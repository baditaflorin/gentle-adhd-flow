# 0065 Module Boundaries and Dependency Direction

## Status

Accepted.

## Context

The app is small but already has domain features, storage, UI components, and browser IO. Phase 3 adds more input/output surfaces.

## Decision

Dependency direction is:

`features UI -> shared browser/workspace helpers -> shared schemas/primitives`

Shared helpers must not import feature UI. Storage modules may import schemas and migrations, but not React components.

## Consequences

Input/output code can be tested without rendering UI components.

## Alternatives Considered

- Add lint-enforced boundaries now: deferred because TypeScript project references are not split and this phase avoids tooling churn.
