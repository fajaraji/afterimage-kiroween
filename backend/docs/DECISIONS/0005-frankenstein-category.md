# ADR-0005 — Choose Frankenstein as primary Kiroween category

**Status:** Accepted as proposed hackathon positioning on 2026-11-07; recheck at demo readiness. **Supersedes:** category selection in initial docs (Costume Contest); **does not supersede:** functional haunted UI, AWS-first ADR-0004, or deterministic engine requirements.

## Context

Originally Afterimage was positioned for Costume Contest because the Ghost Graph could turn residual records into visual ghosts. The AWS serverless + Strands investigator design creates a different central story: novel cooperation between deterministic fault-injection/testing, privacy verification, read-only agentic reasoning, and navigable visual forensics.

## Decision

Target **Frankenstein** while retaining Costume Contest-quality UI as a contributor to the general UX scoring criterion. No claim that mere AWS service count earns points. A real Strands/Bedrock evidence-grounded explanation becomes a key demo target **only after** the deterministic pipeline passes its correctness tests. Bedrock is not on the authoritative verdict path.

## Consequences

- Update product, Devpost draft, demo, evidence matrix, Kiro steering/specs to focus on a verifiable four-role integration.
- Preserve P0 independent of LLM availability; use `aiExplanationStatus: UNAVAILABLE` when necessary.
- Nov 27 decision gate: if integration is not working, present only observed features and reevaluate category.
- Do not implement unrelated AWS products merely for novelty.
