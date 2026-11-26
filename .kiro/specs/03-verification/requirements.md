# 03 — Independent verification and evidence
**Priority:** P0 · **Status:** not implemented · **Method:** requirements-first (EARS).
(The folder name is kept from the earlier plan. The PASS/FAIL/UNKNOWN verdict model is replaced by per-store findings.)

## User story
As a reviewer, I want every finding to come from its own read, so that I can trust the map, log and certificate.

## Requirements
**VERIFY-1:** WHEN the system sets a finding, THE SYSTEM SHALL have just performed a direct read of that store. A write response, a receipt or a cached value SHALL NOT set `clear`, `found` or `returned`.

**VERIFY-2:** IF a read fails, times out or is outside the inspection boundary, THEN THE SYSTEM SHALL set `unreachable` and SHALL NOT set `clear`.

**VERIFY-3:** WHEN primary is read, THE SYSTEM SHALL use a strongly consistent read of the base table with the same region and key as the write.

**VERIFY-4:** WHEN a versioned S3 object is read, THE SYSTEM SHALL state in the evidence which version it read, and a delete marker SHALL NOT be reported as the data being gone while older versions remain.

**VERIFY-5:** WHEN an event is appended, THE SYSTEM SHALL write `detail` in English with store, UTC read time, snapshot reference and the actual result, and SHALL NOT include credentials, account IDs, ARNs or raw error text.

**VERIFY-6:** THE SYSTEM SHALL report errors as short codes (for example `AccessDenied`) and keep stack traces and ARNs in server logs only.

**VERIFY-7:** THE SYSTEM SHALL keep verification independent of the command path: the code that reads a store SHALL NOT share a client or state with the code that wrote to it beyond configuration.

## Acceptance
Negative tests: outcome looks right but source is wrong; import without a confirming read; duplicate command; delete marker with older version present; denied read gives `unreachable`. Logs and responses contain synthetic IDs only.