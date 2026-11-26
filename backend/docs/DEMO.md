# Three-minute Frankenstein demo storyboard (planned)

**Status: script only, not evidence the app works.** Show authentic product interactions, AWS test results, and real Kiro usage. Video must be publicly accessible on YouTube and shorter than three minutes. If Strands or cloud integration is not implemented, remove the corresponding claim and reconsider category fit.

| Time | Actual evidence to show | Narration / proof |
|---|---|---|
| 0:00–0:15 | Product + four-part flow | "Afterimage combines chaos engineering, privacy verification, AI investigation and visual forensics." |
| 0:15–0:40 | Synthetic fixture; AWS-backed run ID | "The data exists in separate test stores; this is a real isolated scenario." |
| 0:40–1:05 | Step Functions / SQS replay + real verifier FAIL | "A delayed event restores a deleted record; the verifier observes it directly." |
| 1:05–1:25 | Ghost Graph follows specific event/observation IDs | "See precisely where that record returned and which invariant broke." |
| 1:25–1:50 | Trigger Strands + Bedrock read-only explanation | "The agent reads fixed evidence, connects the cause and suggests a guard; it cannot change the verdict." |
| 1:50–2:15 | Protected replay + direct AWS verifier PASS | "Identical input; the transactional deletion barrier prevents recreation." |
| 2:15–2:33 | Disable/deny Bedrock; deterministic report remains | "When AI is unavailable, verified testing still works; unknown store observations never become PASS." |
| 2:33–2:50 | Real Kiro specs/hooks/PBT/test output + diagram | "Kiro helped design, test and refine the integration, with evidence saved in our repository." |
| 2:50–2:58 | Product close | "Don't just delete data. Make sure it stays dead—within the scope you can test." |

## Capture gates

- [ ] Actual AWS Step Functions execution history / correlation trace and bounded synthetic store data; no mockup substituted for a successful test.
- [ ] The unsafe/resurrection and protected runs use the same input seed and replay conditions; different consumer policies are explicitly identified.
- [ ] A real, logged Strands SDK + Bedrock response cites valid evidence IDs without overriding the authoritative verifier.
- [ ] `UNKNOWN` and Bedrock `UNAVAILABLE` are demonstrated honestly and separately.
- [ ] The Ghost Graph state and agent conclusions can be traced to persisted data; no fabricated evidence or screenshots.
- [ ] Actual Kiro usage is shown; don't imply prewritten starter files prove Kiro usage.
- [ ] No passwords, AWS account identifiers, credentials, real personal data, or unintended resource names revealed.
- [ ] Demo is accessible, subtitled if possible, under three minutes, and tested from a fresh browser.

## Cut line

If a real Strands explanation does not work reliably by Nov 27, choose between (a) a simplified Frankenstein submission with an *honest, demonstrably distinct* cross-technology integration without claiming working agent intelligence, or (b) Costume Contest if the polished haunted UI is instead the strongest demonstrated capability. The Devpost category is one selection, not both. See `docs/FRANKENSTEIN-STRATEGY.md`.

## v4 optional after-action forensics — only if truly implemented

Do **not** replace the under-three-minute mandatory Frankenstein flow with the article-inspired idea. If P1 evidence chain is complete, show a 5-second inspectable action intent → decision → receipt → independently observed state in the existing Autopsy Report. If the P2 synthetic-denial test works and the core demo has time, show a distinct **proposal denied** clip and an actual post-denial read; explicitly label it a synthetic control test, not production agent protection. Remove it entirely if unverified. Never claim an absence of vendor postmortems as proven fact.
