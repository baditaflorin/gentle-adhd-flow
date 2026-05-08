# 0013: Testing Strategy

## Status

Accepted

## Context

The app has deterministic planning logic plus browser integrations that need smoke coverage.

## Decision

Use Vitest for unit tests, Testing Library for component tests, and Playwright for one smoke/happy-path browser test. `make test` runs unit tests. `make smoke` builds, serves `docs/` with the Pages base path, and runs Playwright.

## Consequences

Core extraction and habit logic remain fast to verify. Browser-only AI modules are covered by adapter fallbacks rather than downloading large models in CI-like local hooks.

## Alternatives Considered

Full model-loading e2e tests were rejected because they would be slow and network-dependent.
