# ADR-0004 — AWS-first serverless deployment and bounded Strands investigator

**Status:** Proposed 2026-11-07; supersedes ADR-0003 *for production target only*. The original local React/Fastify shell remains a developer convenience.

## Decision

- Deploy React/Vite through Amplify Hosting, backend API through API Gateway + Lambda, state orchestration through Step Functions Standard, DynamoDB + S3 independent synthetic stores and SQS event delivery, all expressed with CDK TypeScript.
- Retain deterministic, server-neutral contract/reducer modules. Use fake in-memory adapters for unit tests and real AWS adapters for integration/evidence.
- Add a single read-only Strands Typescript agent (Lambda + Bedrock) after deterministic P0 works. Do not require the LLM to complete core workflow.
- Keep AgentCore Runtime optional P2 only.

## Rationale

This creates a true distributed deletion failure with reproducible AWS evidence while preserving hackathon feasibility. AWS product count does not earn official judging points; actual technical value and Kiro usage do.

## Tradeoffs

Additional resource permissions and billing, eventual event delivery, deployment complexity, and region model access. Safeguards: isolated account/stack, synthetic only, scoped IAM, per-run quotas, dev/demo environments, explicit budgets, and fallback without agent. A globally consistent ordering claim is out of scope.

## Anti-decisions

Do not claim DynamoDB TTL performs immediate erasure; do not claim versioned S3 DELETE removes old versions; do not use an LLM for verification; do not introduce Kafka/OpenSearch/EKS solely for architecture novelty.

## 2026-11-07 follow-up

ADR-0005 records the new Frankenstein category strategy. AWS-first infrastructure is unchanged; Strands remains non-authoritative but becomes an integrated-demo target once deterministic P0 is verified. No additional AWS services are mandated solely for the category.
