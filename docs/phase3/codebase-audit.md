# Phase 3 Codebase Audit

Measurement date: 2026-05-09.

## DRY Findings

| Area                       | Before | Evidence                                                                                                  | Phase 3 response                        |
| -------------------------- | ------ | --------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| JSON export/import         | yellow | Export logic lives in `SettingsPanel`; import parses directly in the component.                           | Move to a shared workspace IO boundary. |
| Clipboard/download helpers | yellow | Download logic will otherwise duplicate across settings/share/copy paths.                                 | Add shared browser IO helpers.          |
| Boundary validation        | yellow | `App.tsx` casts `build.json`; settings imports raw `JSON.parse`; extractor result schema uses `z.custom`. | Centralize schema validation helpers.   |

## SOLID Findings

| Module              | Finding                                                                            | Phase 3 response                                                      |
| ------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `CapturePanel.tsx`  | Handles text state, extraction, LLM, voice, recording, and will need input import. | Keep UI component but move input helpers out before it grows further. |
| `SettingsPanel.tsx` | Handles capabilities, import/export, reset, and will need sharing/import policy.   | Move import/export mechanics into shared modules.                     |
| `yWorkspace.ts`     | Owns storage and migration assumption; only v1 is accepted.                        | Add explicit migration/parser boundary.                               |
| `index.css`         | 517 lines but coherent global app stylesheet.                                      | Accept for now; no polish refactor in Phase 3.                        |

## Dead Code

| Item                   | Before                           | Phase 3 response |
| ---------------------- | -------------------------------- | ---------------- |
| `src/assets/react.svg` | Unreferenced Vite starter asset. | Delete.          |
| `src/assets/vite.svg`  | Unreferenced Vite starter asset. | Delete.          |

## TODO / FIXME / XXX / HACK

Source scan excluding built `docs/assets`: zero project-owned TODO/FIXME/XXX/HACK occurrences. Third-party bundled Piper asset contains upstream TODO comments and is excluded from source health metrics.

## Type Safety Holes

| Item                            | Before                                           | Phase 3 response                                            |
| ------------------------------- | ------------------------------------------------ | ----------------------------------------------------------- |
| `App.tsx` build metadata cast   | Unsafe `as BuildMeta`.                           | Validate with Zod schema.                                   |
| `extractTasks.ts` result schema | Uses `z.custom<Task>()` and `z.custom<Habit>()`. | Reuse canonical task/habit schemas.                         |
| AI/voice boundaries             | `unknown`/casts around dynamic libraries.        | Keep as explicitly-marked boundary code and narrow outputs. |
| DuckDB row casts                | Casts table rows to record.                      | Add small row-normalization helper.                         |

## Inconsistent Patterns

| Area              | Finding                                                                                           | Phase 3 response                                            |
| ----------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Error handling    | Some async handlers catch and set status; others can throw or leave loading true.                 | Add consistent actionable status handling at UI boundaries. |
| State replacement | Settings import uses update recipe for full replacement while storage exposes `replaceWorkspace`. | Use replacement path directly.                              |
| Export shape      | Raw snapshot export has no metadata; build metadata has separate schema.                          | Define canonical export envelope.                           |

## Test Coverage Holes

| Path                     | Before    | Phase 3 response                        |
| ------------------------ | --------- | --------------------------------------- |
| Import invalid JSON      | Untested. | Add unit tests.                         |
| Export/import round-trip | Untested. | Add unit and e2e coverage.              |
| Draft autosave           | Untested. | Add e2e or unit coverage.               |
| Settings persistence     | Untested. | Add e2e coverage through reload/import. |

After implementation:

- DRY findings closed: workspace import/export, browser IO, and capture input parsing now have shared modules.
- TODO/FIXME/XXX/HACK debt: still 0 project-owned occurrences.
- Dead starter assets: 0 after deleting `src/assets/react.svg` and `src/assets/vite.svg`.
- Unsafe casts outside documented dynamic-library boundaries: reduced; remaining casts are in AI/voice/WASM/DuckDB boundary code or literal unions.
- Primary e2e paths: 3 tests cover happy capture, file import/autosave/export/import, copy/share/voice setting.

Before metrics: DRY findings 3, TODO debt 0 project-owned, dead files 2, unsafe casts 9 source occurrences, primary e2e paths 1.
After metrics: DRY findings 0, TODO debt 0 project-owned, dead files 0, primary e2e paths 3.
