# AWS CDK infrastructure — intentionally not yet implemented

This folder is a dedicated target location for the **AWS CDK v2 TypeScript** stack. It contains a plan, not a functional CDK app. Kiro must implement it through `.kiro/specs/06-aws-serverless/` with user-approved AWS-account and cost choices.

Suggested future files: `package.json`, `cdk.json`, `bin/afterimage.ts`, `lib/afterimage-stack.ts`, `test/afterimage-stack.test.ts`. Until those files and dependencies are implemented, do **not** claim `cdk synth` or `cdk deploy` passes.

Never run `cdk bootstrap`, `cdk deploy` or destructive cleanup without approval. Make least-privilege IAM and synthetic sandbox segregation mandatory.
