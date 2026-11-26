# What the AI-agent data-loss article changes (v4)

**Source discussed:** https://medium.com/@chenyuan19920509/ten-ai-agents-destroyed-production-data-not-one-vendor-published-a-postmortem-8907211a68d2

**Evidence caution:** This article is an argument and a collection of reported incidents, not a verified root-cause investigation of every case. Do not repeat its headline numbers, vendor blame, or claimed absence of postmortems as independently established facts. Verify any specific incident through primary incident reports and statements from all relevant parties before using it in a demo or Devpost copy.

## Separate the two failure classes

1. **Existing Afterimage P0 — unintended data resurrection:** a permitted deletion occurs, but a delayed message, incomplete propagation, or restore recreates/resurfaces a copy. The deterministic tester makes an *observed*, *scoped* assertion about synthetic resources.
2. **Adjacent problem — unintended agent destruction:** a tool-using AI proposes or executes a destructive change outside the user's intended scope. This needs pre-execution authorization, constrained credentials, execution evidence, and independent post-execution observation. Our P0 is **not** a protective gateway for Kiro, Cursor, Claude Code, arbitrary MCP tools, or real production accounts.

## What we should adopt

| Finding | Adopt in this release? | Meaning |
|---|---|---|
| Attributable action/decision/receipt chain | **P1**, after P0 | Correlate scenario or agent proposal, policy, receipt, actual store observation by `runId` and stable evidence IDs |
| Read-after-write and read-after-denial verification | **P1** | Query store independently and report present/absent/unknown, not tool success or model opinion |
| Bounded authority and blast radius | **Immediately**, cross-cutting | Synthetic-only resource allowlists, isolate runs, least-privilege IAM, no broad arbitrary command gateway |
| Explicit human approval of exceptional actions | **P2 controlled simulation** | Approval must be explicit, bound to exact action/arguments, expiring, one-use and revalidated; no autoapproval by LLM |
| General external agent interception / production safety product | **Out of scope** | Would require integrations, real identity, enforcement and comprehensive security reviews |

## Success measure

The v4 revision is useful if a judge can distinguish (a) a **real** unsafe data-resurrection failure and protected PASS, from (b) a clearly **optional synthetic agent-action** case that is denied at a controlled execution boundary and verified independently. Neither a scary UI nor an AI warning counts as enforcement.

**No new AWS service is required** to test these ideas. Use the existing Step Functions/Lambda/SQS/DynamoDB/S3 boundary and a single read-only Strands investigator; any new service needs explicit justification and approval.
