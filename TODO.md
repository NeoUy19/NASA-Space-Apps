# TODO

Check off tasks as you finish them (`- [x]`). Do **Must have** tasks before anything else.
Work on a short-lived branch and merge to `main` every couple of hours.

**Status (2026-11-15):** all feature code is done. Now it's content and presentation.
- Working end to end on real data: check-in → assessment against each person's own baseline → color-coded body figure, guidance, and a trend chart with a "your usual" line. The crew dropdown loads from the backend.
- Left before submitting: sourced `recommendedAction` text, the demo script, slides, video, and submission.
- Feature freeze: no new features unless the whole team agrees.

---

## Everyone
- [x] Confirm the indicator list: heart rate, systolic BP, diastolic BP, SpO2, body temperature, sleep duration, mood. All 6 body systems are kept, including COGNITIVE.
  - [ ] Reaction-time test: not planned (COGNITIVE shows `NO_DATA`). Mention it in the pitch as future work.
- [ ] Decide: should the assessment flag changes in **both** directions? Right now any big change from the baseline is flagged, including good ones. For example, a mood of 5 when the usual is 4 shows as CAUTION. Option: for some indicators, flag only the bad direction (SpO2, sleep, mood: only drops). The others stay two-sided. If you don't fix it, avoid entering a higher-than-usual value in the live demo.
- [x] Review `api-contract.md`.
- [ ] **Must:** write the demo script (about 2 minutes): crew 2 all green → check in SpO2 91 → lungs turn red, guidance says "Tell your CMO today", trend chart drops below "your usual" → autonomy point (no ground contact needed).
- [ ] **Should:** one real NASA data point for the Relevance score (for example the Curiosity RAD radiation dose), shown as context in the app or slides. Check the number and the source.
- [ ] **Should:** decide whether to keep the anime character names for the crew, or switch to generic made-up names.

## NeoUy19 (fullstack)
- [x] **Must:** write `api-contract.md`.
- [x] **Must:** assessment service (baseline, 2 and 3 standard-deviation rule, reason, escalation).
- [x] **Must:** `GET /api/crew/{id}/status`.
- [x] **Must:** SVG body figure, with each body system colored by status and clickable, plus a detail panel.
  - [ ] Add the SVG Repo icon licenses to the credits (README or slides).
- [x] **Must:** wire the screens to the real endpoints.
  - [x] Body figure and guidance → `/status` (fetched once in `App`).
  - [x] Check-in → `POST /measurements` and `GET /indicators`. A check-in refreshes every screen.
  - [x] Trend chart → `GET /crew/{id}/measurements` and `GET /indicators`, with a dashed "your usual" baseline line.
  - [x] Crew dropdown → `GET /api/crew`.
- [x] Simulated measurement seed (`MeasurementSeeder.java`): crew 1 ALERT and CAUTION, crew 2 all normal, crew 3 CAUTION.
- [ ] **Should:** `GET /api/crew/{id}/alerts` (trend-based alerts). Skip unless there's spare time.

## Carl (backend)
- [x] **Must:** JPA entities and repositories.
- [x] **Must:** seed data: crew members (fictional names, real roles) and indicator definitions.
- [x] **Must:** `GET /api/indicators`.
- [x] **Must:** `POST /api/measurements`, with `@Valid` and the contract's error shape.
- [x] **Must:** `GET /api/crew/{id}/measurements?indicator=&from=&to=`.
- [x] `GET /api/crew`, for the dropdown.
- [x] `/status` 404 returns the contract's `{ "error": ... }` shape.
- [ ] **Optional:** only flag the bad direction (see the team decision above). Pair with NeoUy19.
- [ ] **Should:** reminders for scheduled check-ins. Skip unless there's spare time.

## Adi (frontend and content)
- [x] **Must:** health content for all 7 indicators, with NASA sources. NASA has no fixed ranges, so assessment uses the baseline only.
  - [ ] Update the body systems in `docs/health-content.md`: temperature → THERMOREGULATION, sleep → SLEEP.
- [x] **Must:** check-in form with "how to take this measurement" instructions.
- [x] **Must:** trend chart screen (Recharts).
- [x] **Must:** guidance screen with tiered actions: self-care → tell the crew medical officer → contact flight surgeons.
  - [ ] **Must:** sourced guidance text for each body system. It fills `recommendedAction` in `/status`, which is `null` for now. Send it to NeoUy19 or Carl to add to the backend.
- [x] **Must:** a "simulated data" label on every screen, and wording that reads as decision support, never a diagnosis.
- [ ] **Must:** slides, demo video, and submission.

---

## Stretch (only if everything above is done)
- [ ] Streaks and badges
- [ ] Environment switcher
- [ ] Simulated comms delay
- [ ] Azure deploy and the AI daily briefing
