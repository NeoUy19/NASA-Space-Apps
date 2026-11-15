package com.example.backend.controller;

import com.example.backend.config.NotFoundException;
import com.example.backend.dto.IndicatorStatus;
import com.example.backend.dto.MeasurementRequest;
import com.example.backend.dto.MeasurementResponse;
import com.example.backend.model.CrewMember;
import com.example.backend.model.IndicatorDefinition;
import com.example.backend.model.Measurement;
import com.example.backend.repository.CrewMemberRepository;
import com.example.backend.repository.IndicatorDefinitionRepository;
import com.example.backend.repository.MeasurementRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("/api")
public class MeasurementController {

    private final CrewMemberRepository crewMemberRepository;
    private final IndicatorDefinitionRepository indicatorRepository;
    private final MeasurementRepository measurementRepository;

    public MeasurementController(CrewMemberRepository crewMemberRepository,
                                 IndicatorDefinitionRepository indicatorRepository,
                                 MeasurementRepository measurementRepository) {
        this.crewMemberRepository = crewMemberRepository;
        this.indicatorRepository = indicatorRepository;
        this.measurementRepository = measurementRepository;
    }

    @PostMapping("/measurements")
    public ResponseEntity<MeasurementResponse> create(@Valid @RequestBody MeasurementRequest request) {
        CrewMember crewMember = crewMemberRepository.findById(request.crewMemberId())
                .orElseThrow(() -> new NotFoundException("crewMemberId does not exist"));
        IndicatorDefinition indicator = indicatorRepository.findById(request.indicatorId())
                .orElseThrow(() -> new NotFoundException("indicatorId does not exist"));
        Instant timestamp;
        if(request.timestamp() != null){
            timestamp = request.timestamp();
        } else {
            timestamp = Instant.now();
        }
        Measurement measurement = new Measurement(crewMember, indicator, request.value(), timestamp);
        Measurement saved = measurementRepository.save(measurement);
        MeasurementResponse response = new MeasurementResponse(
                saved.getId(),
                saved.getCrewMember().getId(),
                saved.getIndicator().getId(),
                saved.getValue(),
                saved.getTimestamp()
        );
        return ResponseEntity.status(201).body(response);
    }
}