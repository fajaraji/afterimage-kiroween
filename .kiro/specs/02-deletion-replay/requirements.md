# 02 — Deletion and replay engine

**Priority:** P0 · **Status:** not implemented.

**REPLAY-1:** WHEN a stale upsert is held, the subject deleted, and the event released to an intentionally unsafe consumer, THE SYSTEM SHALL demonstrate a real record recreation in the target store.

**REPLAY-2:** WHEN the same event sequence is run against the protected consumer, THE SYSTEM SHALL atomically reject writes for a previously deleted `(subjectId, generation)` and SHALL preserve absence in required stores.

**REPLAY-3:** WHEN a run is reset to the same seed and version, THE SYSTEM SHALL replay identical logical events and resulting data states.

**REPLAY-4:** WHEN a duplicate `eventId` is delivered, THE SYSTEM SHALL process it idempotently without an additional state change.

**REPLAY-5:** WHEN a deletion failure is injected for analytics, THE SYSTEM SHALL retain the data copy there and expose the failure without claiming success.

**REPLAY-6:** IF the event carries a generation not approved by the scenario, THE SYSTEM SHALL reject it with an explicit reason.

Acceptance: unsafe FAIL vs protected PASS *only once independent verifier exists*. Before spec 03, the runner may report observed state but must NOT issue full PASS claims.
