# Spec 06 — AWS serverless runtime (P0)

Status: NOT implemented. Requirements-first. References: `docs/AWS-ARCHITECTURE.md`, `docs/AWS-DEPLOYMENT.md`, ADR-0004.

**AWS-1:** WHEN Kiro synthesizes the infrastructure, THE SYSTEM SHALL define Amplify-compatible frontend configuration, API Gateway, Lambda handlers, Standard Step Functions orchestration, SQS+DLQ, independent DynamoDB test tables, a barrier metadata store, and S3 evidence/export storage using CDK TypeScript.

**AWS-2:** IF a run is created, THE API SHALL validate allowlisted synthetic scenario ID and isolated session authorization, start the workflow, and reply HTTP 202 with a run identifier.

**AWS-3:** WHEN a prior snapshot event is deliberately released after deletion, THE SYSTEM SHALL deliver it through SQS to the sandbox consumer; an intentionally unsafe run SHALL reproduce an observed resurrection, and a protected run SHALL atomically reject the same-generation write.

**AWS-4:** WHEN duplicate SQS messages occur, THE SYSTEM SHALL record a single logical event result and SHALL NOT corrupt state.

**AWS-5:** WHEN the verifier checks a run, THE SYSTEM SHALL query independent AWS stores and evaluate `PASS | FAIL | UNKNOWN`; unavailable required observations SHALL never be labeled PASS.

**AWS-6:** WHEN a demo user initiates runs, THE SYSTEM SHALL enforce per-session limits, run concurrency caps, bounded fixture sizes and scoped IAM; it SHALL NOT accept arbitrary AWS resource names or raw commands.

**AWS-7:** WHEN a run fails or times out, THE SYSTEM SHALL retain a safe failure status and diagnostic evidence while keeping unrelated runs isolated.

**AWS-8:** IF a model region/service is unavailable, THE deterministic scenario engine SHALL still function without the Strands investigator.

**AWS-9:** WHEN deployment is proposed, THE project SHALL require an explicit account-owner approval before `cdk bootstrap`, `cdk deploy` or changing IAM/policy.

Acceptance: CDK synth/diff reviewed; tested real AWS end-to-end in a synthetic sandbox; SQS stale replay creates FAIL only in unsafe mode; protected is PASS with evidence; unreachable store UNKNOWN; budget, IAM, throttling, cleanup and deployment instructions documented.
