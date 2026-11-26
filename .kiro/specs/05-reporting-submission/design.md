# Design — 05 Reporting and submission

Evidence JSON report fields: schemaVersion, appVersion, runId, scenarioId, fixtureHash, seed, consumerMode, eventTrace (logical), observedStores (state/evidence/error), verdict, scope, limitations, generatedAt. Report is serialized from persisted server run and independent verification; never accept client-supplied PASS. Generate JSON download from API first; PDF/PPTX unnecessary. CI jobs should run workspace structure validation, typecheck, unit tests, and optionally browser tests. Public deployment must be synthetic-only with rate limiting and run isolation.

See `docs/HACKATHON.md` for Devpost checklist and `docs/DEMO.md` for actual video script.
