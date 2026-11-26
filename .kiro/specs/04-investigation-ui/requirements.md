# 04 — Haunted investigation UI

**Priority:** P0 · **Status:** not implemented.

**UI-1:** WHEN a user opens the lab, THE SYSTEM SHALL show the catalog of synthetic scenarios and clearly indicate unexecuted runs as not run.

**UI-2:** WHEN a run is executing, THE SYSTEM SHALL display current progress without inventing completed results.

**UI-3:** WHEN observations arrive, THE SYSTEM SHALL render each store's `PRESENT`, `ABSENT`, or `UNKNOWN` state with textual labels and evidence details, and graph/timeline shall be driven by server output.

**UI-4:** WHEN users navigate by keyboard or prefer reduced motion, THE SYSTEM SHALL preserve accessible controls and readable status while reducing animation.

**UI-5:** IF a run fails or API becomes unavailable, THE SYSTEM SHALL show a non-success error state and a safe retry.

**UI-6:** WHEN showing a resurrection, THE SYSTEM SHALL identify the event/edge responsible from server trace, not a decorative animation assumption.
