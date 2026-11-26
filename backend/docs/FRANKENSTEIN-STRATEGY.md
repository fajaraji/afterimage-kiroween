# Frankenstein strategy — combining incompatible methods responsibly

**Decision (2026-11-07):** Target the **Frankenstein** category instead of Costume Contest for Kiroween 2026. This is a proposed submission direction, not proof of eligibility or of an implemented system. The official rules require a working Kiro-built application; judges decide category merit. Source: https://kiroween.devpost.com/rules

## One-sentence argument

Afterimage combines **chaos engineering**, **deterministic privacy verification**, **agentic AI investigation**, and **interactive visual forensics** so developers can reproduce a deletion failure, prove the bounded outcome, understand its evidence, and compare it with a protected replay.

## What makes it a chimera rather than an AWS shopping list?

| Discipline | Technical responsibility | Trust boundary | Irreplaceable contribution |
|---|---|---|---|
| Distributed fault injection | Step Functions Standard, Lambda, SQS, synthetic DynamoDB/S3 stores | Controlled synthetic write scope | Produces an actual event-driven resurrection failure |
| Privacy verification | Read-only store queries + pure assertions | Evidence and deterministic verdict; UNKNOWN on incomplete reads | Establishes whether the failure truly occurred |
| Agentic investigation | Strands TypeScript + Bedrock, bounded read-only tools | Advisory, citation-based narrative only | Connects fixed evidence to human-understandable likely causes and checks |
| Visual forensics | React, Ghost Graph and timeline | Presentation must track verified observations | Makes the causal chain navigable and memorable |

**Nonnegotiable principle:** An LLM must never decide PASS/FAIL/UNKNOWN or mutate synthetic stores. An AI outage must not invalidate or block verification. Use of AWS is not independently scored; purposeful Kiro development and a functioning integrated product are what matter.

## Main competitive narrative

1. Inject a delayed SQS event into a deliberately unsafe consumer *after* a deletion request, and observe a real replica recreation.
2. Independently verify persisted state in configured stores, deriving FAIL from evidence, not UI/agent text.
3. Visualize the offending event path and highlight linked evidence references.
4. Ask a bounded Strands investigator to explain the verified failure using read-only run/evidence tools; disclose uncertainty.
5. Run the same fixture through a protected consumer with atomic deletion barrier; show direct PASS.
6. Simulate Bedrock unavailability and show core report still works; demonstrate UNKNOWN for unreadable stores.

## Innovation claim and restraint

The combination is a **candidate differentiated developer workflow**, not a claim of inventing privacy deletion or AI debugging. Enterprise privacy systems already have cross-store deletion, and chaos testing/agentic analysis exist separately. We need a working end-to-end demonstration and honest competitor disclosure. See `docs/COMPETITION.md`.

## Minimum viable Frankenstein proof

- A real AWS-backed unsafe failure, protected repeat, independent observations, signed-off scoped test verdicts, accessible timeline, and a **real** on-demand Strands explanation with relevant existing evidence IDs.
- A replay must be reproducible under the same *logical* fixture and event sequence; AWS wall-clock traces may differ. Explain this difference honestly.
- An interrupted Bedrock invocation returns `UNAVAILABLE` for explanation, not `UNKNOWN` for a previously established test verdict.
- Captured Kiro use must show actual specs/tasks/tests/iterations. Starter files do not prove Kiro execution.

## Category decision gate

On **Nov 27**: If Strands cannot explain real AWS-backed evidence reliably and securely, do not pretend the four-way integration works. You may still choose Frankenstein if the actually implemented combinations form a demonstrably unexpected capability, but reassess against Costume Contest if polished investigative UX is the stronger feature. Choose exactly one main category at final submission.

## Practical scope

Keep one agent with four read-only tools; one fault-injection scenario, protected replay, three bounded synthetic stores; no AgentCore, swarm, production PII, generic DB integrations or arbitrary remedial actions. The primary technical priority remains verified correctness, followed by agentic explanation and visual polish.

## v4 refinement — destruction is adjacent to resurrection

The agent data-loss article inspired a **forensic action / post-action observation layer**, but Afterimage's central Frankenstein combination remains *fault injection + deterministic deletion verification + read-only Strands explanation + visual forensics*. P1 improves evidence provenance for existing operations. P2 is optional synthetic-only prevention of a **proposed** destructive agent action, not a replacement product and not a general-purpose coding-agent safety gateway. If P2 is incomplete, it must not appear in the final claims or demo. Do not add AWS services merely to claim more integrations.
