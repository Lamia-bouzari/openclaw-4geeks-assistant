# 4Geeks Student — Configuration

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `FOUR_GEEKS_TOKEN` | Yes | BreatheCode session token used for authentication. |

## How the Token Is Used

- Read once at skill construction from `process.env.FOUR_GEEKS_TOKEN`.
- Passed as `Authorization: Token <value>` header to `GET /v1/admissions/user/me`.
- Never printed, logged, or written to disk.

## Setting the Token

```bash
export FOUR_GEEKS_TOKEN="your-breathecode-token"
```

Or in the OpenClaw gateway config (`.env`):

```
FOUR_GEEKS_TOKEN=your-breathecode-token
```

## Verification

Run the authentication test:

```bash
node skills/4geeks-student/authenticate.js
```

Expected output on success:

```
{
  success: true,
  status: 200,
  data: { ... }
}
```
