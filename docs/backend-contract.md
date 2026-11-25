# Browser API contract

The frontend implements a browser-local demo and an HTTP adapter in `lib/gateway.ts`. The public snapshot, allowed commands and runtime validator live in `lib/case.ts`. Browser components only consume a `CaseFile`; the demo's physical-copy booleans are private simulation state.

## Endpoints

| Method and path | Request | Success |
| --- | --- | --- |
| POST /cases | Empty JSON object | Create an isolated fictional case and return its full snapshot |
| GET /cases/{id} | No body | Return the latest snapshot |
| POST /cases/{id}/commands | Command envelope below | Return the complete updated snapshot after the operation |

Reset creates a new case. Resolve case ownership on the server using a visitor session. The browser includes credentials with every request and keeps the case ID in tab-scoped storage. For cross-origin deployments, configure CORS for the exact frontend origin, allow credentialed GET/POST/OPTIONS requests and the Content-Type header. The session cookie must work with the deployment's site relationship. A same-site API hostname avoids browser restrictions on third-party cookies.

```json
{
  "commandId": "babfb798-0015-4bcb-9ea7-18728e6b9411",
  "expectedRevision": 6,
  "command": { "type": "inspect", "store": "analytics" }
}
```

Use commandId to deduplicate retries. Compare expectedRevision before changing state and return HTTP 409 for a stale revision. The browser offers a reload after a failed or timed-out operation. Increment the revision monotonically after a successful mutation and append events with unique increasing sequence numbers. Use ISO 8601 UTC timestamps. Never send credentials or actual customer information to the frontend.

## Commands and evidence

| Command | Effect |
| --- | --- |
| erase-primary | Erase the primary record and set pendingCheck until a recheck |
| scan | Read all four configured stores independently |
| erase-copy with store | Request removal of one discovered copy and set pendingCheck |
| inspect with store | Read that store and replace its finding with current evidence |
| restore | Import a retained backup into a verified-clear primary, record the source, then independently read the primary |

Store IDs are primary, analytics, export and backup. A store can be unchecked, found, clear, returned or unreachable. Set checkedAt to the read time for found, clear and returned. An access failure or a store beyond the inspection boundary is unreachable. A pending deletion remains unverified until a successful read. If a restore succeeds but its verification fails, return the recorded restore event and unverified evidence. Tables, counters and the certificate derive their interpretation from the same store snapshot.

Set sourceId to the originating store when known. The main demo uses snapshot SNP-0042. For connected cases put the actual snapshot identifier and cause in event.detail. Return an event with kind return only after verifying that the primary actually contains the restored record. A subsequently erased and rechecked copy can become clear again; retain the earlier restoration events.

The complete response shape is the exported CaseFile type. Integration tests can use the snapshot from startDemo and runDemo as test fixtures. The server owns inspection results and access to AWS. All user-visible timestamps in the frontend are shown in UTC.
