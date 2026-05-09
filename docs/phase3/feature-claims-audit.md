# Phase 3 Feature Claims Audit

| Source          | Claim                                      | Before | After | Finding                                                                           | Phase 3 result                          |
| --------------- | ------------------------------------------ | ------ | ----- | --------------------------------------------------------------------------------- | --------------------------------------- |
| README          | Voice brain-dumps become tasks             | yellow | green | Typed brain dumps work; Whisper may not transcribe if local model is unavailable. | README now describes graceful fallback. |
| README          | Focus sessions                             | green  | green | Focus start/stop records sessions.                                                | Kept.                                   |
| README          | Habits                                     | green  | green | Habit add/toggle/delete works.                                                    | Kept.                                   |
| README          | Gentle planning                            | green  | green | Tasks show next actions and metadata.                                             | Kept.                                   |
| README          | Personal data stays in browser storage     | green  | green | IndexedDB/Yjs local storage only.                                                 | Kept.                                   |
| README          | Build metadata visible in footer           | green  | green | Version and commit are visible.                                                   | Kept.                                   |
| ADR 0005        | IndexedDB local storage                    | green  | green | ADR accurately states IndexedDB.                                                  | Kept.                                   |
| ADR 0006        | Whisper, Piper, DuckDB, WebGPU lazy-loaded | yellow | green | Lazy imports exist and failures now surface actionable statuses.                  | Updated behavior.                       |
| In-app Settings | Gentle voice setting                       | red    | green | Setting exists in schema and now has a real control.                              | Tested.                                 |
| README          | Quickstart                                 | green  | green | Commands are valid.                                                               | Re-verified.                            |
| README          | Live site                                  | green  | green | Pages serves `/docs`.                                                             | Kept.                                   |

Before counts: green 7, yellow 3, red 1, gray 0. After counts: green 11, yellow 0, red 0, gray 0.
