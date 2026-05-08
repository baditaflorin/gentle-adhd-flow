# Runbook

Mode A has no server runtime.

## Local Checks

```bash
make lint
make test
make build
make smoke
```

## Debugging

- If the live site 404s after a push, wait for GitHub Pages propagation and confirm Pages is set to `main` / `/docs`.
- If assets 404, confirm Vite `base` is `/gentle-adhd-flow/`.
- If AI modules fail, use the deterministic extraction fallback and check browser WebGPU/WASM support.
- If local data disappears, inspect browser site data for `baditaflorin.github.io`.

## Resource Sizing

The static shell is small. Optional model downloads can use hundreds of MB of browser cache depending on selected models.
