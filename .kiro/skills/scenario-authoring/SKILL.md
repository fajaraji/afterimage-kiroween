---
name: scenario-authoring
description: Design or extend a deterministic synthetic Afterimage case scenario (erase, scan, restore) with a failing test first and direct store assertions.
---
# Afterimage scenario authoring
1. Read `docs/backend-contract.md`, `docs/backend-handoff.md` (evaluation table), `lib/case.ts` and the active spec in `.kiro/specs/`.
2. State the command sequence, expected findings per store, expected events and `seq`, and what a failed read must show.
3. Write the failing test first, using in-memory adapters and fixtures copied from `startDemo` and `runDemo`.
4. Implement until it passes. Findings come only from reads.
5. Add retry, stale revision and import-without-confirmation cases.
6. Run tests and record real results in `backend/docs/BUILD_LOG.md`.
Copy fixtures from `startDemo` and `runDemo` in `lib/case.ts`; there are no older scenario files.