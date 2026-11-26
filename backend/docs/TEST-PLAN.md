# Test strategy and quality gates

## Test pyramid
- **Unit (Vitest):** event ordering, subject generation matching, barrier semantics, verdict reduction, idempotency.
- **Property-based (fast-check, Kiro IDE Correctness):** arbitrary event sequences preserving deletion barrier invariants; same seed yields same outcome; duplicate events don't change state twice.
- **Integration:** three independent adapters, successful delete, injected failed delete, direct verification of each adapter.
- **E2E (Playwright, P1):** run scenario, inspect result, toggle safe/unsafe, export report, keyboard-only navigation.
- **Security:** malformed scenario ID, oversized payload, paths, rate limits, static-store exposure.

## Test IDs and assertions

| ID | Given | Expected |
|---|---|---|
| T-01 | queued stale upsert, then deletion, unsafe consumer | observed subject reappears; assertion FAIL |
| T-02 | same seed/events, protected consumer | observed subject absent everywhere; assertion PASS |
| T-03 | analytics deletion fails | analytics PRESENT; assertion FAIL |
| T-04 | required export store offline | export UNKNOWN; assertion UNKNOWN |
| T-05 | replay identical seed and fixture | same logical event trace and verdict; ignore wall-clock metadata |
| T-06 | duplicate stale event IDs | no duplicate side effects |
| T-07 | new subject generation | new generation not accidentally blocked by old barrier, if supported |
| T-08 | report generated | matches stored observed evidence, never interpolates inferred status |
| T-09 | keyboard tab flow | controls reachable and status understandable without colors |
| T-10 | two isolated runs | no cross-run data contamination |

## Quality gate before each completed Kiro spec task
Acceptance tests run; typecheck passes; no credentials in diff; no untested API change; corresponding docs and report schema updated; tasks checked only after success.

## Kiro PBT opportunity
Requirements REPLAY-3, VERIFY-2 and FOUNDATION-4 lend themselves to property tests: no event older than deletion generation may recreate an active record in protected mode; unknown adapter never yields pass; identical input sequences are deterministic. Use IDE Correctness where available, and keep fast-check tests in repo for portability.

## v4 new proposed checks (spec 09; not implemented)

| ID | Area | Assertion |
|---|---|---|
| T-11 | Action provenance P1 | Intent, policy, receipt and observed state are linked to same synthetic run/evidence IDs; conflicting or missing refs are rejected |
| T-12 | Source-of-truth P1 | An executor reports success but the independent store is still PRESENT; result is FAIL, not PASS |
| T-13 | Missing evidence P1 | Denied or executed action with unreadable target returns UNKNOWN, not "safe" or PASS |
| T-14 | Scope P2 | Cross-run target, unknown operation or arbitrary ARN/SQL/shell is denied before any executor is called |
| T-15 | Denied operation P2 | `DROP_SYNTHETIC_TABLE_PROPOSAL` has no executor; post-denial independent read shows unchanged synthetic data or UNKNOWN |
| T-16 | Approvals P2 if built | Changed arguments, expired token, duplicate consume and concurrent consume all denied |
| T-17 | Agent isolation | Injected prompt or Strands output cannot set policy decision, approve action, mutate store, or override verdict |

`fixtures/agent-actions/*.json` are schema illustrations only; validation of these JSON files is **not** sufficient to mark T-11–T-17 passed. Never call unit tests a penetration test of production systems.
