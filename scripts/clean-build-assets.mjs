import { rmSync } from 'node:fs'

for (const path of [
  'docs/assets',
  'docs/404.html',
  'docs/build.json',
  'docs/favicon.svg',
  'docs/icons.svg',
  'docs/index.html',
  'docs/manifest.webmanifest',
  'docs/onnx',
  'docs/piper',
  'docs/worker',
]) {
  rmSync(path, { force: true, recursive: true })
}
