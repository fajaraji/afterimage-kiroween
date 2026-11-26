# Architecture and boundaries — AWS-first

**Authoritative:** `docs/AWS-ARCHITECTURE.md` and ADR-0004. Original local SQLite target in the first starter has been superseded. The existing React/Vite app and Fastify API are **local-only development shells**, not the intended AWS production infrastructure.

## Deployable components to implement

- React/Vite investigation UI → AWS Amplify Hosting.
- API → Amazon API Gateway HTTP API + AWS Lambda.
- Scenario runner → AWS Step Functions **Standard** with bounded waits and retries.
- Synthetic stores → independent DynamoDB primary/analytics tables + S3 export objects.
- Event transport → Amazon SQS with dead-letter queue; Lambda event consumer.
- Report storage → S3 + DynamoDB run metadata.
- On-demand after-verification explanation → read-only Strands TypeScript SDK in Lambda + Amazon Bedrock; targeted for Frankenstein demo after deterministic P0, never owns the verdict.
- IaC → AWS CDK TypeScript, `infra/` (to implement).

## Boundaries/invariants

Shared contracts and pure engine modules remain independent of AWS, UI, and API. Store adapters implement `reset`, `delete`, and `observe` operations. Run IDs and user sessions scope every operation; no arbitrary resource names. The protected worker must atomically check the durable deletion barrier before any active same-generation write. Duplicate delivery is idempotent; observations are direct AWS store queries. PASS only when all required observations are ABSENT and invariants succeed; UNKNOWN whenever verification is incomplete. SQS timing is intentionally injected via a pre-created event that is published after deletion. No claims of production compliance or global erasure.

## Legacy shell

`apps/api` still runs Fastify locally for rapid dev and health checks; do not deploy a stateful Fastify/SQLite server. Kiro should reuse domain contracts while implementing AWS Lambda API handlers in a new `apps/lambdas/` folder. Unit tests use in-memory adapters; deployable evidence must come from real AWS test stores.

## Read before implementation

`docs/AWS-ARCHITECTURE.md`, `docs/STRANDS-AGENT-DESIGN.md`, `docs/AWS-COST-AND-SAFETY.md`, `.kiro/specs/06-aws-serverless/`, `.kiro/specs/07-strands-investigator/`, `.kiro/specs/08-frankenstein-integration/`, and `docs/FRANKENSTEIN-STRATEGY.md`.
