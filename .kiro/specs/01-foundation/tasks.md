# Tasks — 01 Foundation (AWS-first revision)

- [x] 1. Reconcile domain contracts and runtime validation with AWS-first data model. (FOUNDATION-3)
- [x] 2. Implement pure in-memory test adapters to validate create/delete/observe logic locally, without calling them production evidence. (FOUNDATION-2)
- [x] 3. Define independent primary, analytics and export adapter interfaces and allowlisted store IDs; AWS implementations are spec 06. (FOUNDATION-2,3)
- [x] 4. Implement seeded fixture initialization/reset and deterministic fixture hash. (FOUNDATION-1,5)
- [x] 5. Add run isolation, invalid-input and failed-reset tests. (FOUNDATION-4,5)
- [ ] 6. Implement real AWS adapters through spec 06, then verify same fixture in deployed dev sandbox. (FOUNDATION-2)
- [ ] 7. Document actual results in README/build log; never mark complete without tests.

## Frontend contract alignment (added after the merge)
- [x] 8. Rename store `exports` to `export` and add `backup` as the fourth allowlisted store across contracts, engine, adapters and tests. (FOUNDATION-2,3)
- [ ] 9. Add a pure finding mapping from observation to `unchecked | found | clear | unreachable` with `pendingCheck`, with tests for each case including failed reads. (FOUNDATION-6)
- [ ] 10. Add the `CaseFile` contract and runtime validator in `packages/contracts`, with a test that validates fixtures copied from `startDemo` and `runDemo`. (FOUNDATION-7)
