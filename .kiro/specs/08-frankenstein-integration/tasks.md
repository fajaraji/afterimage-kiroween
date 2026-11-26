> **Superseded:** this spec belongs to the earlier Frankenstein plan. The hackathon category is Costume Contest. Do not implement it unless the user reopens that scope.

# Tasks — Frankenstein integrated demo readiness

- [ ] 1. Audit real implemented contracts across AWS workflow, independent verifier, agent tools, and UI for run/evidence identity. _(FRANK-1,5)_
- [ ] 2. Add contract tests showing the same AWS synthetic event and observation IDs in persisted evidence and UI API. _(FRANK-1,5)_
- [ ] 3. Prove unsafe FAIL and protected PASS against actual AWS test stores using identical logical fixture/event sequence and record scoped observations. _(FRANK-1,2)_
- [ ] 4. Wire one real read-only Strands+Bedrock explanation to the persisted failed run, validate evidence IDs and schema, document model/region. _(FRANK-3)_
- [ ] 5. Prove absence of write permissions and that Bedrock denial/timeout changes only explanation status, not verifier verdict. _(FRANK-4)_
- [ ] 6. Show event/evidence trace and agent explanations with accessible labels, linked evidence IDs and factual-vs-hypothesis distinction. _(FRANK-5)_
- [ ] 7. Capture genuine Kiro spec/test/counterexample/development evidence; run truthful integration and category audit. _(FRANK-6)_
- [ ] 8. Record real sub-3-minute demo, check public repo/deployment URLs, and reconsider category if real integration is not viable. _(FRANK-6)_

Do not check a task from architectural mockups or generated but unexecuted tests. Do not deploy or enable paid AWS services without human approval.
