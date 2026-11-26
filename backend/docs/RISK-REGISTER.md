# Risk register
| Risk | Likelihood | Impact | Trigger | Response |
|---|---|---|---|---|
| Video shows simulator output as if it were AWS | Medium | Critical | Demo mode left on | Show the Connected label; capture from a real run only |
| `return` shown without a confirming read | Medium | Critical | Event added after the write only | Verification read must match backup bytes and import reference (CMD-8) |
| Failed read shown as clear | Medium | Critical | Error handled as empty | `unreachable` on any failed read (VERIFY-2); test T-05 |
| Case ID leaks and a stranger reads a case | Low | Low | Shared link or log | Only fictional data; short TTL; truncated ID in logs (ADR-0008) |
| Cost or abuse on a public API | Medium | High | Bot traffic | API throttling, active-case cap, budget alarm, TTL |
| Replica or stream behavior surprises on restore | Medium | Medium | Extra copy appears | Observe by read, record in the log (CMD-11) |
| Frontend still saves the case ID across reloads | High | Medium | `lib/gateway.ts` unchanged | Ask the owner (`FRONTEND-REQUESTS.md`); backend works either way |
| Kiro usage not documented | Medium | High | Empty build log | Record real specs, tasks and test runs in `BUILD_LOG.md` |
| Spec drift between frontend and backend | Medium | High | Contract changes | Re-check `lib/case.ts` and `docs/backend-contract.md` when either changes |
| Timeline slips | Medium | High | Deploy not approved or delayed | Cut lines in `ROADMAP.md` |