---
inclusion: always
---
# AWS-first target architecture

- Use `docs/AWS-ARCHITECTURE.md` and ADR-0004 as authoritative cloud-target requirements. Original SQLite/Fastify deployment notes are superseded; local Fastify is **dev shell only**. Never represent this kit as already deployed.
- Prefer AWS CDK v2 in TypeScript, API Gateway HTTP API, Lambda Node.js 22+, Step Functions **Standard**, DynamoDB, SQS+DLQ, S3, Amplify Hosting. Avoid unnecessary services.
- Split domain engine and SDK adapters; every AWS action needs minimal scoped IAM and synthetic-only run partitions.
- Never deploy, bootstrap CDK, configure account credentials, change IAM or spend money without explicit owner approval.
- `POST /api/runs` responds 202; asynchronous workflow and independently verified status. No bogus success when a store or event receipt is missing.
- Use SQS duplicate-tolerant worker, atomic DynamoDB barrier check + protected upsert, and direct independent store queries.
- DynamoDB TTL is delayed cleanup only. Versioned S3 DELETE may add a delete marker; verify versions when versioning is enabled.
- No production customer information; no public unrestricted resource mutation; no broad IAM wildcard actions.
- Record real infrastructure deployment and tests in `docs/BUILD_LOG.md` for Kiroween evidence.
