# Deployment — AWS serverless target

The original long-running Fastify/SQLite deployment suggestion has been **superseded** by AWS-first architecture. The app is not yet deployable to AWS; Kiro must implement infrastructure and Lambda handlers.

- **Frontend:** Amplify Hosting for React/Vite (SPA).
- **Backend:** API Gateway HTTP API + Lambda Node.js 22+.
- **Orchestration:** Step Functions Standard, real SQS transport/consumer.
- **Stores:** DynamoDB test tables + S3 synthetic exports/evidence.
- **On-demand agent:** Strands TypeScript + Amazon Bedrock on a separate read-only Lambda endpoint; necessary to substantiate the *planned* four-way Frankenstein demo but not needed for deterministic core tests.
- **Infrastructure:** CDK TypeScript.

See `docs/AWS-DEPLOYMENT.md` for setup, explicit account owner approval, security, tests, cost guardrails, judge credentials and maintaining the demo through judging. Local `npm run dev` still runs only the scaffold; it does **not** deploy or call AWS by default.
