# 2:45 demo plan (Costume Contest)
**Status: plan only, not evidence the app works.** The full Indonesian storyboard and rehearsal guidance are in `../../docs/backend-handoff.md`. This file is the English shot list and capture gates.

| Time | Shot | On-screen message |
|---|---|---|
| 0:00–0:15 | Evelyn, subject ID, the case question | "Evelyn asked to be erased. How can we prove every copy is gone?" |
| 0:15–0:42 | Connected label, erase, scan. Hold on the primary tombstone and the vault ghost | "Primary read: absent. Backup read: present." |
| 0:42–1:02 | Excerpt of the AWS read from the same run | "This backup still holds Evelyn's record." |
| 1:02–1:25 | One take from restore click to the apparition and source stamp | "Snapshot imported." then "A new primary read found Evelyn again." |
| 1:25–2:05 | Certificate: before/after primary reads, S3 version and DynamoDB read side by side | "Same case. Same record tag. Read back from DynamoDB." |
| 2:05–2:30 | Real Kiro spec or test output. Then a separate control run | "Control run: import succeeded, verification failed. No confirmed return." |
| 2:30–2:45 | Back to the main case evidence and the app URL | "An erasure report is only as good as its last verified read." |

## Capture gates
- [ ] Captions come from a real run's AWS output. Account IDs, ARNs and credentials are hidden.
- [ ] The `return` event appears only after a new read matched the backup version.
- [ ] The control run is clearly labeled as a separate run.
- [ ] Real Kiro usage is shown. Starter files do not prove Kiro was used.
- [ ] A sanitized evidence file for the recorded run is saved with the commit.
- [ ] Watched muted by someone who has not seen the app. They can say when primary was empty, which backup was imported, and which read proved the return.
- [ ] Under three minutes, tested from a fresh browser.