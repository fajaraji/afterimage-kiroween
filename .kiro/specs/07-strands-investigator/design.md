# Spec 07 — Design

Create `packages/agent-investigator` with `@strands-agents/sdk` (TypeScript), Bedrock default provider (configure and check actual model ID/region), Zod response validation, bounded tool schema. Deploy via AWS Lambda `explain` handler and invoke only after a stored verifier result exists.

Tool definitions: `get_run_summary`, `get_event_trace`, `get_store_observations`, `get_invariant_results`. All tools accept a server-validated opaque run ID and verify session ownership; they cannot access arbitrary AWS keys or resource names. All observation values originate from read-only AWS metadata. No raw customer payloads.

Return `summary, likelyCause, evidenceIds, suggestedEngineeringChecks, limitations` plus server-injected authoritative verdict. Use static report fallback if model invocation fails. Limit tool iterations, input/response size, cost and invocation concurrency. No autonomous remediation, MCP tool discovery at runtime, swarm or persistent memory. `docs/STRANDS-AGENT-DESIGN.md` is normative.
