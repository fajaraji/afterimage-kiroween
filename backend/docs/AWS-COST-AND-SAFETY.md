# AWS cost, privacy, and abuse guardrails

This hackathon is judged on effective Kiro implementation and product execution, **not** the number of AWS services consumed. AWS charges may apply independently of Kiro subscription credits. Never assume an AWS Free Tier allowance or Bedrock model pricing for your specific account.

## Required before deployment

- Configure AWS Budgets threshold alerts and CloudWatch alarms for failures, throttling, Lambda duration, Bedrock model usage and Step Functions starts. Budget alarms are **notifications**, not an absolute spending limit.
- Define per-demo-session daily run cap, per-run event count, max run duration and concurrent-run cap in application logic. Constrain Lambda reserved concurrency, API route throttling, and agent invocations separately.
- Disallow public arbitrary AWS resource names and operations. A scenario ID must map to a strictly allowlisted synthetic scenario.
- Keep Bedrock explanations opt-in; cache a report per run, do not invoke a model every UI refresh.
- Use DynamoDB on-demand only if traffic is unpredictable; still cost-bounded by app quotas. Understand higher transactional cost.
- Retain logs for a deliberately short interval; don't put personal data in logs or agent prompts.
- Explicitly configure S3 block-public-access, encryption, and lifecycle. For versioned buckets, lifecycle and deletion semantics must be specified per test; a delete marker is **not** permanent deletion of previous versions.
- DynamoDB TTL may take days; never use TTL as the test deletion mechanism. Perform explicit API deletion and verify state.
- Use KMS/customer-managed keys only if required by a demonstrable risk; AWS-managed server-side encryption is sufficient for synthetic MVP and simpler to operate.
- Never leave infrastructure teardown to an automatic timer that will remove judge access before judging ends.

## Failure isolation

- `unsafe` deliberately bypasses deletion barrier only for synthetic test partitions. Never expose an unsafe write mode against real production accounts.
- Safe worker uses atomic transaction/condition checks; duplicate SQS messages cannot perform duplicate writes.
- Independent verifier queries each system directly; a missing, failed or timed-out observation -> `UNKNOWN`.
- Inactive or unknown run IDs never authorize cross-run reads or writes.
- API Gateway throttle is best effort and does not replace authentication or business-level quotas.

## Evidence and user communications

- Preserve fixture hash, run ID, scenario version, observed state, exact event trail, model version if an explanation used AI, and explicit scope limitations.
- Never market a test result as universal erasure, GDPR certification, or a guarantee about unknown systems.

Official references:
- https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html
- https://docs.aws.amazon.com/AmazonS3/latest/userguide/DeletingObjectVersions.html
- https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-throttling.html
- https://docs.aws.amazon.com/bedrock/latest/userguide/model-access.html
