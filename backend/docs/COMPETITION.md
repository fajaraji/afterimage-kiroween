# Competitive positioning / originality discipline

## What already exists
Privacy management vendors such as BigID, DataGrail, and Transcend support deletion requests, verification and integration testing. "Ghost Data Still Exists" (public GitHub project) overlaps with evidence-based deletion investigation. Kiro hackathon judges assess genuine originality.

## What is proposed, not yet proven unique
A narrowly scoped **developer-controlled deletion chaos/regression lab** combining fault injection, deterministic replay, independently verified store outcomes, and a visual explanation of exact failure paths. No "first ever" claims.

## Demo differentiation
With the same synthetic fixture and stale event: unsafe upsert recreates data and fails the assertion; protected consumer refuses it and passes; store read failures become `UNKNOWN`.

## Validation research to do
- [ ] Compare docs and demos from BigID, Transcend, DataGrail, Fides, Ghost Data Still Exists.
- [ ] Talk to 5 backend/platform developers about CI integration; record objections.
- [ ] Verify final brand/name conflicts before launch.
- [ ] Include third-party libraries and pre-existing code disclosures in submission.

Sources: `docs/SOURCES.md`.

## Primary category: Frankenstein

The core novelty claim is the **cooperation of otherwise separate engineering methods**, not generic cloud integration: a distributed fault-injection system creates testable facts; a deterministic privacy verifier checks scoped outcomes; a constrained AI agent explains those fixed facts without owning the verdict; the Ghost Graph expresses the chain in a human-friendly form. Each role has a distinct failure mode and reason to exist.

Compare against privacy DSR management vendors, chaos-engineering tools, AI investigation platforms, and visualization tools. **Do not** say no existing product combines these capabilities; establish differentiation via a working reproducible end-to-end test. AWS product count does not earn extra judging points. Costume-quality design remains valuable to overall criteria but is not the selected category. See `docs/FRANKENSTEIN-STRATEGY.md`.
