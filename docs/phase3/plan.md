# Phase 3 Plan

Priority is by real-user impact on end-to-end usability, not implementation novelty.

| Rank | Catalog item | Enhancement                                                           | User impact                                                          | Commit scope                                          |
| ---- | ------------ | --------------------------------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------- |
| 1    | A1, A2       | Add capture-side text/Markdown/JSON file input with format sniffing.  | Users can load existing notes.                                       | `feat(input): add capture file import`                |
| 2    | A1, A4       | Add drag/drop text-file and dropped-text support.                     | Users can use desktop workflows naturally.                           | `feat(input): support drag and drop capture import`   |
| 3    | A6           | Add permission-aware clipboard read with fallback.                    | Users can paste from notes apps without manual select/copy friction. | `feat(input): add clipboard capture`                  |
| 4    | A7           | Add sample loader as first-class input.                               | First-run exploration works without replacing real-data paths.       | `feat(input): add sample brain dump loader`           |
| 5    | A8, I38      | Autosave capture draft and restore on reload.                         | User does not lose in-progress thoughts.                             | `feat(persistence): autosave capture drafts`          |
| 6    | B9, B11, I41 | Versioned full-state export envelope.                                 | Backup/restore is trustworthy and future-compatible.                 | `feat(output): add versioned state export`            |
| 7    | H36, H37     | Robust import parser for raw v1 and envelope JSON.                    | Invalid imports fail clearly without crashing.                       | `fix(output): validate state imports`                 |
| 8    | B10          | Copy open plan to clipboard.                                          | Users can take tasks into email, chat, or another task app.          | `feat(output): copy plan text`                        |
| 9    | B13          | Print plan action and print CSS.                                      | Users can make a paper plan or PDF.                                  | `feat(output): add print plan path`                   |
| 10   | B12          | Small shareable URL hash for snapshot state.                          | Lightweight handoff across tabs/devices for small data.              | `feat(output): add shareable state links`             |
| 11   | C18          | Add visible gentle-voice setting and honor it.                        | No placeholder setting remains.                                      | `fix(settings): honor gentle voice preference`        |
| 12   | C18, I40     | Split ambiguous Clear into clear capture draft and factory reset.     | Destructive control does exactly what it says.                       | `fix(settings): clarify reset controls`               |
| 13   | C16          | Add actionable async errors for LLM, Whisper, Tone, DuckDB.           | Users know what failed and what to try next.                         | `fix(errors): make async failures actionable`         |
| 14   | D20, D23     | Move workspace import/export into a shared IO boundary.               | One canonical data contract.                                         | `refactor(workspace): centralize import export`       |
| 15   | D21          | Add shared download/clipboard helpers.                                | Avoid repeated browser IO logic.                                     | `refactor(browser): share file and clipboard helpers` |
| 16   | E24, E25     | Split capture input helpers from `CapturePanel`.                      | UI remains readable as input pathways grow.                          | `refactor(input): isolate capture input parsing`      |
| 17   | F28          | Delete unused starter assets.                                         | Dead code removed.                                                   | `chore: remove unused starter assets`                 |
| 18   | H35, H36     | Replace unsafe build metadata cast with schema validation.            | External JSON boundary is validated.                                 | `fix(types): validate build metadata`                 |
| 19   | H35, H36     | Replace extractor `z.custom` result schema with canonical schemas.    | Domain output schema is real.                                        | `fix(types): validate extraction result schema`       |
| 20   | I39          | Add persisted schema migration helpers.                               | Older state is migrated or reported.                                 | `feat(persistence): add workspace migrations`         |
| 21   | I41          | Add round-trip import/export unit tests.                              | Backup/restore stays real.                                           | `test(output): cover state round trip`                |
| 22   | A1, B10      | Add e2e coverage for file import, copy plan, share import, and reset. | Real-user paths are tested.                                          | `test(e2e): cover completeness paths`                 |
| 23   | J42, J45     | Update README with verified checklist and limitations.                | Claims match reality.                                                | `docs: align README with shipped behavior`            |
| 24   | K46, K47     | Run stranger test and fix top three issues.                           | Validate the whole path cold.                                        | `test: record and fix stranger test findings`         |
| 25   | Release      | Bump version, postmortem, tag, push.                                  | Published Phase 3 release.                                           | `chore: release v0.2.0`                               |

Success gate: all green rows for claimed input/output/control paths, full hook chain passing, live Pages verification, and Phase 3 postmortem written.
