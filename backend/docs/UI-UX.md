# UI/UX design brief — Frankenstein with Costume-quality polish

## Design objective
A haunting but professional engineering investigation console. Horror metaphors communicate observed state, not decoration.

## Screens
1. **Graveyard:** scenario catalog, run statuses; never label unexecuted scenarios passed.
2. **Ghost Graph:** store nodes and replication edges; hover/focus shows evidence and source adapter.
3. **Séance Timeline:** step-through logical event sequence with before/after observation snapshots.
4. **Autopsy Report:** plain-language failures, direct evidence, reproduction instructions and limitations.

## State → visuals
- `PRESENT`: solid node + text label "Present".
- `ABSENT`: faded node + text label "Absent".
- `UNKNOWN`: amber dotted border + "Not verified" (not success).
- Recreated after deletion: illuminated ghost symbol with explicit "Resurrected".
- Active replay step: animated edge only if motion is enabled.
- `PASS`: green check + text, `FAIL`: red warning + text, `UNKNOWN`: amber question + text.

## Palette (suggestion)
Background `#090D14`, surface `#121A27`, text `#F0F4F8`, secondary `#AEBCCB`, verified `#48C6A4`, uncertain `#F6C36A`, failed `#FF738A`.

## Accessibility
WCAG 2.2 AA targets. Keyboard traversal and focus rings; color-independent information; `aria-live` for new verification results; reduce animation under `prefers-reduced-motion`; no rapid flashing; graphs have equivalent table/linearized evidence view.

## Demo choreography
Real data changes first, effects second. Keep Ghost Graph and timeline responsive; errors must be visible even when the effects are disabled. Design P0 = working plain evidence table; P1 = graph and animated story.

## Frankenstein proof within the product experience

- The Ghost Graph must visually link a **specific AWS stale event** to a verified residual record and a **specific failed invariant**.
- An optional-on-demand **Explain this ghost (Strands)** panel displays bounded advisory conclusions and clickable evidence IDs; label hypotheses as hypotheses, never impersonate the verifier.
- Show machine verdict and agent status separately: `verdict: FAIL`, `explanation: READY/UNAVAILABLE` are different concepts.
- Maintain a credible baseline when Bedrock is unavailable: graph/timeline and deterministic report still work with no invented AI content.
- The ghostly theme remains useful and accessible; score-optimizing decoration never outranks correct and transparent evidence.
