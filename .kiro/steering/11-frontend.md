---
inclusion: fileMatch
fileMatchPattern: ["app/**/*.tsx", "components/**/*.tsx", "lib/**/*.ts"]
---
# Frontend (teammate-owned, read-only for backend tasks)
The frontend is the Next.js static export at the repository root, built by the teammate. Do not edit these files during backend work unless the user asks. Treat `lib/case.ts` (`CaseFile`, `isCaseFile`, `startDemo`, `runDemo`), `lib/gateway.ts` and `docs/backend-contract.md` as the browser API the backend must serve. A backend change that needs a frontend change is raised with the user first.

Keep the frontend's accessibility properties intact: color is never the only status cue, evidence has a text or table equivalent, and reduced motion is honored. The UI must only show states the server actually observed.