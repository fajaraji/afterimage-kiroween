---
inclusion: always
---
# Repository layout
- The repository root is the **frontend**: a Next.js static export (`app/`, `components/`, `lib/`, `public/`, `tests/`, root `package.json`) deployed on Vercel. A teammate owns it and builds it with Codex. Leave frontend files unchanged during backend tasks unless the user asks for a frontend change. The one approved exception is spec 06 task 11 (reset on reload in `lib/gateway.ts`), which the frontend owner reviews in the PR.
- `backend/` is the **backend**: an npm workspace (`apps/api`, `packages/*`) plus `infra/`, `fixtures/`, `scripts/` and `docs/`. Run backend npm scripts from `backend/`. Frontend scripts run from the repository root.
- Kiro files stay in the root `.kiro/` (Kiroween rule). Paths written in specs, skills, steering prose and backend docs, such as `docs/…`, `apps/…`, `packages/…`, `fixtures/…`, `infra/…`, `scripts/…` and `AGENTS.md`, are relative to `backend/`. The root `docs/` folder holds the frontend team's backend handoff.
- The frontend defines the browser API the backend must serve: `docs/backend-contract.md`, the `CaseFile` type and validator in `lib/case.ts`, and the HTTP adapter in `lib/gateway.ts`. Acceptance scenarios and the backend tickets (GitHub issues #20 to #24) are in `docs/backend-handoff.md`, written in Indonesian. Backend docs that describe `/api/runs`, Step Functions runs or a Vite/Amplify frontend predate the merge and are superseded by this contract; active specs follow it.
- The Vite placeholder `backend/apps/web` was removed. `11-frontend.md` now matches the Next.js frontend files at the repo root.
- Hackathon category is Costume Contest (see `00-product.md`).
