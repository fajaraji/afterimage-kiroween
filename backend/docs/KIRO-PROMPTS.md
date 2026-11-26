# Ready-to-paste Kiro prompts

## Start implementation / reconciliation

```text
Read AGENTS.md, docs/PRD.md, docs/DOMAIN-MODEL.md, docs/SECURITY-PRIVACY.md and
.kiro/specs/01-foundation/{requirements,design,tasks}.md. Analyze for conflicts,
propose no more than three corrections and get my approval before editing the
spec. Then execute only task 1 in that spec. Keep changes minimal, add tests,
and report observed pass/fail evidence. Do not mark a task done without tests.
```

## End-to-end stale-event task

```text
Work from spec 02. Implement the smallest deterministic unsafe stale-event
resurrection case using actual store writes. First add a test that fails
because the unsafe consumer recreates a deleted record; then implement the
protected consumer with an atomic deletion barrier. Preserve the failing
counterexample and show both independent verification outcomes. Avoid UI work.
```

## Security review agent

```text
Switch to the privacy-reviewer custom agent. Check the current diff for unsafe
external IO, unknown-as-pass, missing bounds, arbitrary paths/SQL, accidental
real PII, mutable state crossing runs, and misleading deletion guarantees.
Produce actionable findings with severity; do not silently rewrite modules.
```

## Design review

```text
Use the UI design steering and spec 04. Design a keyboard-accessible evidence
panel and timeline where every visual state maps to actual observations.
Support reduced motion, readable labels and error cases. Start with the
non-animated evidence table; layer motion only after correctness.
```

## Before hackathon submission

```text
Use the submission-audit skill and docs/HACKATHON.md. Audit actual deployed
URL, public GitHub repo/LICENSE, committed .kiro directory, functioning 3-minute
YouTube demo, real Kiro usage evidence and unsupported product claims. Return
an honest PASS/MISSING/BLOCKED checklist; never invent URLs or outcomes.
```

## Frankenstein integrated-readiness prompt

```text
Read docs/FRANKENSTEIN-STRATEGY.md, docs/FRANKENSTEIN-EVIDENCE-MATRIX.md,
and .kiro/specs/08-frankenstein-integration/{requirements,design,tasks}.md.
Validate a real end-to-end user journey: AWS fault injection produces an observed
FAIL; protected replay produces a PASS; a read-only Strands agent analyzes the
persisted evidence and cites valid IDs; Ghost Graph highlights the same event
chain; disabling Bedrock leaves the core usable. Do not fabricate any AWS logs,
AI outputs or screenshots. Produce a factual PASS/UNKNOWN/BLOCKED audit and
exact missing tasks. Require explicit approval before any deployment or spend.
```

## v4 — action-evidence review after the core works

```text
Use agent-action-threat-review and spec 09 to audit whether each consequential synthetic
operation is traceable across server-owned intent/policy/receipt and independently
observed after-state. Test fake success receipts, missing verifier evidence, denial
no-mutation observation, and injected model claims. Keep Strands read-only and defer
any optional agent-proposal gateway until the entire AWS + Strands + UI Frankenstein
demo works. Never implement arbitrary production deletion tools.
```
