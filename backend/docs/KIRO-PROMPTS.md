# Prompts for Kiro tasks
Use one task at a time. Open the spec in the Specs panel, read `requirements.md` and `design.md`, then run the task from `tasks.md`.

**Start a task:** "Do task N of spec `<folder>`. Read the spec and `../../docs/backend-contract.md` first. Write failing tests before code. Do not change frontend files."

**Check a contract change:** "Compare `packages/contracts` with `lib/case.ts` and list any field that differs."

**Review before commit:** "Review my diff against the task's requirement IDs. Look for a finding set without a read, a failed read treated as clear, an ARN in a response, and a missing test."

**Record evidence:** "Add a row to `docs/BUILD_LOG.md` for what changed, the spec and task, and the test output."

Rules: synthetic data only; ask before deploy, IAM, spend or new dependencies; check a task only after its tests pass.