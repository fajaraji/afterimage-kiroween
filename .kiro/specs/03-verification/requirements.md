# 03 — Independent verification and verdict semantics

**Priority:** P0 · **Status:** not implemented.

**VERIFY-1:** WHEN a scenario completes, THE SYSTEM SHALL query each configured store independently of frontend state and record observed presence or absence.

**VERIFY-2:** IF any required store cannot be queried or returns an ambiguous result, THE SYSTEM SHALL mark it `UNKNOWN`; IF no `PRESENT` is observed and any required evidence is `UNKNOWN`, THE SYSTEM SHALL emit overall `UNKNOWN`, never `PASS`.

**VERIFY-3:** IF any required store is observed `PRESENT` after deletion, THE SYSTEM SHALL emit `FAIL` with linked observation evidence.

**VERIFY-4:** WHEN all required store observations are `ABSENT` and all invariants succeed, THE SYSTEM SHALL emit scoped `PASS` and record verifier version, fixture hash, scenario ID and run ID.

**VERIFY-5:** IF a store observation is duplicated, mismatched, or forged from an unknown store, THE SYSTEM SHALL reject or report `UNKNOWN`, not double-count evidence.

**VERIFY-6:** WHEN a user reads a report, THE SYSTEM SHALL disclose the configured scope and observation time, not imply universal erasure.
