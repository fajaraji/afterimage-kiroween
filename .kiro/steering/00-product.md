---
inclusion: always
---
# Product intent

Afterimage is a synthetic-only demonstration that an erased customer record can return from a retained backup, and that only an independent read can prove it. It is not a production data-subject-request solution, a privacy chatbot, or a compliance guarantee. Every claim must come from a direct read of a store.

**Category decision (user, confirmed):** Kiroween **Costume Contest** (ADR-0007). The earlier Frankenstein plan was removed and must not appear in claims, specs or demos.

**Story:** one fictional customer (Evelyn Marlow, `CUS-0713`) in one isolated case with four stores: `primary` (DynamoDB), `analytics` (replica table), `export` (S3 object), `backup` (versioned S3 snapshot). The visitor erases the primary record, scans the stores, restores the backup, and a fresh read of the primary proves whether the record returned.

**Source of truth for behavior:** `docs/backend-contract.md` (HTTP), `lib/case.ts` (`CaseFile`, `isCaseFile`, `startDemo`, `runDemo`), `lib/gateway.ts`, `lib/trace.ts`, and `docs/backend-handoff.md` (AWS flow, acceptance scenarios, tickets #20 to #24). Active specs are under `.kiro/specs/`.

**Success:** a judge can follow a 2:45 muted video showing three facts from one run: primary read empty, a backup version still holding the record, and a new primary read finding the restored record, each with a UTC read time. A failed or unreachable read is shown as unverified, never as clear.

Out of scope: production data or connectors, arbitrary deletion endpoints, multi-tenant authentication, legal or GDPR certification claims, autonomous write-capable agents.