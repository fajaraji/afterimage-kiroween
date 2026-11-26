# ADR-0003 — Initial local development stack (superseded for cloud target)

**Historical decision:** React/Vite, Fastify and synthetic SQLite/file-backed test stores to accelerate local development.

**Current status:** Superseded for deployed P0 by ADR-0004 (AWS-first). Preserve the React/Vite + Fastify shell as a local development aid. Never implement local SQLite as the production architecture. Unit tests may use deterministic in-memory adapters; AWS integration tests must use real DynamoDB and S3. Review `docs/AWS-ARCHITECTURE.md` before implementing any spec.
