# 0060 Completeness Audit Findings and Phase 3 Success Metrics

## Status

Accepted.

## Context

Phase 3 is about making the existing app usable by a stranger with their own data. The audit found the biggest gaps in capture input pathways, export/import reliability, settings honesty, and documentation drift.

## Decision

Phase 3 success is measured by claimed paths turning green:

- Capture accepts typed, pasted, uploaded, dragged, clipboard-read, sample, restored, and hash-imported text/state inputs.
- Output supports versioned state export/import, copy plan, print plan, and small share links.
- Every visible setting and button has an end-to-end effect.
- Project-owned TODO/FIXME/HACK debt remains zero.
- Boundary JSON is validated with schemas.

## Consequences

The work stays in Mode A and does not add a backend, accounts, OCR, arbitrary URL scraping, or inference-engine changes.

## Alternatives Considered

- Add larger new capabilities first: rejected because completeness gaps block current users.
- Polish the interface first: rejected because visual polish would hide incomplete behavior.
