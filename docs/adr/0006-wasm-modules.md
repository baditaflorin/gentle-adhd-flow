# 0006: WASM Modules

## Status

Accepted

## Context

The requested stack includes DuckDB, Whisper, Piper, WebGPU, and local browser inference while staying on GitHub Pages.

## Decision

Use browser-loaded WASM and WebGPU-capable libraries only after user action:

- DuckDB-WASM for local insights.
- Transformers.js for Whisper ASR and optional local text-to-text refinement.
- Piper TTS web assets for local speech output.
- Tone.js for Web Audio synthesis.

GitHub Pages cannot set COOP/COEP headers. The app therefore avoids requiring SharedArrayBuffer-only paths and falls back to non-threaded/WASM or native browser APIs when needed.

## Consequences

Initial load stays small. First use of AI/audio modules can be slower and may need network access to fetch public model files.

## Alternatives Considered

Bundling model weights into the repository was rejected because it would bloat Pages and slow first load. A backend inference server was rejected by ADR 0001.
