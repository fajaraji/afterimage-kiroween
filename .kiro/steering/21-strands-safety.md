---
inclusion: fileMatch
fileMatchPattern: "**/*agent*"
---
> **Deferred:** the hackathon category is Costume Contest, so the Strands investigator and agent-action work this file covers are not planned. Apply it only if the user reopens that scope.

# Strands product-agent safety

- Product agent is **read-only** investigator, not an orchestrator or deletion/verdict engine. Kiro dev agents and product Strands agent are separate.
- Call only allowlisted server tools returning bounded verified synthetic evidence; never shell, AWS management actions, network fetching or record mutation.
- Server injects authoritative deterministic verdict; agent output is schema validated, cannot override it.
- Every material explanation cites evidence IDs, admits UNKNOWN, and degrades gracefully when Bedrock is unavailable.
- Prefer single Strands TypeScript agent on Lambda, Bedrock region/model configured via environment and IAM role (no static secrets).
- Do not create agent swarms or persistent memory for hackathon MVP.
