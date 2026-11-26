# Design — 02 Case commands and verified restore
## Engine
`applyCommand(caseState, envelope, adapters, clock)` returns `{ caseFile, commandResult }`. It is pure apart from adapter calls, so unit tests run it with in-memory adapters.

Order of checks: validate envelope (runtime parser) → look up `commandId` in the case command log (return stored result) → compare `expectedRevision` (409) → run the command → persist case state, command log entry and events in one conditional write on the revision.

## State kept per case (server only)
Revision, events, command log (`commandId` → result snapshot), restore journal (`commandId`, snapshot key, `VersionId`, phase: `read | written | verified | failed`), per-store `pendingCheck` and last findings. The simulator's physical-copy booleans are not part of this.

## Restore flow
1. Re-read primary (consistent) and backup object version. Refuse unless primary clear and backup holds subject and record tag.
2. Journal phase `read`. `GetObject(Key, VersionId)`, check case and subject.
3. `PutItem` with `attribute_not_exists(PK)` and an import reference (`commandId`). Journal `written`. Append `restore`.
4. New `GetItem(ConsistentRead=true)`. Compare subject, tag and import reference with step 2 bytes. Match: journal `verified`, append `return`, set primary `returned`. No match or read error: journal `failed`, no `return`.
5. Retry in phase `written` goes straight to step 4.

## Replay
Replay in the browser plays stored events only. The server does not re-run anything for replay.

## Decisions (settled)
- **Replica on restore (CMD-11):** the stream Lambda copies primary inserts, so a restored record can reach the replica. The restore does not read analytics. After `return`, analytics keeps its last finding and gets `pendingCheck: true`. Reason: claiming "clear" for a store that may have changed would be false, and re-reading it inside the restore would blur which read proved what.
- **`erase-copy` on backup (CMD-13):** allowed, because the frontend simulator and the handoff scenario "remove the backup, then restore is refused" need it. It deletes the exact snapshot `VersionId`. A plain delete would only add a delete marker and leave the version restorable.
- **Disallowed states (CMD-12):** HTTP 422 with a short code such as `ERASURE_ALREADY_STARTED`, `ERASE_FIRST`, `INSPECT_FIRST`, `RESTORE_NOT_POSSIBLE`. 409 stays reserved for a stale revision.