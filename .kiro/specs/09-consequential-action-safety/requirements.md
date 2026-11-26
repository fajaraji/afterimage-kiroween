# Spec 09 — Consequential action forensics (P1) and optional synthetic guard demo (P2)

**Status:** Not implemented. Dependencies: specs 01–03 and 06 for real store evidence; spec 08 integrated demo takes precedence over optional P2. This spec adds no production agent interception or automatic cost.

## P1 — forensic evidence expansion

**ACTION-1:** WHEN an Afterimage scenario proposes a consequential operation, THE SYSTEM SHALL assign an immutable intent ID, actor/source kind, synthetic run/resource scope, allowlisted operation, canonical arguments digest, and creation timestamp.

**ACTION-2:** BEFORE an allowed synthetic mutation is executed, THE SYSTEM SHALL record the trusted server-side policy decision (decision ID, rule/version, ALLOW/DENY/REQUIRE_APPROVAL, reason) and SHALL deny requests outside the fixed run-bound allowlist.

**ACTION-3:** AFTER an operation is attempted or denied, THE SYSTEM SHALL record a bounded execution receipt or explicit `NOT_EXECUTED` state, and SHALL link the record to the corresponding run/event evidence IDs without including secrets or raw personal data.

**ACTION-4:** AFTER an action outcome is recorded, THE SYSTEM SHALL independently query every relevant configured store for the claimed state, and SHALL report `UNKNOWN` for any store it cannot verify. No model or executor receipt may provide an authoritative PASS.

**ACTION-5:** WHEN an investigator or user views an action chain, THE SYSTEM SHALL distinguish requested action, server decision, adapter receipt, independently verified observation, and agent hypothesis with accessible text and stable IDs.

## P2 — optional controlled agent action demonstration

**ACTION-6:** WHEN an untrusted simulated agent proposes a destructive operation such as `DROP_SYNTHETIC_TABLE_PROPOSAL`, THE SYSTEM SHALL deny it at a server-owned allowlisted gateway and SHALL NOT provide any executor capable of running the destructive operation.

**ACTION-7:** WHEN a synthetic sensitive operation requires manual approval, THE SYSTEM SHALL only authorize it after an authenticated human supplies approval bound to exact intent/run/payload digest, unexpired nonce, and one-time conditional consumption; re-evaluate before execution. If this full mechanism is unavailable, deny instead.

**ACTION-8:** WHEN a proposal is denied, THE SYSTEM SHALL independently verify that the scoped synthetic target has not changed, recording `UNKNOWN` if observation fails rather than claiming safe prevention.

**ACTION-9:** IF the Strands model tries to approve, escalate, execute, or alter a policy result, THE SYSTEM SHALL reject that authority and keep the verifier and policy decisions unchanged.

## Non-goals and test scope

No production datasets, arbitrary agent interception, arbitrary MCP or terminal tools, automatic restore, AWS admin access, or legal compliance claims. See `docs/AGENT-ACTION-THREAT-MODEL.md`.

Acceptance: P1 evidence-chain continuity, no receipts-as-verdict, UNKNOWN on verifier failure, stable redacted IDs; P2 optional negative tests for blocked destructive proposal, replayed approval and tampered arguments, safe no-mutation verification, and Bedrock-denied fallback. Do not mark P2 checked without a real bounded gateway and observation tests.
