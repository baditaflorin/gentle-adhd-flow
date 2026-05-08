# 0002: Architecture Overview And Module Boundaries

## Status

Accepted

## Context

The product flow is capture, extraction, scaffolding, focus, habit tracking, and reflection. The codebase needs clear boundaries so experimental local AI modules do not leak complexity into the core app.

## Decision

Use feature folders under `src/features/`:

- `capture`: typed and voice brain-dump capture, deterministic extraction, optional local LLM refinement.
- `planning`: task board, next actions, energy and urgency scaffolding.
- `focus`: Tone.js ambient sessions and session logging.
- `habits`: low-shame habit tracking and streak calculations.
- `insights`: DuckDB-WASM summaries with JavaScript fallback.
- `settings`: local capability status, export, and reset controls.

Shared code lives under `src/shared/` for storage, schemas, build metadata, and UI primitives.

## Consequences

Feature code can be tested independently. Heavy libraries remain behind dynamic imports owned by their feature adapters.

## Alternatives Considered

A single app-level store and component tree was rejected because it would make the flow harder to test and extend.
