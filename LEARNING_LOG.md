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
| Five body systems: `CARDIOVASCULAR`, `RESPIRATORY`, `THERMOREGULATION`, `SLEEP`, `BEHAVIORAL` | One per indicator group, and each maps to a body-figure region. Bone, muscle and vision are pitched as future work, because a quick check-in can't measure them. |
| Status values `NORMAL`, `CAUTION`, `ALERT` | A small fixed set that maps straight onto the body-figure colors. |

## Progress

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
