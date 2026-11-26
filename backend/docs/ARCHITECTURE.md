# Architecture
Source of truth for behavior: `../../docs/backend-contract.md`, `../../docs/backend-handoff.md` and `../../lib/case.ts`. Detailed design is in the specs under `.kiro/specs/` (01, 02, 03, 05, 06). Nothing here is deployed yet.

```text
Browser (Next.js on Vercel)
   |  POST /cases, GET /cases/{id}, POST /cases/{id}/commands   (no cookies; case ID is the credential)
   v
API Gateway HTTP API  ->  Lambda handlers  ->  engine (pure command logic)
                                              |
        +-------------------+-----------------+------------------+
        v                   v                                    v
 DynamoDB customers   DynamoDB customer-analytics         S3 (versioned)
 (primary store)      (filled by a stream Lambda)         export object + backup snapshot
        ^
        |  DynamoDB Streams
   cases table: case state, revision, events, command log, restore journal, TTL
```

## Packages (`backend/`)
- `packages/contracts`: request and response shapes, runtime parsers, the `CaseFile` contract.
- `packages/engine`: pure logic and in-memory adapters for tests.
- `packages/aws-adapters`: DynamoDB and S3 adapters behind small client interfaces.
- `apps/api`: local Fastify dev shell serving the same routes with in-memory adapters.
- `infra/`: CDK v2 app (spec 06).

## Rules
- A finding comes only from a direct read of its store. A failed read is `unreachable`.
- A `return` event is added only after a new read of primary matches the backup version and import reference.
- Every key is derived on the server from the case ID. Clients never send keys, ARNs or paths.
- No cookies or visitor identifiers (ADR-0008). Cases expire by TTL.
- Deploy, IAM changes and spend need the owner's approval.
