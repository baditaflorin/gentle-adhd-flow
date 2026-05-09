# Phase 3 Input Audit

Status key: green = works fully, yellow = works partially, red = claimed or implied but broken, gray = not built and not claimed.

| Entry point                   | Before | After | Evidence                                                               | Phase 3 result                                         |
| ----------------------------- | ------ | ----- | ---------------------------------------------------------------------- | ------------------------------------------------------ |
| Typed brain dump              | green  | green | Main textarea accepts user text and extracts tasks/habits.             | Covered by smoke tests.                                |
| Pasted plain text             | green  | green | Browser textarea paste works naturally.                                | Kept.                                                  |
| Pasted HTML                   | yellow | green | Capture input normalization strips tags and common HTML entities.      | Shared input pipeline.                                 |
| File upload into capture      | gray   | green | Capture has multi-file `.txt/.md/.csv/.json` import.                   | Covered by e2e file import test.                       |
| Drag and drop into capture    | gray   | green | Textarea handles dropped text and text-like files.                     | Implemented with same parser as file input.            |
| Clipboard read button         | gray   | green | Capture has permission-aware Paste button with fallback message.       | Implemented.                                           |
| URL input                     | gray   | gray  | Static Pages cannot bypass arbitrary CORS.                             | Out of scope in ADR 0061; paste rendered text instead. |
| Image input                   | gray   | gray  | OCR/image input is not claimed.                                        | Out of scope in ADR 0061.                              |
| Audio recording               | yellow | green | Whisper failure and permission paths now explain the fallback.         | Actionable errors added.                               |
| Multi-file input              | gray   | green | Capture file input accepts multiple files in deterministic name order. | Covered by unit test.                                  |
| Mobile picker                 | yellow | green | Capture uses standard file input with `multiple`.                      | Works through browser picker.                          |
| Sample/demo input             | gray   | green | Sample button writes into the same capture box as real user data.      | Implemented.                                           |
| Deep links/imported URL state | gray   | green | Settings creates and opens `#state=` links for small snapshots.        | Covered by e2e share-link test.                        |
| Imported state                | yellow | green | Settings imports envelope and legacy raw v1 JSON with validation.      | Covered by e2e export/reset/import test.               |
| Restored autosave             | yellow | green | Capture draft is restored from localStorage after reload.              | Covered by e2e reload test.                            |

Before counts: green 2, yellow 5, red 0, gray 8. After counts: green 13, yellow 0, red 0, gray 2 documented out of scope.
