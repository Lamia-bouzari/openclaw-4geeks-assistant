---
name: 4geeks-authenticate
description: Authenticates against the 4Geeks/BreatheCode Admissions API using a token from the FOUR_GEEKS_TOKEN environment variable.
whenToUse:
  - Authenticating 4Geeks Academy student API access
  - Verifying a BreatheCode session token
  - Checking token validity before running other 4Geeks skills
askBefore: false
safeDefaults:
  - Token is read only from FOUR_GEEKS_TOKEN environment variable; never hardcoded
  - Token is never printed, logged, or included in error output
keywords:
  - 4geeks
  - breathecode
  - authentication
  - token
  - student
---

# 4Geeks Authenticate

## Overview

Verifies the `FOUR_GEEKS_TOKEN` environment variable against the BreatheCode Admissions API by calling the student profile endpoint. This skill performs **authentication only** — it does not fetch assignments, grades, or any other student data.

### Endpoint

| Property | Value |
|---|---|
| Method | `GET` |
| URL | `https://breathecode.herokuapp.com/v1/admissions/user/me` |
| Header | `Authorization: Token ${FOUR_GEEKS_TOKEN}` |

## Prerequisites

1. The `FOUR_GEEKS_TOKEN` environment variable must be set in the current runtime.
2. The token must be a valid BreatheCode session token with `admissions` scope.

To set the token (one-shot per session):

```bash
export FOUR_GEEKS_TOKEN="your-token-here"
```

## Usage

### Programmatic (Node.js)

```javascript
const AuthenticateSkill = require('./skills/4geeks-student/authenticate.js');

const auth = new AuthenticateSkill();
const result = await auth.authenticate();

if (result.success) {
  console.log('Authenticated as:', result.data);
} else {
  console.error('Auth failed:', result.status, result.statusText);
}
```

### From OpenClaw

```
Use the 4Geeks Authenticate skill to verify your token.
```

## Return Value

`authenticate()` returns an object:

**On success (HTTP 200):**
```json
{
  "success": true,
  "status": 200,
  "data": { ... }
}
```

**On failure (HTTP 401 / 403 / etc.):**
```json
{
  "success": false,
  "status": 401,
  "statusText": "Unauthorized",
  "response": "..."
}
```

**On network error:**
```json
{
  "success": false,
  "error": "connect ECONNREFUSED ...",
  "status": "ERROR"
}
```

## Security

- The token is read **only** from `process.env.FOUR_GEEKS_TOKEN`.
- The token is **never** printed, logged, or included in error messages.
- If the environment variable is missing, the constructor throws immediately.
- No token value is written to any file or log.

## Related Skills

- (Future) `4geeks-student-grades` — Fetch student grades
- (Future) `4geeks-student-assignments` — Fetch student assignments
