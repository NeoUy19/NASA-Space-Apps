# NASA Space Apps: Astronaut Health Monitor

## How to work with me
I'm a student building this with two teammates at a hackathon, and I want to learn.
- Guide and explain first. Don't write whole features for me unless I ask.
- Boilerplate and config (CORS, build setup, Git) can be given directly.
- For feature code, describe the approach and let me try, then review what I write.
- Keep answers short. We're on a deadline.
- Push back if I'm adding scope that risks the demo.

## The challenge
"Create Health Monitoring Software for Astronauts on Space Missions."
Build a visual tool that gathers health indicators, helps astronauts assess their own
health, and gives guidance on what to do. Judges score impact, creativity, validity,
relevance, and presentation.

## Core loop (everything serves this)
1. Measure: guided check-in with "how to take this measurement" instructions.
2. Assess: backend compares values to safe ranges and to the astronaut's own baseline and trend.
3. Understand: clickable SVG body figure, each body system colored by status, with trend charts
   and a plain-language link to the spaceflight hazard involved.
4. Act: tiered guidance (self-care, tell crew medical officer, contact flight surgeons).

Pitch angle: autonomy. Mars communication delays mean the tool can't depend on the ground,
so assessment logic must work with no network.

## Stack
- Repo: github.com/NeoUy19/NASA-Space-Apps (monorepo)
- `/frontend`: React, Vite, TypeScript. Recharts for charts. Dev server on port 5173.
- `/backend`: Spring Boot (Maven, Java), Spring Web, Spring Data JPA, H2, Validation. Port 8080.
  Base package `com.example.backend`, with `controller`, `config`, `service`, `model`, `repository`.
- Stretch: Azure Static Web Apps (frontend), Azure App Service (backend), one Microsoft Foundry
  model call that rephrases rule-engine output as a daily briefing. Rules stay the source of truth.

## Current state
- Feature code is done (2026-11-15) and works end to end on real data: check-in → `POST /measurements`
  → `/status` → color-coded body figure, guidance, and trend chart (with a "your usual" baseline line).
  All endpoints in `api-contract.md` exist except `/alerts`. Feature freeze is in effect.
- Assessment: baselines are computed from the last 14 days of readings, not stored. CAUTION above 2
  and ALERT above 3 standard deviations from the person's own baseline. Fewer than 5 readings is NORMAL.
- Demo data: `MeasurementSeeder` seeds 14 days. Crew 1 has ALERT and CAUTION today, crew 2 is all normal,
  and crew 3 has CAUTION. The in-memory database resets on every backend restart.
- Remaining: sourced `recommendedAction` text, the demo script, slides, video, and submission.
- Per-person tasks live in `TODO.md`. The learning log is `LEARNING_LOG.md`.

## Team
- Me (fullstack): API contract, assessment service and `/status` endpoint, SVG body figure,
  wiring screens to real endpoints.
- Backend teammate (Java, uses IntelliJ): entities, measurement and indicator endpoints,
  seed data, reminders.
- Third teammate: React screens against mock data, health content with NASA sources,
  then video, slides, and submission after feature freeze.

## Indicators (draft, confirm with team)
Heart rate, systolic and diastolic blood pressure (two separate indicators), SpO2,
body temperature, sleep duration, mood. Possible addition: a reaction-time cognition test,
based on NASA's Spaceflight Standard Measures.

## Data model
- CrewMember: name, role, baseline values.
- IndicatorDefinition: name, unit, body system, normal and caution ranges, how to measure,
  why it matters, related hazard, source. Stored as data, not hardcoded.
- Measurement: crew member, indicator, value, timestamp.
- Assessment: status, reason, recommended action, escalation level.
- Task (stretch): scheduled prompts and streaks.

## API (all under `/api`)
- `GET /health`
- `GET /indicators`
- `POST /measurements`
- `GET /crew/{id}/measurements?indicator=&from=&to=`
- `GET /crew/{id}/status` (per-body-system summary for the body figure)
- `GET /crew/{id}/alerts`

## Conventions
- JSON fields in camelCase. Timestamps as ISO 8601 strings in UTC.
- Status values: `NORMAL`, `CAUTION`, `ALERT`, plus `NO_DATA` for body systems with no measurements.
- `api-contract.md` is the source of truth. Update it before changing an endpoint.
- Before every commit, explain the key concepts used in the change like I'm 5 (a few sentences, everyday analogy), then add a dated entry to `LEARNING_LOG.md` (progress, plus any new concepts or design decisions) so it's part of the commit.
- Short-lived branches, merge to main every couple of hours.
- Don't commit `.idea/`, `.vscode/`, `node_modules/`, `target/`, or `.env`.
- Don't reformat whole files. Change only the lines being edited.
- Secrets go in environment variables, never in the repo.

## Rules for health content
- Every range and recommendation needs a NASA or space-agency source, cited in the app.
- Demo data is synthetic and must be labeled "simulated" in the UI.
- Output is decision support, never a diagnosis.
- Don't invent medical thresholds. If a value has no source, flag it for the team.

## Out of scope
Real authentication (use a crew-member dropdown), microservices, real device integration,
live NASA data APIs.

## Scope tiers
- Must have: check-in form, 5 to 6 indicators, color-coded body figure, trend charts, guidance text.
- Should have: trend-based alerts, measurement instructions, reminders.
- Stretch: streaks and badges, environment switcher, simulated comms delay, Azure AI briefing.

## Commands
- Frontend: `cd frontend && npm run dev`
- Backend: `cd backend && ./mvnw spring-boot:run`
