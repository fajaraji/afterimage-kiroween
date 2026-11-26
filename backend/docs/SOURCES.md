# Official references and further reading (checked Nov 7, 2026)

## Kiro
- https://kiro.dev/docs/getting-started/first-project/
- https://kiro.dev/docs/specs/
- https://kiro.dev/docs/specs/feature-specs/
- https://kiro.dev/docs/specs/correctness/ (IDE-only)
- https://kiro.dev/docs/steering/
- https://kiro.dev/docs/hooks/ (schema `version: v1`; IDE/CLI hooks, not Web)
- https://kiro.dev/docs/custom-agents/
- https://kiro.dev/docs/skills/
- https://kiro.dev/docs/powers/
- https://kiro.dev/docs/mcp/configuration/
- https://kiro.dev/docs/web/

## Hackathon
- https://kiroween.devpost.com/rules
- https://kiroween.devpost.com/resources

## Industry and technical
- https://www.edpb.europa.eu/ (search 2026 coordinated action on right to erasure)
- https://docs.aws.amazon.com/AmazonS3/latest/userguide/DeletingObjectVersions.html
- https://debezium.io/documentation/reference/stable/transformations/event-flattening.html
- https://github.com/G26karthik/ghost-data-still-exists (prior art; inspect rights and actual functionality)
- https://docs.transcend.io/ (privacy request integration testing)
- https://www.openlineage.io/ (lineage representation, optional future work)

The presence of a reference is not a claim that its content is bundled, copied, or licensed for reuse. Verify current APIs/versions when installing external tools.

## Inspiration / safety risk (verify assertions independently)
- https://medium.com/@chenyuan19920509/ten-ai-agents-destroyed-production-data-not-one-vendor-published-a-postmortem-8907211a68d2 — opinion/incident compilation; do not assume all incidents or lack of postmortems are independently proven.
- https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html — workflow orchestration and observable execution.
- https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transaction-apis.html — conditional/transactional writes; verify service limitations and IAM before adopting.
