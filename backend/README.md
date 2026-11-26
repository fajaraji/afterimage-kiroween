# Afterimage backend
> **Repository layout:** This folder is the backend of [Afterimage](../README.md). The frontend is the Next.js app at the repository root. Kiro's specs, steering, skills, agents and hook live in the root [`.kiro/`](../.kiro/) folder. Run the backend commands below from this `backend/` folder.
>
> **Direction:** the hackathon category is **Costume Contest** ([ADR-0007](docs/DECISIONS/0007-costume-contest-category.md)). The backend serves the frontend's [browser API](../docs/backend-contract.md) (`/cases`) and follows [`../docs/backend-handoff.md`](../docs/backend-handoff.md). The API sets no cookies and stores no visitor identifiers ([ADR-0008](docs/DECISIONS/0008-no-cookies-reset-on-reload.md)). The earlier Frankenstein plan was removed (ADR-0007).
>
> **Status: development scaffold, not a finished or deployed product.** Nothing is deployed to AWS.

Afterimage is a **synthetic-data-only demonstration** that an erased customer record can return from a retained backup, and that only a fresh read of the store proves it. It is **not** a production privacy-compliance platform or a universal deletion guarantee.

**Submission:** December 4, 2026, 2:00 PM PST. New work must be built during the permitted submission period; disclose pre-existing code and comply with library licenses. See [`docs/HACKATHON.md`](docs/HACKATHON.md).

## Start here
1. Read [`START-HERE.md`](START-HERE.md).
2. Install Node.js 22.13+ and Kiro IDE. Open the **repository root** (the folder that contains `.kiro/`).
3. Run `npm ci` in this folder.
4. Start the **local API dev shell** with the `dev` script (`npm run dev`) at `http://localhost:8787` (health at `/api/health`). It is not the AWS runtime. The `/cases` routes are not built yet (spec 06 task 1). Run the frontend from the repository root with its own `dev` script (port 3000).
5. Run `npm run validate:starter`, `npm run typecheck` and `npm test`.
6. In Kiro, work through the active specs one task at a time: 01, 06 (tasks 1–2), 02, 03, 06 (the rest), 05. Approve deployment and IAM actions explicitly.

## Active specs (`../.kiro/specs/`)
| Spec | Topic |
|---|---|
| 01-foundation | Four stores, finding mapping, `CaseFile` contract |
| 02-deletion-replay | Case commands and verified restore (folder name kept for history) |
| 03-verification | Independent reads and evidence |
| 05-reporting-submission | Certificate evidence and submission package |
| 06-aws-serverless | AWS runtime: CDK, API, DynamoDB, S3, limits |

Spec number 04 is unused (ADR-0007).

## Repository overview
- `apps/api/`: local Fastify dev shell; the deployed API will be Lambda behind API Gateway.
- `packages/contracts/`, `packages/engine/`, `packages/aws-adapters/`: contracts, pure logic, DynamoDB and S3 adapters.
- `infra/`: AWS CDK app (pending spec 06).
- `fixtures/`: empty; copy test fixtures from `../lib/case.ts` (`startDemo`, `runDemo`).
- `docs/`: `ARCHITECTURE`, `HACKATHON`, `DEMO`, `ACCEPTANCE-MATRIX`, `TEST-PLAN`, `ROADMAP`, `RISK-REGISTER`, `SECURITY-PRIVACY`, `AWS-COST-AND-SAFETY`, `FRONTEND-REQUESTS`, `KIRO-*`, `BUILD_LOG` and `DECISIONS/0001` to `0003`, `0007`, `0008`.

## Scripts
```bash
npm ci
npm run dev               # local API dev shell (Ctrl+C to stop)
npm run typecheck
npm test
npm run validate:starter  # workspace integrity checks
npm run audit:submission  # reports missing submission items
```

## Limitations and evidence policy
- Everything is synthetic; never import real customer information.
- A finding is a bounded observation at a specific time and scope, not permanent deletion everywhere.
- A failed or unreachable read is `unreachable`, never `clear`. A `return` event needs a new read that matches the backup.
- Record real Kiro work and test results in `docs/BUILD_LOG.md`; do not present the scaffold as a finished product.
- No AWS deployment, IAM change or spend without the owner's approval.

MIT licensed. See [`LICENSE`](../LICENSE). For security issues follow [`SECURITY.md`](SECURITY.md).
