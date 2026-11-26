# Tasks — 03 Verification
- [ ] 1. Add a `Verifier` over read-only adapters and make every finding go through it. (VERIFY-1,7)
- [ ] 2. Test that failed, denied and timed-out reads give `unreachable`, never `clear`. (VERIFY-2,6)
- [ ] 3. Use `ConsistentRead` for primary reads and test the request flag. (VERIFY-3)
- [ ] 4. Add S3 version handling and a test with a delete marker over a retained version. (VERIFY-4)
- [ ] 5. Add English event detail templates and a test that no ARN, account ID or raw error text appears. (VERIFY-5,6)
- [ ] 6. Add the three separate negative tests: wrong source, import without confirmation, duplicate command. (VERIFY-1, CMD-4,9)