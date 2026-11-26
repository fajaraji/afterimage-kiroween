# Roadmap (Costume Contest, evidence first)
**Status:** plan. Nothing is deployed. Deploy, `cdk bootstrap`, IAM changes and spend need the owner's explicit approval. Deadline: Dec 4, 2026 2:00 PM PST. Plan to submit by Dec 3.

| Phase | Deliverable | Verification gate |
|---|---|---|
| 1 | Spec 01 tasks 8–10: four stores, finding mapping, `CaseFile` contract | Unit and contract tests pass |
| 2 | Spec 06 tasks 1–2: local `/cases` API, frontend connects locally | Frontend shows Connected and completes erase, scan, restore against in-memory adapters |
| 3 | Specs 02 and 03: commands, restore, verification | T-01 to T-10 pass |
| 4 | Spec 06 tasks 3–7: CDK synth, AWS adapters, replica, limits | Synth and diff reviewed by the owner |
| 5 | Spec 06 tasks 8–10: sandbox deploy, evaluation table, Vercel preview | Real results recorded in `BUILD_LOG.md` |
| 6 | Spec 05: evidence export, audit script, video, submission | Public repo, working URL, video under 3 minutes |

## Cut lines
1. If the AWS flow is not working end to end a week before the deadline, stop adding features and fix correctness.
2. Never ship a `return` event that a read did not confirm. Cut features before cutting verification.
3. Freeze features three days before the deadline. Use the rest for security, accessibility, the live URL and the submission.

## Deferred
Per-revision certificate archive, extra stores, authentication, multi-region.