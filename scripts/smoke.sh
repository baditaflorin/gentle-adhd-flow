#!/usr/bin/env bash
set -euo pipefail

npm run build

port_file="$(mktemp)"
PORT="${PORT:-0}" PORT_FILE="$port_file" node scripts/pages-preview.mjs &
server_pid=$!
trap 'kill "$server_pid" >/dev/null 2>&1 || true; rm -f "$port_file"' EXIT

for _ in {1..40}; do
  if [[ -s "$port_file" ]]; then
    break
  fi
  sleep 0.25
done

port="$(cat "$port_file")"

for _ in {1..40}; do
  if curl -fsS "http://127.0.0.1:${port}/gentle-adhd-flow/" >/dev/null; then
    break
  fi
  sleep 0.25
done

PLAYWRIGHT_BASE_URL="http://127.0.0.1:${port}" \
npx playwright test
