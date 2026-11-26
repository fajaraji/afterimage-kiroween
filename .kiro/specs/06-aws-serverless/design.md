# Spec 06 — Design
## Layout
`backend/infra/` CDK app. `backend/apps/lambdas/` handlers (new). Handlers call `packages/engine` for logic and `packages/aws-adapters` for DynamoDB and S3. `apps/api` Fastify remains a local dev shell that serves the same three routes against in-memory adapters, so the frontend can be tried before deploy.

## Resources
- `customers` DynamoDB table: PK `CASE#{caseId}`, SK `SUBJECT#{subjectId}`. The primary store reads here with `ConsistentRead`.
- `customer-analytics` table, filled by a Lambda on DynamoDB Streams of `customers`. Idempotent on item key and sequence.
- `cases` table: case state, revision, events, command log, restore journal, session owner, TTL.
- S3 bucket with versioning: `cases/{caseId}/exports/customers.csv` and `cases/{caseId}/snapshots/SNP-0042.json`. Seed writes the snapshot and stores the returned `VersionId`.
- HTTP API with one Lambda per route, CORS from a stack parameter, and a JSON error contract.

## Sessions
First `POST /cases` without a cookie creates a random session ID in an HttpOnly, Secure cookie. SameSite depends on the deployment: same-site API hostname preferred (`Lax`), otherwise `None` with `Secure`. Decide with the owner before deploy.

## Concurrency
The commands handler writes case state with a conditional update on `revision`. Two concurrent commands cannot both pass. Replayed `commandId` returns the stored result before the revision check.

## Cost and safety
On-demand DynamoDB, small Lambda memory, log retention 7 days, TTL on case items, per-session case cap, budget alarm. No Step Functions, SQS, Bedrock or Amplify. Nothing is deployed without approval (AWS-9).

## Testing
Unit tests with in-memory adapters. Integration tests against a sandbox account only after the owner approves a deploy. Record results in `backend/docs/BUILD_LOG.md`; never mark a task done from mocks alone when it says "real".