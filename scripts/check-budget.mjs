import { gzipSync } from 'node:zlib'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const assetsDir = 'docs/assets'
const budgetBytes = 200 * 1024

let initialBytes = 0

try {
  for (const file of readdirSync(assetsDir)) {
    if (!file.endsWith('.js')) continue
    if (/ai-transformers|duckdb-wasm|piper-tts|tone-focus/.test(file)) continue
    initialBytes += gzipSync(readFileSync(join(assetsDir, file))).length
  }
} catch {
  process.exit(0)
}

if (initialBytes > budgetBytes) {
  throw new Error(`Initial JS payload is ${(initialBytes / 1024).toFixed(1)}KB gzip`)
}
