# Phase 3 Feature Claims Audit

| Source          | Claim                                      | Before | Finding                                                                           | Phase 3 response                                                    |
| --------------- | ------------------------------------------ | ------ | --------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| README          | Voice brain-dumps become tasks             | yellow | Typed brain dumps work; Whisper may not transcribe if local model is unavailable. | Keep claim but phrase as microphone capture with graceful fallback. |
| README          | Focus sessions                             | green  | Focus start/stop records sessions.                                                | Keep.                                                               |
| README          | Habits                                     | green  | Habit add/toggle/delete works.                                                    | Keep.                                                               |
| README          | Gentle planning                            | green  | Tasks show next actions and metadata.                                             | Keep.                                                               |
| README          | Personal data stays in browser storage     | green  | IndexedDB/Yjs local storage only.                                                 | Keep.                                                               |
| README          | Build metadata visible in footer           | green  | Version and commit are visible.                                                   | Keep.                                                               |
| ADR 0005        | IndexedDB / OPFS / localStorage            | yellow | IndexedDB is used; OPFS is not used.                                              | Clarify docs to avoid implying OPFS is active.                      |
| ADR 0006        | Whisper, Piper, DuckDB, WebGPU lazy-loaded | yellow | Lazy imports exist; status does not always make failures actionable.              | Add user-facing failure paths.                                      |
| In-app Settings | Gentle voice setting                       | red    | Setting exists in schema but no visible control and Voice cue ignores it.         | Finish by adding a setting toggle and honoring it.                  |
| README          | Quickstart                                 | green  | Commands are valid.                                                               | Re-verify after changes.                                            |
| README          | Live site                                  | green  | Pages serves `/docs`.                                                             | Keep.                                                               |

Before counts: green 7, yellow 3, red 1, gray 0.
