# Kiro IDE: AWS-first development workflow

Read `.kiro/specs/06-aws-serverless/`, `.kiro/specs/07-strands-investigator/`, and `.kiro/specs/08-frankenstein-integration/`. Development claims are evidence-based; prepared files are not proof that a feature was used.

## Recommended Powers (install selectively in Kiro IDE)

- **Strands SDK** — agent SDK guidance and tool patterns.
- **AWS infrastructure as code / CloudFormation and CDK** — secure infrastructure best practices and review of `cdk diff`.
- **AWS Amplify** — React hosting/deploy previews.
- **AWS Observability** — CloudWatch diagnosis after a stack is live.
- **AWS Serverless** — service selection, Step Functions and Lambda guidance if available in your Power registry.

Use the Kiro Powers panel and install only the tools needed in the current phase. Kiro Powers activate context selectively. Don't install dozens of overlapping MCP servers.

## MCP

Optional AWS MCP server: https://docs.aws.amazon.com/agent-toolkit/latest/userguide/getting-started-aws-mcp-server.html . Configure only after reviewing its permissions and approving credential scope. Prefer read-only documentation/inspection first. Never auto-approve deployment, resource deletion, IAM modification or billing changes. Do NOT include AWS access keys in workspace configuration.

## Kiro implementation order

1. Validate the unmodified shell + `npm install` locally; record logs.
2. Reconcile existing `.kiro/specs/01-*` through `05-*` against AWS target docs. Do not implement old SQLite target from original spec.
3. Complete AWS CDK spec `06` in a small reviewed change with sandbox account and integration tests; no blind cloud deploy.
4. Implement server-neutral deterministic engine and AWS data adapters; validate transactions and missing-observation UNKNOWN behavior.
5. Build UI/graph and Step Functions/SQS replay, prove real unsafe failure vs protected pass on AWS.
6. Integrate Strands spec `07` only when deterministic verification already works. Agent is optional at runtime and cannot change verdict.
7. Use Kiro spec correctness/PBT (where IDE supports it) to test event duplicates, generation barriers, unknown stores and race scenarios. Record counterexamples.
8. Use targeted Kiro hooks for local validation (not silent resource mutation) and maintain `docs/BUILD_LOG.md` with real evidence.
9. Run Kiro-assisted security and architecture audit before deployment, then record AWS resources, actual tests, Kiro changes and results.

## First updated Kiro prompt

```text
This is Afterimage for Kiroween 2026. Read AGENTS.md, START-HERE.md, docs/AWS-ARCHITECTURE.md,
docs/STRANDS-AGENT-DESIGN.md, docs/AWS-COST-AND-SAFETY.md,
.kiro/steering/20-aws-first.md, .kiro/specs/06-aws-serverless/*,
and .kiro/specs/07-strands-investigator/*. Begin with a contradiction audit of the old
SQLite/Fastify target versus the AWS-first architecture. Preserve the working
local React/Fastify shell as local-only development tooling. Do NOT deploy AWS
resources, change IAM, or install external tools without explicit approval.
Implement the smallest testable CDK scaffold and deterministic AWS data-store
interfaces, then propose exact acceptance tests. Use Kiro spec workflow, one
task at a time. Never let a Strands agent decide PASS/FAIL/UNKNOWN or mutate
data. Never claim production privacy compliance.
```

## Product vs Kiro agents

Kiro's *development agents* exist only to help build and review code. Strands' *product investigator agent* is runtime functionality inside Afterimage. They have distinct permissions and histories. The Strands feature does **not** qualify as a separate Kiro Crew bonus app without actually building the required separate Crew application.

## Frankenstein category development overlay

Read `docs/FRANKENSTEIN-STRATEGY.md` and the spec 08 requirements/design/tasks before changing priorities. Stage work **deterministic AWS FAIL/PASS/UNKNOWN → evidence-linked Ghost Graph → read-only Strands explanation with valid evidence IDs → single demonstrable joined user journey**. Test each trust boundary in Kiro and record real failure/fix evidence in `docs/BUILD_LOG.md`. Kiro custom development agents are not Strands runtime agents and do not qualify for the separate Kiro Crew prize.

### Suggested updated first prompt

```text
Read AGENTS.md, START-HERE.md, docs/AWS-ARCHITECTURE.md,
docs/FRANKENSTEIN-STRATEGY.md, docs/FRANKENSTEIN-EVIDENCE-MATRIX.md,
docs/STRANDS-AGENT-DESIGN.md, docs/AWS-COST-AND-SAFETY.md,
and specs 06, 07, and 08 under .kiro/specs/.
We are targeting Kiroween 2026 FRANKENSTEIN, not Costume Contest.
Audit contradictions in the existing specs, preserving strict separation between
AWS fault injection, deterministic privacy-verdict evaluation, read-only Strands
analysis, and visualization. Recommend the smallest implementation order.
Do not write a generic multi-agent app or over-engineer AWS usage.
Never use LLM output as verification truth, and never claim deployed features.
Ask for explicit approval before cloud deployment, IAM, Bedrock charges,
installing MCP servers, or adding billable integrations.
Begin with one spec task and acceptance tests. Capture real evidence in the
build log and leave incomplete tasks unchecked.
```

## v4 optional implementation workflow — after P0

Spec 09 adds a narrowly scoped forensic action chain (P1) and optional synthetic agent proposal denial (P2). Read `docs/AGENT-SAFETY-FINDINGS.md` and `.kiro/steering/23-agent-action-safety.md`; use the `agent-action-threat-review` skill on any implementation. Implement P1 only once AWS delete/replay/verify has real evidence. Keep the Nov 27 Strands integration gate; **do not** introduce write-capable Strands tools or unrestricted Powers/MCP to try to implement agent protection. Kiro Web still does not run IDE/CLI save hooks.

### Suggested Kiro instruction (no deployment authorization)

```text
Read ADR-0006, docs/AGENT-ACTION-FORENSICS.md, docs/AGENT-ACTION-THREAT-MODEL.md,
and .kiro/specs/09-consequential-action-safety/{requirements,design,tasks}.md.
Audit current evidence contracts for the smallest compatible P1 addition: intent, trusted
policy decision, execution receipt, independent store read with UNKNOWN fallback.
Propose tests first. The existing resurrection lab and read-only Strands investigator
must not be redesigned as a general AI agent firewall. Do not add production connectors,
arbitrary tools, shell/SQL/AWS admin actions, or billable services. Ask before any cloud/IAM
change. Mark spec tasks complete only when actually executed against bounded test stores.
```
