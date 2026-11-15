# TODO

Check off tasks as you finish them (`- [x]`). Do **Must have** tasks before anything else.
Work on a short-lived branch and merge to `main` every couple of hours.

**Status (2026-11-15):** about 50% of the Must-haves are done.
- Done: API contract, entities and repositories, assessment logic with tests, `GET /api/crew/{id}/status`, the check-in form (UI only), and the clickable color-coded body figure (on mock data).
- Measurements are now seeded, so `/status` returns real statuses.
- Biggest blocker: the indicator and measurement endpoints don't exist yet (Carl is on `GET /indicators`), so screens still use mock data.
- Next: `GET /indicators` and `POST /measurements`, then wire the body figure and check-in form to the real endpoints, then trend charts and guidance.

---

## Everyone (first, together)
- [x] Confirm the indicator list: heart rate, systolic BP, diastolic BP, SpO2, body temperature, sleep duration, mood. All 6 body systems are kept, including COGNITIVE.
  - [ ] Still open: the reaction-time test (COGNITIVE has no indicator yet, so it always shows `NO_DATA`). Suggested as a Should-have.
- [ ] Decide: should the assessment flag changes in **both** directions? Right now any big change from the baseline is flagged, including good ones. For example, a mood of 5 when the usual is 4 shows as CAUTION. Option: for some indicators, flag only the bad direction (SpO2 and mood: only drops; sleep: only drops). Others stay two-sided (heart rate, blood pressure, temperature). Decide as a team before the demo, since judges may notice.
- [x] Review `api-contract.md` once it's drafted. Speak up now, before code depends on it.

## NeoUy19 (fullstack)
- [x] **Must:** write `api-contract.md` (JSON shapes for all six endpoints). Carl and Adi are blocked on this.
- [x] **Must:** assessment service: compare each value to its safe range and to the crew member's baseline, and return `NORMAL`, `CAUTION` or `ALERT` with a reason.
- [x] **Must:** `GET /api/crew/{id}/status`: a summary per body system, for the body figure.
- [x] **Must:** SVG body figure, with each body system colored by status and clickable. Uses `mocks/status.ts` until it's wired up.
  - [ ] Add the SVG Repo icon licenses to the credits.
- [ ] **Must:** wire Adi's screens to the real endpoints (body figure → `/status`, check-in → `POST /measurements`, indicators → `GET /indicators`).
  - [x] Body figure → `/status`, with a crew dropdown (`screens/StatusScreen.tsx`).
  - [x] Check-in → `POST /measurements` and indicators → `GET /indicators`. A check-in now refreshes the body figure.
  - [x] Guidance screen → real `/status`. `App` fetches it once and passes it to `BodyFigure` and `Guidance`.
  - [x] Trend chart → real `GET /crew/{id}/measurements` and `GET /indicators`. A check-in adds a point.
  - [ ] Trend chart: dashed "your usual" baseline line (Recharts `ReferenceLine`, baseline from `/status`).
- [ ] **Should:** `GET /api/crew/{id}/alerts` (trend-based alerts).

## Carl (backend)
- [x] **Must:** JPA entities `CrewMember`, `IndicatorDefinition` and `Measurement`, plus a repository for each. Use the data model in `CLAUDE.md`. You can start before the contract is final.
- [ ] **Must:** seed data at startup: 2 or 3 simulated crew members, the indicator definitions, and about 2 weeks of simulated measurements, so the trend charts have something to show.
  - [x] Crew members and indicator definitions are seeded.
  - [x] Measurements: 14 days of simulated readings in `MeasurementSeeder.java` (NeoUy19). Crew 1 shows ALERT and CAUTION today, crew 2 is all normal, and crew 3 shows CAUTION.
  - [ ] Replace the placeholder crew names with fictional names and real roles.
- [ ] **Must:** `GET /api/indicators`.
- [ ] **Must:** `POST /api/measurements`, using `@Valid` to reject bad input.
- [ ] **Must:** `GET /api/crew/{id}/measurements?indicator=&from=&to=`.
- [ ] **Should:** reminders for scheduled check-ins.
- Notes:
  - Match `api-contract.md` exactly: camelCase fields and ISO 8601 UTC timestamps.
  - Put ranges in seed data, not in code. Get the values and sources from Adi.
  - Put new classes under `com.example.backend`, or Spring won't find them (see `LEARNING_LOG.md` → Component scanning).

## Adi (frontend and content)
- [x] **Must:** health content for each indicator: normal and caution ranges, how to measure it, why it matters in spaceflight, related hazard, and a **NASA or space-agency source**. Send it to Carl for the seed data.
  - If you can't find a source for a range, flag it to the team. Don't make one up.
  - Done for all 7 indicators. NASA has no fixed ranges, so assessment uses the baseline only.
  - [ ] Update the body systems in `docs/health-content.md`: temperature → THERMOREGULATION, sleep → SLEEP.
- [x] **Must:** check-in form screen, with "how to take this measurement" instructions for each indicator.
  - [ ] Send to `POST /api/measurements` once it exists (it only logs to the console for now).
- [ ] **Must:** trend chart screen (Recharts), one indicator over time.
- [ ] **Must:** guidance screen with tiered actions: self-care → tell the crew medical officer → contact flight surgeons.
  - Also needed: sourced guidance text for each body system. It fills `recommendedAction` in `/status`, which is `null` for now.
- [ ] **Must:** a "simulated data" label visible wherever demo data appears, and wording that reads as decision support, never a diagnosis.
  - Done on the check-in form and the body figure panel. Add it to every new screen.
- [ ] After feature freeze: demo video, slides, submission.
- Notes:
  - Build against mock JSON that matches `api-contract.md`, so swapping in real endpoints is easy later.
  - Put the mock data in its own file (for example `src/mocks/`) instead of inside components.

---

## Stretch (only after every Must is done)
- [ ] Streaks and badges
- [ ] Environment switcher
- [ ] Simulated comms delay
- [ ] Azure deploy and the AI daily briefing
