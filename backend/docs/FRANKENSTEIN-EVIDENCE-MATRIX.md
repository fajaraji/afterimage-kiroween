> **Superseded (Costume Contest direction):** this document describes the earlier run-workflow or Frankenstein plan. The active contract is [`docs/backend-contract.md`](../../docs/backend-contract.md) and [`docs/backend-handoff.md`](../../docs/backend-handoff.md) at the repo root. Kept as history; do not implement from it.

# Frankenstein — claim-to-evidence matrix

**Template only. No statuses below indicate executed tests or deployed services.** Populate with actual run IDs, reproducible commands, redacted logs and screenshots captured during Kiro development. A screenshot of an architecture diagram is not proof that a service ran.

| ID | Claim in the demo | Minimum real evidence | Boundary check | Status |
|---|---|---|---|---|
| FRANK-1 | A stale event caused deletion resurrection in AWS | Step Functions execution, SQS message ID, Lambda logs, and independently observed replica item | Synthetic run scope only, bounded retries | TODO |
| FRANK-2 | Protected replay prevented resurrection | Same fixture hash/scenario/held event, DynamoDB transactional barrier rejection, independent PASS | Atomic check + write, idempotency | TODO |
| FRANK-3 | Strands investigated *actual* failure evidence | Invocation trace, model ID/region, matching valid evidence IDs and structured response | Four read-only tools; no direct mutation | TODO |
| FRANK-4 | Verified outcome remains authoritative and AI failure is safe | PASS/FAIL/UNKNOWN unchanged after malformed/denied Bedrock; explanation `UNAVAILABLE` | Schema and IAM denial tests | TODO |
| FRANK-5 | Ghost Graph represents the same facts as AWS and agent | UI event ID and store observation ID match persisted backend evidence | No client-created PASS, accessible fallback table | TODO |
| FRANK-6 | Kiro materially helped engineering | Actual spec edits, task diffs, hooks/PBT/test traces (only used features) | No manufactured Kiro screenshots | TODO |
| FRANK-7 | Final entry is reproducible | Public deployed app, public GitHub root `.kiro/`, MIT license, YouTube < 3 min | No secrets/production PII, category choice verified | TODO |

## Evidence link ledger (fill during actual work)

| Date | Gate | AWS/CI/YouTube evidence ID or URL | Test command | Observed result | Reviewer |
|---|---|---|---|---|---|
| TODO | TODO | TODO | TODO | TODO | TODO |

## Negative/edge acceptance gates

- Agent is never allowed to write/delete or invoke arbitrary AWS tools; verify with policy tests and negative API tests.
- `UNKNOWN` from an inaccessible required store never becomes PASS, regardless of what a model says.
- Bedrock timeout/denial preserves the previously stored deterministic verdict.
- Evidence IDs claimed by the model must be validated against the run's actual persisted evidence set. Invalid or fabricated references are rejected or clearly marked unsupported.
- Protected consumer must atomically check deletion barrier before upsert; retry and duplicate delivery should not resurrect the record.
- UI must show the same run scope/IDs as the evidence report and distinguish observations from hypotheses.

## v4 additional gates — optional, NOT part of the minimum Frankenstein proof

| ID | Claim only if implemented | Required real evidence | Status |
|---|---|---|---|
| ACTION-TRACE-P1 | Every consequential synthetic operation has attributed intent, policy, receipt and independently verified after-state | Correlated IDs in real AWS run, deliberately false receipt case, UNKNOWN case, redacted report | TODO |
| AGENT-GUARD-P2 | A simulated agent's destructive *proposal* is denied and makes no change | Server-side deny, absent handler, actual post-denial store read, negative bypass tests | TODO |

**Scope warning:** Even a passing P2 demo would NOT establish that Afterimage intercepts arbitrary external coding agents or protects production resources. Keep the mandatory FRANK-1–7 gates and demo first.
