// AI-assisted: written with Claude (Anthropic) and reviewed by the team. See README, "Use of AI tools".
import type { BodySystem, Status } from "./types";

// One place for status colors and friendly labels, so every screen matches.
// The same colors are repeated as CSS variables in index.css (--status-...).
export const STATUS_COLORS: Record<Status, string> = {
  NORMAL: "#5fd838",
  CAUTION: "#f5a524",
  ALERT: "#ff5a52",
  NO_DATA: "#8b95a9",
};

// Shown next to the color, so status never depends on color alone.
export const STATUS_LABELS: Record<Status, string> = {
  NORMAL: "Normal",
  CAUTION: "Caution",
  ALERT: "Alert",
  NO_DATA: "No data",
};

// Friendly names for body systems. The API sends the ALL_CAPS versions.
export const SYSTEM_LABELS: Record<BodySystem, string> = {
  CARDIOVASCULAR: "Heart and circulation",
  RESPIRATORY: "Lungs and breathing",
  THERMOREGULATION: "Body temperature",
  SLEEP: "Sleep",
  BEHAVIORAL: "Mood",
  COGNITIVE: "Thinking and reaction time",
};
