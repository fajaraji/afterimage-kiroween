# Design — 01 Foundation
Contracts live in `packages/contracts`, pure logic in `packages/engine`, AWS adapters in `packages/aws-adapters`, fixtures in `fixtures/`. Unit tests use in-memory adapters, and these are never presented as AWS evidence.

## Store IDs
The earlier code uses `primary`, `analytics`, `exports`. The frontend uses `primary`, `analytics`, `export`, `backup`. Task 8 renames `exports` to `export` and adds `backup`. `backup` is read-only for the visitor: it is created at seed time as a versioned S3 object and only `restore` reads it.

## Finding mapping
| Adapter result | Finding | Notes |
| --- | --- | --- |
| `PRESENT` | `found` | `checkedAt` is the read time |
| `ABSENT` | `clear` | `checkedAt` is the read time |
| `UNKNOWN` | `unreachable` | no `checkedAt` change |
| not read yet | `unchecked` | initial state |
| erase accepted, not re-read | previous finding with `pendingCheck: true` | cleared only by a successful read |
| verified restore | `returned` on primary | `sourceId: "backup"` |

## Case identity
Case ID is a server-generated random ID of at least 128 bits and is the only access credential (ADR-0008). Subject and record tag come from the seed. Every AWS key is derived server-side from the case ID (`cases/{caseId}/...`). No client value becomes a key, ARN or path.

## Interfaces
`StoreAdapter.seed | observe | remove | reset`, `StoreRegistry.get(allowlistedId)`, `toFinding(observation)`, `CaseFile` type and `parseCaseFile` in `packages/contracts`.

## Older run contracts
The existing `packages/contracts` still has the earlier run model (`SCENARIO_IDS` such as `zombie-sync`, `RunEvidence`) and tests for it. Task 10 adds `CaseFile` next to it. Retire the old run model in the same task or a follow-up once nothing imports it, and update its tests rather than deleting them silently.
