# ADR-0008: No cookies; a case lasts only as long as the page

**Status:** accepted (user decision, for transparent privacy). **Amends:** `docs/backend-contract.md`, which describes a visitor session cookie and credentialed CORS.

## Decision
- The backend sets **no cookies** and reads none. It stores no IP address, user agent or visitor identifier.
- `POST /cases` always creates a new case with a new random ID (at least 128 bits, URL-safe). The case ID is the only access credential. Unknown or expired IDs return 404.
- The intended experience is that a browser reload starts a fresh case. The backend cannot force this. It needs the frontend to stop saving the case ID across reloads (spec 06 requirement AWS-10 and task 11; see `docs/FRONTEND-REQUESTS.md`). Until then the browser may keep the ID in tab storage and the backend will serve the same case until it expires.
- Case data expires on its own: DynamoDB TTL on every case item, short (default 1 hour after the last write). TTL deletion can lag, so reads treat an expired item as not found.
- Abuse limits do not use visitor identity: API Gateway throttling plus a global cap on active cases (429 when reached).
- Logs hold event types, short codes and a truncated hash of the case ID, never the full ID, request bodies or subject names.

## Consequences
- Isolation between two browsers rests on the case ID being unguessable. It is not authentication. Anyone who learns an ID can read that case, which holds only fictional data. Do not claim stronger isolation.
- CORS: allow the exact frontend origin and the methods and header in the contract. The current frontend sends `credentials: 'include'`, so the API must also answer `Access-Control-Allow-Credentials: true` until the frontend changes to omit credentials. No cookie is set either way.
- No cross-site cookie problem, so the API hostname does not need to share a site with the frontend.
- The evaluation scenario "two separate visitors" is tested with two case IDs, not two sessions.