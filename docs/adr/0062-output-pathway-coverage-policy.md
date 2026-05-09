# 0062 Output Pathway Coverage Policy

## Status

Accepted.

## Context

V1 exported a raw app snapshot. That is useful for developers but weak for users because it lacks provenance, versioning, and a documented contract.

## Decision

Phase 3 output supports:

- Versioned full-state JSON export with app, schema, generated-at, and source metadata.
- Import of both new envelope exports and legacy raw v1 snapshots.
- Copyable open-plan text.
- Print/PDF-friendly plan output through browser print.
- Small shareable URL hash state with clear size limits.

API/curl/embed output is out of scope because this is a static personal browser app.

## Consequences

Backup and restore become a real user path. The export envelope becomes the stable contract.

## Alternatives Considered

- Keep raw snapshot only: rejected because it is brittle across versions.
- Add cloud share links: rejected because Phase 3 does not add runtime infrastructure.
