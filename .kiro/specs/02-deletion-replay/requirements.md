# 02 — Case commands and verified restore
**Priority:** P0 · **Status:** not implemented · **Method:** requirements-first (EARS).
(The folder name is kept so Kiro history and links stay stable.)

Source of truth: `docs/backend-contract.md`, `docs/backend-handoff.md` (restore flow, "Kapan hantu muncul?"), `lib/case.ts` (`runDemo`), `lib/trace.ts`.

## User story
As a visitor, I erase a customer, scan four stores, restore the backup, and see whether the record came back, with each claim backed by a read.

## Requirements
**CMD-1:** WHEN `POST /cases/{id}/commands` receives `erase-primary`, THE SYSTEM SHALL delete the primary record, set `erasureRequested`, set primary `pendingCheck: true`, and append an `erasure` event.

**CMD-2:** WHEN `scan` is received, THE SYSTEM SHALL read all four stores independently, update each finding and `checkedAt`, and append an `inspection` event. A failure in one store SHALL NOT change the result of the others.

**CMD-3:** WHEN `inspect` with a store is received, THE SYSTEM SHALL read only that store and replace its finding. WHEN `erase-copy` with a store is received, THE SYSTEM SHALL delete that copy and set `pendingCheck: true` until a successful read.

**CMD-4:** WHEN a command carries a `commandId` already processed in the same case, THE SYSTEM SHALL return the stored result and SHALL NOT repeat the operation or append events.

**CMD-5:** IF `expectedRevision` differs from the case revision on a new command, THEN THE SYSTEM SHALL return HTTP 409 and change nothing. A successful mutation SHALL increase the revision by one and append events with strictly increasing `seq`.

**CMD-6:** WHEN `restore` is received, THE SYSTEM SHALL first re-read and require primary verified clear and backup holding the subject. Otherwise it SHALL refuse the command without importing.

**CMD-7:** WHEN restore preconditions hold, THE SYSTEM SHALL read the chosen S3 object by `Key` and `VersionId`, check case and subject, write the payload to primary only if no item exists, and append a `restore` event with `store: "backup"` and the snapshot reference in `detail`.

**CMD-8:** WHEN the restore write succeeds, THE SYSTEM SHALL perform a new strongly consistent read of primary and SHALL append a `return` event (greater `seq` than `restore`) with primary `finding: "returned"`, `sourceId: "backup"`, `pendingCheck: false` only if identity, record tag and import reference match the backup read.

**CMD-9:** IF the restore write succeeds but the verifying read fails or does not match, THEN THE SYSTEM SHALL keep the `restore` event, append no `return` event, and leave primary unverified with the actual result in `detail`.

**CMD-10:** WHEN a restore is retried after the write but before verification, THE SYSTEM SHALL resume verification without importing again.

**CMD-11:** THE analytics replica SHALL follow primary through DynamoDB Streams, including a restored record. WHEN a `return` event is appended, THE SYSTEM SHALL set analytics `pendingCheck: true` and SHALL NOT change its finding, because the replica may repopulate after the restore. A later `inspect` or `scan` SHALL report what a read finds.

**CMD-12:** WHEN a command is not allowed in the current state, THE SYSTEM SHALL return HTTP 422 with a short error code and SHALL NOT change the case or its revision. The rules follow `runDemo`: `erase-primary` is refused once erasure has started; every other command is refused before `erase-primary`; `erase-copy` is refused unless that store's finding is `found`; `restore` is refused unless primary is `clear` and backup is `found`.

**CMD-13:** WHEN `erase-copy` targets `backup`, THE SYSTEM SHALL delete the case's snapshot object by its exact `VersionId` (not by adding a delete marker) and set backup `pendingCheck: true`, so a later read of that version returns absent. THE SYSTEM SHALL touch no other object or version.

## Acceptance (from `docs/backend-handoff.md` evaluation table)
Erase then scan gives 1 clear and 3 found. Erasing the backup copy and rechecking gives a clear backup, and a restore is then refused. After a restore, analytics shows `pendingCheck` until it is read again. Restore after scan ends with primary `returned` from `backup`. A restore with backup clear is refused. One failed read shows `unreachable` and no `return`. Identical envelope twice adds no events. Stale revision returns 409.