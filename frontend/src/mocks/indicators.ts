import type { Indicator } from "../types";

// SIMULATED data. Swap for GET /api/indicators later.
// Ranges are null until the team picks a source (see docs/health-content.md).
// This is a shortcut since all seven indicators need the same four null fields. So we write them once here
const noRange = { normalMin: null, normalMax: null, cautionMin: null, cautionMax: null };

export const mockIndicators: Indicator[] = [
  { id: 1, name: "Heart rate", unit: "bpm", bodySystem: "CARDIOVASCULAR", ...noRange,
    howToMeasure: "Rest quietly for 5 minutes. Use the pulse sensor, or count beats at the wrist for 30 seconds and multiply by 2.",
    whyItMatters: "Fluids shift toward the head in weightlessness and the body changes how it controls the heart.",
    relatedHazard: "Cardiovascular deconditioning",
    source: "https://ntrs.nasa.gov/citations/20040201532" },
  { id: 2, name: "Systolic blood pressure", unit: "mmHg", bodySystem: "CARDIOVASCULAR", ...noRange,
    howToMeasure: "Sit still for 5 minutes, arm supported at heart level. Stay quiet while the cuff reads. This is the top number.",
    whyItMatters: "Blood pressure drops in space, and astronauts can struggle to keep it up when they stand after returning to gravity.",
    relatedHazard: "Orthostatic intolerance",
    source: "https://doi.org/10.1161/CIRCULATIONAHA.119.041050" },
  { id: 3, name: "Diastolic blood pressure", unit: "mmHg", bodySystem: "CARDIOVASCULAR", ...noRange,
    howToMeasure: "Same reading as systolic. This is the bottom number.",
    whyItMatters: "A change from your own baseline can be a sign of cardiovascular deconditioning.",
    relatedHazard: "Orthostatic intolerance",
    source: "https://ntrs.nasa.gov/citations/20040201532" },
  { id: 4, name: "SpO2", unit: "%", bodySystem: "RESPIRATORY", ...noRange,
    howToMeasure: "Clip the pulse oximeter on a fingertip. Keep your hand still and warm, and wait about 30 seconds for the number to settle.",
    whyItMatters: "Low oxygen can affect thinking and mood, and its symptoms are easy to mistake for tiredness.",
    relatedHazard: "Hypoxia",
    source: "https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-003-habitable-atmosphere.pdf" },
  { id: 5, name: "Body temperature", unit: "°C", bodySystem: "THERMOREGULATION", ...noRange,
    howToMeasure: "Rest for 10 minutes first, not right after exercise. Measure the same way and at the same time each day.",
    whyItMatters: "Resting body temperature slowly rises about 1 °C on long missions, which can hurt performance.",
    relatedHazard: "Heat buildup in weightlessness",
    source: "https://doi.org/10.1038/s41598-017-15560-w" },
  { id: 6, name: "Sleep duration", unit: "hours", bodySystem: "SLEEP", ...noRange,
    howToMeasure: "When you wake up, enter about how many hours you actually slept, not just time in bed.",
    whyItMatters: "Astronauts often sleep about 6 hours a night in space, and a week of that hurts performance a lot.",
    relatedHazard: "Fatigue from sleep loss",
    source: "https://www.nasa.gov/wp-content/uploads/2023/03/sleep-accomodations-technical-brief-ochmo.pdf" },
  { id: 7, name: "Mood", unit: "1–5", bodySystem: "BEHAVIORAL", ...noRange,
    howToMeasure: "Pick the number that best matches how you've felt overall today.",
    whyItMatters: "Isolation and confinement can affect mood, thinking and teamwork, and astronauts may be reluctant to report it.",
    relatedHazard: "Adverse behavioral conditions",
    source: "https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-016-behavioral-health.pdf" },
];