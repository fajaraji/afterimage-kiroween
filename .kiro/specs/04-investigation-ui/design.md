> **Superseded:** the teammate built the investigation UI in Next.js at the repo root (Codex). This spec no longer applies and is not a backend task.

# Design — 04 Investigation UI

Build scenario controls first, then an accessible evidence table. Only after it is accurate add Ghost Graph and Séance Timeline. Use React state fed by typed API responses. Graph nodes must have an equivalent list/table for screen readers; provide visible labels and text for all verdicts, keyboard-focus indicators, and prefers-reduced-motion. No auto-execution or unauthorized links. API health state remains separate from scenario success.

Suggested components: `ScenarioSelector`, `RunControls`, `EvidenceTable`, `GhostGraph`, `EventTimeline`, `ReportPanel`, `StatusNotice`. Use simple, narrow CSS custom properties until the fundamental interaction works.
