# TODO

Check off tasks as you finish them (`- [x]`). Do **Must have** tasks before anything else.
Work on a short-lived branch and merge to `main` every couple of hours.

**Status:** `GET /api/health` works end to end, and CORS is set up. Pull `main` and check that http://localhost:5173 shows "backend: UP".

---

## Everyone (first, together)
- [ ] Confirm the indicator list: heart rate, systolic BP, diastolic BP, SpO2, body temperature, sleep duration, mood. Decide on the reaction-time test: in or out?
- [ ] Review `api-contract.md` once it's drafted. Speak up now, before code depends on it.

## NeoUy19 (fullstack)
- [x] **Must:** write `api-contract.md` (JSON shapes for all six endpoints). Carl and Adi are blocked on this.
- [x] **Must:** assessment service: compare each value to its safe range and to the crew member's baseline, and return `NORMAL`, `CAUTION` or `ALERT` with a reason.
- [x] **Must:** `GET /api/crew/{id}/status`: a summary per body system, for the body figure.
- [ ] **Must:** SVG body figure, with each body system colored by status and clickable.
- [ ] **Must:** wire Adi's screens to the real endpoints.
- [ ] **Should:** `GET /api/crew/{id}/alerts` (trend-based alerts).

## Carl (backend)
- [ ] **Must:** JPA entities `CrewMember`, `IndicatorDefinition` and `Measurement`, plus a repository for each. Use the data model in `CLAUDE.md`. You can start before the contract is final.
- [ ] **Must:** seed data at startup: 2 or 3 simulated crew members, the indicator definitions, and about 2 weeks of simulated measurements, so the trend charts have something to show.
- [ ] **Must:** `GET /api/indicators`.
- [ ] **Must:** `POST /api/measurements`, using `@Valid` to reject bad input.
- [ ] **Must:** `GET /api/crew/{id}/measurements?indicator=&from=&to=`.
- [ ] **Should:** reminders for scheduled check-ins.
- Notes:
  - Match `api-contract.md` exactly: camelCase fields and ISO 8601 UTC timestamps.
  - Put ranges in seed data, not in code. Get the values and sources from Adi.
  - Put new classes under `com.example.backend`, or Spring won't find them (see `LEARNING_LOG.md` → Component scanning).

## Adi (frontend and content)
- [ ] **Must:** health content for each indicator: normal and caution ranges, how to measure it, why it matters in spaceflight, related hazard, and a **NASA or space-agency source**. Send it to Carl for the seed data.
  - If you can't find a source for a range, flag it to the team. Don't make one up.
- [ ] **Must:** check-in form screen, with "how to take this measurement" instructions for each indicator.
- [ ] **Must:** trend chart screen (Recharts), one indicator over time.
- [ ] **Must:** guidance screen with tiered actions: self-care → tell the crew medical officer → contact flight surgeons.
- [ ] **Must:** a "simulated data" label visible wherever demo data appears, and wording that reads as decision support, never a diagnosis.
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
