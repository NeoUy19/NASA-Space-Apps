// AI-assisted: written with Claude (Anthropic) and reviewed by the team. See README, "Use of AI tools".
import type { StatusResponse } from "../types";

// SIMULATED data in the shape of GET /api/crew/{id}/status.
// Mixed statuses on purpose, so the body figure shows every color.
// Reason text copies the backend's wording (AssessmentRules.java).
export const mockStatus: StatusResponse = {
    crewMemberId: 1,
    assessedAt: "2026-11-14T09:00:00Z",
    overallStatus: "ALERT",
    bodySystems: [
        {
            bodySystem: "CARDIOVASCULAR",
            status: "CAUTION",
            reason: "78.0 is above your recent average of 64.0",
            recommendedAction: null,
            escalationLevel: "SELF_CARE",
            indicators: [
                { indicatorId: 1, latestValue: 78, baseline: 64, measuredAt: "2026-11-14T08:30:00Z", status: "CAUTION" },
                { indicatorId: 2, latestValue: 118, baseline: 116, measuredAt: "2026-11-14T08:30:00Z", status: "NORMAL" },
                { indicatorId: 3, latestValue: 76, baseline: 75, measuredAt: "2026-11-14T08:30:00Z", status: "NORMAL" },
            ],
        },
        {
            bodySystem: "RESPIRATORY",
            status: "ALERT",
            reason: "92.0 is below your recent average of 97.0",
            recommendedAction: null,
            escalationLevel: "CREW_MEDICAL_OFFICER",
            indicators: [
                { indicatorId: 4, latestValue: 92, baseline: 97, measuredAt: "2026-11-14T08:30:00Z", status: "ALERT" },
            ],
        },
        {
            bodySystem: "THERMOREGULATION",
            status: "NORMAL",
            reason: "36.8 is above your recent average of 36.7",
            recommendedAction: null,
            escalationLevel: "SELF_CARE",
            indicators: [
                { indicatorId: 5, latestValue: 36.8, baseline: 36.7, measuredAt: "2026-11-14T08:30:00Z", status: "NORMAL" },
            ],
        },
        {
            bodySystem: "SLEEP",
            status: "NORMAL",
            reason: "Currently building your baseline: 3 of 5 readings so far",
            recommendedAction: null,
            escalationLevel: "SELF_CARE",
            indicators: [
                { indicatorId: 6, latestValue: 6.5, baseline: null, measuredAt: "2026-11-14T07:00:00Z", status: "NORMAL" },
            ],
        },
        {
            bodySystem: "BEHAVIORAL",
            status: "NORMAL",
            reason: "4.0 is equal to your recent average of 4.0",
            recommendedAction: null,
            escalationLevel: "SELF_CARE",
            indicators: [
                { indicatorId: 7, latestValue: 4, baseline: 4, measuredAt: "2026-11-14T08:30:00Z", status: "NORMAL" },
            ],
        },
        {
            bodySystem: "COGNITIVE",
            status: "NO_DATA",
            reason: null,
            recommendedAction: null,
            escalationLevel: null,
            indicators: [],
        },
    ],
};
