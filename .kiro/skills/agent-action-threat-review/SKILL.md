---
name: agent-action-threat-review
description: Review Afterimage consequential-action evidence and optional synthetic agent-action gate for trustworthy enforcement, post-action verification, and honest scope claims.
---
> **Deferred:** the category is Costume Contest (ADR-0007). Use this skill only if the user reopens the Frankenstein or agent-action scope.

# Action threat review — read-only audit workflow

1. Read spec 09, `docs/AGENT-SAFETY-FINDINGS.md`, `docs/AGENT-ACTION-FORENSICS.md`, `docs/AGENT-ACTION-THREAT-MODEL.md`, and `docs/SECURITY-PRIVACY.md`.
2. Trace exact intent/actor/target/run binding → server-owned policy decision → restricted executor/receipt → independent post-action store query; reject any status derived solely from a model or screenshot.
3. Attempt to find default-allow, privileged write tools, unbounded targets/ARNs/SQL/shell, user-supplied verdicts, approval replay/mismatch, unguarded cross-run access, excessive logging and IAM wildcard permissions.
4. Validate P1 `UNKNOWN` on missing observations; for P2 only, confirm denied synthetic destructive proposal has no executor and no mutation backed by real reads.
5. Confirm Strands remains read-only, cannot approve or run tools that write, and fails safely when Bedrock is unavailable.
6. Return PASS/FAIL/UNVERIFIED with paths, tested evidence, concrete blockers, and prioritization. Explicitly say that a JSON fixture or architectural diagram is not proof of enforcement.
