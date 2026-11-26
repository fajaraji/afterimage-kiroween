# Devpost pre-registration — editable Frankenstein draft

**Planning copy only. Update with actual implemented work before submitting.** Official rules: https://kiroween.devpost.com/rules

## Project name
Afterimage — The Data Resurrection Lab

## Elevator pitch
Don't just delete data. Make sure it stays dead.

## Main category
**Frankenstein** (primary proposed category, one category per submission).

## Two–three sentence idea summary
I'm building Afterimage, a developer-focused data-resurrection lab that combines serverless chaos engineering, deterministic privacy verification, and evidence-grounded AI investigation. It will recreate failures such as delayed events restoring deleted records, verify what happened in AWS test stores, and use a Strands-powered investigator and interactive Ghost Graph to explain the result. The goal is to help engineers catch deletion regressions before they reach production.

## About / inspiration (draft)
Modern applications replicate data across databases, queues and exports, so a successful delete in one place doesn't necessarily mean a record will stay deleted. Afterimage is being designed as a controlled laboratory that injects realistic failures and independently queries synthetic test stores to determine the bounded outcome. Its unusual combination of event-driven chaos testing, deterministic privacy assertions, read-only agentic investigation, and a haunting evidence graph is meant to make these invisible failures reproducible and understandable. Using Kiro, I plan to implement and test the architecture incrementally, record real engineering obstacles and results, and avoid making universal compliance guarantees. Before final submission, replace plans with completed features, actual Kiro techniques used, limitations and measured test evidence.

## Built with (planned; only retain actually used)
Kiro IDE, TypeScript, React, Vite, React Flow, AWS CDK, AWS Lambda, API Gateway, Step Functions, DynamoDB, Amazon SQS, Amazon S3, AWS Amplify Hosting, Amazon Bedrock, Strands Agents, CloudWatch, Zod, Vitest, fast-check, Playwright

## Explain Kiro usage (planned — edit before final)
I plan to use Kiro IDE's specs, steering, focused coding agents, skills, targeted hooks, and property-based testing to implement and verify Afterimage. The repository includes requirements/design/tasks for the core lab, AWS serverless architecture, Strands investigator, and Frankenstein integration proof. I'll document the actual prompts, changes, tests and counterexamples that Kiro helped produce, distinguishing prepared starter guidance from completed development. MCP servers and Powers are opt-in and will only be listed if actually enabled and used.

## Bonus prizes
Best Demo: eligible entries automatically considered where rules say so; Blog/Social: only if required public materials are actually published; Kiro Crew: don't select without a qualifying separate functioning Kiro Crew app and matching public repository. Eligibility for any special prize must be verified against current rules.

## Final submission proof checklist
- [ ] Replace future-tense claims with actual deployed features
- [ ] Link functioning judge-accessible app and public GitHub
- [ ] Include real Kiro engineering evidence and `.kiro/` at repository root
- [ ] Publish actual YouTube demo under 3 minutes
- [ ] Show real AWS FAIL and protected PASS, real Strands explanation or remove claim
- [ ] State explicitly scoped deletion proof and AI limitations

## v4 article-inspired note (optional for final submission)

If implemented and demonstrated, a truthful addition is: "We also recorded attributable action decisions and independently checked store state after each consequential operation; a limited synthetic agent proposal was denied by a server-owned guard." If this is not implemented, **do not** add it to the final description, tag list or Kiro claims. The article describes reported incidents, but its headline is not independently validated in this starter; avoid repeating it as fact. The primary project category remains Frankenstein.
