# Requests to the frontend owner (backend side)

The backend does not change frontend files. These are the changes the backend needs or would like. Decisions: ADR-0008 (no cookies, reset on reload).

1. **Reset on every reload (requested).** `lib/gateway.ts` saves the case ID in `sessionStorage` (`afterimage:case:v1:*`) and calls `GET /cases/{id}` on reload. For a fresh case on each reload, `openCase()` should always call `POST /cases` and keep the ID in memory only. The in-page "Reload case" button after a 409 or timeout can keep using the in-memory ID with `GET /cases/{id}`. The browser-only demo mode has the same storage behavior.
2. **Credentials (optional).** The backend sets no cookies. `credentials: 'include'` can become `'omit'`. Until it does, the API sends `Access-Control-Allow-Credentials: true`.
3. **Handoff text.** `docs/backend-contract.md` and `docs/backend-handoff.md` mention a visitor session cookie. After the change, say that the case ID is the access credential.
4. **Expired case.** After the TTL, `GET /cases/{id}` returns 404. The UI should offer to open a new case.