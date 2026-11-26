# Kiro IDE: AWS development workflow (Costume Contest)
Active specs: `.kiro/specs/01-foundation`, `02-deletion-replay`, `03-verification`, `05-reporting-submission`, `06-aws-serverless`. Source of truth for behavior: `docs/backend-contract.md` and `docs/backend-handoff.md` at the repo root. Prepared files are not proof that Kiro was used; record real work in `docs/BUILD_LOG.md`.

## Optional powers (install only when needed, from the Kiro Powers panel)
- **AWS infrastructure as code (CDK and CloudFormation):** review CDK output and `cdk diff` for security and compliance.
- **AWS Observability:** diagnose CloudWatch logs after a stack is live.
Not needed for this scope: Strands, Amplify, Step Functions.

## MCP
`.kiro/settings/mcp.json` has no servers. Add one only after reviewing its permissions and with the owner's approval. Optional AWS MCP server docs: https://docs.aws.amazon.com/agent-toolkit/latest/userguide/getting-started-aws-mcp-server.html

## Order of work
1. Spec 01 tasks 8–10: four stores, finding mapping, `CaseFile` contract.
2. Spec 06 tasks 1–2: local `/cases` API and a local run with the frontend.
3. Specs 02 and 03: commands, restore, verification, with tests first.
4. Spec 06 tasks 3–7: CDK synth, AWS adapters, replica, limits. The owner reviews the diff.
5. Spec 06 tasks 8–10: deploy after explicit approval, run the evaluation table, record results.
6. Spec 05: evidence export, audit script, video, submission.
Use Kiro's correctness (property-based) tests where the IDE supports them, keep portable Vitest and fast-check tests in the repo, and keep hooks small.