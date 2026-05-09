# Phase 3 Findings

## Top 5 Usability Gaps

1. Users can type text, but cannot load ordinary `.txt` or `.md` brain-dump files into Capture.
2. Export exists, but it is a raw implementation snapshot without provenance, schema version, or future-compatible envelope.
3. Import can fail unclearly on invalid JSON and cannot import the same chosen file twice without browser quirks.
4. The `gentleVoice` setting exists in persisted state but is not user-controllable and is not honored by Voice cue.
5. There is no copy/print/share exit path for the plan a user just created.

## Top 5 Half-Baked Features

| Feature              | Decision                   | Rationale                                                          |
| -------------------- | -------------------------- | ------------------------------------------------------------------ |
| Gentle voice setting | Finish                     | It is already in schema and affects a visible control.             |
| Raw export/import    | Finish                     | Users need trustworthy backup/restore.                             |
| Capture text import  | Finish                     | The product is unusable for existing notes without this.           |
| URL input            | Hide/document out of scope | Static GitHub Pages cannot fetch arbitrary user URLs through CORS. |
| Image/OCR input      | Delete from scope          | Not claimed and would add a new feature class.                     |

## Top 5 Codebase Pain Points

1. Boundary parsing is done inside UI components instead of shared IO modules.
2. Export shape is not versioned.
3. Async UI error states are inconsistent.
4. Starter assets remain in source.
5. Tests cover the demo path but not import/export/persistence paths.

## Top 5 Documentation/Reality Mismatches

1. README says voice brain-dumps become tasks, but local Whisper may be unavailable; the fallback needs to be explicit.
2. ADR 0005 mentions OPFS even though v1 uses IndexedDB.
3. Settings implies full private control, but `gentleVoice` has no visible control.
4. Export is documented only by button label, not by format contract.
5. Limitations are not listed in README, especially URL/CORS and local model size.

## Fully Usable Means

1. A stranger can type, paste, drop, or upload their own text brain dump and see extracted tasks/habits.
2. They can back up, restore, copy, print, or share their current plan without knowing the data model.
3. Every visible setting and button does exactly what its label says.
4. Invalid inputs explain what failed, why it matters, and the next useful action.
5. Reloading the page preserves both saved workspace state and the current unfinished capture draft.

## Phase 3 Success Metrics

- Input audit: all claimed input rows green; out-of-scope rows documented in ADRs.
- Output audit: full state export/import, copy plan, print, and small share link green.
- Controls audit: zero red/yellow production controls after implementation.
- Codebase audit: zero project-owned TODO/FIXME/XXX/HACK, zero dead starter assets, no unsafe casts outside documented boundaries.
- Tests: unit tests for IO boundaries and e2e tests for capture/import/export/copy/share happy paths.

## Out Of Scope

No new backend, accounts, sync server, OCR/image input, arbitrary URL scraping, notifications, dark mode, command palette, visual redesign, or Phase 2 inference-engine changes.
