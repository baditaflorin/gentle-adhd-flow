import { useEffect, useState } from 'react'
import { GitFork, HeartHandshake } from 'lucide-react'
import './index.css'

type BuildMeta = {
  version: string
  commit: string
  builtAt: string
}

const repoUrl = 'https://github.com/baditaflorin/gentle-adhd-flow'
const paypalUrl = 'https://www.paypal.com/paypalme/florinbadita'

function App() {
  const [buildMeta, setBuildMeta] = useState<BuildMeta>({
    version: '0.1.0',
    commit: 'local',
    builtAt: new Date().toISOString(),
  })

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}build.json`)
      .then((response) => (response.ok ? response.json() : undefined))
      .then((meta: BuildMeta | undefined) => {
        if (meta) setBuildMeta(meta)
      })
      .catch(() => undefined)
  }, [])

  return (
    <main className="min-h-screen bg-[#f7f3ea] text-[#17201b]">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-6">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d8d0bf] pb-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#53665a]">
              Local-first ADHD self-management
            </p>
            <h1 className="text-3xl font-semibold">Gentle ADHD Flow</h1>
          </div>
          <nav className="flex flex-wrap gap-2" aria-label="Project links">
            <a className="link-button" href={repoUrl} target="_blank" rel="noreferrer">
              <GitFork size={18} aria-hidden="true" />
              Star on GitHub
            </a>
            <a className="link-button" href={paypalUrl} target="_blank" rel="noreferrer">
              <HeartHandshake size={18} aria-hidden="true" />
              Support
            </a>
          </nav>
        </header>

        <div className="grid flex-1 place-items-center py-16">
          <div className="max-w-3xl">
            <p className="mb-4 text-lg text-[#53665a]">
              Voice brain-dump to task extraction, executive-function scaffolding, focus
              music, and humane habit tracking. This first published shell is static and
              ready for GitHub Pages; the full local workflow lands in the next commits.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {['Capture', 'Plan', 'Focus'].map((item) => (
                <div key={item} className="rounded-lg border border-[#d8d0bf] bg-white/70 p-4">
                  <h2 className="font-semibold">{item}</h2>
                  <p className="text-sm text-[#53665a]">Mode A, browser-only, no account.</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="flex flex-wrap justify-between gap-3 border-t border-[#d8d0bf] pt-4 text-sm text-[#53665a]">
          <span>Version {buildMeta.version}</span>
          <span>Commit {buildMeta.commit}</span>
          <span>Built {new Date(buildMeta.builtAt).toLocaleString()}</span>
        </footer>
      </section>
    </main>
  )
}

export default App
