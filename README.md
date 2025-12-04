# Workload Radar – Frontend SPA

A Vue 3 single‑page application for managing projects, tasks and analytical reports on top of the **Workload Radar** backend (Flask + PostgreSQL + Celery).

This repo is intentionally built as a **resume‑grade frontend project**:

- Modern stack: **Vue 3 + `<script setup>` + Vite + Pinia**
- UI: **Tailwind CSS** + **Heroicons** + subtle motion via **@vueuse/motion**
- State management and API layer separated cleanly
- Integration with a real backend API (projects, tasks, async reports)
- Shows how I think about **clean code, SOLID/DRY/KISS/YAGNI, CORS, and DX**

> Backend repo: `workload-radar` (Flask/Pony ORM/PostgreSQL/RabbitMQ/Celery/Docker).  
> This frontend talks directly to that API.

---

## 1. Problem and concept

### 1.1. What problem does this solve?

Imagine a small team with several projects and lots of tasks bouncing between people. The questions you always get are:

- Who owns which project?
- Which tasks are still “todo”, which ones are “in progress”, which are “done”?
- How fast are we closing tasks for a given project?

The **Workload Radar** backend already implements the domain:

- Users
- Projects
- Tasks with status and priority
- Asynchronous **daily summary reports** (via Celery) that compute:
  - `status_counts` – how many tasks are in each status
  - `avg_lead_time_days_last_30_days` – average time to complete tasks

This frontend provides a focused SPA that:

1. Lets you **select an owner** and see their projects.
2. Navigate into a project and **see all tasks**.
3. Create tasks and update their status (e.g. mark as `done`).
4. Trigger a **daily summary report** and visualize the metrics returned by the backend.

So the “business” value is:

- A minimal but realistic UI on top of a real API.
- Metrics exposed to the user in a compact way.

The “resume” value is:

- Demonstrates a **full Vue 3 pipeline**: routing, state, API layer, UI, animations, CORS handling, dev/prod story.

---

## 2. Tech stack

### 2.1. Frontend

- **Vue 3** with **Composition API** and `<script setup>`
- **Vite** as the build tool and dev server
- **Pinia** for state management
- **Vue Router** for client‑side routing
- **Tailwind CSS** for styling and theming
- **@heroicons/vue** for icons
- **@vueuse/core** for high‑level composables (e.g. dynamic document title)
- **@vueuse/motion** for small, declarative animations
- **Axios** for HTTP client

### 2.2. Backend (assumed)

The frontend expects an existing backend that exposes:

- `POST /auth/register` – create a user (returns `id`, `email`, `name`, `created_at`)
- `POST /projects` – create a project
- `GET /projects?owner_id=...` – list projects for an owner
- `POST /tasks/project/{project_id}` – create a task in a project
- `GET /tasks/project/{project_id}` – list tasks for a project
- `PATCH /tasks/{task_id}/status` – update task status
- `POST /reports/project/{project_id}/daily-summary` – create async report
- `GET /reports/{report_id}` – fetch report status and result

The frontend **does not re‑implement** any backend logic. It consumes the API as a real client.

---

## 3. Architecture overview

The project is split into the following layers:

```text
src/
├─ api/          # Axios-based API clients (projects, tasks, reports)
├─ stores/       # Pinia stores (projects, tasks + reports)
├─ views/        # Route-level views (pages)
├─ components/   # Presentational components (lists, panels, layout)
│  ├─ layout/    # Application shell
│  ├─ projects/  # Project list
│  ├─ tasks/     # Task list
│  └─ reports/   # Report panel
├─ router/       # Vue Router configuration
└─ assets/       # Tailwind entry CSS
```

**Responsibility split:**

- `api/*` – knows how to talk to **HTTP** (URLs, query params, payloads).
- `stores/*` – knows about **app state and flows** (loading flags, error messages, polling a report).
- `views/*` – orchestrates the page: wires inputs, buttons, and components to store actions.
- `components/*` – mostly “dumb” UI: receive props, emit events. No API calls.

This separation keeps code **testable** and **maintainable**, and follows SRP from SOLID.

---

## 4. Features

### 4.1. Projects page

Route: `/projects`

- Input to set **owner ID** (matches a backend user).
- Button to **load projects** for that owner.
- Form to **create a new project** bound to the selected owner.
- Project list:
  - Project name
  - ID
  - Owner
  - Created timestamp (if available)
  - “View tasks” button → navigates to `/projects/:projectId/tasks`

Under the hood:

- Uses the **projects store** to:
  - Keep the current owner ID in state
  - Fetch data from `GET /projects`
  - Create new projects via `POST /projects`
- Uses **@vueuse/core** (`useTitle`) to update the browser tab title to  
  `Projects • Workload Radar`.

### 4.2. Project tasks page

Route: `/projects/:projectId/tasks`

- Header with project ID and “Back to projects” link.
- Form to create a new task:
  - Title (required)
  - Description (optional)
  - Assignee ID (required, should map to an existing user)
- Task list:
  - Title + colored badge with `status` (todo, in_progress, done)
  - Description
  - Metadata: ID, assignee, priority
  - Button to **mark a task as done**
- Report panel:
  - Button “Generate report”
  - Shows report metadata: id, status, created_at, finished_at
  - Shows metrics from backend `result`:
    - `status_counts` as labeled chips
    - `avg_lead_time_days_last_30_days` as a highlighted number

Under the hood:

- Uses the **tasks store** to:
  - Load tasks for the project from `GET /tasks/project/{project_id}`
  - Create tasks via `POST /tasks/project/{project_id}`
  - Update status via `PATCH /tasks/{task_id}/status`
  - Trigger a report via `POST /reports/project/{project_id}/daily-summary`
  - Poll report status via `GET /reports/{report_id}` until it becomes `ready`

### 4.3. UI and animations

- Global **dark theme** using Tailwind: slate background, subtle gradients, soft shadows.
- Application shell with:
  - Sticky header
  - Small “logo” badge
  - Minimal navigation
- Motion:
  - Header and content **fade/slide in** on load.
  - Project and task cards fade in with a slight vertical offset.
- Icons:
  - Header uses **Heroicons** to suggest code/github navigation.

All animation is declarative (no imperative `setTimeout`/manual class toggling) via `@vueuse/motion`.

---

## 5. Running the project

### 5.1. Prerequisites

- Node.js ≥ 18
- **pnpm** as package manager (used intentionally to show familiarity with modern tooling)
- A running instance of the **Workload Radar backend** with the routes described above

### 5.2. Install dependencies

```bash
pnpm install
```

### 5.3. Backend base URL and CORS

There are two supported modes:

#### Mode A – Dev proxy (recommended for local development)

In this mode:

- Vite dev server runs on `http://localhost:5173`
- Backend runs on `http://localhost` (for example via Docker + Nginx on port 80)
- The frontend sends all API calls to `/api/*`
- Vite proxies `/api/*` to the backend and strips the `/api` prefix

This keeps everything **same‑origin** from the browser’s perspective → no CORS errors.

`vite.config.cjs`:

```js
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost', // backend base
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

`src/api/httpClient.js`:

```js
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'
```

So in dev you do **not** need to set `VITE_API_BASE_URL` at all.

#### Mode B – Explicit API base URL

In prod (or if you want to hit a remote backend) you can define:

```env
VITE_API_BASE_URL=https://your-backend-hostname
```

In that case:

- All requests go directly to that URL.
- You must ensure that your backend (or reverse proxy like Nginx) sends the correct **CORS headers**.

### 5.4. Start dev server

```bash
pnpm dev
```

Open:

- `http://localhost:5173`

Then:

1. **Create a user** in the backend via `POST /auth/register` (for example using `curl` or Postman).
2. Use that user’s `id` as **Owner ID** in the Projects page.
3. Load or create projects.
4. Navigate to a project, create tasks, mark them `done`.
5. Generate a report and watch its metrics appear.

---

## 6. Implementation details & design decisions

### 6.1. API layer

Instead of calling `axios` directly in components, the API layer is structured by domain:

- `projectsApi` – `fetchProjects`, `createProject`
- `tasksApi` – `fetchTasks`, `createTask`, `updateTaskStatus`
- `reportsApi` – `createDailySummary`, `getReport`

Benefits:

- Clear, discoverable surface area per domain
- Easy to mock/replace in tests
- Components and stores depend on **intent**, not on the low‑level transport

### 6.2. State management with Pinia

Two main stores:

- `useProjectsStore`
  - `ownerId`, `projects`, `loading`, `error`
  - `fetchProjects`, `createProject`, `setOwnerId`
- `useTasksStore`
  - `tasks`, `tasksLoading`, `tasksError`
  - `report`, `reportLoading`, `reportError`
  - `fetchTasks`, `createTask`, `updateTaskStatus`
  - `generateReportForProject`, `_pollReportUntilReady`, `clearReport`

Pattern:

- UI calls **store actions**.
- Store:
  - Sets loading flags
  - Clears/sets errors
  - Triggers corresponding API functions
  - Normalizes data into simple arrays/objects

This follows KISS and SRP: the router views stay very thin and declarative.

### 6.3. SOLID / DRY / KISS / YAGNI in practice

Some concrete choices:

- **No giant global store**: projects and tasks are in separate stores with clear boundaries.
- **No over‑engineering** with generic forms or dynamic schemas – not needed at this scale (YAGNI).
- **UI components are mostly dumb**:
  - `ProjectList` receives `projects` and `loading` as props.
  - `TaskList` receives `tasks` and emits `mark-done`.
  - `ReportPanel` receives `report`, `loading`, `error` and emits `generate`.
- **Any logic that might be reused lives in stores or API layer**, not in route components.
- **No CSS frameworks** beyond Tailwind; it is enough for consistent styling without hiding HTML or forcing heavy abstractions.

### 6.4. Motion and DX

Instead of manually juggling CSS classes for transitions:

- `@vueuse/motion` is used to configure small entrance animations.
- The configuration is colocated with components and expressed in JavaScript objects:

```js
const cardMotion = computed(() => ({
  initial: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.25 } }
}))
```

This keeps the UI responsive and “alive” without turning into a mess of CSS keyframes.

---

## 7. Metrics

There are two kinds of metrics here.

### 7.1. Business / product metrics (displayed in the UI)

These come directly from the backend’s daily summary report:

- `status_counts`:
  - How many tasks are in `todo`, `in_progress`, `done`.
  - Useful to see **current workload vs. completed work** for a project.
- `avg_lead_time_days_last_30_days`:
  - How long it takes on average to complete tasks in the last 30 days.
  - Gives a simple **velocity** metric without going full Jira‑level complexity.

The frontend’s job is to **visualize** these metrics in a compact way:

- As chips for status counts.
- As a highlighted number for average lead time.

### 7.2. Engineering / implementation metrics

The project is small, but consciously tracks:

- **API behavior**:
  - All critical flows are covered by backend tests (run via Docker + pytest).
- **CORS and network**:
  - Clear separation between dev proxy and direct API:
    - Dev: no CORS because of `/api` proxy.
    - Prod: explicit `VITE_API_BASE_URL` and responsibility moved to backend/Nginx.

If needed, it would be straightforward to add:

- Request/response timing logs in the backend.
- A small frontend “debug panel” to show how many API calls happened for each interaction.

---

## 8. Problems encountered and how they were solved

### 8.1. CORS error when calling the backend

**Symptom (browser console):**

```text
Access to XMLHttpRequest at 'http://localhost/projects?owner_id=1&...'
from origin 'http://localhost:5173' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**Root cause:**

- Frontend origin: `http://localhost:5173`
- Backend origin: `http://localhost` (port 80)
- Different ports → different origins → **cross‑origin request**.
- Backend did not send `Access-Control-Allow-Origin` header.

**Fix (dev mode):**

- Introduced Vite **proxy** for `/api` → `http://localhost`.
- Changed frontend base URL from `http://localhost` to `/api`.
- Result: from the browser’s perspective, all requests come from `http://localhost:5173` to the same origin, so **CORS is no longer triggered**.

This is a typical real‑world issue and the fix (dev proxy + single origin in prod) is a standard, production‑grade pattern.

### 8.2. Backend integration and report polling

Another point to handle correctly:

- Reports are created as **async jobs** and are initially `pending`.
- The frontend cannot block and “wait forever”; it needs a **polling strategy**.

Chosen approach:

- After creating a report, the tasks store calls a private method `_pollReportUntilReady(reportId)`:
  - Tries up to `maxAttempts` (10) with `delayMs` (1000 ms) between calls.
  - Updates `report` in state each time.
  - If status becomes `ready`, it stops.
  - If it never becomes `ready`, an error message is stored in `reportError`.

This illustrates:

- How to integrate with async jobs from the frontend.
- A simple, understandable polling mechanism with a clear stop condition.

---

## 9. How to present this project in an interview

You can talk about this project along these lines:

> **Problem.** I wanted a realistic but compact app to show how I design a modern frontend around an existing backend: projects, tasks, and daily summary reports.

> **Stack selection.** I picked Vue 3 with `<script setup>`, Vite, Pinia and Tailwind because they are lightweight, fast to iterate with, and map nicely to the backend REST model. I added VueUse and VueUse Motion to show that I know how to improve DX and UX without over‑complicating things.

> **Architecture.** I separated the project into API clients, Pinia stores, route views, and presentational components. API clients know HTTP, stores know app workflows, and components are stateless views. This follows SOLID principles and keeps things testable.

> **Metrics.** On the product side, the UI surfaces status counts and average lead time for tasks, computed by the backend. On the engineering side, I made sure the flows that matter are covered by backend tests and that network behavior (CORS, proxy) is explicit and well‑documented.

> **Challenges.** The main integration issue was CORS: Vite runs on port 5173 and the backend on port 80, so browsers block cross‑origin requests by default. I solved that with a dev proxy (`/api` → backend) and a simple base URL strategy, which is a common pattern I use in real projects. Another subtle part was integrating with async Celery reports – I implemented a bounded polling mechanism in the tasks store so that the UI remains responsive and errors are explicit.

> **Why this is senior‑level.** The interesting part is not the number of components; it’s the way concerns are separated, edge cases like CORS and async jobs are handled, and the app is prepared both for local development and for a production deployment behind a reverse proxy like Nginx.

---

## 10. Possible extensions

If I wanted to grow this into an even stronger portfolio piece, I would:

- Add **authentication UI** (login/register) and persist the JWT or session.
- Add simple **filters** on the tasks list (by status, priority).
- Add a small **“insights” panel** aggregating report data over time.
- Add a few **frontend unit tests** (e.g. with Vitest) for stores and critical components.
- Add a **Dockerfile** for the frontend and serve the built assets from Nginx next to the backend.

For now, the scope is intentionally tight: it demonstrates architecture, integration, and developer thinking without turning into a full‑blown product.

## 11. License

```text
MIT License

Copyright (c) 2025 Mohammad Eslamnia
```
