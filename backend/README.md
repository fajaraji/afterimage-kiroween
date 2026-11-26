# Afterimage — The Data Resurrection Lab

> **Status: Kiro-ready AWS-first development scaffold, not a finished or deployed hackathon product.**
> *Don't just delete data. Make sure it stays dead.*

Afterimage is a **synthetic-data-only deletion resilience testing laboratory**. It intentionally reproduces stale-event resurrection and incomplete deletion, checks the **observed state** of participating test stores, and explains the failure through a haunted investigation UI. It is **not** a production privacy-compliance platform or a universal deletion guarantee.

**Kiroween 2026 primary category:** Frankenstein (proposed; select on Devpost). Haunted UI remains important for UX, but the submission must demonstrate meaningful integration between distributed fault injection, deterministic verification, read-only agentic reasoning, and visual forensics. **Submission:** December 4, 2026, 2:00 PM PST. New work must be built during the permitted submission period; disclose any pre-existing code and comply with library licenses. See [`docs/HACKATHON.md`](docs/HACKATHON.md).

## v4 — consequential-action forensics (scoped addition)

The earlier AI-agent data-loss discussion motivated **P1 action trace + independent post-action verification** and a **P2 optional synthetic-only destructive proposal denial demo**. **P0 remains deletion-resurrection testing.** Afterimage does **not** currently intercept or protect external AI coding agents, and this starter contains no implemented agent-action enforcement service. Read [`docs/AGENT-SAFETY-FINDINGS.md`](docs/AGENT-SAFETY-FINDINGS.md), [`docs/AGENT-ACTION-FORENSICS.md`](docs/AGENT-ACTION-FORENSICS.md), and spec `09-consequential-action-safety`. The sample action JSON is illustrative, never an AWS execution result.


## Start here

1. Read **[`START-HERE.md`](START-HERE.md)** before asking Kiro to implement features.
2. Install **Node.js 22+** and Kiro IDE, extract the archive, and **open this repository root** (the folder containing `.kiro/`).
3. Run `npm install` while online. This creates the first `package-lock.json`; commit it. Package installation could not be performed while this archive was generated (network unavailable).
4. Run `npm run dev` for the **local development shell** at `http://localhost:5173`; this is not the AWS runtime. The local health endpoint is at `http://localhost:8787/api/health`.
5. Run `npm run validate:starter`, `npm run typecheck`, and `npm test` after installing dependencies.
6. Read `docs/AWS-ARCHITECTURE.md` and `docs/KIRO-AWS-WORKFLOW.md`. In Kiro, reconcile specs 01–05 and implement the AWS target (spec 06), with a read-only Strands investigator (spec 07) as a *Frankenstein demo target once deterministic P0 is solid*, and integration proof (spec 08). Approve architecture/deployment actions explicitly. Implement one task at a time.

**Expected at extraction:** a minimal local React page and Fastify API health endpoint. **Not yet implemented:** AWS infrastructure, DynamoDB/S3 adapters, SQS replay, Lambda, Step Functions, Strands investigator, actual verifier, timeline, graph, reports. No fake passing results are shown.

## Repository overview

- `.kiro/steering/`: always-on and targeted coding rules
- `.kiro/specs/`: EARS requirements, design, actionable unchecked tasks
- `.kiro/agents/`: optional specialist agents with no broad permission auto-approval
- `.kiro/skills/`: on-demand reusable workflows
- `.kiro/hooks/`: small local validation hook (IDE/CLI only)
- `.kiro/settings/mcp.json`: empty/safe by default; optional tools are opt-in
- `apps/web/`: React/Vite app shell
- `apps/api/`: local-only Fastify dev shell; deployed API will be Lambda behind API Gateway
- `packages/contracts/`: shared typed contracts
- `packages/engine/`: pure domain engine placeholder to implement using Kiro
- `infra/`: target AWS CDK workspace (implementation deliberately pending spec 06)
- `docs/AWS-ARCHITECTURE.md`: authoritative serverless target design
- `docs/STRANDS-AGENT-DESIGN.md`: bounded, read-only Strands investigator; core remains agent-independent
- `docs/FRANKENSTEIN-STRATEGY.md`: why the technology combination matters, category gates and scope
- `docs/FRANKENSTEIN-EVIDENCE-MATRIX.md`: testable cross-technology claims
- `docs/DEVPOST-FRANKENSTEIN.md`: provisional pre-registration and submission copy
- `fixtures/`: synthetic test scenario descriptions
- `docs/`: PRD, engineering design, test plan, security, UI, demos, Kiro workflow, competitive analysis

## Scripts

```bash
npm install
npm run dev               # web + API (press Ctrl+C to stop)
npm run typecheck         # TypeScript projects; requires npm install
npm test                  # tests (existing scaffold smoke tests)
npm run validate:starter  # zero-dependency workspace integrity checks
npm run audit:submission  # warns about missing submission deliverables
```

## Limitations and evidence policy

- Everything shown is synthetic; never import real customer information.
- A successful assertion establishes a bounded observation **at a specific time and configured scope**, not permanent deletion everywhere.
- An unreachable or unconfigured store returns `UNKNOWN`, never an invented `PASS`.
- Core scenario tests will be implemented with Kiro after you open this repo; do not present the scaffold as a completed product.
- Preserve your Kiro spec history, hook usage, and before/after failing tests to substantiate hackathon development.

**Cloud warning:** No AWS deployment or full dependency installation has been performed. AWS account access, IAM changes and spending require your approval.

MIT licensed. See [`LICENSE`](LICENSE). For security issues follow [`SECURITY.md`](SECURITY.md).

## Frankenstein category pivot (v0.0.3)

The intended category is **Frankenstein**, not Costume Contest. Its claim is **not** that an app uses many AWS services. Rather, AWS serverless fault injection generates a real failure, a deterministic verifier proves the bounded result, a permission-constrained Strands + Bedrock investigator explains evidence, and the haunted UI makes that evidence inspectable. Each component has a distinct job and trust boundary.

**Submission gate:** Do not claim an integrated AI demonstration unless a successful end-to-end read-only Strands explanation, with verified evidence IDs and a safe Bedrock-offline fallback, is captured. If agent integration is unavailable before demo lock, the deterministic product can still function; reconsider the category narrative rather than claiming a capability that was not shown. See `docs/FRANKENSTEIN-STRATEGY.md`. No cloud infrastructure or real agent has been implemented in this starter.
