# Start here — first Kiro IDE session

> **Direction:** the category is **Costume Contest** (ADR-0007). The backend serves the frontend's `/cases` API and the story in `../docs/backend-handoff.md`. No cookies, no visitor identifiers (ADR-0008). The earlier Frankenstein plan was removed.

## 0. What exists and what does not
The repo has a Next.js frontend (teammate), a backend workspace with contracts, an in-memory engine, DynamoDB and S3 adapters with unit tests, and a Fastify health shell. The `/cases` API, the restore flow, the CDK app and any AWS deployment are **not built yet**. Do not claim the project works end to end.

## 1. Local setup (Windows PowerShell or macOS/Linux)
- Node.js 22.13+ and npm. Open the **repository root** in Kiro IDE (the folder with `.kiro/`).
- In `backend/`: `npm ci`, then `npm run validate:starter`, `npm run typecheck`, `npm test`.
- API dev shell: the `dev` script in `backend/` serves `http://localhost:8787/api/health`.
- Frontend: the `dev` script at the repository root serves port 3000 and runs in browser demo mode until `NEXT_PUBLIC_AFTERIMAGE_API_BASE` is set.
- Record real results in `docs/BUILD_LOG.md`.

## 2. First prompt to paste into Kiro
```text
Read backend/AGENTS.md, docs/backend-contract.md, docs/backend-handoff.md,
lib/case.ts, and .kiro/specs/01-foundation/{requirements,design,tasks}.md.
List any contradictions before writing code. Then do task 8 of spec 01 test-first.
Do not change frontend files. Do not check a task until its tests pass.
Ask before deploy, IAM changes, spend, new dependencies or MCP servers.
```

## 3. Execution order (one task at a time, review each diff)
1. `01-foundation` tasks 8–10: four stores, finding mapping, `CaseFile` contract.
2. `06-aws-serverless` tasks 1–2: local `/cases` API, connect the frontend locally.
3. `02-deletion-replay`: commands and verified restore.
4. `03-verification`: independent reads and evidence.
5. `06-aws-serverless` tasks 3–7: CDK synth (owner reviews the diff), AWS adapters, replica, limits.
6. `06-aws-serverless` tasks 8–10: deploy only after explicit approval, run the evaluation table, Vercel preview.
7. `05-reporting-submission`: evidence export, audit, video, submission.
Spec number 04 is unused. Spec 01 tasks 1–5 were done against the earlier three-store model; task 6 and 7 stay open.

## 4. Actions only you can do before submitting
- Keep the GitHub repo public with a license and root `.kiro/` committed.
- Keep real Kiro evidence (specs, tasks, test runs) in `docs/BUILD_LOG.md`.
- Deploy through CDK to a reviewed AWS account, set `NEXT_PUBLIC_AFTERIMAGE_API_BASE` on the Vercel preview, and test the judge URL in a fresh browser.
- Record a demo under 3 minutes (target 2:45) and publish it on YouTube.
- Complete the Devpost entry with the Costume Contest category and the Kiro write-up.
- Keep the app online until judging ends on January 29, 2027, and re-check dates on the official site.

See `docs/HACKATHON.md`, `docs/DEMO.md`, `docs/ROADMAP.md`, `docs/FRONTEND-REQUESTS.md`.

Run `npm run audit:submission` regularly. It lists what is still unverified and cannot confirm URLs or functionality. Kiro Web does not run local hooks, so validate in the IDE, CLI or CI.
