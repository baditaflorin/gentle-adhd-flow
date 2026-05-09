# Phase 3 Output Audit

Status key: green = works fully, yellow = works partially, red = claimed or implied but broken, gray = not built and not claimed.

| Exit path                    | Before | Evidence                                                                                                                | Required Phase 3 response                                              |
| ---------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Full JSON export             | yellow | Settings downloads raw snapshot only; no app/version/provenance envelope.                                               | Version the export envelope and keep raw v1 import compatibility.      |
| Full JSON import round-trip  | yellow | Import accepts raw snapshot but parse failures are not caught and file input cannot re-import same file twice reliably. | Add robust parser, reset file input, and tests.                        |
| Copy tasks to clipboard      | gray   | No copy button for the plan.                                                                                            | Add copyable plain-text plan output.                                   |
| Download task list           | gray   | No task-list-only export.                                                                                               | Defer; full state export plus copy plan covers user exit path.         |
| Share link                   | gray   | No hash/share state output.                                                                                             | Add hash-encoded state for small snapshots with documented size limit. |
| Print/PDF                    | gray   | Browser print works but no print-focused action or CSS.                                                                 | Add print button and print CSS hiding controls/chrome.                 |
| Screenshot                   | gray   | Not claimed.                                                                                                            | Keep out of scope.                                                     |
| Embed/API/curl output        | gray   | Not meaningful for a local-first personal app.                                                                          | Keep out of scope in ADR.                                              |
| Focus session history export | yellow | Included in raw snapshot export but not discoverable.                                                                   | Covered by versioned state export.                                     |
| Habit history export         | yellow | Included in raw snapshot export but not discoverable.                                                                   | Covered by versioned state export.                                     |

Before counts: green 0, yellow 4, red 0, gray 6.
