// This file is like the blue print
// This file doesn't do anything when the app runs. It describes what our data should look like
// so TypeScript can catch mistakes while we type

export type CrewMember = {
    id: number; 
    name: string; 
    role: string
}

export type BodySystem =
    | "CARDIOVASCULAR"          // "|" means "or"
    | "RESPIRATORY"
    | "THERMOREGULATION"
    | "SLEEP"
    | "BEHAVIORAL"
    | "COGNITIVE";

export type Indicator = {       //Indicator must have all the fields listed below, and there types
    id: number;
    name: string;
    unit: string;
    bodySystem: BodySystem;
    normalMin: number | null;
    normalMax: number | null;
    cautionMin: number | null;
    cautionMax: number | null;
    howToMeasure: string;
    whyItMatters: string;
    relatedHazard: string;
    source: string;
};

// What the check-in form sends to POST /api/measurements
export type NewMeasurement = {
    crewMemberId: number;
    indicatorId: number;
    value: number;
    timestamp?: string;         //This is optional, backend defaults to current time
};

// What POST /api/measurements returns
export type Measurement = NewMeasurement & {
    id: number;
    timestamp: string;          //This is always returned from the backend
};

export type Status = 
    |"NORMAL"
    |"CAUTION"
    |"ALERT"
    |"NO_DATA";

export type EscalationLevel = 
    |"SELF_CARE"
    |"CREW_MEDICAL_OFFICER"
    |"FLIGHT_SURGEON";

export type IndicatorStatus = {
    indicatorId: number;
    latestValue: number;
    baseline: number | null;
    measuredAt: string;
    status: Status;
}

export type BodySystemStatus = {
    bodySystem: BodySystem;
    status: Status;
    reason: string | null;
    recommendedAction: string|null;
    escalationLevel: EscalationLevel | null;
    indicators: IndicatorStatus[];
}

export type StatusResponse = {
    crewMemberId: number;
    assessedAt:string;
    overallStatus: Status;
    bodySystems: BodySystemStatus[];
}