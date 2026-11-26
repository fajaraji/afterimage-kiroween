# Start here — first Kiro IDE session

> **v4:** Read `docs/AGENT-SAFETY-FINDINGS.md` and ADR-0006 before changing scope. Preserve P0 and Frankenstein integration; add P1 forensic action/post-action evidence once core works. Spec 09's P2 synthetic agent denial is strictly optional. **Do not** give Strands write tools or claim to protect arbitrary external coding agents.


## 0. What has been prepared versus what still needs development

This ZIP is a **planning + runnable UI/API scaffold**, not an implemented deletion test engine. Documentation, typed boundaries, executable starter checks, Kiro guidance, and reference fixtures are included. **Do not claim the project already works end-to-end.** Build the core with Kiro during the submission period.

## 1. Local setup (Windows PowerShell or macOS/Linux)

- Extract the ZIP before opening it in Kiro.
- Install Node.js 22+ and npm; `node --version`; `npm --version`.
- Open the **`afterimage-kiro-starter` directory** in Kiro IDE.
- In Kiro terminal: `npm install` (internet required), then `npm run dev`.
- API health is at `http://localhost:8787/api/health`. Run the frontend from the repository root (`npm run dev`, port 3000).
- Run `npm run validate:starter`, `npm run typecheck`, and `npm test`.
- Record the first successful clean install and smoke test in `docs/BUILD_LOG.md`.

If using Kiro Web, **first push this extracted folder to a new GitHub repository**, then connect the repo in Kiro Web. Kiro Web can consume steering/specs/agents/skills, but current Web sessions do **not execute local event-driven hooks**. Use the IDE or CLI for hooks and IDE-only spec correctness/PBT.

## 2. First prompt to paste into Kiro

**Frankenstein v3:** Start from the current prompt in `docs/KIRO-AWS-WORKFLOW.md` and read `docs/FRANKENSTEIN-STRATEGY.md`. The block below is retained as historical reference.

```text
Read AGENTS.md, START-HERE.md, docs/PRD.md, docs/ARCHITECTURE.md,
docs/SECURITY-PRIVACY.md, and .kiro/specs/01-foundation/{requirements,design,tasks}.md.
Review them for contradictions before writing code. Use the requirements-first
spec workflow, verify the repo starts locally, and propose the smallest ordered
implementation plan for spec 01. Do not change the frozen P0 scope. Do not mark
tasks complete unless their acceptance tests pass. Do not generate synthetic
PASS claims for unverified stores. Ask before installing external MCP servers,
changing auth or deployment, or introducing customer data.
```

## 3. Execution order

1. `.kiro/specs/01-foundation/` — synthetic fixture and adapter contracts; AWS real store work is in spec 06
2. `.kiro/specs/06-aws-serverless/` — CDK infrastructure, real AWS adapters and HTTP API (approval before deploy)
3. `.kiro/specs/02-deletion-replay/` — delete, held events, SQS unsafe/protected replay
4. `.kiro/specs/03-verification/` — independent AWS observations and PASS/FAIL/UNKNOWN
5. `.kiro/specs/04-investigation-ui/` — graph, timeline, accessible UI
6. `.kiro/specs/05-reporting-submission/`
7. `.kiro/specs/07-strands-investigator/` — read-only AI investigator after core P0 (targeted for a convincing Frankenstein demo)
8. `.kiro/specs/08-frankenstein-integration/` — prove the entire cross-technology story with real evidence and fallback

The reporting spec (05) covers report schemas, end-to-end tests, and demo documentation.

Run one task at a time and review the diff; do not execute all parallel tasks when they touch shared storage contracts.

## 4. Mandatory user actions before submitting

- Create a **new public GitHub repo**, choose a unique repo name, commit `package-lock.json` after installation.
- Maintain actual Kiro usage evidence and screenshots (do not fabricate).
- Deploy the actual backend through AWS CDK to reviewed AWS account and frontend preview on Vercel; test the judge URL in an incognito browser. Never publish unrestricted mutable AWS resources.
- Record **your own** functioning app demo under 3 minutes and publish it **publicly on YouTube**.
- Complete Devpost entry, category, technology/Kiro write-up, and open-source repo URL.
- Keep the judge-accessible app online until the official end of judging, January 29, 2027.
- Confirm current dates/rules on the official site before submitting.

See docs/KIRO-WORKFLOW.md, docs/HACKATHON.md, docs/DEMO.md, docs/ROADMAP.md.

## Updated category and first working session

The **chosen category is Costume Contest** (the Frankenstein plan is deferred). The Halloween design is still a functional UX layer, not the principal category claim. Read `docs/FRANKENSTEIN-STRATEGY.md` and `docs/FRANKENSTEIN-EVIDENCE-MATRIX.md` before prioritizing features. Execute `npm run audit:submission` regularly; it reports evidence that remains unverified, not a false submission success. If Kiro Web is used, local hooks are not executed there; validate in Kiro IDE/CLI or CI.

**Safe first milestone:** show real `FAIL` (unsafe stale upsert), real `PASS` (protected barrier), and `UNKNOWN` (unreachable store) before invoking Strands. Obtain approval before AWS CDK bootstrap/deploy, IAM changes, spending, or model access. Once P0 works, add a bounded read-only Strands narrative with evidence IDs; the verifier alone owns verdicts.

## v4 — safe Kiro follow-on prompt (after the core is working)

```text
Read docs/AGENT-SAFETY-FINDINGS.md, docs/AGENT-ACTION-FORENSICS.md,
docs/AGENT-ACTION-THREAT-MODEL.md, docs/DECISIONS/0006-consequential-agent-actions.md,
.kiro/steering/23-agent-action-safety.md, and spec 09.
Do NOT pivot away from the P0 resurrection lab or the Frankenstein Strands demo.
First audit the currently working AWS evidence model, propose the smallest P1 action
intent/policy/receipt/independent-observation contract, and write tests for UNKNOWN
on failed post-action reads. No external agent gateway, production resources,
arbitrary shell/SQL/AWS management tools, or model-issued approvals.
Ask approval before CDK, IAM, Bedrock or billable AWS changes.
Mark tasks done only after genuine executable tests and recorded evidence.
```
