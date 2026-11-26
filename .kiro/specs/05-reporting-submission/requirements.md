# 05 — Evidence reports, quality and hackathon packaging

**Priority:** P0 · **Status:** not implemented.

**REPORT-1:** WHEN a run finishes, THE SYSTEM SHALL export JSON containing actual event sequence, observed store states, test verdict, scope, scenario version and reproduction metadata.

**REPORT-2:** WHEN evidence is unavailable, THE SYSTEM SHALL retain explicit unknown/failure states and SHALL NOT fabricate PASS outcomes.

**REPORT-3:** WHEN a report is downloaded, THE SYSTEM SHALL exclude secrets and raw personal identifiers and include limits of evidence scope.

**REPORT-4:** WHEN an automated test executes a deterministic scenario, THE SYSTEM SHALL produce repeatable normalized outcomes for that scenario and seed.

**REPORT-5:** WHEN preparing submission, THE PROJECT SHALL include public repo instructions, MIT license, root `.kiro/`, actual Kiro usage write-up and a functioning app demo under three minutes.

**REPORT-6:** WHEN judge visits public build, THE SYSTEM SHALL serve the functional P0 flow for the judging period without paid access or private setup.
