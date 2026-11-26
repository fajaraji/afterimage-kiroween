> **Superseded:** this spec belongs to the earlier Frankenstein plan. The hackathon category is Costume Contest. Do not implement it unless the user reopens that scope.

# Spec 07 — Tasks (optional until deterministic P0 passes)

- [ ] 1. Implement read-only evidence provider with authorization and bounded responses. (AGENT-1,5)
- [ ] 2. Install current compatible Strands TypeScript SDK and Bedrock model provider; document verified SDK versions and model access. (AGENT-1)
- [ ] 3. Define the four allowlisted read-only tools; test unauthorized runs and injected tool-output instructions. (AGENT-1,5,6)
- [ ] 4. Implement typed Zod output validation and server-injected verifier verdict. (AGENT-2,4)
- [ ] 5. Deploy an explain Lambda with narrowly scoped IAM and bounded timeouts/tokens; budget/rate-limit invocations. (AGENT-3,5)
- [ ] 6. Add tests for protected PASS, unsafe FAIL, unknown store, invalid evidence, Bedrock denied/unavailable fallback. (AGENT-2,3,4)
- [ ] 7. Integrate an optional 'Explain this ghost' button; agent cannot be a critical path of core demo. (AGENT-3)
