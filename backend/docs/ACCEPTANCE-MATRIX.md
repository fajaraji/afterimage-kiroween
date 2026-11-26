# Acceptance traceability matrix

No status below implies implementation. Update evidence links after Kiro-driven development.

| Requirement | Real evidence required | Test anchor | Status |
|---|---|---|---|
| FOUNDATION-1 | Same fixture state/hash from repeated seed | fixture reset integration | TODO |
| FOUNDATION-2 | Direct read of primary, analytics, exports | adapter integration | TODO |
| FOUNDATION-4 | Parallel sessions do not share run state | isolation integration | TODO |
| REPLAY-1 | Actual persisted row recreated in unsafe mode | T-01 | TODO |
| REPLAY-2 | Actual protected write rejected under atomic barrier | T-02 | TODO |
| REPLAY-3 | Same logical event trace from same seed | T-05 | TODO |
| REPLAY-4 | Duplicate ID no extra state change | T-06 | TODO |
| REPLAY-5 | Analytics leftover record detected | T-03 | TODO |
| VERIFY-2 | Unreachable store is UNKNOWN | T-04 | TODO |
| VERIFY-3 | Present residual copy is FAIL | T-03 | TODO |
| VERIFY-4 | PASS only for all required absent and satisfied invariants | T-02 | TODO |
| VERIFY-5 | Duplicate/unknown evidence rejected | T-08 | TODO |
| UI-3 | Ghost Graph matches observed response | E2E visual/state check | TODO |
| UI-4 | Keyboard and reduced motion usable | T-09 | TODO |
| REPORT-1 | Exported report matches actual event and observation IDs | T-08 | TODO |
| REPORT-4 | Repeatable test run in CI | T-05 + CI | TODO |
| REPORT-5 | Valid public repo, Kiro evidence and video | Manual audit | TODO |

Rule: change status to PASS only with a concrete reproducible command, test run, or functioning public URL. If uncertainty exists, mark BLOCKED or UNKNOWN.

## Frankenstein integration gates — new in v3

| Requirement | Proof required | Status |
|---|---|---|
| FRANK-1 | Actual Step Functions/SQS/Lambda event tied to persisted synthetic mutation and independent FAIL | TODO |
| FRANK-2 | Protected replay of same fixture & event with atomic barrier and authoritative PASS | TODO |
| FRANK-3 | Real Strands+Bedrock read-only response citing actual existing evidence IDs | TODO |
| FRANK-4 | Agent cannot mutate data/override verdict; Bedrock-disabled fallback still serves report | TODO |
| FRANK-5 | Graph/timeline, verifier and agent refer to the same immutable run/event/evidence references | TODO |
| FRANK-6 | Recorded Kiro workflow and working app/video demonstrate the joined workflow truthfully | TODO |

Do not mark `PASS` until actual cloud and model integrations have been exercised. Stub screenshots and JSON response examples do not constitute proof.

## v4 P1/P2 proposed gates (not implemented)

| ID | Proof required | Status |
|---|---|---|
| ACTION-1–3 | Trusted intent → decision → receipt with same synthetic run IDs, no raw private payload | TODO |
| ACTION-4 | Actual independent post-action observation; failed query is UNKNOWN | TODO |
| ACTION-5 | Accessible evidence chain separates facts, receipts and agent hypotheses | TODO |
| ACTION-6,8 | Optional synthetic denied destructive proposal; independent no-mutation read | TODO |
| ACTION-7,9 | If human approval supported: exact scope/digest/nonce, one-use atomic consumption; model bypass denied | TODO |
