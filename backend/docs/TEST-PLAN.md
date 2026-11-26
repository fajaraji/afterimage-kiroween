# Test strategy and quality gates

## Layers
- **Unit (Vitest):** finding mapping, command parsing, revision and `commandId` handling, restore state machine, event detail templates.
- **Property-based (fast-check):** any command sequence keeps `seq` strictly increasing and revision monotonic; the same `commandId` never adds events; `unreachable` never becomes `clear`.
- **Contract:** every response validates as `CaseFile` and matches the shape of `startDemo` and `runDemo` fixtures from `lib/case.ts`.
- **Integration (real sandbox AWS, after owner approval):** the evaluation table in `../../docs/backend-handoff.md`.
- **Frontend check:** run the frontend from the repo root against the local API, then against the deployed API.

## Test IDs
| ID | Given | Expected |
|---|---|---|
| T-01 | fresh case, `erase-primary` | primary pending recheck; `erasure` event |
| T-02 | erase then `scan` | 1 clear, 3 found |
| T-03 | scanned case, `restore` | `restore` then `return`; primary `returned`, source `backup`; before/after reads with UTC times |
| T-04 | backup verified clear, `restore` | refused; no import |
| T-05 | import ok, verifying read fails or mismatches | no `return`; unverified result; failed read is `unreachable` |
| T-06 | same envelope sent twice | second reply equals first; no new events |
| T-07 | new command with old revision | HTTP 409; nothing changed |
| T-08 | retry after write, before verification | verification resumes; one import |
| T-09 | primary and S3 reads | consistent read flag set; S3 version named; delete marker over older version handled |
| T-10 | any response or event | no ARN, account ID, secret or raw error text |
| T-11 | any response | no `Set-Cookie`; no visitor identifier stored |
| T-12 | preflight and request from allowed and other origins | allowed origin only |
| T-13 | duplicate stream record | replica unchanged the second time |
| T-14 | expired, oversized, over-cap | 404, rejected, 429 |
| T-15 | two cases | neither can read or change the other by ID |
| T-16 | verified `return` | analytics `pendingCheck: true`, finding unchanged; later `inspect` reports the read |
| T-17 | `erase-primary` twice, any command before erase, `erase-copy` on a store not `found`, `restore` when not allowed | HTTP 422 with a short code; revision and events unchanged |
| T-18 | `erase-copy` on backup, then `inspect` backup, then `restore` | version absent, backup clear, restore refused |
| T-19 | frontend with a throwing `sessionStorage` stub (root `tests/gateway.test.mjs`) | open, command and "Reload case" still work; new page load opens a new case |

## Gate for each Kiro task
Tests for the task pass, typecheck passes, no credentials in the diff, docs and the contract fixtures updated, and the task is checked only after tests pass. A task that says "real AWS" is not done from mocks.