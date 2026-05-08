# Postmortem

## What Was Built

Gentle ADHD Flow v0.1.0 is a local-first GitHub Pages app for adult ADHD self-management. It supports typed brain-dumps, browser microphone recording for optional Whisper transcription, deterministic task extraction, optional local LLM refinement, Yjs-backed IndexedDB persistence, executive-function task scaffolding, Tone.js ambient focus sessions, Piper/browser voice cues, habit tracking, DuckDB-WASM insights, export/import, PWA manifest, and a local hook/test/smoke workflow.

Live site: https://baditaflorin.github.io/gentle-adhd-flow/

Repository: https://github.com/baditaflorin/gentle-adhd-flow

## Was Mode A Correct?

Yes. Mode A was the right choice. The app has no auth, no shared server state, no secrets, and no runtime mutations outside the user's browser. Browser storage, WASM, WebGPU where available, and public first-use model downloads cover the v1 flow. A backend would mostly add privacy risk and operational work.

## What Worked

- GitHub Pages from `main` `/docs` worked well once the build cleaned generated assets without deleting authored docs.
- The deterministic extractor made the core flow useful without waiting for model downloads.
- Yjs plus IndexedDB gave a good local-first foundation.
- Playwright caught a real React `useSyncExternalStore` snapshot bug before release.
- The pre-push hook now verifies unit tests, Pages build, and browser smoke locally.

## What Did Not Work

- Build metadata cannot contain the hash of the same commit that contains it. The app now fetches the public GitHub `main` commit at runtime and falls back to `build.json`.
- Piper's web package is large and emits a build-time eval warning from its bundled dependency code.
- First-use AI and TTS experiences depend on browser capability, public model downloads, and cache space.

## Surprises

- Manual chunk naming caused dynamic AI/audio chunks to be imported too eagerly. Removing manual chunks restored lazy loading.
- Zod parsing returned a fresh object each time, which broke `useSyncExternalStore` until the parsed snapshot was cached.
- `gitleaks` over generated Pages assets is slower than over source-only changes, but staged scanning is acceptable.

## Accepted Tech Debt

- The local LLM refinement is optional and small-model based; deterministic extraction remains the dependable path.
- Whisper and Piper use graceful fallbacks instead of guaranteeing every browser can run every model.
- There is no cross-device sync, notifications, calendar integration, or clinical content.
- Large Piper/WASM assets are committed so Pages can serve the local TTS runtime.

## Next Three Improvements

1. Add a model manager that shows download size, cache status, and a clearer offline/online readiness state.
2. Add OPFS export bundles with encrypted user-controlled backups.
3. Add richer task editing: due dates, recurring habits, drag ordering, and keyboard-first triage.

## Time Spent Vs Estimate

Estimated: 4 to 6 hours for a polished static v1 scaffold.

Actual: about 4 hours of implementation, documentation, test setup, Pages verification, and release hardening.
