# ADR-0002: Deterministic assertions separate from visual effects

Status: Accepted for MVP (Nov 7, 2026).

Decision: Scenario runner and independent direct-store verifier produce typed events, observations, assertions, and evidence. UI renders their results only. No LLM makes pass/fail decisions.

Consequences: Easier reproducibility, more trustworthy results, fewer demo dependencies. UI effects may lag actual state but never invent successes.
