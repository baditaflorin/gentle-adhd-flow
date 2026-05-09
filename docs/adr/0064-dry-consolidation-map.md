# 0064 DRY Consolidation Map

## Status

Accepted.

## Context

The audit found boundary parsing and browser IO living inside UI components. More input/output paths would duplicate that logic.

## Decision

Consolidate:

- Workspace export/import/migration into `src/shared/workspaceIO.ts`.
- Browser download, clipboard, and print helpers into `src/shared/browserIO.ts`.
- Capture file/drop/clipboard text parsing into `src/features/capture/captureInput.ts`.
- Build metadata validation into the shared type schema.

## Consequences

UI components call named domain helpers instead of owning file parsing and serialization details.

## Alternatives Considered

- Keep logic in components: rejected because adding more paths would multiply error handling.
- Add a broad service layer: rejected because the current app is small and does not need indirection everywhere.
