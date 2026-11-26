# Threat model, privacy and truthful reporting

## Assumptions
A public demo receives untrusted input. All data is fictional. The API reaches only its own sandbox resources. There are no cookies and no visitor accounts (ADR-0008).

## Threats and mitigations
| Threat | Mitigation |
|---|---|
| Client picks a table, key, ARN, path or query | Server derives every key from the case ID; only five command types and four store IDs are accepted; runtime parser on every request |
| Another browser reads a case | Case ID is random (at least 128 bits) and is the only credential; unknown or expired ID gives 404. This is not authentication. State this honestly |
| Fake "clear" or "returned" | Findings only from a direct read after the operation; failed read is `unreachable`; `return` only after a matching new read |
| Retry or double click corrupts a case | `commandId` deduplication, conditional revision write, restore journal |
| Restore overwrites a live record | Conditional write that requires no existing item |
| Denial of service or cost | API throttling, request size limit, active-case cap, TTL, budget alarm |
| Secrets or account details in responses | No ARNs, account IDs, error text or stack traces in responses or events; short error codes only |
| Visitor tracking | No cookies, no IP or user agent stored, truncated case ID hash in logs |
| Cross-origin abuse | CORS allows only the configured frontend origin and the methods and header in the contract |
| Misleading compliance claims | Scope limits in the certificate and docs; no GDPR or universal erasure claims |

## Security acceptance criteria
- `.env` files and `.data` are untracked.
- Responses never contain `Set-Cookie`.
- A failed read yields `unreachable`.
- Logs and events contain fictional IDs and short codes only.
- IAM has no wildcard actions; the verifier cannot write.
- No production connectors or third-party calls.

## Responsible usage
This is a demonstration, not a compliance product. It makes no legal determination about backup retention or erasure duties. Check any regulatory claim with counsel before productizing.