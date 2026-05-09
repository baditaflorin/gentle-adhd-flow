# 0069 Type-Safety Policy at Boundaries

## Status

Accepted.

## Context

The audit found unsafe casts at JSON and dynamic-library boundaries.

## Decision

JSON loaded from files, URLs, or build artifacts is validated with Zod. Dynamic AI/voice library outputs may use `unknown`, but narrowing helpers must convert them before returning app data.

`any`, `@ts-ignore`, and unsafe casts are not allowed in app-domain code.

## Consequences

The app remains strict while acknowledging that browser and ML library boundaries are inherently dynamic.

## Alternatives Considered

- Ban all casts absolutely: rejected as impractical for third-party dynamic imports.
