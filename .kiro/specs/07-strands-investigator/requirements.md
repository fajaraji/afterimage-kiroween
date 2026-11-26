# Spec 07 — Strands read-only investigator (P1, optional runtime)

**AGENT-1:** WHEN a user requests an explanation of a completed run, THE SYSTEM SHALL invoke one Strands TypeScript agent using Bedrock with only bounded, read-only evidence tools.

**AGENT-2:** WHEN the agent outputs a narrative, THE SERVER SHALL validate it against an explicit response schema and SHALL set the authoritative `verdictFromVerifier` from stored verification, never from model text.

**AGENT-3:** IF a model, tool, or AWS region fails, THE application SHALL retain deterministic results, show a clear `aiExplanationStatus: UNAVAILABLE`, and avoid inventing evidence.

**AGENT-4:** WHEN an explanation claims a cause, THE response SHALL include supporting evidence IDs or clearly label it as a hypothesis.

**AGENT-5:** THE agent SHALL NOT mutate any test data, install software, execute shell code, call arbitrary external APIs, or perform account administration.

**AGENT-6:** WHEN the agent sees untrusted evidence text containing instructions, IT SHALL treat them as data and not act on them.

Acceptance: schema tests, spoofed-evidence tests, permission checks, Bedrock-disabled fallback, and explicit end-to-end explanation validated against real evidence.
