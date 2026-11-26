---
name: aws-architecture-review
description: Review Afterimage AWS CDK infrastructure for security, cost, observability, and deterministic synthetic test guarantees.
---
# Afterimage AWS architecture review

Invoke when working on CDK, AWS Lambda, Step Functions, DynamoDB, SQS, S3, Bedrock or Amplify. Review `docs/AWS-ARCHITECTURE.md` and `docs/AWS-COST-AND-SAFETY.md` first.

1. Inventory proposed resource changes and dependencies.
2. Identify dangerous IAM wildcards, public writes, missing session ownership, cross-run leaks, unbounded concurrency and model spend.
3. Confirm SQS retry/idempotency behavior and DynamoDB protected-write atomicity.
4. Confirm TTL is not used for immediate erase, and S3 delete marker isn't confused with permanent version deletion.
5. Verify `UNKNOWN` on incomplete observation; validate test evidence is from direct AWS reads.
6. Require explicit approval before AWS deployment, policy modifications or paid service invocation.
7. Produce actionable findings prioritized P0/P1 with exact files and acceptance tests; no fabricated execution evidence.
