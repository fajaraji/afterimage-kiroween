---
inclusion: always
---
# Engineering standard

- TypeScript strict; modular engine independent of React/Fastify.
- Schema-first public API; validate untrusted JSON at runtime; disallow unsupported event kinds.
- Tests for invariants and negative cases precede feature completion.
- No "TODO" fake-success or disabled failing tests; explicit not-implemented outcomes.
- Small PR/task-sized edits; inspect diffs and follow acceptance criteria in active `.kiro/specs/*/`.
- Use coherent error contracts and structured logs with synthetic IDs only.
- Keep `.kiro/` tracked. Preserve meaningful Kiro progress in `docs/BUILD_LOG.md`.
