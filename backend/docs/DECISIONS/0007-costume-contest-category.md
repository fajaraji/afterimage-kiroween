# ADR-0007: Costume Contest is the hackathon category

**Status:** accepted (user decision).

## Decision
Submit Afterimage in the Kiroween **Costume Contest** category. The product is the teammate's haunted case file: an erased customer returns from a retained backup, and a fresh read proves it. The backend supplies the real AWS evidence behind that story.

## Consequences
- Active specs: 01, 02, 03, 05, 06. The number 04 is unused: the investigation UI spec was removed because the teammate built that UI in the Next.js frontend. Numbers are kept so Kiro's run history for spec 01 stays attached.
- The earlier Frankenstein plan (Strands and Bedrock investigator, Step Functions and SQS replay, agent-action work) was removed from the repo. It remains in git history, before the commit titled "Remove the superseded Frankenstein plan".
- If the category is ever reopened, start a fresh plan from the frontend contract rather than restoring the old files.