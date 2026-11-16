// AI-assisted in part: written by the team; one fix and the explanatory comments were added with Claude (Anthropic). See README, "Use of AI tools".
package com.example.backend.service;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

import com.example.backend.config.NotFoundException;
import org.springframework.stereotype.Service;
import com.example.backend.dto.BodySystemStatus;
import com.example.backend.dto.IndicatorStatus;
import com.example.backend.dto.StatusResponse;
import com.example.backend.model.BodySystem;
import com.example.backend.model.EscalationLevel;
import com.example.backend.model.IndicatorDefinition;
import com.example.backend.repository.CrewMemberRepository;
import com.example.backend.repository.IndicatorDefinitionRepository;
import com.example.backend.repository.MeasurementRepository;
import java.util.List;
import java.util.ArrayList;
import com.example.backend.model.Measurement;
import com.example.backend.model.Status;

/**
 * Answers the question "How is this crew member doing?" for GET /api/crew/{id}/status.
 *
 * Big picture:
 *   1. For every indicator (heart rate, SpO2, ...), compare the latest reading
 *      to that person's own last 14 days, using AssessmentRules.
 *   2. Group the indicators by body system, and give each system the status
 *      of its worst indicator.
 *   3. The overall status is the worst body system.
 *
 * AssessmentRules does the math. This class fetches the data and puts the answer together.
 */
@Service
public class AssessmentService {
    // The three database helpers we need. Spring passes them in (dependency injection).
    private final CrewMemberRepository crewRepo;
    private final IndicatorDefinitionRepository indicatorDefRepo;
    private final MeasurementRepository measurementRepo;

    public AssessmentService(CrewMemberRepository crewRepo,IndicatorDefinitionRepository indicatorDefRepo,MeasurementRepository measurementRepo){
        this.crewRepo = crewRepo;
        this.indicatorDefRepo = indicatorDefRepo;
        this.measurementRepo = measurementRepo;
    }

    // One indicator's result plus the plain-language reason.
    // The reason isn't part of IndicatorStatus, but the body system needs it later.
    private record Assessed(IndicatorStatus indicator, String reason) { }

    /**
     * Assesses ONE indicator for ONE crew member.
     * Example: "Crew member 1's SpO2 is 92, but their usual is 97, so CAUTION."
     * Returns null if they have no readings for this indicator in the window.
     */
    private Assessed assessIndicator(Long crewMemberId, IndicatorDefinition indicator, Instant since ){
        // All of this person's readings for this indicator since `since`, oldest first.
        List<Measurement> readings = measurementRepo.findByCrewMemberIdAndIndicatorIdAndTimestampAfterOrderByTimestampAsc(crewMemberId, indicator.getId(), since);
        if (readings.isEmpty()){
            return null; // never measured: the caller treats this as "no data"
        }

        // Split into today's reading and everything before it.
        // The history is "what's normal for you". Today's reading is left out
        // so an unusual value can't drag the average toward itself.
        Measurement latest = readings.getLast();
        List<Double> history = new ArrayList<>();
        for (int i = 0 ; i < readings.size() - 1; i++){
            history.add(readings.get(i).getValue());
        }

        // The actual decision: NORMAL, CAUTION or ALERT, plus the baseline and a reason.
        AssessmentRules.Result result = AssessmentRules.classify(latest.getValue(), history);

        // Package it in the shape the API contract promises.
        IndicatorStatus status = new IndicatorStatus(indicator.getId(), latest.getValue(), result.baseline(), latest.getTimestamp(), result.status());
        return new Assessed(status, result.reason());
    }

    /**
     * Builds the full /status answer for one crew member: one entry per body system,
     * plus an overall status. This is what colors the body figure.
     */
    public StatusResponse assess(Long crewMemberId){
        // Unknown crew member: Spring turns this into a 404 response.
        if (!crewRepo.existsById(crewMemberId)){ //if crew member does not exist throw error
            throw new NotFoundException("Crew member not found");

        }

        // Only look at the last 14 days of readings.
        Instant since = Instant.now().minus(14, ChronoUnit.DAYS);
        List<IndicatorDefinition> indicators = indicatorDefRepo.findAll();
        List<BodySystemStatus> systems = new ArrayList<>();

        // Go through each body system (CARDIOVASCULAR, RESPIRATORY, ...) in order.
        for (BodySystem system : BodySystem.values()) {

            // Step A: assess every indicator that belongs to this body system.
            List<Assessed> assessed = new ArrayList<>();
            for (IndicatorDefinition indicator : indicators){
                if (indicator.getBodySystem() == system){
                    Assessed result = assessIndicator(crewMemberId, indicator, since);
                    if (result != null){
                        assessed.add(result);
                    }
                }
            }

            // Step B: nothing measured for this system, so it's gray on the body figure.
            if (assessed.isEmpty()){
                systems.add(new BodySystemStatus(system, Status.NO_DATA, null, null, null, List.of()));
                continue; // move on to the next body system
            }

            // Step C: find the worst indicator, and collect all of them for the response.
            // A body system is only as healthy as its worst indicator.
            Assessed worst = assessed.get(0);
            List<IndicatorStatus> indStatus = new ArrayList<>();
            for (Assessed a: assessed){
                if (a.indicator().status().compareTo(worst.indicator().status()) > 0){
                    worst = a; // later in the Status enum means worse
                }
                indStatus.add(a.indicator());
            }

            // Step D: who should the astronaut involve?
            // ALERT means tell the crew medical officer. Anything milder starts with self-care.
            Status worstStatus = worst.indicator().status();
            EscalationLevel escalation;
            if (worstStatus == Status.ALERT){
                escalation = EscalationLevel.CREW_MEDICAL_OFFICER;
            }else{
                escalation = EscalationLevel.SELF_CARE;
            }

            // Step E: save this body system's result.
            // recommendedAction stays null until Adi's sourced guidance text is ready.
            systems.add(new BodySystemStatus(system, worstStatus,worst.reason(), null, escalation, indStatus));
        }

        // Overall status = the worst body system, ignoring NO_DATA.
        // If nothing has been measured at all, it stays NO_DATA.
        Status overallStatus = Status.NO_DATA;
        for (BodySystemStatus bss : systems){
            Status currStatus = bss.status();
            if(currStatus == Status.NO_DATA){
                continue;
            }
            else{
                // The first real status replaces NO_DATA. After that, only a worse one does.
                if (overallStatus == Status.NO_DATA || currStatus.compareTo(overallStatus) > 0){
                    overallStatus = currStatus;
                }
            }
        }
        return new StatusResponse(crewMemberId, Instant.now(), overallStatus, systems);

    }
}
