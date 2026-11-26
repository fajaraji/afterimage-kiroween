# Proposed API contract (to be implemented in Kiro specs)

Scaffold currently implements `GET /api/health` only. Everything else is **planned** and must not be represented as already functional.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/health` | Current starter health endpoint |
| `GET` | `/api/scenarios` | List allowlisted synthetic scenarios |
| `POST` | `/api/runs` | Create isolated run from `{scenarioId, mode, seed}` |
| `GET` | `/api/runs/:runId` | Fetch run status + verdict + scoped summary |
| `GET` | `/api/runs/:runId/events` | Ordered event trace |
| `GET` | `/api/runs/:runId/observations` | Independent per-store results |
| `GET` | `/api/runs/:runId/report` | JSON evidence bundle |

## Status and error semantics
`202` for accepted async run; `200` for successful read; `400` validation, `404` unknown ID, `409` scenario conflict, `429` rate limit, `500` unexpected internal failure. Failures never return a success-shaped verdict.

## Contract sample

```json
{
  "runId": "run-example-1",
  "scenarioId": "zombie-sync-v1",
  "mode": "protected",
  "status": "completed",
  "verdict": "PASS",
  "scope": ["primary", "analytics", "exports"],
  "observations": [
    {"storeId": "primary", "state": "ABSENT", "evidenceId": "obs-001"},
    {"storeId": "analytics", "state": "ABSENT", "evidenceId": "obs-002"},
    {"storeId": "exports", "state": "ABSENT", "evidenceId": "obs-003"}
  ]
}
```

The above response is a **contract illustration**, not a measured execution. See `packages/contracts` and `docs/DOMAIN-MODEL.md` for typed representations.

## v4 proposed optional action-evidence API (NOT IMPLEMENTED)

- **P1**: `GET /api/runs/:runId/action-trace` — server-owned, redacted action intent, policy decision, execution receipt, independent post-action observation. Requires same run authorization/tenant isolation as existing evidence endpoints.
- **P2 only**: `POST /api/runs/:runId/synthetic-agent-proposals` — narrowly bounded proposal type; for `DROP_SYNTHETIC_TABLE_PROPOSAL`, returns an explicit server-side `DENY`, `NOT_EXECUTED`, and separate verifier evidence. Never accepts arbitrary SQL, shell strings, resource ARNs, account IDs, or a user-supplied policy verdict.

No such endpoints exist in the starter. Do not put examples in the runtime UI as though actual calls occurred. See spec 09.
