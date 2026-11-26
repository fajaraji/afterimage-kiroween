# Spec 08 — Frankenstein integration evidence (P1, category readiness)

**Status:** Not implemented. **Dependency:** actual AWS replay + independent verifier P0, then read-only Strands investigator and UI. This spec adds no arbitrary AWS resources or automatic spend.

**FRANK-1:** WHEN an unsafe stale-event scenario completes, THE SYSTEM SHALL link the AWS orchestration execution, released event, consumer action, direct store observation, and authoritative FAIL by durable run/evidence references.

**FRANK-2:** WHEN the same logical fixture is replayed in protected mode, THE SYSTEM SHALL independently verify a PASS, show the atomic barrier decision, and retain reproducibility metadata distinguishing logical replay from AWS timestamps.

**FRANK-3:** WHEN a user requests an AI explanation of a completed run, THE SYSTEM SHALL invoke one Strands agent through only bounded read-only evidence tools, validate output, and link each supported factual claim to a stored evidence ID.

**FRANK-4:** IF Strands/Bedrock fails, returns invalid evidence IDs, or is unavailable, THE SYSTEM SHALL leave the authoritative PASS/FAIL/UNKNOWN unchanged and display a clear explanation failure status with access to deterministic evidence.

**FRANK-5:** WHEN users inspect an event in the Ghost Graph or timeline, THE SYSTEM SHALL show the same run/event/observation IDs as in the report and differentiate verified facts from agent hypotheses, with a keyboard-accessible evidence alternative.

**FRANK-6:** WHEN preparing a hackathon demo and Devpost write-up, THE PROJECT SHALL show real functioning integrated behavior, actual Kiro usage, and honest limitations, avoiding unverified service/agent claims.

Acceptance: real unsafe FAIL + protected PASS, independently queried AWS observations, one grounded read-only Strands response, disabled/denied-Bedrock fallback, matching UI/report evidence IDs, and truthful demo trace. Kiro agent development traces do not count as runtime Strands responses.
