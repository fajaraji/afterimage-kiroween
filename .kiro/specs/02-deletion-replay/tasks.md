# Tasks — 02 Replay

- [ ] 1. Implement strict event schema with eventId, generation, logical sequence and event type. _(REPLAY-3,6)_
- [ ] 2. Implement held-event queue and deterministic release, with safe reset. _(REPLAY-1,3)_
- [ ] 3. Implement intentionally unsafe consumer and reproduce a failing resurrection regression test. _(REPLAY-1)_
- [ ] 4. Implement protected consumer's atomic generation barrier and prove same event cannot revive record. _(REPLAY-2)_
- [ ] 5. Add idempotency, duplicate IDs, invalid generation and replay determinism tests. _(REPLAY-3,4,6)_
- [ ] 6. Inject analytics deletion failure and observe real leftover record. _(REPLAY-5)_
- [ ] 7. Capture actual Kiro spec/PBT and regression evidence in build log.
