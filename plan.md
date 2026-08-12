# HRMS Recruitment Module — Build Plan

## 1. Tech Stack

### Frontend

- **React 18 + Vite** — fast dev server, easy build
- **Redux Toolkit** — global state (auth, jobs, candidates, pipeline)
- **React Router v6** — routing/navigation
- **Tailwind CSS** — utility-first styling, fast responsive work
- **React Hook Form + Zod** — form state + runtime schema validation
- **prop-types** — runtime prop validation for components (standing in for TS types)
- **Axios** — API client with interceptors (auth token, error handling)
- **Recharts** — dashboard charts (pipeline funnel, applications over time)
- **react-hot-toast** — action feedback (success/error toasts)

### Backend

- **Node.js + Express** — plain JavaScript (ES modules)
- **MongoDB + Mongoose** — schema modeling, validation hooks
- **JWT (jsonwebtoken)** — access-token auth only (kept simple, no refresh-token flow — matches the tasks below; add one later only if there's spare time)
- **bcrypt** — password hashing
- **Zod** — request validation (same library as the frontend forms; one validator file per resource, see Phase 1/4)
- **Multer** — resume/file uploads (if included)
- **express-rate-limit + helmet + cors** — baseline security
- **dotenv** — env config

### Infra / Deployment

- **MongoDB Atlas** — hosted DB
- **Render or Railway** — backend hosting
- **Vercel** — frontend hosting
- **GitHub Actions** (optional, nice-to-have) — lint/build check on push

---

## 2. Design System — Light, Premium Theme

### Color tokens (define once in Tailwind config, reference everywhere — never a raw hex value in a component)

- `surface` (page background): `#FAFAFA`
- `surface-elevated` (cards, modals, dropdowns): `#FFFFFF`
- `border`: `#E4E4E7`
- `text-primary`: `#18181B`
- `text-secondary`: `#6B7280`
- `text-muted`: `#9CA3AF`
- `primary` (buttons, links, focus rings): `#2B3A67` — a deep indigo-navy, reads trustworthy/corporate without being the generic default blue
- `accent` (used sparingly — key stat numbers, premium highlight badges only): `#A67C3D` — a muted brass/gold, the actual "premium" signal
- `success`: `#16A34A`, `danger`: `#DC2626`, `warning`: `#D97706` — all muted, not neon

Do not use a warm cream background with a terracotta/clay accent — that specific pairing is a well-known AI-generated-design tell. The cooler neutral palette above is the deliberate alternative.

### Typography

- Display/headings (h1–h3, page titles, key dashboard stat numbers): **Plus Jakarta Sans**, weights 600/700
- Body/UI (paragraphs, labels, table content, buttons, form fields): **Inter**, weights 400/500
- Exactly two typefaces — don't add a third "for numbers"; use Inter's tabular-nums feature for aligned dashboard figures instead
- Fixed type scale only (e.g. 12/14/16/20/24/32px), set once in Tailwind config — never an arbitrary size picked per component
- Load both via a Google Fonts `<link>` in `index.html` — no self-hosting setup needed for a project this size

### Spacing, radius, elevation

- Spacing: Tailwind's default 4px scale is enough — don't introduce a second one
- Border radius: `8px` on inputs/buttons, `12px` on cards/modals — consistent everywhere, never a random mix
- Shadows: one subtle elevation level for cards, a slightly stronger one for modals/dropdowns — no heavy drop shadows; restraint is what reads as premium

### What "premium" means here (so a weaker model doesn't overdo it)

- Generous whitespace over dense cramming — reach for padding before borders
- The accent color is used sparingly (key CTAs, key numbers, active states), not sprinkled across every element
- Subtle hover/transition states (150–200ms ease) on interactive elements — no bouncy or elaborate animation
- Override the default browser blue link/focus color with the `primary` token, but keep a visible focus ring for accessibility
- Consistency beats novelty: every button looks like every other button, every card like every other card

---

## 3. Folder Structure

### Frontend (`/client`)

```
client/
├── src/
│   ├── api/                 # axios instance + endpoint functions (jobs.api.js, candidates.api.js)
│   ├── app/                 # redux store setup
│   │   └── store.js
│   ├── features/            # redux slices, grouped by domain
│   │   ├── auth/
│   │   ├── jobs/
│   │   ├── candidates/
│   │   └── pipeline/
│   ├── components/
│   │   ├── ui/               # generic reusable (Button, Modal, Table, Badge, Skeleton)
│   │   └── shared/            # composed reusable (EmptyState, ErrorState, PageHeader)
│   ├── pages/
│   │   ├── Dashboard/
│   │   ├── Jobs/
│   │   │   ├── JobList.jsx
│   │   │   ├── JobDetail.jsx
│   │   │   └── JobForm.jsx
│   │   ├── Candidates/
│   │   │   ├── CandidateList.jsx
│   │   │   └── CandidateProfile.jsx
│   │   ├── Pipeline/
│   │   └── Auth/
│   ├── layouts/               # AppLayout (sidebar+topbar), AuthLayout
│   ├── hooks/                 # useDebounce, usePagination, useAuth
│   ├── types/                 # optional JSDoc @typedef comments (Job, Candidate, Application) — not required
│   ├── utils/                 # formatDate, statusColors, constants
│   ├── routes/                # route config + ProtectedRoute
│   ├── App.jsx
│   └── main.jsx
├── .env.example
└── package.json
```

### Backend (`/server`)

```
server/
├── src/
│   ├── config/               # db.js, env.js
│   ├── models/                # Job.js, Candidate.js, Application.js, User.js
│   ├── controllers/           # job.controller.js, candidate.controller.js, application.controller.js, auth.controller.js
│   ├── routes/                 # job.routes.js, candidate.routes.js, application.routes.js, auth.routes.js
│   ├── middleware/             # auth.middleware.js, error.middleware.js, validate.middleware.js
│   ├── validators/             # zod schemas per resource (auth, job, candidate, application)
│   ├── services/               # business logic separated from controllers
│   ├── utils/                  # apiResponse.js, asyncHandler.js
│   ├── app.js
│   └── server.js
├── .env.example
└── package.json
```

**Why split controllers/services:** keeps controllers thin (parse request → call service → send response), makes business logic testable and reusable, and is an easy thing to explain cleanly in a technical walkthrough.

---

## 4. Core Data Models (high level)

**User** (HR) — name, email, passwordHash, role, createdAt

**Job** — title, department, location, employmentType, status (`open` / `closed` / `archived`), description, requirements[], openings count, createdBy, createdAt, closedAt

**Candidate** — name, email, phone, resumeUrl, appliedJobId(s), source, createdAt

**Application** (join between Candidate + Job) — candidateId, jobId, currentStage (`applied` → `screening` → `interview` → `offer` → `hired` / `rejected`), stageHistory[] (stage, changedAt, changedBy), notes[] (author, text, createdAt), rating (optional)

Modeling `Application` as its own collection (rather than nesting inside Candidate or Job) is what lets one candidate apply to multiple jobs cleanly, and keeps pipeline-stage updates isolated from candidate/job edits.

---

## 5. Execution Plan — Atomic Tasks for AI-Assisted Coding

### How to use this with a smaller/weaker AI model

Small models drift when given broad, multi-step instructions — they over-generate, guess at things not specified, and break conventions. Three rules fix most of that:

1. **One checklist line = one prompt.** Never hand a whole phase to the model at once — paste a single `- [ ]` line as the task.
2. **Paste this constraint block before every task**, so scope, style, and performance stay fixed no matter which line you're on:
3. **The detail after each `—` is the spec, not decoration.** It tells the model the exact shape, behavior, and edge cases expected — a weak model can't infer "paginate this" or "validate this enum" on its own, so it's stated explicitly.

```
Rules for this task:
- Write clean, simple, readable code. No unnecessary abstractions, no over-engineering for cases that don't exist yet, no garbage/filler code.
- Implement ONLY what this task describes. No extra files, features, comments, or "while I'm at it" additions.
- Reuse existing types/utils/components already defined earlier in the plan — do not redefine them.
- No unused imports, variables, or parameters. Every exported component gets `PropTypes` for its props.
- One function = one responsibility. Split anything over ~30 lines.
- Match the exact file path and naming given in the task.
- No leftover console.log, commented-out code, or TODOs in the final output.
- Query only what's needed: `.select()` on list views, paginate with `limit`/`skip`, use one `.populate()` or aggregation instead of looping queries — never N+1 requests.
- Debounce user-triggered API calls (search/filter inputs) by ~300ms.
- Don't add memoization (`useMemo`/`useCallback`/`React.memo`) unless the task explicitly says the computation or re-render is expensive — unnecessary memoization is also "garbage code."
- Use only the Section 2 Design System tokens for color, type, spacing, and radius — no ad hoc hex values or fonts, even ones that seem close enough.
```

After each task: run `npm run lint` and `npm run format` before starting the next line. Fixing lint on a 15-line file is trivial; fixing it on a whole phase's worth of code is not — that's the actual reason for this granularity.

### Phase 0 — Setup & Guardrails (Day 1)

- [✅] **0.1** Init `client` (Vite + React, JavaScript template) and `server` (`npm init`, Node + Express) as two separate npm projects with their own `package.json`

- [✅] **0.2** `.eslintrc.cjs` (both) — base `eslint:recommended`; client adds `eslint-plugin-react` + `plugin:react-hooks/recommended` and forces `react/prop-types: error`. Force `error` on `no-unused-vars` and `no-console` (server: allow only inside `server.js`; client: disallow everywhere — use toast/UI feedback instead of logging)
- [✅] **0.3** `.prettierrc` — `{ singleQuote: true, semi: true, trailingComma: "es5", tabWidth: 2, printWidth: 80 }` + `eslint-config-prettier` added to the ESLint `extends` array so lint and format rules never contradict each other
- [✅] **0.4** `package.json` scripts (both): `"lint": "eslint src"`, `"lint:fix": "eslint src --fix"`, `"format": "prettier --write src"`
- [✅] **0.5** MongoDB Atlas free-tier cluster; `server/.env` with `PORT`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`; `server/.env.example` with the same keys, empty values, committed to git
- [✅] **0.6** `server/src/server.js` — imports `app.js`, calls `connectDB()`, then `app.listen(env.PORT)`; `app.js` exposes a single `GET /health` returning `{ status: 'ok' }`. Confirm `npm run dev` starts with zero lint errors
- [✅] **0.7** `README.md` skeleton — headings only (Setup, Environment Variables, Running Locally, Tech Stack, Architecture Overview) — fill in content in Phase 9

### Phase 1 — Backend Foundation (Day 1–2)

- [✅] **1.1** `src/config/env.js` — export one frozen `env` object built from `process.env` (`PORT`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `NODE_ENV`). At import time, loop the required keys and `throw new Error('Missing env var: ' + key)` if any is undefined — fail at boot, not mid-request
- [✅] **1.2** `src/config/db.js` — export async `connectDB()`: `mongoose.connect(env.MONGO_URI)`, log success, `process.exit(1)` on failure. Called exactly once, from `server.js`
- [✅] **1.3** `src/models/User.js` — `name` (String, required), `email` (String, required, unique, lowercase, indexed), `passwordHash` (String, required, `select: false`), `role` (String, enum `['hr','admin']`, default `'hr'`), `timestamps: true`
- [✅] **1.4** `src/models/Job.js` — `title`, `department`, `location`, `employmentType` (enum), `status` (enum `['open','closed','archived']`, default `'open'`, indexed — list/dashboard queries filter on this), `description`, `requirements` (`[String]`), `openings` (Number, min 1), `createdBy` (ObjectId ref `User`), `closedAt` (Date, default `null`), `timestamps: true`
- [✅] **1.5** `src/models/Candidate.js` — `name`, `email` (indexed — search hits this), `phone`, `resumeUrl`, `source`, `timestamps: true`. No job-association array here — that relationship lives entirely in `Application`, avoiding duplicated state
- [✅] **1.6** `src/models/Application.js` — `candidateId` (ObjectId ref `Candidate`, indexed), `jobId` (ObjectId ref `Job`, indexed), `currentStage` (enum `['applied','screening','interview','offer','hired','rejected']`, default `'applied'`, indexed), `stageHistory` (`[{ stage, changedAt, changedBy }]`), `notes` (`[{ author, text, createdAt }]`), `rating` (Number, optional), `timestamps: true`. Compound unique index on `{ candidateId, jobId }` to block duplicate applications
- [✅] **1.7** `src/utils/asyncHandler.js` — one higher-order function: `(fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)`. Every controller wraps in this — no try/catch blocks anywhere else
- [✅] **1.8** `src/utils/apiResponse.js` — export `sendSuccess(res, data, message = '', status = 200)` returning `{ success: true, data, message }`. Errors do NOT go through this file — they go through the error middleware only
- [✅] **1.9** `src/middleware/error.middleware.js` — one 4-arg Express handler, registered last in `app.js`. Reads `err.statusCode || 500`, responds `{ success: false, message: err.message }`; logs the full error server-side with a plain `console.error`, never leaks a stack trace to the client
- [✅] **1.10** `src/services/auth.service.js` — pure functions only, no req/res: `hashPassword(plain)` (bcrypt, 10 rounds), `comparePassword(plain, hash)`, `signToken(userId)` (jwt.sign, expiry from `env.JWT_EXPIRES_IN`), `verifyToken(token)`
- [✅] **1.11** `src/controllers/auth.controller.js` — `register`: validate → check email not taken → hash password → create `User` → sign token → `sendSuccess`. `login`: find user by email (`+passwordHash`) → compare → sign token → `sendSuccess`. Both wrapped in `asyncHandler`; both throw a `statusCode: 401` error on bad credentials without revealing which field was wrong
- [✅] **1.12** `src/middleware/auth.middleware.js` — read `Authorization: Bearer <token>`, `verifyToken`, attach `req.user = { id, role }`, else `next(error 401)`. No token-parsing logic duplicated elsewhere
- [✅] **1.13** `src/middleware/validate.middleware.js` — one generic `validate(schema) => (req, res, next)` factory: parses `req.body` against the given Zod schema, calls `next()` on success, or throws a `statusCode: 400` error with the first validation message on failure. Every route reuses this ONE factory — no per-route validation logic
- [✅] **1.14** `src/validators/auth.validator.js` — `registerSchema` (name required, email valid, password min 8 chars), `loginSchema` (email, password) — plain Zod objects, no request/response code in this file
- [✅] **1.15** `src/routes/auth.routes.js` — `POST /register`, `POST /login`, both behind `validate(registerSchema)` / `validate(loginSchema)`
- [✅] **1.16** `src/services/job.service.js` — `createJob`, `getJobs(filters)` (status filter, `limit`/`skip` pagination, `.select()` only the fields the list view needs), `getJobById`, `updateJob`, `closeJob` (sets `status: 'closed'`, `closedAt: Date.now()` — never deletes). `src/controllers/job.controller.js` stays thin — no query logic in the controller
- [✅] **1.17** `src/validators/job.validator.js` — `createJobSchema` (title, department, location, employmentType, openings min 1 all required), `updateJobSchema` (same fields, all optional)
- [✅] **1.18** `src/routes/job.routes.js` — `POST /jobs` (+ `validate(createJobSchema)`), `GET /jobs`, `GET /jobs/:id`, `PUT /jobs/:id` (+ `validate(updateJobSchema)`), `PATCH /jobs/:id/close` — all behind `auth.middleware`
- [✅] **1.19** Wire `src/app.js`: `helmet()`, `cors({ origin: env.CLIENT_URL })`, `express.json({ limit: '10kb' })`, `express-rate-limit` (100 req/15min on `/api`), routes mounted under `/api`, error middleware registered LAST
- [ ] **1.20** Lint clean + manually hit every route (Postman/Thunder Client) with valid AND invalid input before Phase 2

### Phase 2 — Frontend Foundation (Day 2)

- [ ] **2.1** (optional) `src/types/` — JSDoc `@typedef` blocks per domain (e.g. `/** @typedef {{ _id: string, title: string, status: 'open'|'closed'|'archived' }} Job */`) for editor hints only — skip entirely if you don't want it
- [ ] **2.2** `src/api/axiosInstance.js` — `axios.create({ baseURL: import.meta.env.VITE_API_URL })`; request interceptor attaches the `Authorization` header from stored auth state; response interceptor catches `401` globally (dispatch logout + redirect to `/login`) so no page has to handle it individually
- [ ] **2.3** Tailwind config — implement the Section 2 Design System tokens exactly in `theme.extend` (colors, `fontFamily.display` = Plus Jakarta Sans, `fontFamily.sans` = Inter, radius, type scale); add the Google Fonts `<link>` to `index.html`; every later component references these tokens, never a raw hex value, arbitrary size, or ad hoc font
- [ ] **2.4** `src/components/ui/Button.jsx` — props: `variant` (`'primary'|'secondary'|'danger'|'ghost'`), `size`, `isLoading`, `disabled`, `children`, `onClick`, all PropTypes-required; when `isLoading`, disable the button and show a spinner (prevents duplicate submits)
- [ ] **2.5** `Input.jsx`, `Select.jsx` — controlled only (`value` + `onChange` props); `error` prop renders a helper line below the field; no internal state duplicating the parent's
- [ ] **2.6** `Modal.jsx` — `isOpen`, `onClose`, `title`, `children`; closes on `Escape` and backdrop click
- [ ] **2.7** `Table.jsx` — generic: `columns` (`[{ key, label, render? }]`), `data`, `isLoading`, `emptyMessage`. `isLoading` → render `Skeleton` rows matching column count; `data.length === 0` → render `EmptyState`. This ONE component is reused by every list page — don't build a second one later
- [ ] **2.8** `Badge.jsx` — `status` prop maps to color via a lookup object defined once in `utils/statusColors.js` (not inline conditionals repeated per usage)
- [ ] **2.9** `EmptyState.jsx`, `ErrorState.jsx` — `title`, `description`, optional `action`; `ErrorState` also accepts `onRetry`
- [ ] **2.10** `AppLayout.jsx` — sidebar (collapses to a slide-over below `md`) + topbar + `<Outlet />`; sidebar links come from one `NAV_ITEMS` constant, not per-link hardcoded JSX
- [ ] **2.11** `ProtectedRoute.jsx` — reads auth state; no token → `<Navigate to="/login" />`; else render `<Outlet />`
- [ ] **2.12** `src/features/auth/authSlice.js` — state `{ user, token, status }`; `login` as a `createAsyncThunk` with `pending/fulfilled/rejected`; `logout` action. Token persisted to `localStorage` only inside the `fulfilled` case, not scattered across components
- [ ] **2.13** `Login.jsx` — React Hook Form + Zod (`email`, `password`); submit dispatches `login`; inline field errors AND a toast on rejection; on success redirect to the route the user originally tried to reach
- [ ] **2.14** Lint clean before Phase 3 — every component built here is reused everywhere else; a mistake here multiplies

### Phase 3 — Job Management (Day 3)

- [ ] **3.1** `src/features/jobs/jobsSlice.js` — state `{ items, status, error, filters: { search, status } }`; thunks `fetchJobs(filters)`, `createJob`, `updateJob`, `closeJob`; update `items` immutably via Redux Toolkit's built-in Immer, no manual deep spreading
- [ ] **3.2** `src/api/jobs.api.js` — `getJobs(params)`, `getJob(id)`, `createJob(payload)`, `updateJob(id, payload)`, `closeJob(id)`; each unwraps `res.data.data` here once so components never touch the raw response envelope
- [ ] **3.3** `src/pages/Jobs/JobList.jsx` — `Table` with columns (title, department, status `Badge`, openings, actions); search input debounced 300ms before dispatching `fetchJobs`; status filter via `Select`; empty state action: "Create your first job"
- [ ] **3.4** `src/pages/Jobs/JobForm.jsx` — Zod schema in `job.schema.js` (title required, openings min 1, etc.); one component for both create and edit (a `mode` prop or presence of `defaultValues` decides which); submit button disabled while `isSubmitting`
- [ ] **3.5** `src/pages/Jobs/JobDetail.jsx` — read-only field list + close/archive button behind a `Modal` confirmation
- [ ] **3.6** Loading/error/empty states on `JobList` reuse Phase 2's `Skeleton`/`EmptyState`/`ErrorState` verbatim — no page-specific versions
- [ ] **3.7** Lint + manual click-through (create → edit → close) before Phase 4

### Phase 4 — Candidate Management (Day 3–4)

- [✅] **4.1** `src/services/candidate.service.js` — `createCandidate`, `getCandidates(filters)` (search on the indexed `name`/`email` fields; `jobId`/`stage` filters actually query the `Application` collection joined to `Candidate`, not a denormalized field on `Candidate`), `getCandidateById`. `src/controllers/candidate.controller.js` stays a thin wrapper
- [✅] **4.2** `src/services/application.service.js` — `createApplication(candidateId, jobId)` (catches the compound-unique-index violation and returns a clean 409-style message instead of a raw Mongo error), `addNote(applicationId, author, text)`
- [✅] **4.3** `src/validators/candidate.validator.js` — `createCandidateSchema` (name, email valid, phone optional), `src/validators/application.validator.js` — `createApplicationSchema` (candidateId, jobId), `stageUpdateSchema` (stage must be one of the enum values), `addNoteSchema` (text required, non-empty)
- [✅] **4.4** `src/routes/candidate.routes.js`, `src/routes/application.routes.js` — `GET /candidates`, `GET /candidates/:id`, `POST /candidates` (+ `validate(createCandidateSchema)`), `POST /applications` (+ `validate(createApplicationSchema)`), `POST /applications/:id/notes` (+ `validate(addNoteSchema)`)
- [ ] **4.5** `src/api/candidates.api.js` — mirrors the exact pattern of `jobs.api.js` (same response-unwrap convention)
- [ ] **4.6** `src/features/candidates/candidatesSlice.js` — same shape as `jobsSlice` (state/filters/thunks) — consistency here means less for a weaker model to improvise
- [ ] **4.7** `CandidateList.jsx` — reuse `Table`, `EmptyState`, and the exact debounced-search pattern from `JobList` — copy the working pattern rather than redesigning it
- [ ] **4.8** Candidate creation form — job-select dropdown that creates the `Candidate` AND the linking `Application` in one flow (two sequential calls, or one combined backend endpoint — pick one and stay consistent)
- [ ] **4.9** Notes UI on candidate detail — textarea + submit, optimistically appends to the notes list, no rich text editor
- [ ] **4.10** Lint + test before Phase 5

### Phase 5 — Hiring Pipeline (Day 4–5)

- [✅] **5.1** `PATCH /applications/:id/stage` — body `{ stage }` behind `validate(stageUpdateSchema)`; service then checks the move against a fixed `STAGE_ORDER` array server-side (don't rely on the UI alone to prevent illegal jumps); pushes `{ stage, changedAt: Date.now(), changedBy: req.user.id }` to `stageHistory`
- [ ] **5.2** `PipelineBoard.jsx` — ONE API call fetches all relevant applications, then groups them into columns client-side with a single `groupBy(applications, 'currentStage')` — never a separate fetch per column
- [ ] **5.3** Stage-change action — a "Move to next stage" button is simpler and more reliable than drag-and-drop for a first pass; if you add drag-and-drop, the drop handler should call the exact same PATCH the button uses, not a duplicated code path
- [ ] **5.4** Lint + test before Phase 6

### Phase 6 — Dashboard (Day 5)

- [✅] **6.1** `GET /dashboard/summary` — one combined response from a single request: `Job.countDocuments` (by status), `Application.aggregate` grouped by `currentStage`, and a `.sort({createdAt:-1}).limit(10)` recent-activity query — the frontend makes exactly one call for the whole dashboard
- [ ] **6.2** `Dashboard.jsx` — stat cards + Recharts funnel/bar fed directly by `summary.pipelineCounts` + a recent-activity list; no client-side recomputation of numbers the backend already aggregated
- [ ] **6.3** Lint + test before Phase 7

### Phase 7 — Candidate Profile (Day 5–6)

- [✅] **7.1** `GET /candidates/:id` — backend joins `Candidate` + all its `Application`s (job title populated) + notes in one query via `.populate()`, so the frontend never makes a follow-up call per application
- [ ] **7.2** `CandidateProfile.jsx` — reuses `PageHeader`, `Badge`, and a simple notes timeline (map + sort by `createdAt` descending) — no new list/card component invented here
- [ ] **7.3** Lint + test before Phase 8

### Phase 8 — Polish Pass (Day 6)

- [ ] **8.1** Resize every page at 375px / 768px / 1280px, smallest first — decide the mobile table→card behavior ONCE inside `Table.jsx` (e.g. a `hidden sm:table` / `sm:hidden` pair), not per page
- [ ] **8.2** Every list page (`JobList`, `CandidateList`, `PipelineBoard`) has loading + empty + error states wired — audit against `JobList` as the reference implementation
- [ ] **8.3** Every form shows field-level inline errors from its Zod schema, not just a generic toast — toast reports the overall submit result, inline errors say which field is wrong
- [ ] **8.4** Tab order makes sense inside every `Modal`; all icon-only buttons have `aria-label`
- [ ] **8.5** `npm run lint` + `npm run format` clean on both `client` and `server`, zero warnings, before deployment

### Phase 9 — Deployment + Docs (Day 7)

- [ ] **9.1** Deploy `server` to Render/Railway, `client` to Vercel; env vars set on both platforms, never in the repo
- [ ] **9.2** Final README: exact setup commands (`npm install`, `npm run dev`), the full list of required env vars with descriptions (no real values), a one-paragraph architecture overview plus the Section 3 folder structure, and known limitations stated honestly
- [ ] **9.3** Confirm no secrets committed (scan `git log -p` for anything resembling a connection string or secret) and `.env.example` present in both `client` and `server`

---

## 6. Scope Discipline (per assessment guidance)

Since a **smaller, polished app beats a feature-heavy sloppy one**, if time is tight, cut in this order (last cut first):

1. Nice-to-haves: charts on dashboard beyond basic counts, drag-drop (fallback to button-based stage change)
2. Notes attachments/resume upload (fallback: just a resume URL field)
3. Advanced filters (fallback: basic status + search only)

Never cut: auth, core CRUD on jobs/candidates, pipeline stage updates, responsive layout, form validation, error/empty/loading states — these are explicitly named in the evaluation criteria.
