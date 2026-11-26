---
name: privacy-review
description: Audit Afterimage code and copy for truthful deletion evidence, synthetic-data restrictions, no-cookie privacy, API security and misleading compliance claims.
---
# Afterimage privacy and safety review
1. Read `backend/docs/SECURITY-PRIVACY.md`, `backend/docs/DECISIONS/0008-no-cookies-reset-on-reload.md` and the changed files.
2. List external I/O, accepted payloads, keys derived from client input, isolation boundaries and error modes.
3. Confirm responses carry no `Set-Cookie`, ARNs, account IDs or raw errors, and logs hold only short codes and a truncated case ID hash.
4. Find any place where a failed read or missing evidence can show as clear, or a return without a matching read.
5. Check restore for double import, retry and stale revision handling.
6. Return findings by severity with a reproducing test. Ask the user before any risky fix.