> **Superseded:** this spec belongs to the earlier Frankenstein plan. The hackathon category is Costume Contest. Do not implement it unless the user reopens that scope.

# Spec 09 design — deliberately bounded

## Trusted source-of-truth boundaries

`ScenarioRunner` proposes `ActionIntent` (runID/actor/operation/target/argumentDigest) → `ServerPolicyGate` evaluates named allowed operations against a server-owned run scope → `AllowlistedExecutor` returns `ExecutionReceipt` for permitted synthetic operations only → `IndependentVerifier` queries actual configured store states and saves `PostActionObservation` → `EvidenceReporter` links stable IDs → optional read-only `StrandsInvestigator` explains the chain.

No model response can populate or override `PolicyDecision`, `ApprovalRecord`, `ExecutionReceipt` or `PostActionObservation` in the authoritative record. These are separate versioned contracts, not an LLM-generated JSON paragraph.

## P1 implementation sequence

1. Extend the existing event and report schema with an `actionTrace` of bounded, versioned metadata. Existing scenario runs remain readable through explicit version handling.
2. Normalize the event into an intent and identify actor (`scenario-runner`, `simulated-agent`, `human`) with only synthetic resource identifiers. Reject arbitrary ARN/path/SQL/shell fields.
3. Record pre/post observations from independent adapters rather than claims in the executor receipt. Denied actions still receive a post-denial observation when asserting lack of mutation.
4. Display a simple accessible evidence table *before* designing decorative animations. Keep logical ordering and wall-clock time separately.
5. Add limits: payload size, event count, retries, run TTL, audit retention and report redaction.

## P2 safety demo

Use `DROP_SYNTHETIC_TABLE_PROPOSAL` as a **proposal type only** with an unconditional `DENY` and no runnable handler. The separate demonstration guard service is invoked with a fixed synthetic run ID; AWS IAM and code-level resource allowlists prevent arbitrary mutations. Capture intent, decision, `NOT_EXECUTED`, and a real verifier read of the synthetic resource to establish whether anything changed. Failed verification yields `UNKNOWN`.

A future human-approved `DELETE_SYNTHETIC_RECORD` requires real authentication, action/payload/run-bound approval and atomic one-time consume; if these requirements aren't implemented, return `DENY` and do **not** build a fake green approval UI.

## Reference example and test plan

`fixtures/agent-actions/denied-destructive-proposal.json` and `fixtures/agent-actions/verification-unavailable.json` are **illustrative schema examples**, not test executions. Their format is defined by `fixtures/agent-actions/action-trace.schema.json`.

Negative tests: forged user `ALLOW`, forged model decision, changed payload after approval, replayed nonce, cross-run ID, oversized arguments, unknown target, denied proposal with no mutation, failure to verify, Strands asks to write, and no-op executor falsely claims success.

## Privacy / retention

No raw prompt bodies, customer profiles, AWS account identifiers, secrets or real resource ARNs in public reports. A CloudWatch log stream is useful for diagnosis but **does not by itself provide tamper-evident or complete postmortem evidence**.
