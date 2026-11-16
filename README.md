# Astronaut Health Monitor

Our project for the NASA Space Apps challenge **"Create Health Monitoring Software for Astronauts on Space Missions."**

Astronauts do a quick daily check-in. The app compares each reading to **that astronaut's own normal**, shows which body systems need attention on a color-coded body figure, plots trends over time, and says what to do next.

> **Simulated data.** All crew members and measurements are made up for the demo.
> **Decision support, not a diagnosis.** The app suggests who to talk to. It doesn't diagnose anything.


## Demo
https://github.com/user-attachments/assets/4aeb28ff-37ce-46be-a5e9-c73232cf425b


## Why it matters

On a Mars mission, a message to Earth can take many minutes each way. Astronauts can't wait for flight surgeons to check every reading, so the assessment runs entirely on board, with no network needed.

## How it works

1. **Measure:** a guided check-in for 7 indicators, each with "how to take this measurement" instructions.
2. **Assess:** the backend compares each new value to the astronaut's own baseline from the last 14 days and labels it `NORMAL`, `CAUTION` or `ALERT`.
3. **Understand:** a clickable body figure colored by status, plus a trend chart with a "your usual" line.
4. **Act:** tiered guidance: self-care, then tell the crew medical officer, then contact the flight surgeons.

**Indicators:** heart rate, systolic and diastolic blood pressure, SpO2 (blood oxygen), body temperature, sleep duration and mood.

**Why compare to each person's baseline?** Bodies change in space. For example, healthy astronauts on long missions can run about 1 °C warmer than on Earth, so an Earth "fever" cutoff would wrongly flag them. NASA also doesn't publish simple fixed ranges for these indicators. See [`docs/health-content.md`](docs/health-content.md) for the research and sources.

## Run it locally

### What you need

| Tool | Version | Check with |
|---|---|---|
| Java | **21** | `java -version` |
| Node.js | 20.19+ or 22.12+ | `node -v` |
| Git | any | `git --version` |

You don't need to install Maven. The project includes `mvnw`, which downloads it for you.

### 1. Get the code

```bash
git clone https://github.com/NeoUy19/NASA-Space-Apps.git
cd NASA-Space-Apps
```

### 2. Start the backend (terminal 1)

```bash
cd backend
./mvnw spring-boot:run
```

The first run takes a minute or two. It's ready when you see `Started BackendApplication`. Check **http://localhost:8080/api/health**, which should show `{"status":"UP"}`.

Leave this terminal running.

### 3. Start the frontend (terminal 2)

Open a **new** terminal:

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. You only need `npm install` the first time, or after someone adds a package.

Leave this terminal running too. Use a third terminal for git.

### Demo data

The backend fills an in-memory database with 3 simulated crew members and 14 days of readings every time it starts:
- **Crew 1** has an `ALERT` and a `CAUTION` today
- **Crew 2** is all normal
- **Crew 3** has a `CAUTION`

Anything you submit is **wiped when the backend restarts**.

## Troubleshooting

| Problem | Fix |
|---|---|
| `release version 21 not supported` | Your Java is older than 21. Install Java 21 (for example Temurin 21 from [adoptium.net](https://adoptium.net)), then run `export JAVA_HOME=$(/usr/libexec/java_home -v 21)` on macOS and try again. |
| `permission denied: ./mvnw` | Run `chmod +x mvnw` once. |
| `Port 8080 was already in use` | The backend is already running in another terminal. Use that one, or stop it with **Ctrl + C**. |
| `Could not read package.json` | You're in the wrong folder. `npm` commands only work inside `frontend`. |
| `not a git repository` | You're outside the project. `cd` into `NASA-Space-Apps` first. |
| The page says "backend unreachable" | The backend isn't running. Start it (step 2). |
| Typing in a terminal does nothing | That terminal is busy running a server. Open a new one with **+**. |

## Project structure

```
NASA-Space-Apps/
├── backend/            Spring Boot API (Java 21, Maven, H2 in-memory database)
│   └── src/main/java/com/example/backend/
│       ├── controller/ REST endpoints
│       ├── service/    Assessment rules (baseline, CAUTION/ALERT)
│       ├── model/      Crew members, indicators, measurements
│       └── config/     CORS, error handling, demo data seeding
├── frontend/           React + Vite + TypeScript, Recharts for charts
│   └── src/
│       ├── screens/    Check-in, guidance, trend chart, crew overview
│       ├── components/ Body figure, status badge
│       └── mocks/      Mock data used before the endpoints existed
├── docs/
│   └── health-content.md   Indicator research and NASA sources
├── api-contract.md     Every endpoint and its JSON (the source of truth)
├── LEARNING_LOG.md     Decisions we made and concepts we learned
└── TODO.md             Task list
```

## API

All endpoints are under `http://localhost:8080/api`. Full request and response shapes are in [`api-contract.md`](api-contract.md).

| Method | Path | What it does |
|---|---|---|
| GET | `/health` | Checks the backend is running |
| GET | `/crew` | Lists crew members (for the dropdown) |
| GET | `/indicators` | Lists the 7 indicators and how to measure them |
| POST | `/measurements` | Saves one reading from a check-in |
| GET | `/crew/{id}/measurements` | Readings over time, for the trend chart |
| GET | `/crew/{id}/status` | Status per body system, for the body figure and guidance |

## Sources

Health content comes from NASA and space-agency sources, including NASA-STD-3001 and the NASA OCHMO technical briefs. Every source is listed per indicator in [`docs/health-content.md`](docs/health-content.md). Where NASA gives no number, we say so instead of making one up.

## Credits

- **Logo:** designed by the team in Canva (not AI-generated).
- **Body figure icons** (body outline, heart, lungs, brain): [SVG Repo](https://www.svgrepo.com).
- **Fonts:** [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) and [Newsreader](https://fonts.google.com/specimen/Newsreader), both under the SIL Open Font License, bundled through [Fontsource](https://fontsource.org).
- **Health content:** NASA and space-agency sources, listed in [`docs/health-content.md`](docs/health-content.md).

## Use of AI tools

The team designed and built this project. We used **Claude (Anthropic)** as a coding assistant, much like a pair programmer, and reviewed and tested everything it produced. Files that are mostly or partly AI-written start with an `AI-assisted` comment. The instructions we gave the AI assistant, including our rules for health content, are in [`CLAUDE.md`](CLAUDE.md).

**What the team built**
- The project idea, the measure → assess → understand → act loop, and the design decisions
- The API contract, data model and REST endpoints
- The assessment approach: comparing each reading to the astronaut's own baseline, with the 2 and 3 standard deviation rule
- The body figure, check-in, guidance and trend chart screens, and wiring them to the backend (often with AI review and explanations)
- The health research and NASA sources, the logo, the fonts, and the demo story

**Where AI helped**
- **Code:** the simulated data generator (`MeasurementSeeder.java`), the assessment unit tests, the CORS setup, the Crew overview page, the status badge and shared theme file, plus reviews and fixes on our code
- **Visual design:** styling for the dark space theme (colors, starfield, layout)
- **Debugging and Git:** finding bugs, resolving merge conflicts and branch problems
- **Documentation:** first drafts of `LEARNING_LOG.md`, `TODO.md` and project notes

**Not AI-generated:** the health research and NASA sources in `docs/health-content.md`, the project idea and design decisions, and the logo. No images, video or audio in this project were generated by AI tools.

## Team

- **Neo:** fullstack: API contract, assessment service, body figure, wiring screens to the backend
- **Carl:** backend: data model, seed data, indicator and measurement endpoints
- **Adi:** frontend and product: health research, check-in form, guidance screen, trend chart
