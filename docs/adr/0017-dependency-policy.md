# 0017: Dependency Policy

## Status

Accepted

## Context

The app uses specialized browser AI/audio/storage tools. Dependencies should be production-grade and lazy where heavy.

## Decision

Use maintained, battle-tested packages:

- React, Vite, TypeScript, Tailwind CSS, zod, TanStack Query.
- Yjs and y-indexeddb for local document persistence.
- DuckDB-WASM for local analytics.
- Transformers.js for Whisper and local text refinement.
- Piper TTS Web for local speech.
- Tone.js for generative ambient audio.
- Vitest and Playwright for tests.

## Consequences

The code avoids custom implementations where a strong library exists. Heavy packages are dynamically imported and excluded from the initial payload budget.

## Alternatives Considered

Hand-rolled storage, SQL, transcription, TTS, or audio synthesis were rejected because mature libraries exist.
