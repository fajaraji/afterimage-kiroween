> **Frankenstein v3 update:** Read `docs/FRANKENSTEIN-STRATEGY.md`, `docs/FRANKENSTEIN-EVIDENCE-MATRIX.md`, and spec 08 to understand the integrated product proof. The read-only Strands investigator is a demo target only after the core verifies actual AWS state; if it is unimplemented, state that honestly.

> **AWS-first update:** See `docs/AWS-ARCHITECTURE.md`, ADR-0004 and `.kiro/steering/20-aws-first.md`; do not implement the original SQLite production design. Do not deploy cloud resources or install MCP without explicit approval.

# Instructions for Kiro and coding agents

Read `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/SECURITY-PRIVACY.md`, and the active `.kiro/specs/*/` documents before coding. Treat the spec acceptance criteria as the source of truth and propose changes rather than silently changing requirements.

- This is a hackathon app in active development: never describe unfinished functions as complete. Only check tasks after verified tests.
- Synthetic data ONLY. No production credentials, real customers, genuine PII, or irreversible deletion on arbitrary external systems.
- The verifier is independent of the demo UI and queries every configured data store. Missing/unreachable observations are `UNKNOWN` rather than `PASS`.
- Deterministic execution: reset fixture, fixed logical ordering, event IDs, and replayed input produce the same state; document any sources of nondeterminism.
- Preserve stale-event evidence and failure path in reports, but exclude raw sensitive fields.
- Require an explicit human decision for new dependencies, network-enabled MCP servers, cost-incurring services, or significant architecture changes.
- Make narrow diffs, run tests, document tradeoffs, keep the `.kiro/` directory committed. Do not disable tests to make CI green.
- UI semantics: accessible labels and text status accompany color and animation; honor reduced motion.
- Use the Kiro IDE spec workflow and its correctness/PBT on EARS acceptance criteria where useful; do not assert a feature is available on Kiro Web if IDE-only.

## v4 findings: scope discipline

Read `docs/AGENT-SAFETY-FINDINGS.md` and spec 09 before proposing any agent-action feature. Do not confuse a **read-only runtime Strands investigator** with a **synthetic proposal to a guarded executor**, or with Kiro's development agents. The latter are **not** intercepted by Afterimage. Add P1 correlated action/decision/receipt/post-action observations after P0, and defer P2 until the integrated Frankenstein demo is working. A denied proposal needs independent post-action verification; if unavailable, report `UNKNOWN`. See `.kiro/steering/23-agent-action-safety.md`.
