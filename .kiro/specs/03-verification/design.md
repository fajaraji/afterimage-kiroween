# Design — 03 Independent verifier (AWS-first revision)

Use pure verdict reducer in `packages/engine` and AWS-specific observer adapters in `packages/aws-adapters`. Directly query primary and analytics DynamoDB base tables (strongly consistent reads where supported), and observe S3 exports. Do not rely on UI/client claims or Step Functions command completion alone. For a versioned object scenario (P1), inspect actual object versions/delete markers, not only regular GET/HEAD.

Observation fields: runId, scenarioId, storeId, generation, `PRESENT|ABSENT|UNKNOWN`, checkedAt, evidenceId, adapterVersion and scope; align with shared contract. `PRESENT` required store -> FAIL, else any UNKNOWN/unreachable/mismatched required observation -> UNKNOWN, else all ABSENT and invariants pass -> PASS. Persist evidence in S3 and metadata in DynamoDB. Unit/PBT tests mock transport, integration tests observe actual AWS sandbox. Avoid claims of compliance certification.
