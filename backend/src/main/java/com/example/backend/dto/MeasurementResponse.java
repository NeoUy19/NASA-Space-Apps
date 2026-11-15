package com.example.backend.dto;

import java.time.Instant;

public record MeasurementResponse(
        Long id,
        Long crewMemberId,
        Long indicatorId,
        Double value,
        Instant timestamp
) { }