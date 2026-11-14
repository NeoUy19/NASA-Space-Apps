# API Contract

Base URL: `http://localhost:8080`

JSON fields are camelCase. Timestamps are ISO 8601 UTC (`2026-11-14T08:30:00Z`).
Status values: `NORMAL`, `CAUTION`, `ALERT`.
Body systems: `CARDIOVASCULAR`, `RESPIRATORY`, `THERMOREGULATION`, `SLEEP`, `BEHAVIORAL`.

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
    "normalMin": 60,
    "normalMax": 100,
    "cautionMin": 50,
    "cautionMax": 120,
    "howToMeasure": "...",
    "whyItMatters": "...",
    "relatedHazard": "...",
    "source": "TODO:Adi source"
  }
]
```

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
