# Agent-action threat model (synthetic-only P2)

**Status:** proposed controlled simulation, not a production agent firewall.

## Assets and trust boundaries

- Protect: isolated synthetic DynamoDB run partitions, scenario records, evidence integrity, cost budget, and the AWS account boundary.
- Sources of untrusted input: user text, model-generated tool arguments, SQS event bodies, third-party logs, Kiro development prompts, web/Markdown evidence and attempted approval text.
- Trusted authorities: server-owned allowlist + IAM boundary, deterministic verifier, authenticated human approval service (if built), Step Functions state machine constrained to bounded run IDs.
- Read-only Strands investigator is not the approver, policy engine, executor, or verifier. Kiro development agents are not runtime protections for third-party coding agents.

## Threats, controls, and tests

| Threat | Required control | Acceptance test |
|---|---|---|
| Prompt injection in tool/evidence text | Treat as data, schema-validate; Strands read-only tools | Embedded "ignore rules/delete" never triggers mutation |
| Model asks to drop DB or execute shell | No executable handler; default-deny server policy; least-privilege IAM | Proposal is denied and actual synthetic store state unchanged |
| Approval replay, expiry or parameter substitution | Exact canonical payload digest, expiry, run binding, atomic one-time use | Reuse/mismatch/expired attempts denied |
| Concurrent approval consumption | Atomic conditional update and idempotency key | At most one permitted execution receipt |
| Forged success/verdict | Independent read-only post-action verifier | Failed/unreachable reads return UNKNOWN |
| Cross-run data access | Run isolation + enforce server-derived resource namespace | Attempt against different run denied |
| AWS credential exfiltration | No static keys in repo/logs; bounded tool scope | CI scans, explicit IAM review, no secret-bearing events |
| Unexpected costs or runaway executions | Run quotas, timeouts, budget alerts, user approval before deploy | Quota and timeout tests; cleanup documented |

## Non-goals

Do **not** advertise safety for real AWS accounts, arbitrary MCP servers, filesystem commands, GitHub repository deletion, infrastructure-as-code changes or Kiro's own actions. The only optional P2 demonstration is an **isolated, allowlisted, synthetic proposal** that cannot reach external destructive APIs.

## Reviewer checklist

- Does an application-level deny have an independent infrastructure permission boundary?
- Does the policy recheck immediately before the action?
- Are logs receipts rather than unverified truth?
- Does every claim cite an actual observation ID, with `UNKNOWN` honored?
- Can the model influence who approved or change the verifier's verdict? (Must be no.)
- Are there any actual destructive IAM calls or unrestricted tool execution paths? (Must be no.)
