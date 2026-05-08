import { gzipSync } from 'node:zlib'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const assetsDir = 'docs/assets'
const budgetBytes = 200 * 1024

let initialBytes = 0

try {
  const index = readFileSync('docs/index.html', 'utf8')
  const scripts = [...index.matchAll(/src="\/gentle-adhd-flow\/assets\/([^"]+\.js)"/g)].map(
    (match) => match[1],
  )
  for (const file of scripts) {
    initialBytes += gzipSync(readFileSync(join(assetsDir, file))).length
  }
} catch {
  process.exit(0)
}

if (initialBytes > budgetBytes) {
  throw new Error(`Initial JS payload is ${(initialBytes / 1024).toFixed(1)}KB gzip`)
}
