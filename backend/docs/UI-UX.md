# UI/UX notes
> The UI is built and owned by the teammate (Next.js, repo root). This file only records what the backend must keep true for the UI. Source of truth: `../../docs/backend-handoff.md`, `../../lib/case.ts`, `../../lib/trace.ts`.

## What the UI shows from backend data
| Backend fact | UI meaning |
|---|---|
| `finding: found` | A ghost at that store |
| `finding: clear` | A tombstone: a successful read found the record absent at the read time |
| `finding: unreachable` | Out of scope; not verified |
| `pendingCheck: true` | Recheck needed |
| `return` event on primary with `sourceId: backup` | The large apparition and confirmed path. Only after a new matching read |

## Rules for the backend
- Never send a state the server did not read. Unverified stays unverified.
- Event `detail` is English and includes store, UTC read time, snapshot reference and result, because the certificate compares before and after reads.
- Reload and replay in the UI never trigger server commands.

## Accessibility (frontend-owned)
Text status next to color, keyboard operation, reduced motion as still images, and a table equivalent for the map.