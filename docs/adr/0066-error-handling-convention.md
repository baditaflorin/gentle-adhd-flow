# 0066 Error-Handling Convention

## Status

Accepted.

## Context

Some async controls could throw or leave status unclear. Phase 3 requires actionable errors.

## Decision

UI boundary handlers catch errors and surface a short domain message with:

- what failed,
- why it likely happened,
- the next action.

Library/dynamic-import failures are converted to fallback behavior where possible. JSON and file parsing errors are validated at the boundary.

## Consequences

Users see "Import failed: this file is not a Gentle ADHD Flow export. Choose a JSON export or paste text into Capture." instead of stack traces or silent no-ops.

## Alternatives Considered

- Global error boundary only: rejected because boundary-specific recovery is better.
