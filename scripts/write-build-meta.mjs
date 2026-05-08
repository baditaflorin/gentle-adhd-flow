import { execSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

function readGit(command, fallback) {
  try {
    return execSync(command, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
  } catch {
    return fallback
  }
}

const commit = readGit('git rev-parse --short HEAD', 'local')

mkdirSync(new URL('../public', import.meta.url), { recursive: true })
writeFileSync(
  new URL('../public/build.json', import.meta.url),
  `${JSON.stringify(
    {
      version: packageJson.version,
      commit,
      builtAt: new Date().toISOString(),
    },
    null,
    2,
  )}\n`,
)
