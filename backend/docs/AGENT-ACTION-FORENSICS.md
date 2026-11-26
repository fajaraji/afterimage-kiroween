# Consequential-action forensics and independent post-action checks

**Status: design/specification, not implemented.** This document defines what must be logged once real scenario actions exist. Existing P0 deletion tests remain first priority. See spec 09.

## Evidence chain (ordered, append-only at application level)

| Record | Minimum fields | Who creates it | What it proves / does NOT prove |
|---|---|---|---|
| `ActionIntent` | `runId`, `intentId`, actor kind, operation enum, synthetic target ID, canonical argument digest, creation timestamp | Scenario runner / simulated agent front-end | Proposed operation; not proof of execution or authorization |
| `PolicyDecision` | `decisionId`, `intentId`, `ALLOW/DENY/REQUIRE_APPROVAL`, rule/version, reason, evaluation time | Trusted server-side guard | Authoritative decision **at that instant**; not proof the operation happened |
| `ApprovalRecord` (P2 only) | approver identity, exact intent+payload digest, target run, expiry, nonce, consumed flag | Authenticated human workflow | Human authorization **for one specific intent**; model text can never substitute |
| `ExecutionReceipt` | `executionId`, `intentId`, adapter, status, provider request ID, timestamp, bounded error | Allowlisted executor | Attempted/result as reported by adapter; not proof of after-state |
| `PostActionObservation` | `observationId`, `executionId`, store ID, directly queried state `PRESENT/ABSENT/UNKNOWN`, observed time, error code | Separate read-only verifier | Scoped observed state at a point in time; not permanent or universal erasure |
| `Investigation` | evidence IDs, factual vs hypothesis, agent model/status | Read-only Strands layer | Advisory explanation; never supplies policy decision or PASS/FAIL |

All records carry an isolated synthetic `runId` and stable IDs. Redact payload bodies, subject names, credentials, ARNs, secret keys and request headers in public reports; keep a minimal allowlisted attribute set. Use versioned schemas and stable serializations; logical sequence numbers are replay-stable, wall-clock timestamps are not.

## Policy gate boundaries

- Treat **any** tool-request text, model output, event payload, or log as untrusted input. A request cannot choose its own authorization decision, verification result, account, arbitrary ARN, SQL, shell command, path or network endpoint.
- Deny by default, then allow **only** named synthetic-run operations within a server-owned resource allowlist. For P2 use `READ_SYNTHETIC_RECORD`, `DELETE_SYNTHETIC_RECORD`, `DROP_SYNTHETIC_TABLE_PROPOSAL` as illustrative intent enums; **never implement a real table-drop executor**.
- For a sensitive but explicitly permitted synthetic action, require a human approval with exact action+arguments hash, `runId`, expiry, nonce and one-time consumption, and re-evaluate policy immediately before execution.
- Separate *proposal*, *policy decision*, *execution*, and *verification* into distinct interfaces. A `DENY` must cause no mutation. The independent verifier still queries the relevant resource after denial; if it cannot query, report `UNKNOWN` rather than "safe".
- Two concurrent requests cannot both consume one authorization. Design the approval transition as a conditional/atomic operation and test retries/idempotency.
- Lambda execution role and data adapters provide an independent enforcement boundary. A Strands agent has **no write permissions** and no direct adapter invocation even if prompted to perform one.

## Observability vs auditability

Use structured CloudWatch logs with correlation IDs and bounded retention. These are diagnostic logs, not tamper-proof or complete forensic records. If later implementing durable evidence, define an integrity mechanism, authorized retention and access policies explicitly; an arbitrary SHA-256 column or hash chain alone does not establish audit immutability.

## Independent verification contract

A `PASS` is allowed only when all configured required store observations are directly obtained and the relevant invariant is satisfied. `FAIL` for observed contrary state; `UNKNOWN` when required evidence is missing or inconsistent. Verification happens **after** the operation, including denied proposals when asserting no mutation. `ExecutionReceipt.status === 'SUCCEEDED'` is **not** sufficient for `PASS`.

## Sample records

`fixtures/agent-actions/` contains non-executable example event envelopes. They are **design fixtures**, not evidence that the gateway, cloud integrations, or production protection are implemented.
