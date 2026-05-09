# Phase 3 Postmortem

## Audit Grids

| Audit          | Before                            | After                                                     |
| -------------- | --------------------------------- | --------------------------------------------------------- |
| Input          | green 2, yellow 5, red 0, gray 8  | green 13, yellow 0, red 0, gray 2 documented out of scope |
| Output         | green 0, yellow 4, red 0, gray 6  | green 8, yellow 0, red 0, gray 2 documented out of scope  |
| Controls       | green 11, yellow 9, red 1, gray 8 | green 29, yellow 0, red 0, gray 0                         |
| Feature claims | green 7, yellow 3, red 1, gray 0  | green 11, yellow 0, red 0, gray 0                         |

## Half-Baked Feature Triage

| Feature              | Outcome                        | Rationale                                                                                  |
| -------------------- | ------------------------------ | ------------------------------------------------------------------------------------------ |
| Gentle voice setting | Finished                       | It already existed in persisted state; now it has a visible toggle and controls Voice cue. |
| Raw export/import    | Finished                       | Replaced with a versioned export envelope while preserving legacy raw v1 imports.          |
| Capture file input   | Finished                       | Users can import text-like note files and multi-file batches.                              |
| URL input            | Hidden/documented out of scope | Static GitHub Pages cannot fetch arbitrary user URLs through CORS.                         |
| OCR/image input      | Deleted from scope             | Not claimed and would add a new feature class.                                             |
| API/curl output      | Deleted from scope             | Not meaningful without a backend API.                                                      |

## Codebase Health

| Metric                            | Before | After                                         |
| --------------------------------- | ------ | --------------------------------------------- |
| DRY findings in core modules      | 3      | 0                                             |
| Project-owned TODO/FIXME/XXX/HACK | 0      | 0                                             |
| Dead starter assets               | 2      | 0                                             |
| Primary e2e real-user paths       | 1      | 3                                             |
| Import/export unit tests          | 0      | 5 workspace IO tests plus capture input tests |

Remaining casts are in dynamic AI/voice/WASM/DuckDB boundary code or literal-union UI lists. JSON boundaries now use Zod validation.

## Stranger Test

The private-browser stranger test is documented at `docs/phase3/stranger-test.md`.

Top three findings fixed:

1. Share links now become visible in the address bar even if clipboard copy succeeds.
2. Export/import now has a real versioned contract and validation.
3. Voice cue now honors the user-visible voice setting.

## Documentation/Reality Mismatches Fixed

- README now lists verified features instead of broad aspirational claims.
- README limitations explicitly call out URL/CORS, OCR absence, local model size, share-link size limits, and no sync server.
- Phase 3 audits record before/after status instead of only initial findings.
- ADRs 0060-0071 document the completeness decisions.

## What Surprised Me

- The largest usability gap was not extraction quality; it was getting ordinary user notes into and out of the app.
- The old raw JSON export technically worked but did not feel trustworthy as a backup.
- Clipboard success can hide the generated share link from the user unless the URL is also reflected in the address bar.

## Still-Open Completeness Gaps

1. No external-human usability test has been run yet; the substitute was a private-browser pass.
2. Drag/drop is implemented but not covered by a dedicated browser test.
3. Local Whisper/Piper behavior still depends heavily on browser/device support and large lazy assets.
4. Large workspaces cannot use share links and must use file export/import.
5. There is no cross-device sync by design.

## Honest Take

Yes, a stranger can now use the app for their own text-based brain dump work end-to-end: bring in notes, extract tasks/habits, focus, copy/print/share/export, reset, and restore without needing developer help.

It is still not a universal input tool. A stranger with screenshots, arbitrary web pages, or a demand for cross-device sync will hit deliberate boundaries. Within the promised local-first text/voice workflow, it now feels usable rather than like a demo.
