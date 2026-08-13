# HRMS Recruitment Backend - AI Context Dump

This document contains 100% of the context, decisions, and architectural patterns established during the complete build of the backend for the HRMS Recruitment platform. 

If this is being read by a new AI session or model, use this as your ultimate source of truth for how the backend is structured, so you can perfectly integrate the frontend without breaking existing conventions.

## 1. Project Status & Strategy
- **Strategy**: We opted for an "All-Backend-First" strategy. We skipped all frontend tasks in the original `plan.md` to ensure the entire backend and database layer were 100% bulletproof first.
- **Status**: The Backend is **100% COMPLETE**. Every single backend-related task from Phase 0 to Phase 7 in `plan.md` has been successfully implemented, tested, and cleanly integrated.
- **Next Step**: The project is now ready to begin **Phase 2 (Frontend Foundation)**. 

## 2. Tech Stack & Environment
- **Runtime**: Node.js (ES Modules enabled via `"type": "module"` in package.json)
- **Framework**: Express.js
- **Database**: MongoDB hosted on Atlas, accessed via Mongoose.
- **Validation**: Zod (for strictly typed schema validation).
- **Security/Middlewares**: `helmet`, `cors`, `express-rate-limit` (extracted to a custom middleware), `jsonwebtoken`, `bcrypt`.
- **Environment Variables**: Defined in `.env`, strictly validated at boot time via `src/config/env.js`. If a variable is missing, the app refuses to boot.

## 3. Core Architectural Patterns
We strictly followed a **3-Tier / Layered Architecture** to keep the codebase modular, testable, and clean.

### A. Routing & Controllers (The "Thin" Layer)
- **Routes (`src/routes/`)**: Simply declare the HTTP methods and chain middlewares (Auth -> Validator -> Controller).
- **Controllers (`src/controllers/`)**: Extremely thin wrappers. They ONLY extract `req.body`, `req.params`, or `req.user`, pass them to a Service, and then send a response using our standardized `sendSuccess` helper.
- **Standardized Response**: All successful responses are formatted via `src/utils/apiResponse.js` as `{ success: true, data: ..., message: '...' }`.

### B. Business Logic (The Service Layer)
- **Services (`src/services/`)**: This is the brain of the backend. ALL database interactions and complex business rules (like checking valid pipeline stage movements) happen here. Services return raw data or throw custom Error objects. They never touch Express `req` or `res` objects.

### C. Validation & Error Handling
- **Zod Validators (`src/validators/`)**: Every resource has a strictly defined Zod schema (e.g., `createJobSchema`).
- **Validate Middleware (`src/middleware/validate.middleware.js`)**: A generic factory function that intercepts requests, tests them against the Zod schema, and immediately throws a 400 Error if validation fails.
- **Global Error Handler**: We NEVER use `try/catch` inside controllers. Instead, every controller is wrapped in `src/utils/asyncHandler.js`, which catches any thrown error (from validation, services, or DB) and funnels it to the global error middleware in `app.js`.

## 4. Data Models & Database Strategy
1. **User (`src/models/User.js`)**: HR/Admins. Uses `bcrypt` for password hashing and issues JWTs for authentication.
2. **Job (`src/models/Job.js`)**: Represents job postings. Has statuses: `open`, `closed`, `archived`.
3. **Candidate (`src/models/Candidate.js`)**: Stores candidate personal info. We added a **Mongoose Virtual** called `applications` to cleanly reverse-populate applications without duplicating data.
4. **Application (`src/models/Application.js`)**: The critical join collection between `Candidate` and `Job`. 
   - Uses a **Compound Unique Index** (`candidateId` + `jobId`) to prevent duplicate applications. The service layer gracefully catches MongoDB's `11000` duplicate key error and converts it to a 409 Conflict.
   - Tracks hiring stages via `currentStage` and an appended `stageHistory` array.
   - Contains an embedded `notes` array for recruiters to leave comments.

## 5. API Endpoints Overview
- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`
- **Jobs**: `GET /api/jobs`, `GET /api/jobs/:id`, `POST /api/jobs`, `PUT /api/jobs/:id`, `PATCH /api/jobs/:id/close`
- **Candidates**: `GET /api/candidates`, `GET /api/candidates/:id` (Deep populates all applications, jobs, and notes using the virtual), `POST /api/candidates`
- **Applications**: `POST /api/applications`, `POST /api/applications/:id/notes`, `PATCH /api/applications/:id/stage` (Strictly enforces forward-only stage movements based on a predefined `STAGE_ORDER` array, or allows movement to 'rejected').
- **Dashboard**: `GET /api/dashboard/summary` (A single, highly optimized endpoint that aggregates total jobs, pipeline counts using a MongoDB aggregation pipeline, and fetches recent activity in one shot).

## 6. Key Files & Additions Made Outside Original Plan
- **`src/public/index.html`**: We created a highly stylized, lightweight HTML page served at `GET /` to verify the backend is running. It uses the exact design tokens specified in the frontend plan.
- **`src/middleware/rateLimiter.middleware.js`**: We extracted the `express-rate-limit` logic out of `app.js` to perfectly maintain separation of concerns.

## 7. Developer Notes for Frontend Implementation
- When building the frontend API calls, remember to unwrap `response.data.data` because of our global `apiResponse` wrapper!
- All authentication uses standard Bearer JWT tokens.
- All errors returned by the API will be strictly formatted as `{ success: false, message: "Error reason" }`.
- Always check `plan.md` before writing a new component to ensure you reuse existing UI patterns instead of inventing new ones.
