---
name: aws-architecture-review
description: Review Afterimage AWS CDK infrastructure for security, cost, privacy (no cookies) and read-based evidence guarantees.
---
# Afterimage AWS architecture review
Invoke when working on CDK, AWS Lambda, API Gateway, DynamoDB, DynamoDB Streams or S3. Read `.kiro/specs/06-aws-serverless/`, `backend/docs/AWS-COST-AND-SAFETY.md` and `backend/docs/DECISIONS/0008-no-cookies-reset-on-reload.md` first.
1. Inventory proposed resource changes and dependencies.
2. Find IAM wildcards, public writes, keys or ARNs taken from client input, cross-case leaks, missing TTL, missing throttling or active-case cap, and unbounded concurrency.
3. Confirm no cookies are set or read and no IP, user agent or visitor identifier is stored or logged.
4. Confirm the replica Lambda is idempotent on redelivery and the restore write is conditional (no existing item).
5. Confirm primary reads use `ConsistentRead`, TTL is not used as the deletion mechanism, and an S3 delete marker is not treated as removal of older versions.
6. Confirm a failed read gives `unreachable` and evidence comes from direct AWS reads.
7. Require explicit owner approval before deploy, `cdk bootstrap`, policy changes or paid services.
8. Report findings by priority with exact files and acceptance tests. Do not invent execution evidence.
