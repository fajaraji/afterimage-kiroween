# Design — 01 Foundation (AWS-first revision)

Keep contracts under `packages/contracts`, pure deterministic logic in `packages/engine`, and synthetic fixtures in `fixtures/`. Unit test with in-memory fake adapters. Cloud target uses independent DynamoDB primary and analytics tables plus S3 synthetic exports; adapters are implemented under new `packages/aws-adapters/` (spec 06). `apps/api` Fastify remains a LOCAL development shell only.

Each run gets a non-guessable ID, scoped ownership and deterministic fixture hash. Logical timestamps keep fixture replay reproducible. Runtime schemas validate scenario/store IDs against an allowlist. Store adapters have `reset`, `delete`, `observe`, but do not accept arbitrary AWS ARNs/keys. For schema and IAM details read spec 06 and `docs/AWS-ARCHITECTURE.md`.

Interface: `FixtureRepository.create(runId, seed)`, `StoreAdapter.reset`, `StoreAdapter.observe`, `StoreRegistry.get(allowlistedId)`. Test repeated seeds, independent runs, bad IDs. Do not claim deployment evidence from local mocks.
