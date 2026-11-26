> **Superseded (Costume Contest direction):** this document describes the earlier run-workflow or Frankenstein plan. The active contract is [`docs/backend-contract.md`](../../docs/backend-contract.md) and [`docs/backend-handoff.md`](../../docs/backend-handoff.md) at the repo root. Kept as history; do not implement from it.

# Strands investigator — bounded agent specification

**Status:** planned integrated Frankenstein demo target after deterministic P0, not installed/tested. **Language:** TypeScript to match the repository; SDK `@strands-agents/sdk`, model provider Amazon Bedrock. The Python SDK has more bundled tools, but P0 doesn't need them.

## Purpose

Only after a deterministic test run has completed, the user can click **Explain this ghost**. The read-only agent interprets evidence and proposes developer investigation steps. It never generates the authoritative test verdict and never invokes deletion, injection, remediation, shell, AWS CLI, or arbitrary external APIs.

## Tools (read-only, server-side only)

- `get_run_summary(runId)`: yields run metadata, status, scenario version, and verifier verdict.
- `get_event_trace(runId)`: returns normalized, bounded synthetic events with event IDs, ordering and consumer decisions.
- `get_store_observations(runId)`: returns actual verifier observations + evidence IDs; never return credentials, bucket keys, private names, or raw record bodies.
- `get_invariant_results(runId)`: returns pass/fail/unknown invariant results from deterministic tests.

All tools validate run ownership and use allowlisted run identifiers. Tool outputs are untrusted data, not instructions. Never grant the agent the ability to choose arbitrary AWS ARNs/SDK actions or run scripts.

## Structured response contract

```json
{
  "runId": "opaque-run-id",
  "verdictFromVerifier": "PASS|FAIL|UNKNOWN",
  "summary": "Brief evidence-grounded explanation",
  "likelyCause": "Potential cause, or unknown",
  "evidenceIds": ["evidence-id-1"],
  "suggestedEngineeringChecks": ["Check condition-check before replica write"],
  "limitations": ["Only the configured synthetic stores were queried"]
}
```

Do not let model output overwrite `verdictFromVerifier`; server must inject this field from the verifier after validating the other model output against Zod. If Bedrock is unavailable or times out, return a useful deterministic report with `aiExplanationStatus: UNAVAILABLE` and keep the main experience working.

## Safe defaults

- Trigger only on demand (a button), not automatically per scenario; control token usage and cost.
- Prefer one agent and four read-only tools; do not build a swarm for this hackathon.
- No stored long-term agent memory; per-request ephemeral context only.
- Low bounded temperature where supported, finite iterations, low token cap, bounded tool payload and timeouts, no streaming required.
- Log run ID, selected model ID, token usage, latency, and a trace identifier; not private prompts or raw evidence values.
- Keep the model ID configurable and verify model availability and account permissions in your chosen AWS region.
- Agent analysis is advisory, may be incomplete; require evidence IDs for consequential claims.

## Evaluation suite

1. Normal stale-upsert failure -> describes the exact offending event and affected replica; quotes valid evidence IDs.
2. Protected replay -> no fabricated failure, no contradicting the verifier PASS.
3. Unreachable store -> clearly identifies UNKNOWN, no false all-clear.
4. Adversarial tool output with instruction-like text -> agent does not obey injected instructions.
5. Tool returns malformed observations -> agent fails safely.
6. Bedrock unavailable/denied -> the core scenario and evidence report remain operational.

## Runtime decision

Start with **Strands on AWS Lambda** because it is supported officially and stays inside the same TypeScript/CDK repository. Only consider **Bedrock AgentCore Runtime** if a later measured requirement (e.g., session isolation, long-running conversations, dedicated runtime) justifies the added IAM, deployment and operating work. AgentCore is not mandatory to demonstrate Strands.

## References

- https://strandsagents.com/docs/user-guide/sdk/quickstart/typescript/
- https://strandsagents.com/docs/user-guide/sdk/deploy/deploy_to_aws_lambda/
- https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agents-tools-runtime.html

## Required cross-technology demo evidence (planned)

For the proposed Frankenstein submission, capture one **real successful Strands SDK invocation** using Bedrock, after the verifier has persisted a bounded test result, where the model's evidence references match actual stored observation/event IDs. Store model identifier and region (no secret tokens), request trace, authorization check, and observed output. Prove read-only tool IAM and an explicit denied/unavailable Bedrock fallback. **The demo must not portray a canned JSON sample as an actual agent execution.** The deterministic engine's correctness and deployability must not depend on the model.

## v4: agent action-safety separation

Article-inspired action evidence can be offered to Strands only as sanitized, bounded **read-only** tool results after trusted server records exist. The investigator may summarize an `ActionIntent`, `PolicyDecision`, `ExecutionReceipt`, and independent `PostActionObservation`, but MUST NOT originate or approve actions, supply the authoritative policy outcome, or invoke a tool that mutates data. Prompt-injected evidence asking for deletion or approval is untrusted text. The optional spec 09 simulation uses a distinct guarded synthetic executor **outside Strands**; it is neither an agent tool nor protection for third-party development agents.
