# ADR-0003 — Initial local development stack (superseded for cloud target)

**Historical decision:** React/Vite, Fastify and synthetic SQLite/file-backed test stores to accelerate local development.

**Current status:** Superseded for the deployed backend by spec 06 (AWS CDK, Lambda, DynamoDB, S3). Keep the Fastify shell as a local development aid. The Vite frontend was removed; the frontend is the Next.js app at the repo root. Never implement local SQLite as the production architecture. Unit tests may use deterministic in-memory adapters; AWS integration tests must use real DynamoDB and S3. Review `docs/ARCHITECTURE.md` and spec 06 before implementing.
