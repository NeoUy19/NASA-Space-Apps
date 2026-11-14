package com.example.backend.dto;
import java.time.Instant;
import com.example.backend.model.Status;

public record IndicatorStatus(Long indicatorId, Double latestValue, Double baseline, Instant measuredAt, Status status){}