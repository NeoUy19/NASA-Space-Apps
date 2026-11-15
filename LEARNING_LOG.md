# Learning Log

What we decided, what we built, and what we learned along the way.
Add an entry with every commit or merge to `main`. Keep entries short.

- **Design decisions**: choices that shape the project, and why we made them.
- **Progress**: what got built, newest first.
- **Key concepts**: ideas we used, explained simply. Link them from progress entries.

---

## Design decisions

| Decision | Why |
|---|---|
| Monorepo (`/frontend` + `/backend`) | One repo for three people. Frontend and backend changes ship together. |
| React + Vite + TypeScript | Vite is fast to start. TypeScript catches typos in API data before the browser does. |
| Spring Boot + H2 | Spring sets up a web server with very little code. H2 is an in-memory database, so there's nothing to install. |
| Rule engine is the source of truth, and it works offline | Mars comms delays mean astronauts can't wait for Earth. Any AI is only allowed to *rephrase* rule output. |
| Indicator ranges are stored as data, not hardcoded | Every range needs a cited source and may change. Data is easier to update and show in the UI. |
| `api-contract.md` comes before endpoint code | All three of us can build against the same JSON shapes at the same time. |
| CORS allowed only for `http://localhost:5173` on `/api/**` | Allow just our frontend, nothing wider. Add the Azure URL when we deploy. See [CORS](#cors). |
| Numeric IDs and one error shape `{ "error": "..." }` | Numbers are the JPA default. One error shape means the frontend handles errors in one place. |
| Six body systems: `CARDIOVASCULAR`, `RESPIRATORY`, `THERMOREGULATION`, `SLEEP`, `BEHAVIORAL`, `COGNITIVE` | One per indicator group, and each maps to a body-figure region. `COGNITIVE` covers a reaction-time test. Bone, muscle and vision are pitched as future work, because a quick check-in can't measure them. |
| Status values `NORMAL`, `CAUTION`, `ALERT` | A small fixed set that maps straight onto the body-figure colors. |
| Range fields can be `null`, and assessment falls back to the baseline | NASA publishes no fixed ranges for our indicators, and we never invent thresholds. See [Baseline vs. fixed ranges](#baseline-vs-fixed-ranges). |
| `/status` always returns every body system, using `NO_DATA` for systems not measured yet | The body figure can draw every region without special cases. Unmeasured regions show gray. |
| CAUTION above 2 and ALERT above 3 standard deviations from the person's own baseline | NASA gives no fixed ranges, and we don't invent medical thresholds. This rule is statistical ("unusual for you"), not medical, so the UI says "unusual compared with your recent readings," not "dangerous." |
| Escalation levels `SELF_CARE`, `CREW_MEDICAL_OFFICER`, `FLIGHT_SURGEON` | These match the three guidance tiers in the core loop. |

## Progress

### 2026-11-15: Space theme and crew overview page
- Restyled the whole frontend as a dark "mission console": deep navy, a multicolor starfield, glowing panels, and a header with an "Onboard system" pill. It's all CSS (no images or web fonts), so it works with no network.
- New layout: check-in, body figure and guidance side by side, so a check-in visibly changes the figure without scrolling. Two pages with tabs: "My health" and "Crew overview".
- New `screens/CrewOverview.tsx`: one column per crew member, one row per indicator. Each cell shows the latest value, a status badge, and that person's own usual value. A mini body figure sits on top of each column, and "View details" opens that person's dashboard.
- New `theme.ts` (shared status colors and labels) and `components/StatusBadge.tsx`. Status is always shown as a word plus a color, never color alone.
- `BodyFigure` got a `compact` prop, so the crew page reuses it without the detail panel.
- Check-in instructions are now collapsed behind "How to take this measurement", to keep the form on one screen.
- Bug found: the first starfield was invisible, because a background on `:root` was painted over layers with `z-index: -1`. Verified the fix with screenshots.
- The chart line animation is off: the line didn't draw in headless screenshots, and an instant line is safer for the demo.
- Concepts: [CSS variables](#css-variables), [Reusing a component with props](#reusing-a-component-with-props), [Stacking order](#stacking-order)

### 2026-11-15: Crew dropdown from the backend
- The crew dropdown now loads from Carl's `GET /api/crew` instead of three hardcoded options. It shows each name and role, still labeled "(simulated)".
- Added a `CrewMember` type to `types.ts`.
- Gotcha: the endpoint first returned 404 because the running backend had started before pulling Carl's controller. Restart the backend after pulling backend changes.
- Concepts: [Data-driven UI](#data-driven-ui)

### 2026-11-15: "Your usual" line on the trend chart
- The trend chart draws a dashed `ReferenceLine` at the person's baseline (from `/status`), so you can see at a glance when a reading is unusual *for them*. For example, crew 1's SpO2 sits around 97, and today's 92 drops well below the line.
- `TrendChart` gets `status` as a prop (it can be `null` while loading), and finds the baseline with `flatMap` + `find`. No line is drawn when the baseline is still being built.
- Bug: the line first sat outside `</LineChart>`, so nothing was drawn. Chart parts must be children of the chart.
- Concepts: [flatMap](#flatmap)

### 2026-11-15: Trend chart on real data
- `TrendChart` now fetches `GET /api/crew/{id}/measurements?indicator=...` (rerunning on `[crewId, indicatorId, refreshKey]`) and `GET /api/indicators` for its dropdown. No more mocks.
- A check-in now adds a new point to the chart. Every Must-have screen uses real data.
- Mistake and lesson: the chart's state and fetches first ended up in `App`. State belongs in the component that uses it. Only lift it up when several components share it (like `crewId`).
- Git: `Neo/lift-status` was pushed but never merged, so this branch is built on top of it plus main. One PR brings in both.
- Concepts: [Where state lives](#where-state-lives)

### 2026-11-15: One shared status for the body figure and guidance
- `App` now fetches `GET /api/crew/{id}/status` once (into `crewStatus`) and passes it to both `BodyFigure` and `Guidance`. They always agree, and both update after a check-in.
- `Guidance` takes a `status` prop instead of reading `mockStatus`. That's why it didn't update after a check-in before.
- Deleted `StatusScreen.tsx`, because its job moved into `App`.
- Gotcha: `App` already had a `status` variable (the health check), so the new one is `crewStatus`. Using the wrong setter would have put an object into the page heading.
- Concepts: [Single source of truth](#single-source-of-truth), [Fragments](#fragments)

### 2026-11-15: Hotfix: conflict markers on main
- PR #23 merged `App.tsx` with `<<<<<<<` and `>>>>>>>` markers still in it, so the app wouldn't compile for anyone who pulled main.
- Fixed it: `App.tsx` now renders `StatusScreen` with props, plus Adi's `TrendChart`.
- Lesson: after resolving a conflict, search for `<<<<<<<` and run the app (or `npm run build`) before committing. Run `npm install` after pulling if `package.json` changed.
- Concepts: [Conflict markers](#conflict-markers)

### 2026-11-15: Check-in saves to the backend
- `CheckIn` now loads indicators from `GET /api/indicators` (no more mock), and on submit POSTs each value to `POST /api/measurements` with `Promise.all`. It only shows "saved" after every request finishes.
- Lifted state up: `App` owns `crewId` (and the crew dropdown) and a `refreshKey`. `CheckIn` uses `crewId` and calls `onSaved()` after saving, which bumps `refreshKey`. `StatusScreen` refetches when `crewId` or `refreshKey` changes.
- Verified in the API: a new check-in becomes the latest reading and is assessed (crew 2 SpO2 90 → ALERT).
- Fixed a merge conflict on Adi's `adi/trend-chart` branch (`App.tsx`), and a missing type import in `mocks/measurements.ts`.
- To do: the Guidance screen still reads `mockStatus`, so it doesn't change after a check-in.
- Note: `CheckIn.tsx` was auto-formatted by the editor (a large diff). Turn off format-on-save to avoid conflicts.
- Concepts: [POST requests](#post-requests), [Promise.all](#promiseall), [Lifting state up](#lifting-state-up), [Rules of hooks](#rules-of-hooks)

### 2026-11-15: Body figure on real data
- Added `screens/StatusScreen.tsx`: a crew dropdown (1 to 3, labeled simulated) that fetches `GET /api/crew/{id}/status` and passes it to `BodyFigure`. `App.tsx` renders `StatusScreen` instead of the mock.
- Milestone: the core loop runs end to end: seeded data → assessment → API → colored body figure.
- `BodyFigure` didn't change, because it only receives data through props. `mocks/status.ts` stays for Adi's screens.
- Concepts: [useEffect dependencies](#useeffect-dependencies), [Container and display components](#container-and-display-components), [Template strings](#template-strings)

### 2026-11-15: Simulated measurements
- Added `MeasurementSeeder.java`: 14 days of simulated readings for every crew member and indicator, so `/status` shows real statuses instead of `NO_DATA`.
- The story for the demo: crew 1 has SpO2 ALERT and heart rate CAUTION today, crew 2 is all normal, and crew 3 has sleep CAUTION.
- Today's readings sit exactly at the usual value (except for the story values). With random wobble, healthy crew members got surprise CAUTIONs.
- The usual values and wobbles only generate fake data. They aren't medical thresholds.
- Added `@Order(1)` to `DataSeeder` and `@Order(2)` to `MeasurementSeeder`, so the crew and indicators exist first.
- Found a design issue: the rule flags good changes too (a better mood is shown as CAUTION). Added to TODO as a team decision.
- Updated TODO.md with everyone's progress.
- Concepts: [Seed data](#seed-data), [Fixed random seed](#fixed-random-seed), [Runner order](#runner-order)

### 2026-11-14: Clickable body figure and detail panel
- Clicking a body part selects its system (`useState`). A side panel shows its status (in color), the reason, the next step from the escalation level, and each indicator's latest value against the person's usual.
- `NO_DATA` systems say "No measurements yet". A null baseline says "still building your baseline".
- Every panel says "Simulated data. Decision support only, not a diagnosis."
- Indicator names come from `mocks/indicators.ts` for now. Swap in `GET /api/indicators` once it exists.
- Concepts: [State and re-rendering](#state-and-re-rendering), [Event handlers](#event-handlers), [Conditional rendering](#conditional-rendering)

### 2026-11-14: Body figure, first version
- Added `components/BodyFigure.tsx`: an SVG body where each part is colored by its body system's status. The body outline is thermoregulation, the lungs respiratory, the heart cardiovascular, the brain cognitive, the eyes sleep, and the mouth behavioral.
- Added `StatusResponse` types to `types.ts` (with `| null` where the backend can send null), and simulated data in `mocks/status.ts` with every status, so every color shows.
- Icons come from SVG Repo. We removed their hardcoded colors so `fill` can be set from the status. Removed the leftover Vite template from `App.tsx`.
- Decision: a 2D figure with flat icons, not 3D. It's clearer on a projector and much faster to build.
- To do: make the parts clickable and show a detail panel. Add icon licenses to the credits.
- Concepts: [SVG viewBox](#svg-viewbox), [Nested SVG](#nested-svg), [Props](#props), [Optional values in TypeScript](#optional-values-in-typescript)

### 2026-11-14: Status endpoint
- Added `StatusController`: `GET /api/crew/{id}/status` passes the request straight to `AssessmentService.assess(id)`. It returns all 6 body systems (`NO_DATA` until measurements are seeded), and a 404 for an unknown crew member.
- To do: error bodies are Spring's default, not the contract's `{ "error": "..." }`. A global `@RestControllerAdvice` handler can fix that later.
- Concepts: [Controller vs. service](#controller-vs-service), [Path vs. query parameters](#path-vs-query-parameters)

### 2026-11-14: Check-in form
- Added `screens/CheckIn.tsx`: one input per indicator, builds `POST /api/measurements` bodies on submit (logged for now, not sent yet).
- Blocks impossible values (negatives, SpO2 over 100, sleep over 24 h, mood outside 1–5). Health thresholds stay in the assessment service.
- Concepts: [Controlled inputs](#controlled-inputs)

### 2026-11-14: Assessment service
- `AssessmentService.assess(crewMemberId)` builds the full `/status` response. It covers a 404 for an unknown crew member, a 14-day window, each indicator assessed against its own history, the worst indicator per body system, escalation, and an overall status.
- Decision: `NORMAL` and `CAUTION` map to `SELF_CARE`, and `ALERT` maps to `CREW_MEDICAL_OFFICER`. `FLIGHT_SURGEON` is reserved for persistent alerts. The contract was updated to match.
- Concepts: [Dependency injection](#dependency-injection), [Variable scope](#variable-scope), [Comparing enums](#comparing-enums)

### 2026-11-14: Tests for the assessment rules
- `AssessmentRulesTest`: 8 JUnit tests covering mean, standard deviation, NORMAL, CAUTION and ALERT, too few readings, and the never-varies cases. Run them with `cd backend && ./mvnw test`.
- Concepts: [Unit tests](#unit-tests), [src/main vs. src/test](#srcmain-vs-srctest)

### 2026-11-14: Assessment rules
- `service/AssessmentRules`: `mean`, `standardDeviation`, and `classify(latest, history)`, which returns a status, the baseline and a plain-language reason.
- Rules: fewer than 5 past readings means NORMAL while the baseline builds. Otherwise, more than 2 standard deviations from the person's own average is CAUTION, and more than 3 is ALERT. If past readings never vary, any change is CAUTION.
- Concepts: [Standard deviation](#standard-deviation), [Pure functions](#pure-functions), [Edge cases](#edge-cases)

### 2026-11-14: Assessment building blocks
- `MeasurementRepository` query for one crew member's readings of one indicator since a given time.
- `Status` and `EscalationLevel` enums, plus `dto` records (`IndicatorStatus`, `BodySystemStatus`, `StatusResponse`) that mirror the `/status` JSON.
- Decision: baselines are computed from past readings, not stored.
- Concepts: [Repositories and derived queries](#repositories-and-derived-queries), [Records and DTOs](#records-and-dtos)

### 2026-11-14: API contract, part 2
- Added `GET /api/crew/{id}/measurements`, `GET /api/crew/{id}/status` and `GET /api/crew/{id}/alerts`. All six endpoints are now in the contract.
- Range fields are now nullable, following Adi's finding that NASA gives no fixed ranges.
- Team decision: six body systems, including `COGNITIVE`, which matches Carl's `BodySystem` enum.
- Concepts: [Path vs. query parameters](#path-vs-query-parameters), [Nullable fields](#nullable-fields), [Computed vs. stored data](#computed-vs-stored-data)

### 2026-11-14: Health content for all indicators
- Added `docs/health-content.md`: how to measure, why it matters in space, related hazard, warning signs and NASA sources for all 7 indicators.
- NASA doesn't publish fixed normal/caution ranges for these, so ranges are flagged for a team decision.
- Concepts: [Baseline vs. fixed ranges](#baseline-vs-fixed-ranges)

### 2026-11-14: Line endings
- Added a root `.gitattributes` with `* text=auto`, so Windows (Carl) and macOS commits don't fight over line endings.
- Concepts: [Line endings (CRLF vs. LF)](#line-endings-crlf-vs-lf)

### 2026-11-14: API contract, part 1
- `api-contract.md` with shared conventions, the error format, `GET /api/indicators` and `POST /api/measurements`. Range values are placeholders until Adi adds sources.
- Concepts: [API and contract](#api-and-contract), [GET vs. POST](#get-vs-post), [Markdown gotchas](#markdown-gotchas)

### 2026-11-14: Team TODO list
- Added `TODO.md` with tasks per person, ordered so `api-contract.md` comes first, because it unblocks everyone.
- Concepts: [Unblocking work](#unblocking-work)

### 2026-11-14: Commit rule added to CLAUDE.md
- Claude explains the key concepts like you're 5 and updates this log before every commit, for the whole team.
- Concepts: [New commit vs. amend](#new-commit-vs-amend)

### 2026-11-14: Frontend and backend connected
- Added `GET /api/health` in `controller/HealthController.java`. It returns `{"status":"UP"}`.
- Added `config/CorsConfig.java` so the React dev server can call the API.
- `App.tsx` fetches `/api/health` on load and shows the result.
- Concepts: [CORS](#cors), [Annotations](#annotations), [Component scanning](#component-scanning), [Imports](#imports), [JSX vs. JavaScript](#jsx-vs-javascript), [useState](#usestate), [useEffect](#useeffect), [fetch and promises](#fetch-and-promises), [Long-running servers](#long-running-servers)

### 2026-11-14: Project scaffolding
- React frontend scaffold, Spring Boot backend scaffold, root `.gitignore`, `CLAUDE.md`.
- Concepts: [.gitignore](#gitignore)

---

## Key concepts
### Baseline vs. fixed ranges
A fixed range is one rule for everyone, like "a temperature over 38 °C is a fever." A baseline is each person's own normal. In space, bodies change: healthy astronauts can run about 1 °C warmer than on Earth. So "is this different from *your* usual?" is often a better check than one number for everyone.
> Like 5: your friend's normal speaking voice is loud, and yours is quiet. If you suddenly start yelling, that's a big change for you, even if it's just normal volume for them.

### CORS
Browsers only let a page's JavaScript read responses from its own **origin**: the same scheme, host and port. `localhost:5173` and `localhost:8080` count as different origins. The server opts in by sending `Access-Control-Allow-Origin`. Only browsers enforce this, so it can work in curl and still fail in the browser. For some requests, like a JSON `POST`, the browser first sends an `OPTIONS` **preflight** to ask permission.
> Like 5: the browser is a strict babysitter. It won't let your page take a cookie from another house unless that house says "they're allowed."

### Annotations
`@Something` is a label on the code right below it. Spring reads these labels and wires things up for you. There's no semicolon after an annotation.
- `@RestController`: this class answers web requests and returns JSON.
- `@RequestMapping("/api")` on the class plus `@GetMapping("/health")` on a method combine into `GET /api/health`.
- `@Configuration`: this class sets up Spring itself (for example, CORS).
> Like 5: name tags. Spring reads the tag and knows what job each piece of code has.

### Component scanning
Spring only finds annotated classes in the package of `BackendApplication` (`com.example.backend`) and the packages below it. A controller outside that package gets ignored, and its URLs return 404.
> Like 5: Spring only looks for toys in its own toy box.

### Imports
`import org.springframework...GetMapping;` lets you write the short name `GetMapping`. Imports go between the `package` line and the class. Your editor can add them for you: `Cmd + .` in VS Code, `Option + Enter` in IntelliJ.

### JSX vs. JavaScript
Inside `return ( ... )` is JSX, the HTML-like markup for the screen. Hooks and other logic go *above* the `return`. Use `{ }` inside JSX to show a JavaScript value, like `{status}`.

### useState
`const [status, setStatus] = useState<string>("checking...")` creates a value and a setter. Calling the setter changes the value and makes React redraw the page.
> Like 5: a whiteboard. When you write something new on it, everyone looks again.

### useEffect
`useEffect(() => { ... }, [])` runs code after the component shows up. The `[]` means "only once, on first load". Without it, the effect runs after every render. If the effect sets state, that becomes an infinite loop.

### fetch and promises
`fetch(url)` returns a **promise**, a value that arrives later. `.then` runs when it arrives, and each `.then` gets the result of the one before. `.catch` runs if anything fails, for example when the backend is down.
> Like 5: you order pizza (`fetch`), then you open the box (`.json()`), then you eat it (`setStatus`). If the pizza never comes, you make a sandwich (`.catch`).

### Long-running servers
`./mvnw spring-boot:run` and `npm run dev` keep running and don't give the terminal back. Use separate terminals for the backend, the frontend, and commands like curl or git. Press `Ctrl + C` to stop a server.

### Path vs. query parameters
A path parameter is part of the address and is required: `/crew/1/...` means crew member 1. Query parameters come after `?`, are optional filters, and are joined with `&`: `?indicator=2&from=...`.
> Like 5: the path is the house address. Query parameters are "only bring me the red toys from this week."

### Nullable fields
`null` means "no value." Carl's entity uses `Double`, which can be `null`, instead of `double`, which can't, so a missing range is stored as "unknown" rather than a fake `0`.
> Like 5: an empty box is not the same as a box with a zero in it.

### Dependency injection
A `@Service` lists what it needs in its constructor (here, three repositories). Spring creates those objects once and passes them in. You never write `new MeasurementRepository()`.
> Like 5: you tell the teacher "I need red, blue and green," and the teacher hands you the crayons.

### CSS variables
`--accent: #5cc8ff;` on `:root` defines a named value, and `color: var(--accent);` uses it anywhere. Changing the theme means changing the variables, not every rule. Values needed in JavaScript (SVG fills, chart colors) live in `theme.ts`, and must be kept the same as the CSS ones.
> Like 5: naming your paint cans. Everyone says "use the alert red," and repainting means changing one can.

### Reusing a component with props
Instead of writing a second, smaller body figure, `BodyFigure` takes `compact`. An optional prop with a default (`compact = false`) keeps every existing use working.
> Like 5: the same Lego figure with a switch for "small, no accessories."

### Stacking order
Elements with `z-index: -1` are painted behind normal content, including behind a parent's background. A background on `:root` covered the star layers. Moving the background to `body` only (so it becomes the page canvas) let the stars show.
> Like 5: sheets of paper in a stack. The stars were under a solid-colored sheet.

### Data-driven UI
Build lists from fetched data with `.map()`, instead of writing each item by hand. When the data changes (a new crew member), the UI updates without a code change.
> Like 5: asking the office for today's class list instead of writing names on the door by hand.

### flatMap
`list.flatMap(x => x.items)` turns a list of lists into one flat list. Here, all indicators across all body systems, so `.find()` can search them at once.
> Like 5: emptying several small bags of marbles into one big bag.

### Where state lives
Put state in the lowest component that needs it. If only `TrendChart` uses the measurements, they live in `TrendChart`. If several components need it (`crewId`, the status), lift it to their shared parent. Passing props: the function line is the blank form (`{ crewId }: { crewId: number }`), and the tag fills it in (`<TrendChart crewId={crewId} />`).
> Like 5: keep your toothbrush in your own room. Only put things in the living room if the whole family uses them.

### Single source of truth
Fetch shared data once, in the closest common parent, and pass it down. Two components fetching the same thing separately can show different answers.
> Like 5: Mom calls Grandma once and tells both kids, instead of each kid calling and hearing something different.

### Fragments
`<> ... </>` groups several elements into one without adding an extra `<div>`. It's useful where only one element is allowed, like each side of `cond ? A : B`.
> Like 5: an invisible rubber band around two toys, so you can hand them over as one bundle.

### Conflict markers
During a conflict, Git writes both versions into the file between `<<<<<<<`, `=======` and `>>>>>>>`. You must edit the file to the final version and delete the markers. Git doesn't check this: `git add` accepts the file with the markers still in it. Search with `git grep "<<<<<<<"` before committing.
> Like 5: sticky notes saying "pick one!" If you leave the notes in, the code tries to run them and crashes.

### POST requests
`fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj) })` sends data to be saved. GET (the default) only asks for data. `fetch` only fails on network errors. A 400 reply still "succeeds" unless you check `r.ok`.
> Like 5: GET is asking the library for a book, and POST is dropping a letter in the mailbox.

### Promise.all
`Promise.all(list.map(item => fetch(...)))` starts every request and waits until all of them finish. `.then` runs once, after the last one.
> Like 5: waiting at the door until all your friends have arrived, not just the first one.

### Lifting state up
When two components need the same data, move the state to their closest shared parent and pass it down as props. To let a child change it, pass down a function (`onSaved`) that the child calls.
> Like 5: two kids fighting over their own remotes. Give one remote to the parent, and hand each kid a walkie-talkie to say "change it now."

### Rules of hooks
`useState` and `useEffect` must sit at the top level of a component, never inside a function, loop or `if`. React matches hooks by their order on every render. A `useEffect` doesn't return data, so store the result in state.
> Like 5: kids lining up in the same order every day, so the teacher knows who's who.

### useEffect dependencies
The array at the end of `useEffect` says when to run it again. `[]` means once, when the component first appears. `[crewId]` means again every time `crewId` changes.
> Like 5: a doorbell wired to the dropdown. Every new pick rings it, and it fetches fresh data.

### Container and display components
`StatusScreen` gets the data (state, fetch, dropdown), and `BodyFigure` only draws whatever it receives. Swapping mock data for real data only changed the container.
> Like 5: a cable box and a TV. The box fetches the channel, and the TV just shows what it's given.

### Template strings
Backticks let you put values into text: `` `crew/${crewId}/status` ``. Regular quotes print `${crewId}` literally.
> Like 5: fill-in-the-blank text.

### Seed data
Code that fills the database at startup with demo data. H2 is in memory, so it reseeds on every restart. `if (repo.count() > 0) return;` stops it seeding twice.
> Like 5: stocking a pretend shop before opening day, so customers have something to look at.

### Fixed random seed
`new Random(42)` gives the same "random" numbers on every run. `nextGaussian()` gives values that are mostly close to 0 and rarely far, like real day-to-day wobble.
> Like 5: shuffling a deck exactly the same way every time. It looks random, but every rehearsal gets the same cards.

### Runner order
Every `CommandLineRunner` runs at startup. `@Order(n)` sets the order, and lower runs first. A runner without `@Order` runs last.
> Like 5: a line for the slide. Number 1 goes first.

### State and re-rendering
`const [selected, setSelected] = useState(null)` gives a component memory. Calling `setSelected(...)` stores a new value and makes React run the component again, so the screen matches the new value.
> Like 5: the component's memory. When it remembers something new, it redraws its picture.

### Event handlers
`onClick={() => setSelected("RESPIRATORY")}` passes a function to run later, on click. Writing `onClick={setSelected("RESPIRATORY")}` would run it immediately, while drawing.
> Like 5: a sticky note that says "when tapped, do this," instead of doing it right now.

### Conditional rendering
Show different JSX depending on the data: early `return`s in a helper function, `cond ? A : B`, or `cond && A` (show A only if cond is true).
> Like 5: a choose-your-own-adventure book. Which page you see depends on what you picked.

### SVG viewBox
`viewBox="minX minY width height"` sets the coordinate grid that the shapes are drawn in. The browser scales that grid to fit the element on screen. Changing the numbers crops or zooms without moving any shapes.
> Like 5: a camera. The drawing stays put, and you choose where to point the camera and how much to zoom.

### Nested SVG
An `<svg>` inside an `<svg>` gets its own `viewBox`, so an icon drawn on a 512 grid can sit in a 16×16 box on a 200×400 canvas. `x`, `y`, `width` and `height` place the box (`x` and `y` are the top-left corner). Shapes later in the code are drawn on top.
> Like 5: a picture frame. Each picture keeps its own size inside, and you only choose where to hang the frame.

### Props
A React component receives data through props, for example `<BodyFigure status={mockStatus} />`. The component only reads them, and the parent decides what to pass. Swapping the mock for real API data later only changes the parent.
> Like 5: a lunchbox someone hands you. You eat what's inside, and you don't pack it yourself.

### Optional values in TypeScript
`.find()` returns the item or `undefined`. Checking `if (entry)` narrows the type, so inside the `if` TypeScript knows `entry` exists. `number | null` in a type forces you to handle the missing case.
> Like 5: before you open a box, check that there's a box.

### Controller vs. service
The controller handles HTTP: the URL, `@PathVariable`, and turning the result into JSON. The service holds the logic. Keeping controllers thin means the logic can be tested and reused without a web request.
> Like 5: the waiter takes your order to the kitchen. The kitchen cooks. The waiter doesn't cook.

### Variable scope
A variable declared inside `{ }` only exists inside those braces. To set it in an `if`/`else` and use it afterwards, declare it before the `if` and only assign it inside.
> Like 5: a toy made inside a room stays in that room. If you need it in the hallway, put it in the hallway first.

### Comparing enums
`a.compareTo(b) > 0` means "a is declared after b." `Status` is declared `NORMAL, CAUTION, ALERT, NO_DATA`, so later means worse, except that `NO_DATA` sits last and needs its own check.

### Unit tests
A unit test runs one small piece of code with known inputs and checks the answer with `assertEquals(expected, actual)`. Each test follows three steps: set up, run, check. Name tests after the behavior (`betweenTwoAndThreeStandardDeviationsIsCaution`), so a failure tells you what broke. Pick inputs with easy numbers (an average of 97 and a wobble of exactly 1) so you can check the expected answer in your head.
> Like 5: a robot that rechecks your homework every time you change it.

### src/main vs. src/test
`src/main` is the real app. `src/test` holds tests, in the same folder and package layout. Test tools like JUnit are test-only dependencies, so code in `src/main` can't import them, and tests never ship with the app.

### Standard deviation
The average says what's normal for you. The standard deviation says how much you usually wobble around it. To get it, take each reading minus the average, square it, average those squares, then take the square root. "3 standard deviations away" means three times further than your usual wobble.
> Like 5: if you always sleep about 7 hours, give or take half an hour, then 5 hours is 4 half-hours away. That's very unusual for *you*.

### Pure functions
`classify` takes numbers in and gives a result back. It doesn't touch the database or the network. That makes it easy to test, and it works with no connection at all, which is the core of the Mars pitch.
> Like 5: a calculator. Same buttons, same answer, every time, even with the Wi-Fi off.

### Edge cases
These are the unusual inputs that break naive code. Here they were: too few readings, and readings that never vary (wobble = 0). Dividing by zero with doubles doesn't crash in Java. It silently gives "infinity," which turned a small mood change into ALERT. Test edge cases on purpose.
> Like 5: checking your boat floats in the bath and in the waves, not just in the bath.

### Repositories and derived queries
A repository is an interface that talks to the database for you. Spring writes the code behind it. Name a method like `findByCrewMemberIdAndIndicatorIdAndTimestampAfterOrderByTimestampAsc`, and Spring turns the name into a query. The compiler doesn't check the name, but Spring does at startup, so run the app or `./mvnw test` to find out if a name is wrong.
> Like 5: the worker at the warehouse counter. Say exactly what you want, and they fetch it.

### Records and DTOs
A `record` is a one-line class that just holds data. A DTO (data transfer object) is a class whose only job is to be sent as JSON. Field names become JSON keys, so a typo like `inidcators` compiles fine but breaks the frontend. Always compare field names against the contract.
> Like 5: a labelled lunchbox. The labels must match what the person opening it expects to find.

### Computed vs. stored data
Measurements are **stored** in the database. Status and alerts are **computed** from those measurements on each request. Computed data can never fall out of date or contradict the measurements, and there's no extra table to maintain. The cost is a bit of work on every request, which is fine at our size.
> Like 5: you don't write "I'm 8" on a sticky note and update it every year. You keep your birthday and work out your age whenever someone asks.

### API and contract
The API is how React and Spring talk: React asks at a URL, and Spring answers with JSON. The contract writes down exactly what each question and answer looks like, so people can build both sides at the same time.
> Like 5: a restaurant menu. Everyone agrees what "the SpO2 plate" looks like before anyone cooks.

### GET vs. POST
GET reads and never changes anything; its inputs go in the URL (`?indicator=2`), and it returns `200`. POST creates something new; its data goes in a JSON body, and it returns `201 Created`.
> Like 5: GET is looking in the fridge. POST is putting a new snack in it.

### Markdown gotchas
Code blocks need three backticks (`` ``` ``), not `'''` or one `` ` ``. A `---` directly under a line of text turns that line into a heading, so leave a blank line above it. Headings need a space after the `#`.

### Line endings (CRLF vs. LF)
Every line of text ends with invisible characters. Windows uses CRLF (`\r\n`), and macOS and Linux use LF (`\n`). If they get mixed, Git thinks every line changed. `* text=auto` in `.gitattributes` makes Git store LF in the repo and convert to each computer's native ending on checkout. `mvnw` is forced to LF and `.cmd` files to CRLF, because shell and Windows scripts need those to run.
> Like 5: Windows puts two full stops at the end of each sentence, and Mac puts one. Git quietly fixes them, so nobody's essay looks rewritten.

### Unblocking work
On a team, do first whatever other people are waiting on. The API contract comes first, because Carl's endpoints and Adi's mock data both depend on its JSON shapes. While it's being written, each person picks tasks that don't depend on it (entities, health content).
> Like 5: before anyone builds Lego, agree on what the picture on the box looks like.

### New commit vs. amend
`git commit --amend` rewrites your last commit. That's fine before you push. Once a commit is pushed, teammates may already have it, and rewriting it forces everyone to untangle the history. After a push, make a new commit instead.
> Like 5: once you've handed your drawing to a friend, don't secretly swap it. Hand them a second drawing.

### .gitignore
This file lists things Git should never track: build output (`target/`, `node_modules/`), editor settings (`.idea/`, `.vscode/`) and secrets (`.env`).

### Controlled inputs
The input box shows whatever is in React state (`value={...}`), and every keystroke updates that state (`onChange`). React is always the one in charge of what's in the box, so clearing the form is just `setValues({})`.
> Like 5: the input is a puppet and state holds the strings. Move the strings, and the puppet moves.
