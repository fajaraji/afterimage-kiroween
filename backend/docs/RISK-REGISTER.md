# Risk register

| Risk | Probability | Impact | Trigger | Response |
|---|---|---|---|---|
| Simulated UI without real DB evidence | High | Critical | No independent adapter read | Stop polish, implement verifier |
| Unknown reported as success | Medium | Critical | Failed adapter returns success | Fail-closed tri-state invariant |
| P0 expands to compliance suite | High | High | Requested OAuth/enterprise integrations | Defer to P2, freeze scope |
| Too much custom graph UI | Medium | High | Engine not stable by Nov 19 | Use evidence table; animation P1 |
| Cross-run data leakage | Medium | High | Shared mutable storage | Isolated run DB/fixture resets |
| Kiro usage not documented | Medium | High | No build log | Record real specs/tests/iterations |
| Public demo downtime | Medium | High | Ephemeral server | Persistent hosting + smoke test |
| Commercial novelty overclaimed | Medium | Medium | "only solution" wording | Accurate prior art disclosure |

## Frankenstein category-specific risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Mere AWS service composition looks unoriginal | High | High | Document unique role per technology and demonstrate one inseparable user journey |
| Agent not built before deadline | Medium | High | Deterministic P0 first, scoped P1 investigator, Nov 27 category decision gate |
| AI hallucinates evidence or overwrites verdict | Medium | Critical | Read-only allowlist, schema validation, server-owned verdict, linked evidence IDs |
| More AWS services drive cost/scope without improving story | High | High | Small resource set, explicit cost/approval gates, strict scope cuts |
| Cross-service status races produce false PASS | Medium | Critical | Explicit completion receipts, bounded polling, independent queries and UNKNOWN |

## v4 agent-action expansion risks

| Risk | Likelihood | Impact | Response |
|---|---|---|---|
| Scope pivot to production agent firewall | High | Critical | P0 fixed; P2 optional after all Frankenstein gates; ADR-0006 |
| LLM message treated as permission or policy | Medium | Critical | Server-only policy/approvals; Strands read-only; negative tests |
| Fake no-mutation proof from DENY receipt | High | High | Independent post-denial store read; UNKNOWN when missing |
| Agent proposal handler reaches real AWS resource | Low if designed safely | Critical | No arbitrary handler; synthetic allowlist and IAM restrictions |
| Audit log contains secrets/PII or misrepresents immutability | Medium | High | Redacted bounded metadata; explicit completeness/retention limits |
| Optional P2 dilutes required three-minute demo | High | High | Keep P2 off the main path unless proven and demonstrably better |
