# Phase 3 Controls Audit

| Control                | Before | After | Finding                                      | Phase 3 result                       |
| ---------------------- | ------ | ----- | -------------------------------------------- | ------------------------------------ |
| Star repo              | green  | green | Opens the GitHub repository.                 | Kept.                                |
| PayPal                 | green  | green | Opens the PayPal support link.               | Kept.                                |
| Brain dump textarea    | green  | green | Accepts typed/pasted text.                   | Autosaves draft.                     |
| File                   | gray   | green | New capture file input.                      | Imports text-like files.             |
| Paste                  | gray   | green | New clipboard-read input.                    | Permission-aware fallback.           |
| Sample                 | gray   | green | New first-run sample loader.                 | Writes into capture field.           |
| Extract                | green  | green | Adds extracted tasks/habits/capture entries. | Covered by smoke.                    |
| Local LLM              | yellow | green | Lazy local model may fail to load.           | Actionable fallback message.         |
| Whisper                | yellow | green | Starts/stops recording.                      | Clear permission/transcription path. |
| Voice cue              | yellow | green | Previously ignored `gentleVoice`.            | Now honors Settings toggle.          |
| Clear draft            | gray   | green | New draft-only reset.                        | Clears localStorage draft.           |
| Focus task play icon   | green  | green | Selects task for focus panel.                | Kept.                                |
| Complete task          | green  | green | Marks done and removes from open list.       | Kept.                                |
| Delete task            | green  | green | Deletes task.                                | Kept.                                |
| Copy plan              | gray   | green | New output control.                          | Covered by e2e.                      |
| Print                  | gray   | green | New output control.                          | Print CSS added.                     |
| Focus duration buttons | green  | green | Persist via workspace settings.              | Kept.                                |
| Soundscape buttons     | green  | green | Persist via workspace settings.              | Kept.                                |
| Begin/Land focus       | yellow | green | Starts Tone.js and records session on stop.  | Guarded audio error status.          |
| Add habit              | green  | green | Adds a habit.                                | Kept.                                |
| Toggle habit           | green  | green | Updates today's check-in.                    | Kept.                                |
| Delete habit           | green  | green | Removes habit.                               | Kept.                                |
| Insights summarize     | yellow | green | Runs DuckDB or fallback.                     | Try/finally recovery state.          |
| Voice setting          | red    | green | Setting existed but had no control.          | Toggle added and tested.             |
| Export                 | yellow | green | Raw JSON before.                             | Versioned envelope.                  |
| Import                 | yellow | green | Could throw on invalid JSON before.          | Boundary validation.                 |
| Share                  | gray   | green | New small-state share path.                  | Covered by e2e.                      |
| Open link              | gray   | green | New share-link import path.                  | Covered by e2e.                      |
| Reset workspace        | yellow | green | Replaces ambiguous Clear.                    | Full reset using default snapshot.   |

Before counts: green 11, yellow 9, red 1, gray 8. After counts: green 29, yellow 0, red 0, gray 0.
