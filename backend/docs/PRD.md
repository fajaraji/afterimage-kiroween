> **Superseded (Costume Contest direction):** this document describes the earlier run-workflow or Frankenstein plan. The active contract is [`docs/backend-contract.md`](../../docs/backend-contract.md) and [`docs/backend-handoff.md`](../../docs/backend-handoff.md) at the repo root. Kept as history; do not implement from it.

# Product requirements document (PRD)

## Problem
Application developers can delete a record from one store while delayed events or incomplete propagation can leave copies accessible or recreate the record. Teams need **repeatable, scoped engineering tests** before release.

## Product and user
**Afterimage — The Data Resurrection Lab**. Primary persona: backend/platform engineer working on a small-to-mid-sized SaaS with async jobs and multiple data stores. Secondary: privacy engineer who reviews test evidence.

## Primary job-to-be-done
"When I modify our deletion or synchronization logic, let me intentionally replay realistic failure modes and see whether deleted data can reappear in the systems I've configured."

## Core promise
A developer-controlled, synthetic-only laboratory for deterministic deletion fault injection, store verification, and visible failure evidence. **No universal erasure guarantee or legal compliance certification.**

## P0 in scope
1. Resettable synthetic Nocturne Commerce fixture with independent primary, analytics, and export stores.
2. Scenario runner with bounded sequence numbers, subject generation IDs, deterministic delayed upserts, and one deletion-failure injection.
3. Explicit safe and unsafe consumer modes for demonstration; the unsafe mode is intentionally vulnerable.
4. Independent per-store observation with `PRESENT`, `ABSENT`, `UNKNOWN`, and assertion verdict `PASS`, `FAIL`, `UNKNOWN`.
5. Timeline + ghost graph reflecting observed results, accessible labels, and reduced-motion behavior.
6. Exportable structured report with scenario version, fixture hash, event trace, scoped evidence, and reproduction instructions.

## P1 integrated Frankenstein story — after deterministic P0
A **bounded read-only Strands + Bedrock investigator**, integrated with stored run evidence and shown through the Ghost Graph, is the primary post-P0 priority for the Frankenstein narrative. The AI must never determine verdicts or modify records; failed or unavailable explanations must not break the core. A working explanation is a **demo readiness requirement for the planned Frankenstein story**, not a prerequisite for running deterministic tests. If unavailable by demo freeze, simplify honest claims and reconsider category positioning.

Optional *after that*: CLI regression testing, JSON/JUnit report, third fault scenario, Playwright E2E in CI.

## Out of scope
Live production data and connectors; irreversible external deletion; autonomous write-capable agent; universal identity resolution; RAG unlearning; claims of GDPR certification; billing; authentication for a multi-tenant SaaS; complex backup recovery.

## Required demo proof
Unsafe stale-event replay **fails** assertion with a real DynamoDB item reappearing after deletion; protected replay **passes** the same bounded test; a deliberately unreachable store yields `UNKNOWN`, not `PASS`; evidence links to actual observations.

## North-star demo success
A judge understands the issue in 20 seconds and can repeat the observed fail/fix demonstration in under 90 seconds.

## Non-functional
Synthetic-only; isolated scenario sessions; deterministic replay for a given fixture and run configuration; no fake data states; no secrets; accessible keyboard navigation; readable error and timeout reporting.

## Hackathon
Frankenstein proposed primary category (once integrated technology proof is working). Built with Kiro during current submission period. Keep `.kiro/` committed. Deliver public working URL, GitHub repo/license, English description, short public YouTube demo, meaningful Kiro development write-up.

## Unique Frankenstein integration requirement

The AI explanation must be **dependent on and grounded in actual deterministic evidence**. The verifier must remain **independent of the agent**, and UI must show both machine-verifiable verdicts and clearly labeled advisory reasoning. If any component is removed, a defined user capability is lost: without fault injection the failure cannot be reproduced; without verification the result cannot be trusted; without Strands the evidence lacks optional guided investigation; without visual forensics the sequence is harder to understand. See spec 08.

## v4 boundary: agent-caused data loss is adjacent, not the core MVP

The reported agent-data-loss cases motivate **P1 trustworthy action traces and independent post-action queries**; optional P2 is one *synthetic-only* guard denial and verification. This does not change the P0 scope or the required AWS + verifier + read-only Strands + Ghost Graph flow. We are not building a general-purpose production agent authorization platform for the hackathon. See ADR-0006 and spec 09. Treat any claim of protecting arbitrary coding agents as incorrect unless a separate future product is actually engineered and validated.
