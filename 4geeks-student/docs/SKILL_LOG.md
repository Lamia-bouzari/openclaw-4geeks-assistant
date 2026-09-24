# 4Geeks Student Skill — Development Log

## 2026-09-21 — Skill 1: Authenticate

### Summary

Implemented the authentication skill that verifies the `FOUR_GEEKS_TOKEN`
environment variable against the BreatheCode Admissions API.

### Files

- `authenticate.js` — Core skill implementation (`AuthenticateSkill` class)
- `index.js` — Entry point, exports `AuthenticateSkill`
- `SKILL.md` — Skill documentation (usage, return values, security)
- `CONFIGURATION.md` — Environment variable setup guide
- `docs/SKILL_LOG.md` — This file

### Implementation Details

- **Method:** `GET`
- **Endpoint:** `https://breathecode.herokuapp.com/v1/admissions/user/me`
- **Header:** `Authorization: Token ${FOUR_GEEKS_TOKEN}`
- Token is read only from `process.env.FOUR_GEEKS_TOKEN`; never hardcoded or logged.
- Constructor throws immediately if token is missing.
- 10-second timeout via `AbortSignal`.
- Returns structured object: `{ success, status, data }` on success; `{ success, status, statusText, response }` on HTTP error; `{ success, error, status: 'ERROR' }` on network error.

### Fixes

- Fixed syntax error in `authenticate.js`: stray `n` character after the JSDoc comment block (`*/n` → `*/`).

### Tests

| Test | Case | Expected | Result |
|---|---|---|---|
| 1 | Valid token (real `FOUR_GEEKS_TOKEN`) | HTTP 200, `success: true` | ✅ PASS |
| 2 | Missing token (unset env var) | Constructor throws | ✅ PASS |
| 3 | Invalid token (garbage string) | HTTP 401, `success: false` | ✅ PASS |

### Final Test Result

- **Method:** GET
- **Endpoint:** `https://breathecode.herokuapp.com/v1/admissions/user/me`
- **Authentication:** `Authorization: Token ${FOUR_GEEKS_TOKEN}`
- **Result:** HTTP 200 — Authentication succeeded.
- Token value was never printed, logged, or revealed.

### Verified Endpoints (from 4Geeks Academy Documentation)

- `GET /v1/admissions/user/me` — Student profile, cohort memberships, roles, permissions
- `GET /v1/admissions/academy/cohort/me` — Cohort enrollments
- `GET /v1/assignment/user/me/task` — Assigned tasks
- `GET /v1/certificate/` — Certificates
- `GET /v1/activity/me` — Learning activity
- `GET /v1/registry/asset` — Asset catalog

---

## 2026-09-22 — Skill 2: Get My Projects

### Summary

Implemented the projects skill that retrieves the student's assigned PROJECT
tasks from the BreatheCode API using `/v1/assignment/user/me/task` with
`task_type=PROJECT` query parameter.

### Files

- `projects.js` — Core skill implementation (`GetProjectsSkill` class)
- `index.js` — Updated to export `GetProjectsSkill` alongside `AuthenticateSkill`
- `test_projects.js` — Test suite for the projects skill
- `docs/SKILL_LOG.md` — This file

### Initiating Prompt

> Use GET https://breathecode.herokuapp.com/v1/assignment/user/me/task with query task_type=PROJECT to retrieve my assigned projects. Authenticate with Authorization: Token ${FOUR_GEEKS_TOKEN}. Preserve the real project status values returned by the API. Support pagination using limit and offset.

### Implementation Details

- **Method:** `GET`
- **Endpoint:** `https://breathecode.herokuapp.com/v1/assignment/user/me/task`
- **Query Parameters:** `task_type=PROJECT`, `limit` (default: 50), `offset` (default: 0)
- **Header:** `Authorization: Token ${FOUR_GEEKS_TOKEN}`
- Token is read only from `process.env.FOUR_GEEKS_TOKEN`; never hardcoded or logged.
- Constructor throws immediately if token is missing.
- 10-second timeout via `AbortSignal`.
- Returns structured object: `{ success, status, data }` on success; `{ success, status, statusText, response }` on HTTP error; `{ success, error, status: 'ERROR' }` on network error.
- Preserves all real project status values returned by the API (e.g., `task_status` field).
- Supports pagination via `limit` and `offset` query parameters.

### Tests

| Test | Case | Expected | Result |
|---|---|---|---|
| 1 | Valid token (real `FOUR_GEEKS_TOKEN`) | HTTP 200, `success: true` | ✅ PASS |
| 2 | Missing token (unset env var) | Constructor throws | ✅ PASS |
| 3 | Invalid token (garbage string) | HTTP 401, `success: false` | ✅ PASS |

### Final Test Result

- **Method:** GET
- **Endpoint:** `https://breathecode.herokuapp.com/v1/assignment/user/me/task`
- **Query:** `task_type=PROJECT`
- **Authentication:** `Authorization: Token ${FOUR_GEEKS_TOKEN}`
- **Result:** HTTP 200 — Successfully retrieved assigned projects.
- Token value was never printed, logged, or revealed.

### Related Skills

- `4geeks-student` (this skill collection) — Authenticate + Get Projects

---

## 2026-09-24 — Skill 4: Get My Progress Summary

### Summary

Implemented the progress summary skill that aggregates ALL assigned tasks
(no task_status filter) from the BreatheCode API using `/v1/assignment/user/me/task`.
Since no official progress endpoint exists, this skill calculates a derived progress
percentage locally.

### Initiating Prompt

> Fetch all assigned tasks from GET https://breathecode.herokuapp.com/v1/assignment/user/me/task. Do not use a task_status filter. Automatically paginate through all pages. Calculate total, PENDING, DONE, APPROVED, REJECTED, and breakdown by PROJECT / EXERCISE / LESSON / QUIZ. Calculate progress_percent = (DONE + APPROVED) / total * 100, but clearly label it as a derived metric created by this skill, not an official 4Geeks progress percentage. Use FOUR_GEEKS_TOKEN securely and never print, log, hardcode, or expose it. Test valid token, missing token, and invalid token cases. Update docs/SKILL_LOG.md.

### Files

- `progress.js` — Core skill implementation (`GetProgressSkill` class)
- `index.js` — Updated to export `GetProgressSkill`
- `test_progress.js` — Test suite for the progress skill
- `docs/SKILL_LOG.md` — This file

### Implementation Details

- **Method:** `GET`
- **Endpoint:** `https://breathecode.herokuapp.com/v1/assignment/user/me/task`
- **No `task_status` filter** — fetches every assigned task regardless of status
- **Auto-pagination** — follows `next` links across all pages with `limit=50`
- **Header:** `Authorization: Token ${FOUR_GEEKS_TOKEN}`
- Token is read only from `process.env.FOUR_GEEKS_TOKEN`; never hardcoded or logged.
- Constructor throws immediately if token is missing.
- 10-second timeout via `AbortSignal`.
- Returns structured object: `{ success, status, data }` on success; `{ success, status, statusText, response }` on HTTP error; `{ success, error, status: 'ERROR' }` on network error.
- **Derived metric:** `progress_percent` = `(DONE + APPROVED) / total * 100`. This is NOT an official 4Geeks progress percentage.

### Tests

| Test | Case | Expected | Result |
|---|---|---|---|
| 1 | Valid token (real `FOUR_GEEKS_TOKEN`) | HTTP 200, `success: true` | ✅ PASS |
| 2 | Missing token (unset env var) | Constructor throws | ✅ PASS |
| 3 | Invalid token (garbage string) | HTTP 401, `success: false` | ✅ PASS |

### Final Test Result

- **Method:** GET
- **Endpoint:** `https://breathecode.herokuapp.com/v1/assignment/user/me/task`
- **Authentication:** `Authorization: Token ${FOUR_GEEKS_TOKEN}`
- **Result:** HTTP 200 — Successfully retrieved all assigned tasks.
- **Total tasks:** 229
- **Pages fetched:** 5

**Status breakdown:**
- PENDING: 104
- DONE: 125
- APPROVED: 0
- REJECTED: 0

**Task type breakdown:**
- PROJECT: 52
- EXERCISE: 154
- LESSON: 23
- QUIZ: 0

**Derived progress percentage:** 54.59%
- Note: This is a DERIVED METRIC calculated by this skill as (DONE + APPROVED) / total * 100. This is NOT an official 4Geeks progress percentage.

Token value was never printed, logged, or revealed.

### Related Skills

- `4geeks-student` (this skill collection) — Authenticate, Get Projects, Get Pending Work, Get Progress Summary

---

*Test token never printed or logged. All error messages contain no token value.*

---

## 2026-09-24 — Skill 5: Get My Assets

### Summary

Implemented the assets skill that retrieves assets I created or modified from the BreatheCode API using `GET /v1/registry/asset/me`.

### Initiating Prompt

> Create a skill to retrieve assets I created or modified using GET https://breathecode.herokuapp.com/v1/registry/asset/me. Use FOUR_GEEKS_TOKEN securely. Never print, log, hardcode, or expose the token. Test with my real account and confirm HTTP 200. Update docs/SKILL_LOG.md.

### Files

- `assets.js` — Core skill implementation (`GetAssetsSkill` class)
- `index.js` — Updated to export `GetAssetsSkill`
- `test_assets.js` — Test suite for the assets skill
- `docs/SKILL_LOG.md` — This file

### Implementation Details

- **Method:** `GET`
- **Endpoint:** `https://breathecode.herokuapp.com/v1/registry/asset/me`
- **Header:** `Authorization: Token ${FOUR_GEEKS_TOKEN}`
- Token is read only from `process.env.FOUR_GEEKS_TOKEN`; never hardcoded or logged.
- Constructor throws immediately if token is missing.
- 10-second timeout via `AbortSignal`.
- Returns structured object: `{ success, status, data }` on success; `{ success, status, statusText, response }` on HTTP error; `{ success, error, status: 'ERROR' }` on network error.

### Tests

| Test | Case | Expected | Result |
|---|---|---|---|
| 1 | Valid token (real `FOUR_GEEKS_TOKEN`) | HTTP 200, `success: true` | ✅ PASS |
| 2 | Missing token (unset env var) | Constructor throws | ✅ PASS |
| 3 | Invalid token (garbage string) | HTTP 401, `success: false` | ✅ PASS |

### Final Test Result

- **Method:** GET
- **Endpoint:** `https://breathecode.herokuapp.com/v1/registry/asset/me`
- **Authentication:** `Authorization: Token ${FOUR_GEEKS_TOKEN}`
- **Result:** HTTP 200 — Successfully retrieved assets.
- **Total assets returned:** 0
- Token value was never printed, logged, or revealed.

### Related Skills

- `4geeks-student` (this skill collection) — Authenticate, Get Projects, Get Pending Work, Get Progress Summary, Get My Assets

---

## 2026-09-24 — Skill 6: Get My Events

### Summary

Implemented the events skill that retrieves upcoming and/or available events from the BreatheCode API using `GET /v1/events/all`.

### Initiating Prompt

> Create a skill to retrieve upcoming and/or available events using GET https://breathecode.herokuapp.com/v1/events/all. Use FOUR_GEEKS_TOKEN securely. Never print, log, hardcode, or expose the token. Test with my real account and confirm HTTP 200. Update docs/SKILL_LOG.md.

### Files

- `events.js` — Core skill implementation (`GetEventsSkill` class)
- `index.js` — Updated to export `GetEventsSkill`
- `test_events.js` — Test suite for the events skill
- `docs/SKILL_LOG.md` — This file

### Implementation Details

- **Method:** `GET`
- **Endpoint:** `https://breathecode.herokuapp.com/v1/events/all`
- **Header:** `Authorization: Token ${FOUR_GEEKS_TOKEN}`
- Token is read only from `process.env.FOUR_GEEKS_TOKEN`; never hardcoded or logged.
- Constructor throws immediately if token is missing.
- 10-second timeout via `AbortSignal`.
- Returns structured object: `{ success, status, data }` on success; `{ success, status, statusText, response }` on HTTP error; `{ success, error, status: 'ERROR' }` on network error.

### Tests

| Test | Case | Expected | Result |
|---|---|---|---|
| 1 | Valid token (real `FOUR_GEEKS_TOKEN`) | HTTP 200, `success: true` | ✅ PASS |
| 2 | Missing token (unset env var) | Constructor throws | ✅ PASS |
| 3 | Invalid token (garbage string) | HTTP 401, `success: false` | ✅ PASS |

### Final Test Result

- **Method:** GET
- **Endpoint:** `https://breathecode.herokuapp.com/v1/events/all`
- **Authentication:** `Authorization: Token ${FOUR_GEEKS_TOKEN}`
- **Result:** HTTP 200 — Successfully retrieved events.
- **Total events returned:** 3
- Token value was never printed, logged, or revealed.

### Related Skills

- `4geeks-student` (this skill collection) — Authenticate, Get Projects, Get Pending Work, Get Progress Summary, Get My Assets, Get My Events

---

*Test token never printed or logged. All error messages contain no token value.*

---

## 2026-09-22 — Skill 3: Get Pending Work

### Summary

Implemented the pending work skill that retrieves ALL assigned tasks
with task_status=PENDING (PROJECT, EXERCISE, LESSON, etc.) from
the BreatheCode API using `/v1/assignment/user/me/task`.

### Initiating Prompt

> Use GET https://breathecode.herokuapp.com/v1/assignment/user/me/task. Filter with task_status=PENDING. Do not filter by task_type; include all pending PROJECT, EXERCISE, and LESSON tasks returned by the API. Authenticate with Authorization: Token ${FOUR_GEEKS_TOKEN}. Never print, log, hardcode, or expose the token. Support limit and offset. Create pending-work.js and integrate it with the existing 4geeks-student skill. Test with my real account and confirm HTTP 200. Test missing-token and invalid-token cases. Update docs/SKILL_LOG.md with the initiating prompt, endpoint, method, purpose, and test result.

### Files

- `pending-work.js` — Core skill implementation (`PendingWorkSkill` class)
- `index.js` — Updated to export `PendingWorkSkill` alongside `AuthenticateSkill` and `GetProjectsSkill`
- `test_pending_work.js` — Test suite for the pending work skill
- `docs/SKILL_LOG.md` — This file

### Implementation Details

- **Method:** `GET`
- **Endpoint:** `https://breathecode.herokuapp.com/v1/assignment/user/me/task`
- **Query Parameters:** `task_status=PENDING`, `limit` (default: 50), `offset` (default: 0)
- **Header:** `Authorization: Token ${FOUR_GEEKS_TOKEN}`
- Token is read only from `process.env.FOUR_GEEKS_TOKEN`; never hardcoded or logged.
- Constructor throws immediately if token is missing.
- 10-second timeout via `AbortSignal`.
- Does NOT filter by task_type — includes all pending task types (PROJECT, EXERCISE, LESSON, etc.).
- Returns structured object: `{ success, status, data }` on success; `{ success, status, statusText, response }` on HTTP error; `{ success, error, status: 'ERROR' }` on network error.
- Preserves all real task status values returned by the API.
- Supports pagination via `limit` and `offset` query parameters.

### Tests

| Test | Case | Expected | Result |
|---|---|---|---|
| 1 | Valid token (real `FOUR_GEEKS_TOKEN`) | HTTP 200, `success: true` | ✅ PASS |
| 2 | Missing token (unset env var) | Constructor throws | ✅ PASS |
| 3 | Invalid token (garbage string) | HTTP 401, `success: false` | ✅ PASS |

### Final Test Result

- **Method:** GET
- **Endpoint:** `https://breathecode.herokuapp.com/v1/assignment/user/me/task`
- **Query:** `task_status=PENDING`, `limit=50`, `offset=0`
- **Authentication:** `Authorization: Token ${FOUR_GEEKS_TOKEN}`
- **Result:** HTTP 200 — Successfully retrieved pending tasks.
- **Total pending tasks returned:** 50
- **Task type breakdown:** EXERCISE: 46, PROJECT: 4
- Token value was never printed, logged, or revealed.

### Related Skills

- `4geeks-student` (this skill collection) — Authenticate, Get Projects, Get Pending Work

---

## 2026-09-23 — Skill 3: Pagination Update

### Summary

Updated `PendingWorkSkill` to support automatic pagination fetching via `getAllPendingWork()`, which follows `next` links across all pages with `limit=50`. Normal `getPendingWork(limit, offset)` pagination still works when a specific page is requested.

### Files

- `pending-work.js` — Added `getAllPendingWork()` method and `_buildUrl()` helper
- `test_pending_work.js` — Added Test 2 for auto-pagination
- `docs/SKILL_LOG.md` — This file

### Changes

- Added `_buildUrl(limit, offset)` helper to centralise URL construction
- Added `getAllPendingWork()` that automatically follows `next` pagination links with `limit=50` per page
- Kept `getPendingWork(limit, offset)` for normal single-page pagination
- Updated test suite to verify both modes

### Test Results

| Test | Case | Expected | Result |
|---|---|---|---|
| 1 | Valid token (single page, limit=50, offset=0) | HTTP 200, 50 tasks | ✅ PASS |
| 2 | Valid token (all pages, auto-pagination) | HTTP 200, all tasks, pages_fetched=3 | ✅ PASS |
| 3 | Missing token (unset env var) | Constructor throws | ✅ PASS |
| 4 | Invalid token (garbage string) | HTTP 401, success=false | ✅ PASS |

### Final Test Result

- **Method:** GET
- **Endpoint:** `https://breathecode.herokuapp.com/v1/assignment/user/me/task`
- **Authentication:** `Authorization: Token ${FOUR_GEEKS_TOKEN}`

**Single page (getPendingWork):**
- HTTP Status: 200
- Tasks returned (page 1): 50
- Task type breakdown: EXERCISE: 47, PROJECT: 3

**All pages (getAllPendingWork):**
- HTTP Status: 200
- Total pending tasks: 106
- Pages fetched: 3
- Task type breakdown:
  | Task Type | Count |
  |---|---|
  | EXERCISE | 94 |
  | PROJECT | 10 |
  | LESSON | 2 |
  | QUIZ | 0 |

- Token value was never printed, logged, or revealed.

### Related Skills

- `4geeks-student` (this skill collection) — Authenticate, Get Projects, Get Pending Work

---

*Test token never printed or logged. All error messages contain no token value.*