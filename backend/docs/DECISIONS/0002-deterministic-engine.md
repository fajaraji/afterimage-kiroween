# ADR-0002: Deterministic assertions separate from visual effects

Status: Accepted for MVP (Nov 7, 2026).

Decision: The command engine and an independent read-only verifier produce typed events and findings. The UI renders their results only. No model decides a finding.

Consequences: Easier reproducibility, more trustworthy results, fewer demo dependencies. UI effects may lag actual state but never invent successes.
