> **Update:** see `docs/KIRO-AWS-WORKFLOW.md` for the powers that apply to this project (CDK/IaC and Observability).

# Kiro optional integrations and powers — opt-in, not automatically installed

The starter deliberately **does not enable MCP tools**, broaden agent permissions, or install a paid power. This protects synthetic-only testing and avoids giving a coding agent unnecessary credentials.

| Capability | When worth enabling | Safe rollout |
|---|---|---|
| Kiro Powers (Postman) | You have real API endpoints and need repeatable request/response testing | Review provider and scopes; install via Kiro Powers panel; test only local lab endpoints |
| Kiro Powers (Figma) | You have an actual Figma UX design | Grant project-specific read access only; avoid exposing unrelated design files |
| MCP testing tool | Built-in HTTP test scripts lack an important integration you can justify | Add narrow workspace config to `.kiro/settings/mcp.json`, never secrets; require human approvals |
| Built-in GitHub integration / Kiro Web | You are ready to work via PRs and collaborate across surfaces | Commit the repo first and connect it; configure repo access intentionally |
| Kiro CLI | Need repeated local prompts or terminal workflows | Use checked-in steering/specs and review permissions |
| Correctness (PBT) | Core EARS requirements are stable and testable | Use Kiro **IDE** (current Web does not support this feature), preserve portable test cases |

Avoid installing servers solely to list them in your hackathon write-up. Describe only tools you truly used and how they improved engineering outcomes.

Official docs: https://kiro.dev/docs/powers/ , https://kiro.dev/docs/mcp/configuration/ , https://kiro.dev/docs/specs/correctness/
