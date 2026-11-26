> **Superseded (Costume Contest direction):** this document describes the earlier run-workflow or Frankenstein plan. The active contract is [`docs/backend-contract.md`](../../docs/backend-contract.md) and [`docs/backend-handoff.md`](../../docs/backend-handoff.md) at the repo root. Kept as history; do not implement from it.

# Domain and data model

## Entities

| Entity | Required fields | Invariant |
|---|---|---|
| `Subject` | id, generation, fixtureVersion | Synthetic identifier, no personal identity |
| `DataCopy` | subjectId, generation, storeId, currentState | State observed by actual adapter |
| `Store` | id, type, capabilityFlags | Exactly three configured lab stores in P0 |
| `Event` | eventId, subjectId, generation, sequence, kind, payloadRef | Unique event ID, logical sequence stable |
| `DeletionBarrier` | subjectId, generation, deletedAtSequence | Protected consumer enforces barrier atomically |
| `Run` | runId, scenarioId, fixtureHash, mode, startedAt, status | Unique isolated scenario execution |
| `Observation` | runId, storeId, subjectId, observedAt, state, error? | Must come from direct adapter read |
| `Assertion` | assertionId, runId, verdict, observationRefs | Verifiable evidence reference |

## Two distinct enums

**ObservationState:** `PRESENT`, `ABSENT`, `UNKNOWN`  
**AssertionVerdict:** `PASS`, `FAIL`, `UNKNOWN`

Do not conflate missing evidence with absence. An assertion is `FAIL` if a store is observed `PRESENT` when absence is required. Otherwise if any required store is `UNKNOWN`, return `UNKNOWN`, else `PASS`.

## Three required scenarios

1. `zombie-sync`: queue a stale upsert, delete the subject, release the held event, observe unsafe resurrection and protected prevention.
2. `partial-delete`: fail the analytics deletion once; independent verification finds the leftover copy.
3. `unreachable-store`: test harness intentionally cannot query export adapter; verifier returns `UNKNOWN` (use as negative acceptance test, optional UI).

## Report provenance
Include scenario version, tool version, fixture hash, run ID, deterministic event order, all store observation references, and scope limitations. Avoid raw subject names, email addresses, or secrets.

## v4 action-evidence extension — planned P1 only

Add scoped `ActionIntent → PolicyDecision → ExecutionReceipt → PostActionObservation` links to `RunEvidence` when implemented, keyed by stable `runId` and evidence IDs. `ExecutionReceipt` is a provider/adapter claim, never an independent proof of deletion or lack of mutation. A denied action must emit `NOT_EXECUTED`; post-denial observation still must query the target before asserting unchanged state. Preserve previous report schema compatibility and never expose raw personal data, secrets, arbitrary ARNs or prompt bodies. Example proposed records are in `fixtures/agent-actions/` and have `illustrativeOnly: true`.
