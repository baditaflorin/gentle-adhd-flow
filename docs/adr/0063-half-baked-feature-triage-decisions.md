# 0063 Half-Baked Feature Triage Decisions

## Status

Accepted.

## Context

Phase 3 found features that were partly present but incomplete.

## Decision

| Feature                  | Decision                   | Reason                                                                 |
| ------------------------ | -------------------------- | ---------------------------------------------------------------------- |
| Gentle voice setting     | Finish                     | It exists in persisted settings and should control voice cue behavior. |
| Raw state export/import  | Finish                     | It is essential for backup and restore.                                |
| Capture input import     | Finish                     | It lets users bring their real notes.                                  |
| URL input                | Hide/document out of scope | Static Pages cannot fetch arbitrary sites through CORS.                |
| OCR/image input          | Delete from scope          | Not claimed and outside the product's current surface.                 |
| API/curl/export snippets | Delete from scope          | Not meaningful without a backend API.                                  |

## Consequences

Production UI should not contain controls that imply missing features.

## Alternatives Considered

- Leave partial controls in place: rejected because it creates user confusion.
