---
name: privacy-review
description: Audit Afterimage code and product copy for truthful deletion evidence, synthetic-data restrictions, API security and misleading compliance claims.
---
# Afterimage privacy and safety review

1. Read `docs/SECURITY-PRIVACY.md` and the changed files.
2. List external I/O, accepted payloads, filesystem paths, run isolation boundaries and error modes.
3. Confirm synthetic-only fixture and raw evidence redaction.
4. Find any instance where missing verification can be presented as a pass.
5. Inspect stale event replay for barrier race, duplicate event, and ordering bugs.
6. Return findings by severity with reproducible tests; request user approval before any dangerous remediation.
