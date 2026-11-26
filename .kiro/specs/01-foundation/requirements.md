# 01 — Foundation: case model, stores and contract
**Priority:** P0 · **Status:** tasks 1 to 5 done against the earlier three-store model; tasks 8 to 10 adapt it to the frontend contract · **Method:** requirements-first (EARS).

Source of truth: `docs/backend-contract.md`, `lib/case.ts`, `docs/backend-handoff.md` at the repo root. Stores are `primary`, `analytics`, `export`, `backup`.

## User story
As the backend developer, I want an isolated fictional case with four independently readable stores, so that every finding shown in the browser comes from a direct read of one store.

## Requirements
**FOUNDATION-1:** WHEN a case is created with a known seed, THE SYSTEM SHALL produce the same fictional subject, record tag and fixture hash on every repetition.

**FOUNDATION-2:** WHEN a case is initialized, THE SYSTEM SHALL populate four independently readable stores: primary, analytics, export and backup, and SHALL NOT report the case ready until each initial copy is readable.

**FOUNDATION-3:** IF a store ID, command type or field is not on the allowlist, THEN THE SYSTEM SHALL reject the request without running any AWS call, query or path built from it.

**FOUNDATION-4:** WHEN two cases exist, THE SYSTEM SHALL keep their data, key prefixes and revisions separate, and a visitor session SHALL NOT read or change another visitor's case.

**FOUNDATION-5:** IF initialization or reset fails, THEN THE SYSTEM SHALL return an explicit error and SHALL NOT return a case that looks ready.

**FOUNDATION-6:** WHEN a store read completes, THE SYSTEM SHALL map it to a finding: record present becomes `found`, record absent becomes `clear`, and a failed or timed-out read becomes `unreachable`. A deletion not yet re-read SHALL stay `pendingCheck: true`. `returned` SHALL be set only by a verified restore (spec 02).

**FOUNDATION-7:** THE SYSTEM SHALL serialize every case as the `CaseFile` shape in `lib/case.ts` and SHALL validate its own output with an equivalent runtime validator before sending it.

## Acceptance
- Same seed gives the same hash. Tests cover invalid IDs, isolation between cases, and a failed reset.
- A contract test validates snapshots equal in shape to `startDemo` and `runDemo` output (copied as fixtures).
- Existing `npm run dev` shell still starts.