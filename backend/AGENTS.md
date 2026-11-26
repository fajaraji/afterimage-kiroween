> **Current direction:** hackathon category is **Costume Contest** (ADR-0007). The backend serves the frontend's browser API (`../docs/backend-contract.md`, `../lib/case.ts`, `../docs/backend-handoff.md`). Frankenstein, Strands, Bedrock, Step Functions replay and agent-action documents are superseded history. No cookies and no visitor identifiers are stored (ADR-0008). Do not deploy cloud resources or install MCP servers without explicit approval.
# Instructions for Kiro and coding agents

Read `../docs/backend-contract.md`, `../docs/backend-handoff.md`, `docs/SECURITY-PRIVACY.md`, and the active specs (01, 02, 03, 05, 06 in `../.kiro/specs/`) before coding. Treat the spec acceptance criteria as the source of truth and propose changes rather than silently changing requirements.

- This is a hackathon app in active development: never describe unfinished functions as complete. Only check tasks after verified tests.
- Synthetic data ONLY. No production credentials, real customers, genuine PII, or irreversible deletion on arbitrary external systems.
- Every finding comes from a direct read of its store. A missing or failed read is `unreachable`, never `clear`.
- Deterministic execution: reset fixture, fixed logical ordering, event IDs, and replayed input produce the same state; document any sources of nondeterminism.
- Preserve stale-event evidence and failure path in reports, but exclude raw sensitive fields.
- Require an explicit human decision for new dependencies, network-enabled MCP servers, cost-incurring services, or significant architecture changes.
- Make narrow diffs, run tests, document tradeoffs, keep the `.kiro/` directory committed. Do not disable tests to make CI green.
- UI semantics: accessible labels and text status accompany color and animation; honor reduced motion.
- Use the Kiro IDE spec workflow and its correctness/PBT on EARS acceptance criteria where useful; do not assert a feature is available on Kiro Web if IDE-only.

## Scope discipline

Do not build the superseded Frankenstein or agent-action scope (specs 04, 07, 08, 09) unless the user reopens it. A finding is set only from a direct read; a failed read is `unreachable`; a `return` event needs a new matching read.
