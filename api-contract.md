# API Contract

Base URL: `http://localhost:8080`

JSON fields are camelCase. Timestamps are ISO 8601 UTC (`2026-11-14T08:30:00Z`).
Status values: `NORMAL`, `CAUTION`, `ALERT`, plus `NO_DATA` when there are no measurements yet.
Body systems: `CARDIOVASCULAR`, `RESPIRATORY`, `THERMOREGULATION`, `SLEEP`, `BEHAVIORAL`, `COGNITIVE`.
Escalation levels: `SELF_CARE`, `CREW_MEDICAL_OFFICER`, `FLIGHT_SURGEON`.

**Errors**

```json
{ "error": "indicatorId does not exist" }
```

`400` for invalid input, `404` item not found

---

## GET /api/indicators

Returns all indicator definitions

**Response 200**

```json
[
  {
    "id": 1,
    "name": "Heart rate",
    "unit": "bpm",
    "bodySystem": "CARDIOVASCULAR",
    "normalMin": null,
    "normalMax": null,
    "cautionMin": null,
    "cautionMax": null,
    "howToMeasure": "...",
    "whyItMatters": "...",
    "relatedHazard": "...",
    "source": "TODO:Adi source"
  }
]
```

Range fields are `null` when there's no sourced range (see `docs/health-content.md`). Assessment then uses the crew member's baseline only. Never fill in an unsourced number.

**Errors:** none

---

## POST /api/measurements

Records one measurement from a check-in.

**Request body**

```json
{
  "crewMemberId": 1,
  "indicatorId": 2,
  "value": 97,
  "timestamp": "2026-11-14T08:30:00Z"
}
```

| Field        | Type   | Required | Notes                   |
| ------------ | ------ | -------- | ----------------------- |
| crewMemberId | number | yes      | Must exist              |
| indicatorId  | number | yes      | Must exist              |
| value        | number | yes      | In the indicator's unit |
| timestamp    | string | no       | Defaults to now         |

**Response 201**

```json
{
    "id":345,
    "crewMemberId": 1,
    "indicatorId": 2,
    "value":97,
    "timestamp": "2026-11-14T08:30:00Z"
}
```

**Errors:** `400` if a field is missing or value isn't a number. `404` crew member or indicator does not exist

---

## GET /api/crew/{id}/measurements

Returns a crew member's measurements, oldest first. Used for trend charts.

**Path parameter**

| Name | Type | Notes |
|---|---|---|
| id | number | Crew member ID |

**Query parameters** (all optional)

| Name | Type | Notes |
|---|---|---|
| indicator | number | Only this indicator's ID. Omit to get all indicators. |
| from | string | ISO 8601 UTC. Only measurements at or after this time. |
| to | string | ISO 8601 UTC. Only measurements at or before this time. |

Example: `GET /api/crew/1/measurements?indicator=2&from=2026-11-01T00:00:00Z`

**Response 200**

```json
[
  {
    "id": 340,
    "crewMemberId": 1,
    "indicatorId": 2,
    "value": 98,
    "timestamp": "2026-11-13T08:30:00Z"
  },
  {
    "id": 345,
    "crewMemberId": 1,
    "indicatorId": 2,
    "value": 97,
    "timestamp": "2026-11-14T08:30:00Z"
  }
]
```

Returns an empty array `[]` if nothing matches.

**Errors:** `404` crew member does not exist. `400` invalid timestamp

---

## GET /api/crew/{id}/status

Returns a crew member's current status, from their latest measurements. Used for the body figure.

**Response 200**

```json
{
  "crewMemberId": 1,
  "assessedAt": "2026-11-14T09:00:00Z",
  "overallStatus": "CAUTION",
  "bodySystems": [
    {
      "bodySystem": "RESPIRATORY",
      "status": "CAUTION",
      "reason": "SpO2 92% is 5 points under your baseline of 97%.",
      "escalationLevel": "CREW_MEDICAL_OFFICER",
      "recommendedAction": "...",
      "indicators": [
        {
          "indicatorId": 2,
          "latestValue": 92,
          "baseline": 97,
          "status": "CAUTION",
          "measuredAt": "2026-11-14T08:30:00Z"
        }
      ]
    }
  ]
}
```

- `bodySystems` always has one entry per body system, in the order listed at the top. A system with no measurements has status `NO_DATA`, an empty `indicators` array, and `null` for `reason`, `escalationLevel` and `recommendedAction`.
- `overallStatus` is the worst status across all systems (`ALERT` > `CAUTION` > `NORMAL`). `NO_DATA` doesn't count.
- `recommendedAction` text comes from the sourced guidance in `docs/health-content.md`. It's decision support, never a diagnosis.

**Errors:** `404` crew member does not exist

---

## GET /api/crew/{id}/alerts

Returns a crew member's active trend alerts, newest first. `/status` judges the latest reading. Alerts catch patterns across several readings, like a value getting worse day after day.

**Response 200**

```json
[
  {
    "indicatorId": 6,
    "bodySystem": "SLEEP",
    "severity": "CAUTION",
    "escalationLevel": "SELF_CARE",
    "message": "Sleep has been below your baseline for 3 nights in a row.",
    "recommendedAction": "...",
    "firstReadingAt": "2026-11-12T07:00:00Z",
    "triggeredAt": "2026-11-14T07:00:00Z"
  }
]
```

- `severity` is `CAUTION` or `ALERT`. It's never `NORMAL` or `NO_DATA`.
- `firstReadingAt` is when the pattern started, and `triggeredAt` is the reading that set off the alert.
- Alerts are worked out from measurements on every request, not stored, so there's no ID and nothing to dismiss. An alert goes away once the trend stops.
- The trend rules (how many readings, and how far from the baseline) live in the assessment service, not in this contract.

Returns an empty array `[]` if there are no active alerts.

**Errors:** `404` crew member does not exist
