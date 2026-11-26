# 05 — Evidence certificate and submission
**Priority:** P0 · **Status:** not implemented · **Method:** requirements-first (EARS).
The certificate is rendered by the frontend from `events` and `stores`. This spec covers what the backend must supply and the submission package.

**REPORT-1:** WHEN a restore completes, THE SYSTEM SHALL supply in `events` the before and after primary reads, each with UTC time, `seq`, store and result, so the certificate can compare them.

**REPORT-2:** WHEN evidence is missing, THE SYSTEM SHALL leave it unverified in the data, and SHALL NOT supply values that make the certificate show a pass.

**REPORT-3:** THE SYSTEM SHALL exclude secrets, account IDs and ARNs from every response and event.

**REPORT-4:** WHEN a run is prepared for the video, THE PROJECT SHALL keep one sanitized evidence file (events, store reads, snapshot reference) with the recorded commit.

**REPORT-5:** WHEN submitting, THE PROJECT SHALL include a public repo, an open source license, root `.kiro/`, an honest write-up of the Kiro specs, steering and hooks actually used, and a demo video under three minutes.

**REPORT-6:** WHEN a judge opens the public build, THE SYSTEM SHALL work without paid access or private setup, and the frontend SHALL show clearly whether it is in simulated or Connected mode.