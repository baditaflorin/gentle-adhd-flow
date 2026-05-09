# Phase 3 Input Audit

Status key: green = works fully, yellow = works partially, red = claimed or implied but broken, gray = not built and not claimed.

| Entry point                   | Before | Evidence                                                                                                 | Required Phase 3 response                                                  |
| ----------------------------- | ------ | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Typed brain dump              | green  | Main textarea accepts user text and extracts tasks/habits.                                               | Keep and cover with smoke tests.                                           |
| Pasted plain text             | green  | Browser textarea paste works naturally.                                                                  | Add explicit paste guidance/status only if needed.                         |
| Pasted HTML                   | yellow | HTML pasted into textarea becomes flattened visible text, but no HTML-to-text normalization is explicit. | Normalize clipboard/file text through one input pipeline.                  |
| File upload into capture      | gray   | No capture-side file input. Settings import only accepts full app state.                                 | Add `.txt`, `.md`, `.json` text import for brain dumps.                    |
| Drag and drop into capture    | gray   | No drag/drop handlers on the capture area.                                                               | Add text-file and dropped-text support.                                    |
| Clipboard read button         | gray   | Textarea supports manual paste but there is no permission-aware clipboard read control.                  | Add explicit "Paste" control with graceful fallback.                       |
| URL input                     | gray   | No URL fetch path. GitHub Pages cannot bypass arbitrary CORS.                                            | Keep out of scope; document "paste rendered text instead."                 |
| Image input                   | gray   | Whisper supports audio capture, but OCR/image input is not claimed.                                      | Permanently out of scope for Phase 3.                                      |
| Audio recording               | yellow | Whisper button records audio; if transcription fails status says unavailable.                            | Keep, but make errors actionable and respect voice settings.               |
| Multi-file input              | gray   | No batch input path.                                                                                     | Support multiple text files for capture import.                            |
| Mobile picker                 | yellow | Existing hidden JSON file picker works for state only; capture lacks mobile file input.                  | Use normal file input with `multiple` for capture text files.              |
| Sample/demo input             | gray   | README has no sample loader; placeholder text is the only sample.                                        | Add one first-class sample loader that writes into the user's capture box. |
| Deep links/imported URL state | gray   | No hash importer.                                                                                        | Add small share-link import/export for snapshot state.                     |
| Imported state                | yellow | Settings import accepts raw schema v1 JSON, but JSON parse errors can crash the handler.                 | Add schema envelope, validation, and actionable errors.                    |
| Restored autosave             | yellow | Workspace persists in IndexedDB; in-progress capture text does not survive reload.                       | Add capture draft autosave and one-click clear.                            |

Before counts: green 2, yellow 5, red 0, gray 8.
