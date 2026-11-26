---
inclusion: always
---
# AWS target architecture

- Source of truth for the flow is `docs/backend-handoff.md` and `docs/backend-contract.md` (repo root). `backend/docs/AWS-ARCHITECTURE.md` and ADR-0004 are older and apply only where they do not conflict. Local Fastify (`backend/apps/api`) is a dev shell; never represent this kit as already deployed.
- Prefer AWS CDK v2 in TypeScript, API Gateway HTTP API, Lambda Node.js 22+, DynamoDB, S3 with versioning, CloudWatch Logs. The frontend is hosted on Vercel, not Amplify. Avoid services the flow does not need (no Step Functions, SQS or Bedrock unless a spec justifies them).
- The browser API is `POST /cases`, `GET /cases/{id}`, `POST /cases/{id}/commands`. Responses are synchronous and return the full `CaseFile`. Commands are deduplicated by `commandId`; a stale `expectedRevision` returns 409. Case ownership comes from a server-side visitor session cookie; CORS allows the exact frontend origin with credentials.
- Every AWS action needs minimal scoped IAM and a per-case key prefix. Never accept resource names, ARNs, keys or paths from the client.
- Never deploy, bootstrap CDK, configure account credentials, change IAM or spend money without explicit owner approval.
- DynamoDB reads that prove state use `ConsistentRead=true` on the base table. S3 verification must name the bucket versioning scope: a delete marker can hide an object while older versions remain.
- No production data. Record real deployments and tests in `backend/docs/BUILD_LOG.md` for Kiroween evidence.