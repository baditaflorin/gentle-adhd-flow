#!/usr/bin/env bash
set -euo pipefail

npm run build

PORT="${PORT:-4173}" node scripts/pages-preview.mjs &
server_pid=$!
trap 'kill "$server_pid" >/dev/null 2>&1 || true' EXIT

for _ in {1..40}; do
  if curl -fsS "http://127.0.0.1:${PORT}/gentle-adhd-flow/" >/dev/null; then
    break
  fi
  sleep 0.25
done

npx playwright test
