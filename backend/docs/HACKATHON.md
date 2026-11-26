# Kiroween 2026 submission and compliance checklist

Authoritative source: https://kiroween.devpost.com/rules (accessed Nov 7, 2026; re-check before submission). This file is a checklist, not legal advice.

- **Eligible period:** new project work created from Oct 30, 2026 submission start; standard starter templates/libraries allowed under rules, disclose other pre-existing code/work.
- **Deadline:** Dec 4, 2026 2:00 PM PST (Dec 5, 5:00 AM Asia/Jakarta).
- **Category (proposed):** **Frankenstein**, based on combining deterministic AWS fault injection + independent privacy verification + constrained Strands/Bedrock reasoning + functional visual forensics. Only select one main category in Devpost. Design should still be polished and haunting, but Costume Contest is not the primary category.
- [ ] Working application URL accessible to judges; fully functional as depicted.
- [ ] Public GitHub repo URL; open-source LICENSE visible on repository home page.
- [ ] Root `.kiro/` directory committed, not excluded by `.gitignore`.
- [ ] All necessary source, assets, fixtures and run instructions committed.
- [ ] Description in English: problem, solution, features, target audience, differentiation.
- [ ] Public YouTube demonstration **under 3 minutes** showing running app on intended platform.
- [ ] Detailed truthful write-up: Kiro IDE/CLI/Web used, specs, steering, hooks, agents, MCP, powers, PBT **only if actually used**.
- [ ] If bonus categories selected: satisfy separate criteria; do not assume automatic eligibility.
- [ ] Disclose pre-existing work, external libraries and authorized assets accurately.
- [ ] App accessible without payment/restrictions through end of judging (Jan 29, 2027).
- [ ] Test submission from a fresh browser and verify all URLs.
- [ ] Finish and submit by Dec 3 if possible to buffer technical issues.

Bonus entries such as social/blog have additional evidence and timing requirements in official rules; intentionally not auto-selected here.

## Pre-existing assistance disclosure template
"Project planning, initial specification documents, and general-purpose repository scaffold were prepared with AI assistance during the eligible period. Core functionality, test implementation, refinements and validation were developed using Kiro as described in the Kiro usage write-up. Standard third-party packages are credited through package manifests and their licenses." Edit this to **match actual work**.

## Frankenstein-specific readiness gates

- [ ] The video **shows**, not just names, at least three nonredundant technological roles: serverless fault-injection/replay, independently verified data outcomes, and Strands evidence-grounded investigation. The visual investigation UI connects them.
- [ ] Runtime agent is **actual Strands SDK + Bedrock** in a bounded read-only Lambda; an LLM-generated mock response does not qualify as technical evidence.
- [ ] Verified AWS trace IDs / real store observations and source-evidence IDs are inspectable; no simulated screenshots or hand-edited PASS outcomes.
- [ ] Agent output never changes PASS/FAIL/UNKNOWN and is marked unavailable when Bedrock fails.
- [ ] Document why each component is necessary, not just its AWS product name. No claim of bonus points for AWS service count.
- [ ] Reassess category if Strands integration is not working by the demo freeze; no unverifiable cross-technology claims.

Use `docs/FRANKENSTEIN-EVIDENCE-MATRIX.md` for per-claim proof and `docs/DEVPOST-FRANKENSTEIN.md` for edit-ready copy.
