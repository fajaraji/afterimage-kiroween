> **Superseded (Costume Contest direction):** see ADR-0007. This describes the earlier Frankenstein or run-workflow plan and is kept as history. Do not implement from it.

# ADR-0006: Adopt forensic action records; defer external agent interception

**Date:** 2026-11-07  
**Status:** Accepted as development plan; not implemented  
**Context:** The article on reported AI-agent data-loss incidents surfaces concerns about authorization, attribution and verification. Afterimage P0 solves unintended **resurrection**, not arbitrary agent-caused **destruction**.

## Decision

1. Preserve P0: real AWS synthetic deletion/resurrection FAIL, protected PASS, missing evidence UNKNOWN, and clear Ghost Graph.
2. Add P1: link consequential action intent, policy decision/actor, execution receipt, and independent post-action store observation to the existing evidence report.
3. Permit P2 **only after** P0 and Strands/Frankenstein demo are working: demonstrate a destructive **proposal** denied at a controlled synthetic-only policy boundary, prove by independent query that nothing changed, and show an evidence chain. No arbitrary shell, SQL, AWS management API or production connector.
4. Keep Strands read-only; no model-issued approval or automated remediation. No extra AWS products solely for category positioning.
5. Do not rebrand or claim general agent security. Revisit only after hackathon and an actual threat-model/security review.

## Consequences

- More credible incident narratives and future interoperability with agent-tool safety systems.
- P1 requires careful correlation, redaction, test fixtures and UNKNOWN semantics. P2 requires real enforcement tests, not a toy visualization.
- Cost and schedule pressure remain contained by hard priority gates and explicit approval before deployment.

## Alternatives rejected

- **Immediate pivot to universal agent firewall:** unbounded trust boundaries, integration/auth complexity and deadline risk.
- **LLM-based classification as enforcement:** bypassable and nondeterministic; cannot be authoritative.
- **Agent-auto-remediation:** write privileges and operational risk not justified for the hackathon.
