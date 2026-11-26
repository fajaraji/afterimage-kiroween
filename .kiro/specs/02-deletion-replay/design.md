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

## Open decisions to settle in the spec workflow
Analytics replica behavior on restore (CMD-11); whether `erase-copy` on `backup` is allowed (default: reject).