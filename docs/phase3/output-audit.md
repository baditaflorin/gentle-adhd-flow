# Phase 3 Output Audit

Status key: green = works fully, yellow = works partially, red = claimed or implied but broken, gray = not built and not claimed.

| Exit path                    | Before | After | Evidence                                                                      | Phase 3 result                     |
| ---------------------------- | ------ | ----- | ----------------------------------------------------------------------------- | ---------------------------------- |
| Full JSON export             | yellow | green | Export is a versioned envelope with app version, commit, generated-at, state. | Implemented.                       |
| Full JSON import round-trip  | yellow | green | Envelope and legacy raw v1 snapshots import with validation.                  | Covered by e2e.                    |
| Copy tasks to clipboard      | gray   | green | Plan panel copies deterministic plain text.                                   | Covered by e2e clipboard test.     |
| Download task list           | gray   | green | Full state export plus copy plan covers user and automation handoff.          | No separate partial export needed. |
| Share link                   | gray   | green | Settings writes `#state=` for small snapshots and opens shared state.         | Covered by e2e.                    |
| Print/PDF                    | gray   | green | Plan panel has Print button and print CSS.                                    | Implemented.                       |
| Screenshot                   | gray   | gray  | Not claimed.                                                                  | Out of scope.                      |
| Embed/API/curl output        | gray   | gray  | Not meaningful for a local-first personal app.                                | Out of scope in ADR 0062.          |
| Focus session history export | yellow | green | Included in versioned full-state export.                                      | Implemented.                       |
| Habit history export         | yellow | green | Included in versioned full-state export.                                      | Implemented.                       |

Before counts: green 0, yellow 4, red 0, gray 6. After counts: green 8, yellow 0, red 0, gray 2 documented out of scope.
