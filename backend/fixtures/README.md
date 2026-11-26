> **Superseded (Costume Contest direction):** these scenario and agent-action fixtures belong to the earlier replay plan. They are kept because scripts/validate-workspace.mjs still checks them. New case fixtures should be copied from startDemo and unDemo in lib/case.ts.

# Synthetic scenarios (draft definitions)

Fixtures in `scenarios/` are **design inputs**, not completed executable scenario runs. The Kiro spec 01 implementation must validate them with a runtime schema and reject unknown actions/stores. The `expectedObservation` section is a **test target only**, never evidence of observed results. Do not display expected results as actual run outcomes.

`scenario.schema.json` uses JSON Schema 2020-12. `scripts/validate-workspace.mjs` checks basic JSON and allowlist rules; use a full JSON Schema validator (with Kiro approval) when implementing runtime execution.
