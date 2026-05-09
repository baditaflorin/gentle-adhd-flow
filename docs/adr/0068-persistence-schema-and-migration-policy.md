# 0068 Persistence Schema and Migration Policy

## Status

Accepted.

## Context

The app currently stores schema version 1 snapshots. Future versions need explicit migration or clear failure.

## Decision

`parseWorkspaceSnapshot` accepts:

- current raw snapshots,
- versioned export envelopes,
- legacy raw schema version 1 snapshots.

Unknown schema versions fail with an actionable error and leave existing state intact.

## Consequences

Imports become safe and old v1 exports remain usable.

## Alternatives Considered

- Blind `JSON.parse` plus `appSnapshotSchema.parse`: rejected because errors are not user-friendly.
