---
name: frankenstein-demo-audit
description: Verify the Kiroween Frankenstein cross-technology demonstration using real run evidence rather than AWS product names or mock outputs.
---
# Frankenstein evidence audit

Use this skill before demo recording, Devpost editing or marking spec 08 done.

1. Read `docs/FRANKENSTEIN-STRATEGY.md`, `docs/FRANKENSTEIN-EVIDENCE-MATRIX.md`, `docs/DEMO.md`, `docs/BUILD_LOG.md`, and specs 07 and 08.
2. Verify real AWS-run-backed unsafe FAIL and protected PASS, actual independent store reads, and consistent run/evidence IDs in UI and exported report.
3. Verify at least one real Strands SDK + Bedrock explanation grounded in existing evidence, plus Bedrock `UNAVAILABLE` fallback and no agent write capabilities.
4. Distinguish actual Kiro IDE/CLI/Web usage evidence from prepared templates. Include only tools used.
5. Confirm synthetic-only data, bounded authorization, least-privilege IAM, concurrency controls and accessibility.
6. Return precise PASS/UNVERIFIED/BLOCKED with source paths or real test logs and a clear category decision gate. Do not invent cloud outputs, screenshots, links, winning odds or agent traces.
