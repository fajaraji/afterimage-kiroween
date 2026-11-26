# AWS cost, privacy and abuse guardrails
The hackathon is judged on Kiro use and product execution, not the number of AWS services. AWS charges apply independently of Kiro credits. Do not assume a free tier covers this account.

## Before any deployment
- Owner approval for deploy, `cdk bootstrap`, IAM and any paid service. Review `cdk diff` first.
- AWS Budgets alert and CloudWatch alarms on Lambda errors, throttles and duration. Budgets only notify; they do not cap spend.
- API Gateway throttling, Lambda reserved concurrency, request size limit, and a global cap on active cases enforced in code.
- Case items expire with DynamoDB TTL, a short time after the last write. TTL deletion can lag, so reads treat an expired item as not found. TTL is cleanup only. Deletions in the test use explicit API calls and a read afterwards.
- No cookies and no visitor identifiers stored (ADR-0008). Logs hold short codes and a truncated case ID hash, never subject names or request bodies. Keep retention short.
- S3: block public access, encryption on, lifecycle rules. With versioning, a delete marker does not remove older versions, so tests name the version read.
- AWS-managed encryption is enough for synthetic data. Add KMS only for a concrete risk.
- Do not set a teardown timer that removes access before judging ends (Jan 29, 2027).

## Isolation
Every key and item is under a per-case prefix derived on the server. Clients never supply resource names, ARNs, keys or paths. Roles are least-privilege, and verifier read access is separate from writer access.

## Reporting
Keep run evidence (case ID hash, revision, event sequence, snapshot version, read results, UTC times) with the commit. Never describe a result as universal erasure or GDPR certification.

References:
- https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html
- https://docs.aws.amazon.com/AmazonS3/latest/userguide/DeletingObjectVersions.html
- https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-throttling.html