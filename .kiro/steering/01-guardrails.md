---
inclusion: always
---
# Absolute safety / evidence constraints

1. Never connect to production, import PII, or add arbitrary external delete endpoints.
2. Never infer deletion from UI animation, HTTP success, or missing data without direct store observation.
3. `UNKNOWN` on missing/failed/inaccessible evidence; never report unknown as `PASS`.
4. Event source, logical sequence, subject generation, and fixture version must be traceable.
5. Unsafe consumer mode must be deliberately vulnerable and explicitly labeled as a **test fixture**.
6. Isolate runs and prevent arbitrary filesystem paths, SQL strings, or commands from API parameters.
7. Obtain user approval before changing deployment security, enabling paid services, or installing external powers/MCP tools.

Details: `#[[file:backend/docs/SECURITY-PRIVACY.md]]`.
