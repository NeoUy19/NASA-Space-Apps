import type { Measurement } from '../types/measurement'

// Simulated data in the shape of GET api/crew/{id}/measurements response
// 14 days of daily readings for crew member 1. NOT REAL ASTRONAUT DATA. This is just for testing the UI.
// The last data matches mocks/status.ts, so that the guidance screen can be tested.

const days = 14;

const series: [number, number, number, number] [] = [
    [1, 64, 3, 78],      // heart rate: jumps on the last day (CAUTION)
    [2, 116, 4, 118],    // systolic BP
    [3, 75, 3, 76],      // diastolic BP
    [4, 97, 1, 92],      // SpO2: drops on the last day (ALERT)
    [5, 36.7, 0.2, 36.8],// body temperature
    [6, 6.5, 0.6, 6.5],  // sleep hours
    [7, 4, 1, 4],        // mood 1–5
];

const wholeNumbers = [1,2,3,7];
let nextId = 1;

export const mockMeasurements: Measurement[] = series.flatMap(([indicatorId, typical, wiggle, last]) =>
    Array.from({ length: days }, (_, day) => {
        const raw = typical + Math.sin(day * 1.7 + indicatorId) * wiggle;
        const rounded = wholeNumbers.includes(indicatorId) ? Math.round(raw) : Math.round(raw * 10) / 10;
        return {
            id: nextId++,
            crewMemberId: 1,
            indicatorId,
            value: day === days - 1 ? last : rounded,
            timestamp: new Date(Date.UTC(2026, 10, 1 + day, 8, 30)).toISOString().replace(".000Z", "Z"),
        };
    })
);