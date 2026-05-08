# Gentle ADHD Flow

Live site: https://baditaflorin.github.io/gentle-adhd-flow/

Repository: https://github.com/baditaflorin/gentle-adhd-flow

Support: https://www.paypal.com/paypalme/florinbadita

Local-first ADHD self-management: voice brain-dumps become tasks, focus sessions, habits, and gentle planning. The v1 app is a pure GitHub Pages static site: no backend, no accounts, no secrets in the frontend.

## Quickstart

```bash
npm install
make dev
make test
make build
make pages-preview
```

## Status

The initial Pages shell is published first, then each feature lands in small commits. Build metadata is visible in the footer of the published app.

## Architecture

```mermaid
flowchart LR
  User["User browser"] --> Pages["GitHub Pages static app"]
  Pages --> IDB["IndexedDB / OPFS"]
  Pages --> WASM["Lazy WASM and WebGPU modules"]
  WASM --> Whisper["Whisper ASR"]
  WASM --> Piper["Piper TTS"]
  WASM --> DuckDB["DuckDB-WASM insights"]
  Pages --> Tone["Tone.js focus audio"]
```

## Documentation

Architecture decisions: https://github.com/baditaflorin/gentle-adhd-flow/tree/main/docs/adr

Deploy notes: https://github.com/baditaflorin/gentle-adhd-flow/blob/main/docs/deploy.md
