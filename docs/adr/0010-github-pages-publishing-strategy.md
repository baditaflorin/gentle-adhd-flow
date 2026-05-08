# 0010: GitHub Pages Publishing Strategy

## Status

Accepted

## Context

The live GitHub Pages URL is a first-class deliverable from the first commit. The repo also needs documentation under `docs/`.

## Decision

Publish from `main` branch `/docs`.

Vite builds to `docs/` with `emptyOutDir: false`. A clean script removes generated assets while preserving authored documentation such as `docs/adr/`. The base path is `/gentle-adhd-flow/`. `404.html` is copied from `index.html` for SPA fallback. Asset filenames are hashed by Vite.

Live URL: https://baditaflorin.github.io/gentle-adhd-flow/

## Consequences

Built frontend assets and authored docs coexist in `docs/`. The `.gitignore` must not ignore `docs/`.

## Alternatives Considered

A `gh-pages` branch was rejected because it adds branch choreography and makes the publish artifact less visible in `main`.
