---
inclusion: fileMatch
fileMatchPattern: ["backend/apps/api/**/*.ts", "backend/packages/contracts/**/*.ts", "backend/packages/engine/**/*.ts"]
---
# API + engine guardrails
The browser API is defined by the frontend: `docs/backend-contract.md`, `lib/case.ts` and `lib/gateway.ts` (`POST /cases`, `GET /cases/{id}`, `POST /cases/{id}/commands`). `backend/docs/API.md` and `backend/docs/OPENAPI.yaml` describe the older `/api/runs` design and are superseded where they differ.

Validate every request with a runtime parser; never trust TypeScript types for JSON from the network. Treat the four stores (`primary`, `analytics`, `export`, `backup`) as a configured allowlist. Deduplicate retries by `commandId`, return 409 for a stale `expectedRevision`, and derive every finding from a direct store read. A failed or unreachable read is `unreachable`, never `clear`. Version contract changes.