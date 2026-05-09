# 0061 Input Pathway Coverage Policy

## Status

Accepted.

## Context

The app originally accepted typed/pasted text and audio recording only. Users often already have thoughts in Notes, text files, Markdown, or another tab.

## Decision

Capture input supports:

- Typed and manual pasted text.
- Text/Markdown/JSON files loaded into the capture box.
- Multiple text-like files appended in deterministic filename order.
- Drag/drop of text or text-like files.
- Permission-aware clipboard read with a clear fallback.
- A sample brain dump that populates the same capture field.
- Capture draft autosave.

URL fetching and OCR/image input remain out of scope for Phase 3.

## Consequences

The app becomes usable for existing notes without adding a server. CORS-heavy URL ingestion is honestly documented instead of half-built.

## Alternatives Considered

- Add URL input with a public proxy: rejected because it would introduce privacy and reliability risk.
- Add image OCR: rejected as a new feature class.
