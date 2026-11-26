> **2026-11-07 update:** For cloud target, follow `docs/KIRO-AWS-WORKFLOW.md`, `docs/AWS-ARCHITECTURE.md`, specs 06/07, and ADR-0004. Original local setup remains a dev shell only.

# Recommended Kiro IDE / Web workflow

This repository provides Kiro-specific artifacts verified against the current public docs. **Not every feature works in every surface**.

## 1. Use specs as the implementation authority
- Open `.kiro/specs/01-foundation/requirements.md`; use IDE **Analyze Requirements** (not supported on Web) to identify gaps.
- Review `design.md`; review `tasks.md` before agent execution.
- Do one task, inspect diffs and tests, then check it off. Run parallel tasks only when Kiro establishes independence.
- Create **Bugfix Specs** for significant regressions instead of silently patching behavior.
- Use Quick Spec for trivial polish tasks after P0 is stable.

## 2. Steering with minimal baseline context
- Always-on: product guardrails, privacy, technical conventions.
- fileMatch: API/schema and frontend design guidance.
- manual: `#submission-evidence` only during demo/submission work.
- `AGENTS.md` also loaded automatically in supported Kiro surfaces.
- Do not generate duplicate foundation docs without reconciling them with existing steering.

## 3. Project agents and skills
- Project agent configs in `.kiro/agents/` can be selected in IDE/CLI. Web can use project agents as sub-agents but not as the main Web session agent.
- Skills under `.kiro/skills/` provide focused scenario-authoring, security review and demo-audit workflows.
- Agents do not auto-approve shell/network tools in this starter.

## 4. Hooks
- `.kiro/hooks/workspace-check.json`: `PostFileSave` validation on source saves (IDE / CLI V3 only).
- Current Kiro Web sessions **do not execute hooks**; CI is the cross-surface fallback.
- Keep hooks fast and deterministic. Disable locally if they cause excessive latency; do not falsify a claim that they were run.

## 5. PBT and testing
- Kiro IDE Correctness can derive property-based tests from EARS requirements; currently IDE-only.
- Keep portable Vitest/fast-check tests in source after implementation; use CI even when Kiro cloud automation isn't running.
- In build log capture failing counterexample, fix, and passing run **with real evidence**.

## 6. MCP and Powers
- Workspace `.kiro/settings/mcp.json` intentionally contains no active MCP servers. Opt in only when justified.
- Suggested **optional** power: Postman for API contract exploration/testing, if actually useful and reviewed; Figma power only if working with a Figma design.
- Check registry/provider legitimacy, permissions, cost, sensitive data exposure and account scope before installing. Avoid connecting to a live customer DB.
- Kiro Powers load capability on demand; a power is not automatically used merely because the repository mentions it.

## 7. Local vs Web
- **IDE:** full local agent workflow, hooks, IDE-only correctness/PBT, VS Code-like editing.
- **CLI:** agent and task workflow with local hooks depending on CLI version.
- **Web:** connect GitHub repo after initial local commit; useful for PR iterations and specs, but no local hook execution and no IDE-only PBT.
- The hackathon write-up must state which surfaces/features were **actually used**.

## 8. Recommended development prompts
See `docs/KIRO-PROMPTS.md`. Do not ask for one giant "build everything" step; iterate by acceptance criteria.
