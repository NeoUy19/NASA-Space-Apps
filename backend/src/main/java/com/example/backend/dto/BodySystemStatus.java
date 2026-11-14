package com.example.backend.dto;
import java.util.List;
import com.example.backend.model.*;

public record BodySystemStatus(BodySystem bodySystem, Status status, String reason, String recommendedAction, EscalationLevel escalationLevel, List<IndicatorStatus> indicators) {
}
