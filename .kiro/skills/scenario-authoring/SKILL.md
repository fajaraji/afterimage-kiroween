---
name: scenario-authoring
description: Design or extend a deterministic synthetic Afterimage deletion regression scenario with a failing example, safe replay, and direct store assertions.
---
# Afterimage scenario authoring

1. Read `docs/DOMAIN-MODEL.md`, `docs/TEST-PLAN.md`, the active Kiro spec and `fixtures/scenarios/`.
2. Write one small allowlisted fixture and validate it against `fixtures/scenario.schema.json`.
3. State event order, subject generation, fault mode, expected adapter observations, and unknown-state handling.
4. First construct a test that reproduces the unsafe behavior; then implement the barrier fix.
5. Verify the result by querying all configured stores, never by interpreting animation state.
6. Add deterministic replay and duplicate-delivery tests; update docs without exaggerating verification scope.
7. Run tests and record actual evidence in `docs/BUILD_LOG.md`.
