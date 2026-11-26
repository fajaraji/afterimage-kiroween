# 01 — Foundation / synthetic stores

**Priority:** P0 · **Status:** proposed, not implemented · **Method:** Requirements-first (EARS).

## User stories
As a backend engineer, I want seeded independent stores and clean resets so later tests reproduce the same state.

## Requirements
**FOUNDATION-1:** WHEN a known fixture is reset with a given seed, THE SYSTEM SHALL produce equivalent subject records and fixture hashes across repeated runs.

**FOUNDATION-2:** WHEN the developer initializes a scenario, THE SYSTEM SHALL populate three independently queryable stores: primary, analytics and export.

**FOUNDATION-3:** IF a scenario ID, store ID, or field is not on the allowlist, THE SYSTEM SHALL reject it without executing arbitrary commands, queries or paths.

**FOUNDATION-4:** WHEN two scenario runs use separate run IDs, THE SYSTEM SHALL prevent state from leaking between them.

**FOUNDATION-5:** WHEN initialization or reset fails, THE SYSTEM SHALL return an explicit error and SHALL NOT return a completed verdict.

## Acceptance
- Deterministic fixture hashes; all stores directly readable; `.data/` untracked.
- Tests for invalid IDs, repeatability, and run isolation.
- Existing UI/API shell continues to start.
