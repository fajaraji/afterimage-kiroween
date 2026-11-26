# Design — 03 Verification
A `Verifier` module wraps read-only adapters (`observe`) built from a separate read client. It returns `{ store, state, checkedAt, evidenceRef, errorCode? }`. `toFinding` (spec 01 task 9) converts it to a finding. Evidence references are short IDs that match the full record kept in the case log.

S3: with versioning on, the verifier lists versions under the case prefix and reports the latest version and whether a delete marker is current. For `backup` it reads the exact `VersionId` chosen at seed time.

Event `detail` templates are English and fixed, with only the values (store, UTC time, short snapshot ref, result) filled in. Error text passes through `safeErrorCode`.

IAM: the verifier's role has read actions only on the case table, replica table and buckets. The writer role has no read-only shortcuts to set findings.