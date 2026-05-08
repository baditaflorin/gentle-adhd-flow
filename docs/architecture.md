# Architecture

Live site: https://baditaflorin.github.io/gentle-adhd-flow/

Repository: https://github.com/baditaflorin/gentle-adhd-flow

## C4 Context

```mermaid
flowchart TB
  Person["Adult with ADHD<br/>or ADHD-like executive friction"]
  App["Gentle ADHD Flow<br/>GitHub Pages static app"]
  GitHub["GitHub repository<br/>stars, issues, releases"]
  PayPal["PayPal support link"]
  HF["Public model hosts<br/>optional first-use model download"]

  Person --> App
  App --> GitHub
  App --> PayPal
  App --> HF
```

## C4 Container

```mermaid
flowchart LR
  subgraph Pages["GitHub Pages boundary"]
    Shell["React app shell"]
    Capture["Capture and extraction"]
    Plan["Planning scaffold"]
    Focus["Focus mode"]
    Habits["Habit tracker"]
    Insights["Local insights"]
  end

  subgraph Browser["User browser"]
    IndexedDB["IndexedDB via Yjs"]
    WebAudio["Web Audio via Tone.js"]
    WebGPU["WebGPU / WASM"]
  end

  Shell --> Capture
  Shell --> Plan
  Shell --> Focus
  Shell --> Habits
  Shell --> Insights
  Capture --> IndexedDB
  Plan --> IndexedDB
  Habits --> IndexedDB
  Focus --> WebAudio
  Insights --> WebGPU
```

## Boundaries

The frontend is the runtime. GitHub Pages serves static files only. The app does not send user brain-dumps, task lists, habit logs, or focus sessions to a project backend.
