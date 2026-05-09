# 0067 State-Management Convention

## Status

Accepted.

## Context

Saved workspace state lives in Yjs/IndexedDB. Unsubmitted capture text was transient.

## Decision

Persistent user state remains in the workspace snapshot. Ephemeral draft text is stored in `localStorage` under a namespaced key and can be cleared independently.

Full workspace replacement uses `replaceWorkspace`; incremental edits use `updateWorkspace`.

## Consequences

Reloading preserves in-progress capture text without changing the canonical workspace schema.

## Alternatives Considered

- Store draft in the workspace: rejected because unsubmitted capture text is not yet part of the user's plan/history.
