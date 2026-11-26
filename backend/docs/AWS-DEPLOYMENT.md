# AWS deployment runbook — actions require account-owner approval

**Status:** design/runbook only. There is no deployed AWS stack or verified service in this starter. Do not run `cdk deploy` until infrastructure is implemented and reviewed.

## Environment strategy

- `dev`: sandbox AWS account or logically isolated stack; all data synthetic.
- `demo`: separate stack, restricted public/judge access, reliable deployment through the end of the judging period (Jan 29, 2027).
- Pick region after checking Amazon Bedrock model accessibility and service quotas for *your account*. Keeping API, Step Functions, SQS, DynamoDB and S3 in one region simplifies integration. Cross-region Bedrock only with explicit architecture decision.

## Local prerequisite checks

```bash
node --version                # Node.js 22+
npm --version
aws --version
aws sts get-caller-identity  # check the selected account, never paste result into public repo
```

Install AWS CLI v2 and AWS CDK CLI according to official docs. Use AWS IAM Identity Center or temporary credentials, never an IAM user's long-lived access keys committed into the project. Confirm account/region and budget settings before generating real resources.

## Deployment plan (not executable in this starter yet)

1. Implement `infra/` AWS CDK project per `.kiro/specs/06-aws-serverless/`. Review `cdk diff`, IAM policies, deletion settings, and monthly cost expectations.
2. Bootstrap CDK only after explicitly reviewing the target AWS account/region.
3. Deploy backend CDK stack (Lambda, HTTP API, Step Functions Standard, SQS, DynamoDB tables, S3 buckets and audit controls) in `dev`.
4. Run AWS integration tests against isolated synthetic run IDs. Verify cross-run isolation and fault injection; record exact AWS region/date/services in build log.
5. Connect public React/Vite repo/branch to Amplify Hosting. Define `VITE_API_BASE_URL` for the deployed API, not credentials. Validate SPA rewrite/refresh routes and CORS allowlist.
6. For public `demo` create fixed judge credentials or a strictly rate-limited and authenticated short-lived demo session. Record judging instructions privately on Devpost, not in GitHub.
7. Set a budget alert, concurrency caps, max runs per session, route throttling, CloudWatch log retention, S3 lifecycle and resource cleanup plan. AWS Budgets alerts are NOT guaranteed hard caps.
8. Run 2 browser-based end-to-end validations through Amplify with a freshly seeded scenario. Test Bedrock access and agent graceful degradation.
9. Document a **manual** rollback and teardown plan and ensure the judge URL remains accessible until the end of judging.

## Suggested user-facing endpoints

- `GET /api/health`: no secrets; distinguish API availability from scenario validity.
- `POST /api/runs`: `{scenarioId,mode}` -> 202 `{runId,statusUrl}`.
- `GET /api/runs/{runId}`: safe status + observation summary; authorized owner only.
- `GET /api/runs/{runId}/evidence`: report and cited observation IDs; authorized owner only.
- `POST /api/runs/{runId}/explain`: bounded on-demand Strands explanation; read-only.

## Security / release gates

- Deny all IAM actions unrelated to resource-specific function responsibilities.
- No broad public writable S3 buckets, no open DynamoDB direct endpoints, no secret AWS keys in frontend builds.
- Production data access is expressly prohibited; resource identifiers are configured on the server, not user-supplied.
- One public demo run must NOT interfere with another run. The unsafe mode is scoped to synthetic isolated run partitions.
- Disable anonymous agent invocations without bounded quotas; preserve deterministic fallback when Bedrock fails.
- Before public launch: `cdk synth`, `cdk diff`, `npm run typecheck`, unit, PBT, actual AWS integration, browser E2E tests.

## References

- https://docs.aws.amazon.com/cdk/v2/guide/home.html
- https://docs.amplify.aws/react/deploy-and-host/amplify-hosting/
- https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-throttling.html
- https://docs.aws.amazon.com/bedrock/latest/userguide/model-access.html
