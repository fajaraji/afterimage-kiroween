# Acceptance traceability matrix
No status below implies implementation. Set a status only with a command, test run or URL anyone can repeat. Use BLOCKED or UNKNOWN when unsure.

| Requirement | Real evidence required | Test anchor | Status |
|---|---|---|---|
| FOUNDATION-1 | Same seed gives same subject, tag and fixture hash | engine fixture test | TODO |
| FOUNDATION-2 | Four stores seeded and each directly readable | adapter integration | TODO |
| FOUNDATION-4 | Two cases isolated by ID, unknown ID gives 404 | isolation test | TODO |
| FOUNDATION-6 | Finding mapping: found, clear, unreachable, pendingCheck | mapping unit test | TODO |
| FOUNDATION-7 | Output validates as `CaseFile` and matches `startDemo`/`runDemo` shapes | contract test | TODO |
| CMD-1..3 | erase-primary, scan, erase-copy, inspect update findings from reads | T-01, T-02 | TODO |
| CMD-4 | Same `commandId` adds no events | T-06 | TODO |
| CMD-5 | Stale `expectedRevision` returns 409 | T-07 | TODO |
| CMD-6 | Restore refused if primary not clear or backup clear | T-04 | TODO |
| CMD-7,8 | Restore then verifying read gives `restore` then `return` | T-03 | TODO |
| CMD-9 | Import ok, verification fails: no `return` | T-05 | TODO |
| CMD-10 | Retry after write resumes without second import | T-08 | TODO |
| CMD-11 | After `return`, analytics has `pendingCheck` and an unchanged finding | T-16 | TODO |
| CMD-12 | Disallowed command gives 422 and changes nothing | T-17 | TODO |
| CMD-13 | Backup `erase-copy` removes the exact version; restore then refused | T-18 | TODO |
| AWS-10 | Reload opens a new case; no `sessionStorage` or cookie; Reload case still works | T-19 (frontend) | TODO |
| VERIFY-1,2 | Findings only from reads; failed read is `unreachable` | T-05 | TODO |
| VERIFY-3,4 | Consistent primary read; S3 version stated | T-09 | TODO |
| VERIFY-5,6 | English detail, no ARN or raw error text | T-10 | TODO |
| AWS-3 | No `Set-Cookie`, no stored visitor identifiers | T-11 | TODO |
| AWS-4 | CORS exact origin and methods | T-12 | TODO |
| AWS-5 | Replica update is idempotent | T-13 | TODO |
| AWS-7 | TTL, size limit, throttling, active-case cap | T-14 | TODO |
| REPORT-1 | Certificate has before/after primary reads with UTC time | T-03 | TODO |
| REPORT-5 | Public repo, license, `.kiro/`, write-up, video | manual audit | TODO |