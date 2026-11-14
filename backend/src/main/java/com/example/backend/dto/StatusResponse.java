package com.example.backend.dto;
import com.example.backend.model.*;
import java.util.List;
import java.time.Instant;
public record StatusResponse(Long crewMemberId, Instant assessedAt, Status overallStatus, List<BodySystemStatus> bodySystems){}

