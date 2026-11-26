---
inclusion: fileMatch
fileMatchPattern: ["apps/api/**/*.ts", "packages/contracts/**/*.ts", "packages/engine/**/*.ts"]
---
# API + engine guardrails

Use `docs/API.md` and `docs/DOMAIN-MODEL.md`. Treat required stores as a configured allowlist. Version contract changes. Validate all requests with a runtime parser; never trust TypeScript types for JSON from the network. Ensure atomic barrier/upsert semantics in protected mode and independently query test stores for final evidence.
