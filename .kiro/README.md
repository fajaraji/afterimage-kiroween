# Kiro configuration

These are repository-scoped Kiro artifacts, intentionally committed to satisfy Kiroween rules. Paths and configuration align with Kiro public docs as of Nov 7, 2026.

- `steering/`: always, fileMatch, and manual context. No silent broad auto-inclusion.
- `specs/`: nine specs (01, 02, 03, 05, 06 active; 04, 07, 08, 09 superseded), each with `requirements.md`, `design.md`, `tasks.md`; unchecked tasks mean **not implemented**.
- `agents/`: optional agents (no trust bypass/auto-approved tools).
- `skills/`: focused on-demand workflows.
- `hooks/`: quick local validation on save, **IDE and CLI**, not Kiro Web.
- `settings/mcp.json`: deliberately empty. Add third-party servers only after trust review.

IMPORTANT: Do not add `.kiro/` to `.gitignore` and do not remove the directory to reduce repo size. See `docs/KIRO-WORKFLOW.md`.

## Frankenstein 2026 category overlay (deferred: the chosen category is Costume Contest)

- `.kiro/steering/22-frankenstein.md`: product/category priorities, always included.
- `.kiro/specs/08-frankenstein-integration/`: acceptance criteria proving the mixed-tech user journey.
- `.kiro/skills/frankenstein-demo-audit/`: on-demand honest proof-audit skill.
- Docs: `docs/FRANKENSTEIN-STRATEGY.md`, `docs/FRANKENSTEIN-EVIDENCE-MATRIX.md`.

Strands is the **product's runtime investigator**; Kiro development agents are **coding assistants**. Neither is itself a Kiro Crew app. Kiro Web does not run local event-driven hooks; use IDE/CLI for those checks.

## v4 — additional scoped materials

- `.kiro/steering/23-agent-action-safety.md` — no pivot into unsafe or general-purpose agent interception.
- `.kiro/specs/09-consequential-action-safety/` — P1 forensic evidence and independent checks; P2 optional synthetic-only guard demonstration.
- `.kiro/skills/agent-action-threat-review/` — read-only review instructions.
- `fixtures/agent-actions/` — **illustrative JSON examples, not runnable proof or cloud evidence**.
- `docs/AGENT-SAFETY-FINDINGS.md`, `docs/AGENT-ACTION-FORENSICS.md`, `docs/AGENT-ACTION-THREAT-MODEL.md`, and ADR-0006.

Nine specs total in v4. Do not treat the optional agent-action spec as blocking the existing P0 or category demo.
