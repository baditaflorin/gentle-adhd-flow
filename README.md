# Gentle ADHD Flow

![Mode A GitHub Pages](https://img.shields.io/badge/deployment-GitHub%20Pages-2f6b58)
![License MIT](https://img.shields.io/badge/license-MIT-3d5a80)
![Version 0.1.0](https://img.shields.io/badge/version-0.1.0-c85a3e)

Live site: https://baditaflorin.github.io/gentle-adhd-flow/

Repository: https://github.com/baditaflorin/gentle-adhd-flow

Support: https://www.paypal.com/paypalme/florinbadita

Local-first ADHD self-management: voice brain-dumps become tasks, focus sessions, habits, and gentle planning. The v1 app is a pure GitHub Pages static site: no backend, no accounts, no secrets in the frontend, and personal data stays in browser storage.

![Gentle ADHD Flow screenshot](docs/screenshot.png)

## Quickstart

```bash
npm install
make dev
make test
make build
make pages-preview
```

## Status

V1 is live. Build metadata is visible in the footer of the published app, and the footer links back to the GitHub repository so visitors can star it.

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

Privacy notes: https://github.com/baditaflorin/gentle-adhd-flow/blob/main/docs/privacy.md

Postmortem: https://github.com/baditaflorin/gentle-adhd-flow/blob/main/docs/postmortem.md
