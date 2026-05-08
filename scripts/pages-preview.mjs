import { createServer } from 'node:http'
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'

const port = Number(process.env.PORT ?? 4173)
const host = process.env.HOST ?? '127.0.0.1'
const base = '/gentle-adhd-flow'
const root = 'docs'

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.wasm': 'application/wasm',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
}

function resolvePath(url) {
  const pathname = decodeURIComponent(new URL(url, `http://${host}:${port}`).pathname)
  if (pathname === '/') return join(root, 'index.html')
  const withoutBase = pathname.startsWith(base) ? pathname.slice(base.length) || '/' : pathname
  const candidate = normalize(join(root, withoutBase))
  if (!candidate.startsWith(root)) return join(root, '404.html')
  if (existsSync(candidate) && statSync(candidate).isFile()) return candidate
  return join(root, 'index.html')
}

const server = createServer((request, response) => {
  const filePath = resolvePath(request.url ?? '/')
  const ext = extname(filePath)
  response.setHeader('Content-Type', contentTypes[ext] ?? 'application/octet-stream')
  response.setHeader('Cache-Control', 'no-store')
  response.end(readFileSync(filePath))
})

server.listen(port, host, () => {
  const address = server.address()
  const actualPort = typeof address === 'object' && address ? address.port : port
  if (process.env.PORT_FILE) writeFileSync(process.env.PORT_FILE, `${actualPort}`)
  console.log(`Pages preview: http://${host}:${actualPort}${base}/`)
})
