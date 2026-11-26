# Kiro configuration

These are repository-scoped Kiro artifacts, intentionally committed to satisfy Kiroween rules. Paths and configuration align with Kiro public docs as of Nov 7, 2026.

- `steering/`: always, fileMatch, and manual context. No silent broad auto-inclusion.
- `specs/`: five specs (01, 02, 03, 05, 06; number 04 is unused), each with `requirements.md`, `design.md`, `tasks.md`; unchecked tasks mean **not implemented**.
- `agents/`: optional agents (no trust bypass/auto-approved tools).
- `skills/`: focused on-demand workflows.
- `hooks/`: quick local validation on save, **IDE and CLI**, not Kiro Web.
- `settings/mcp.json`: deliberately empty. Add third-party servers only after trust review.

IMPORTANT: Do not add `.kiro/` to `.gitignore` and do not remove the directory to reduce repo size. See `backend/docs/KIRO-WORKFLOW.md`.

## Category
The chosen category is **Costume Contest** (ADR-0007). Active steering: `00-product`, `01-guardrails`, `02-engineering`, `03-repo-layout`, `10-api-contracts`, `11-frontend`, `20-aws-first`.

Paths in specs and steering such as `docs/...` and `apps/...` are relative to `backend/`, except `docs/backend-contract.md` and `docs/backend-handoff.md`, which are in the repository root `docs/`.

No cookies and no visitor identifiers are stored by the backend (ADR-0008). Kiro Web does not run local event-driven hooks; use the IDE or CLI for those checks.
