# Design — Frankenstein integration

## Cross-component contracts

- Every scenario produces `runId`, `scenarioId`, `fixtureHash`, `logicalEventSequence`, `stepExecutionArn` (internal/redacted), `eventEvidenceIds`, and independently observed `storeEvidenceIds`.
- `POST /api/runs` returns 202 with run ID; subsequent reads show persisted status and evidence. Never trust user-provided PASS flags.
- The verifier owns `verdict`; its published result is immutable for that run/version and contains `observations`, `scope`, and `limitations`.
- `POST /api/runs/{runId}/explain` authorizes ownership, invokes the Strands Lambda with fixed run ID, grants four read-only tools, validates evidence ID references, and returns `{verdictFromVerifier, aiExplanationStatus, summary, citedEvidenceIds, hypotheses, limitations}`. The verifier field is always injected by server code after parsing model output.
- UI views map evidence IDs to graph and timeline nodes. Missing/unknown evidence must not be animated as PASS or hidden behind a ghost effect.

## Trust boundaries

1. Only test-scoped actions may mutate synthetic run partitions; no arbitrary data source URIs/ARNs/SQL.
2. Verification reads independently from actual configured stores; event queue receipt is not proof of store state.
3. Strands receives bounded and sanitized evidence; its output is advisory, can be contradicted by facts, and cannot perform any writes.
4. Bedrock timeout/denial returns `UNAVAILABLE` for explanation without changing the persisted test verdict.
5. Kiro engineering automation may edit repository code under review; this is separate from runtime Strands agent access.

## Acceptance and observability

- Link AWS request IDs/trace IDs to run/event/observation metadata without leaking credentials or actual data contents.
- Tests: protected vs unsafe scenario, partial delete, UNKNOWN store, fake evidence ID rejection, invalid model schema, Bedrock failure, denied mutation, two concurrent runs isolated, accessible navigation.
- For demo, show four distinct technologies cooperating; do not add services solely for appearance. Preserve screenshot/video evidence after obtaining required account approval.

See `docs/FRANKENSTEIN-EVIDENCE-MATRIX.md`, `docs/AWS-ARCHITECTURE.md`, `docs/STRANDS-AGENT-DESIGN.md`.
