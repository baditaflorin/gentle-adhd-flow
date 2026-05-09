# Phase 3 Controls Audit

| Control                | Before | Finding                                                                                        | Phase 3 response                                  |
| ---------------------- | ------ | ---------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Star repo              | green  | Opens the GitHub repository.                                                                   | Keep.                                             |
| PayPal                 | green  | Opens the PayPal support link.                                                                 | Keep.                                             |
| Brain dump textarea    | green  | Accepts typed/pasted text.                                                                     | Add autosave.                                     |
| Extract                | green  | Adds extracted tasks/habits/capture entries.                                                   | Keep smoke coverage.                              |
| Local LLM              | yellow | Lazy local model may fail to load; deterministic fallback works but errors are not actionable. | Wrap failures with actionable status.             |
| Whisper                | yellow | Starts/stops recording; failure status is terse.                                               | Add clearer permission/error copy.                |
| Voice cue              | yellow | Always speaks even if `gentleVoice` setting is false.                                          | Wire setting or remove setting.                   |
| Focus task play icon   | green  | Selects task for focus panel.                                                                  | Keep.                                             |
| Complete task          | green  | Marks done and removes from open list.                                                         | Keep.                                             |
| Delete task            | green  | Deletes task.                                                                                  | Keep.                                             |
| Focus duration buttons | green  | Persist via workspace settings.                                                                | Keep and test persistence.                        |
| Soundscape buttons     | green  | Persist via workspace settings.                                                                | Keep and test persistence.                        |
| Begin/Land focus       | yellow | Starts Tone.js and records session on stop; no error status if audio start fails.              | Add guarded start/stop status.                    |
| Add habit              | green  | Adds a habit.                                                                                  | Keep.                                             |
| Toggle habit           | green  | Updates today's check-in.                                                                      | Keep.                                             |
| Delete habit           | green  | Removes habit.                                                                                 | Keep.                                             |
| Insights summarize     | yellow | Runs DuckDB or fallback; no try/finally error recovery.                                        | Add error state with recovery.                    |
| Export                 | yellow | Downloads raw JSON without provenance.                                                         | Replace with versioned export.                    |
| Import                 | yellow | Can throw on invalid JSON; no visible why/next step.                                           | Add boundary validation.                          |
| Clear                  | yellow | Clears tasks/sessions/captures, leaves habits; label is ambiguous.                             | Rename/split semantics so label matches behavior. |

Before counts: green 11, yellow 9, red 0, gray 0.
