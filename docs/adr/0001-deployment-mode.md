# 0001: Deployment Mode

## Status

Accepted

## Context

Gentle ADHD Flow handles private brain-dumps, tasks, habits, focus sessions, and local audio/AI helpers. The bootstrap requires GitHub Pages first and a runtime backend only when browser or build-time options are insufficient.

## Decision

Use Mode A: Pure GitHub Pages.

The app is a Vite static site served from `main` branch `/docs`. User state stays in IndexedDB through Yjs persistence. Heavy capabilities are lazy-loaded in the browser: DuckDB-WASM for insights, Transformers.js Whisper/local text models for optional local AI, Piper for local TTS, WebGPU where available, and Tone.js for focus audio.

## Consequences

- No backend, accounts, server database, Docker, nginx, or runtime secrets are part of v1.
- Core state is private to the browser profile unless the user exports it.
- Cross-device sync is out of scope for v1.
- Some AI/audio modules need a first-use model download and graceful fallback when browsers lack WebGPU or model support.

## Alternatives Considered

- Mode B: rejected because there is no shared static dataset to precompute.
- Mode C: rejected because v1 does not need auth, server-side mutations, private API keys, or cross-device sync.
