# Tasks — consequential action records and optional agent-safety demo

**P1 — implement only after core P0 is real and stable**

- [ ] 1. Extend versioned contracts for actor, intent, policy decision, execution receipt and post-action observation; migrate/report old schema safely. _(ACTION-1,2,3)_
- [ ] 2. Emit correlated and redacted intent/decision/receipt records from actual synthetic AWS scenario execution. No arbitrary targets. _(ACTION-1,2,3)_
- [ ] 3. Add independent post-action/denial observation and fail-closed `UNKNOWN` behavior; cover read failures and false success receipts in tests. _(ACTION-4)_
- [ ] 4. Add accessible timeline/evidence-table representation of action chain with IDs, actor, trusted vs agent-hypothesis labels. _(ACTION-5)_
- [ ] 5. Add tests for idempotent logs, cross-run isolation, redact-only reports and consistent timestamps/logical event sequence. _(ACTION-1,5)_

**P2 — optional only if P0 + Frankenstein demo integration remain on schedule**

- [ ] 6. Build a separate server-owned **synthetic-only** policy gateway with fixed allowlisted operations and an always-denied destructive proposal. No shell, SQL or AWS management executor. _(ACTION-6)_
- [ ] 7. Verify denied proposal causes no mutation through actual post-action store reads; an unreachable verifier must yield UNKNOWN. _(ACTION-8)_
- [ ] 8. Add adversarial tests for model approval bypass, cross-run target, altered payload, prompt injection and unsupported actions. _(ACTION-6,9)_
- [ ] 9. Only if necessary: implement human approval with identity, exact digest/run binding, expiry, one-time conditional consume, and concurrency tests. Otherwise leave the action denied. _(ACTION-7)_
- [ ] 10. Audit claims/demo with the `agent-action-threat-review` skill; do not describe the optional demo as protection for arbitrary AI coding agents. _(ACTION-1–9)_

**Hard gate:** If P0 is not stable by the Nov 19 checkpoint or Strands integration isn't proven by Nov 27, defer all P2 tasks. Never replace the required Kiroween app workflow with a fake action-denial animation.
