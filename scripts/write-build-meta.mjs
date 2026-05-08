import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const buildPath = new URL('../public/build.json', import.meta.url)

function readGit(command, fallback) {
  try {
    return execSync(command, { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim()
  } catch {
    return fallback
  }
}

const existing = existsSync(buildPath) ? JSON.parse(readFileSync(buildPath, 'utf8')) : undefined
const shouldRefresh = process.env.REFRESH_BUILD_META === '1' || !existing
const commit = shouldRefresh ? readGit('git rev-parse --short HEAD', 'local') : existing.commit
const builtAt = shouldRefresh
  ? readGit('git show -s --format=%cI HEAD', new Date().toISOString())
  : existing.builtAt

mkdirSync(new URL('../public', import.meta.url), { recursive: true })
writeFileSync(
  buildPath,
  `${JSON.stringify(
    {
      version: packageJson.version,
      commit,
      builtAt,
    },
    null,
    2,
  )}\n`,
)
