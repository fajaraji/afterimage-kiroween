# Development roadmap — Frankenstein-first, correctness-first

**Status:** planning estimates for a solo developer. AWS infrastructure and Strands are **not** implemented in this starter. Require explicit approval before deployment, IAM changes, Bedrock access, or spend. Deadline: Dec 4, 2026, 2:00 PM PST; plan to submit by Dec 3.

| Window | Deliverable | Verification gate |
|---|---|---|
| Nov 7–10 | Kiro spec reconciliation, CDK plan, synthetic domain engine | Contracts and local tests; no AWS cost without approval |
| Nov 11–15 | AWS CDK limited infrastructure, Step Functions/SQS stale-event run | Actual sandbox execution, deterministic unsafe FAIL |
| Nov 16–19 | Transactional deletion barrier and read-only verifier | Protected PASS; unreachable store UNKNOWN; real observations |
| Nov 20–23 | Ghost Graph, timeline, report | UI state traceable to AWS event & evidence IDs |
| Nov 24–27 | Read-only Strands + Bedrock, model access verification | One cited real explanation, read-only policy, unavailable fallback |
| Nov 28–30 | Cross-technology integration testing and visual polish | Spec 08 integration gates met, no secret exposure |
| Dec 1–3 | Kiro evidence, capture demo, docs, judge deployment | Working public app, public GitHub, video < 3 min, Devpost submitted |

## Hard scope cut lines

1. **Nov 15:** If the AWS-backed unsafe case does not execute, cut to one fault scenario and reduced UI; do not add more services.
2. **Nov 19:** If independent verification doesn't work, stop Strands/UI expansion and fix correctness; don't fake PASS/FAIL.
3. **Nov 27:** If Strands cannot explain real evidence reliably, retain deterministic product, disclose the limitation, and reassess whether Frankenstein remains the strongest category.
4. **Nov 30:** Freeze features. Use the remainder for security, accessibility, reliability, live URLs and submission.

## P0 vs integrated demo

- **Core P0 (must never depend on AI):** synthetic stores, event replay, unsafe FAIL, protected PASS, UNKNOWN fallback, evidence serialization, safe demo session controls.
- **Frankenstein demo target after P0:** on-demand Strands read-only explanation + visual traceability and evidence links; counted as implemented only with observed successful invocation.
- **Deferred:** AgentCore, multi-agent swarm, production PII, live compliance workflows, unlimited AWS integrations, third-party connector gallery, paid billing, automatic remediation, fancy animation before evidence works.

## v4 feature gate for action-safety findings

- **P1 (after all core AWS replay/verifier capabilities work, when time allows):** add attributed `ActionIntent → PolicyDecision → ExecutionReceipt → PostActionObservation` records with independent check. Use existing AWS services; do not delay the Nov 27 read-only Strands gate.
- **P2 (only if core + Strands + UI demo already stable):** one isolated simulated-agent destructive *proposal* denied through a server-owned synthetic-only policy gateway; independent no-mutation verification. No real `DROP TABLE`, shell tool or AWS resource delete action. Optional demo can be omitted entirely.
- **Post-hackathon:** investigate real external agent policy enforcement only after identity, IAM, replay, approvals and adversarial security review. Not a present Afterimage capability.
