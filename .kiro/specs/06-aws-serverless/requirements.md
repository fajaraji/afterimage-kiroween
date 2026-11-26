# Spec 06 — AWS runtime for the case API
**Priority:** P0 · **Status:** not implemented · **Method:** requirements-first (EARS).
References: `docs/backend-contract.md`, `docs/backend-handoff.md` (tickets #20 to #24), `backend/docs/AWS-DEPLOYMENT.md` (partly superseded).

**AWS-1:** WHEN the infrastructure is synthesized, THE SYSTEM SHALL define, in CDK v2 TypeScript, an HTTP API with Lambda handlers for `POST /cases`, `GET /cases/{id}` and `POST /cases/{id}/commands`, a DynamoDB table for customer records, a replica table, a case-state table, and a versioned S3 bucket for export and snapshot objects.

**AWS-2:** WHEN `POST /cases` is received, THE SYSTEM SHALL create an isolated case with a new random ID, seed four stores with fictional data, and return the full `CaseFile` with all findings `unchecked`.

**AWS-3:** THE SYSTEM SHALL set and read no cookies and SHALL store no IP address, user agent or visitor identifier. A case SHALL be reachable only through its random case ID, and an unknown or expired ID SHALL return 404 (ADR-0008).

**AWS-4:** THE SYSTEM SHALL allow CORS only for the exact configured frontend origin, methods GET, POST and OPTIONS, and the `Content-Type` header, and SHALL answer `Access-Control-Allow-Credentials: true` while the frontend still sends credentials.

**AWS-5:** WHEN the DynamoDB stream delivers a primary change, THE SYSTEM SHALL update the analytics replica idempotently, so a redelivered record does not corrupt state.

**AWS-6:** THE SYSTEM SHALL scope every Lambda role to the case tables and the bucket prefix `cases/` with no wildcard actions, and SHALL keep verifier read permissions separate from writer permissions.

**AWS-7:** THE SYSTEM SHALL expire every case item with a short TTL (default 1 hour after the last write), reject reads of expired items, enforce a request size limit, apply API throttling and a global cap on active cases (429 when reached), and log only short codes and a truncated case ID hash.

**AWS-8:** WHEN a command takes longer than the browser's 15 second wait, THE SYSTEM SHALL still leave the case consistent so a reload shows a valid revision.

**AWS-9:** IF deployment, `cdk bootstrap`, IAM changes or paid services are proposed, THEN the owner SHALL approve them explicitly first, and the CDK diff SHALL be reviewed before any deploy.

## Acceptance
`cdk synth` and diff reviewed. Integration tests run against a real sandbox: erase/scan/restore end to end, replay of a command, 409, two cases isolated by ID, one denied read gives `unreachable`. A frontend preview connects with `NEXT_PUBLIC_AFTERIMAGE_API_BASE` and shows the Connected label. Cost, quotas, cleanup and teardown are documented in `docs/BUILD_LOG.md`.