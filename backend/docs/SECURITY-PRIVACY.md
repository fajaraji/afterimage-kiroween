# Threat model, safety and truthful reporting

## Assumptions
A public demo may receive untrusted inputs. No real user/customer data; no access to external systems. Test scenarios are allowlisted, fixture IDs synthetic, output read-only for external audiences except sandbox run controls.

## Threats and mitigations

| Threat | Mitigation |
|---|---|
| Arbitrary filesystem or SQL injection | Never accept SQL, shell or path from public API; whitelist scenario IDs and adapter names |
| Cross-run data leakage | Unique run directories, strict per-run adapters, clean reset, no shared mutable execution state |
| Denial of service from excessive runs | Concurrency caps, timeouts, payload size limits, simple public demo rate limiting |
| Fake verification success | Direct independent adapter checks; `UNKNOWN` on timeout/unreachable |
| Accidental PII in artifacts | Fixed synthetic generator; scrub outputs; reject production credentials |
| Persistent raw customer values in logs | Redaction, identifiers only, structured event types |
| Stale event bypassing deletion barrier | Atomic barrier check + upsert, idempotent event handling |
| Misleading compliance claims | Clear scope banner and report caveats; no universal erasure guarantee |
| Public deployment mutation | Bind local-only until session isolation and abuse prevention implemented |

## Security acceptance criteria
- Sensitive `.env` and `.data` are excluded from git and agent context.
- API accepts only predefined synthetic scenarios and bounded options.
- An unreachable store yields `UNKNOWN`.
- Unsafe mode is clearly labeled as a deliberately vulnerable demonstration.
- No live production connectors or arbitrary third-party API calls in P0.
- Browser UI sanitizes all displayed data and relies on React escaping; no `dangerouslySetInnerHTML` for untrusted values.

## Responsible usage
Deletion barriers may be personal data in real deployments. The MVP is not a general compliance solution and makes no legal determination regarding GDPR/CCPA backup retention or exemptions. Verify regulatory claims with counsel before productization.

## v4 agent-action safety amendment

An agent output is **never** an authorization, approval or verified report. Decisions are made by a trusted server-side policy gate before execution and reinforced by IAM/resource boundaries. Only synthetic, run-scoped operations are contemplated. No external coding agent interception, production database modification, arbitrary shell/SQL, infrastructure destroy, or write-capable Strands tools. Human approvals (if P2 ever implements them) must bind exact action/digest/run, expire, be consumed once atomically and be rechecked. Independent post-action reads are required for outcome claims; failed read = `UNKNOWN`. Structured diagnostic logs are not automatically tamper-proof forensic evidence. See `docs/AGENT-ACTION-THREAT-MODEL.md`.
