// AI-assisted: written with Claude (Anthropic) and reviewed by the team. See README, "Use of AI tools".
package com.example.backend.config;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Random;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.example.backend.model.CrewMember;
import com.example.backend.model.IndicatorDefinition;
import com.example.backend.model.Measurement;
import com.example.backend.repository.CrewMemberRepository;
import com.example.backend.repository.IndicatorDefinitionRepository;
import com.example.backend.repository.MeasurementRepository;

/**
 * Seeds 14 days of SIMULATED measurements so the demo has data.
 * Runs after DataSeeder (@Order 1), because it needs the crew and indicators to exist.
 *
 * The story:
 *   Crew 1: steady for 13 days, then today SpO2 drops (ALERT) and heart rate rises (CAUTION).
 *   Crew 2: steady, all normal today. The "healthy" comparison.
 *   Crew 3: steady, then a short night of sleep today (CAUTION).
 *
 * The usual values and wobbles below are only for generating fake data.
 * They are NOT medical thresholds. Assessment compares each person to their own baseline.
 */
@Component
@Order(2)
public class MeasurementSeeder implements CommandLineRunner {
    private final CrewMemberRepository crewRepo;
    private final IndicatorDefinitionRepository indicatorDefRepo;
    private final MeasurementRepository measurementRepo;

    public MeasurementSeeder(CrewMemberRepository crewRepo,IndicatorDefinitionRepository indicatorDefRepo,MeasurementRepository measurementRepo){
        this.crewRepo = crewRepo;
        this.indicatorDefRepo = indicatorDefRepo;
        this.measurementRepo = measurementRepo;
    }

    @Override
    public void run(String... args){
        if (measurementRepo.count() > 0) return; // already seeded, don't do it twice
        Random random = new Random(42);          // fixed seed: same "random" data every run, so the demo is repeatable
        Instant now = Instant.now();

        for (CrewMember crew : crewRepo.findAll()) {
            for (IndicatorDefinition indicator : indicatorDefRepo.findAll()) {

                // 1. This indicator's simulated usual value and how much it wobbles day to day.
                double usual;
                double wobble;
                switch (indicator.getName()) {
                    case "Heart rate" -> { usual = 62; wobble = 3; }
                    case "Systolic Blood Pressure" -> { usual = 115; wobble = 4; }
                    case "Diastolic Blood Pressure" -> { usual = 75; wobble = 3; }
                    case "SpO2 (blood oxygen)" -> { usual = 97; wobble = 0.7; }
                    case "Body Temperature" -> { usual = 36.7; wobble = 0.15; }
                    case "Sleep Duration" -> { usual = 7; wobble = 0.4; }
                    case "Mood" -> { usual = 4; wobble = 0.5; }
                    default -> { continue; } // unknown indicator: skip it instead of inventing data
                }

                // 2. History: one reading a day, 13 days ago up to yesterday.
                for (int daysAgo = 13; daysAgo >= 1; daysAgo--) {
                    double value = usual + random.nextGaussian() * wobble;
                    save(crew, indicator, value, now.minus(daysAgo, ChronoUnit.DAYS));
                }

                // 3. Today: right at the usual value (so random wobble can't cause surprise
                //    CAUTIONs in the demo), unless this is one of the story moments.
                double today = usual;
                Double story = storyValue(crew.getId(), indicator.getName());
                if (story != null) {
                    today = story;
                }
                // A few minutes ago, so it's safely before Instant.now() when /status runs.
                save(crew, indicator, today, now.minus(5, ChronoUnit.MINUTES));
            }
        }
    }

    // The chosen unusual values for today. null means "no story here, use normal wobble".
    private Double storyValue(Long crewId, String indicatorName) {
        if (crewId == 1 && indicatorName.equals("SpO2 (blood oxygen)")) return 92.0;
        if (crewId == 1 && indicatorName.equals("Heart rate")) return 70.0;
        if (crewId == 3 && indicatorName.equals("Sleep Duration")) return 6.4;
        return null;
    }

    // Keeps values realistic (SpO2 can't pass 100, mood is a whole number from 1 to 5),
    // rounds to 1 decimal place, then saves.
    private void save(CrewMember crew, IndicatorDefinition indicator, double value, Instant timestamp) {
        switch (indicator.getName()) {
            case "SpO2 (blood oxygen)" -> value = Math.min(value, 100);
            case "Mood" -> value = Math.max(1, Math.min(5, Math.round(value)));
            default -> { }
        }
        value = Math.round(value * 10) / 10.0;
        measurementRepo.save(new Measurement(crew, indicator, value, timestamp));
    }
}
