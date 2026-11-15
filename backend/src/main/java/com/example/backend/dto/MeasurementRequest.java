package com.example.backend.dto;

import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record MeasurementRequest(
        @NotNull Long crewMemberId,
        @NotNull Long indicatorId,
        @NotNull Double value,
        Instant timestamp
) { }