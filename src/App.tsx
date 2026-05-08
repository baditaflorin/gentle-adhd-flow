import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Activity, Brain, GitFork, HeartHandshake } from 'lucide-react'
import { CapturePanel } from './features/capture/CapturePanel'
import { FocusPanel } from './features/focus/FocusPanel'
import { HabitPanel } from './features/habits/HabitPanel'
import { InsightsPanel } from './features/insights/InsightsPanel'
import { PlanPanel } from './features/planning/PlanPanel'
import { SettingsPanel } from './features/settings/SettingsPanel'
import { useWorkspace } from './shared/storage/useWorkspace'
import type { BuildMeta, Task } from './shared/types'
import './index.css'

const repoUrl = 'https://github.com/baditaflorin/gentle-adhd-flow'
const paypalUrl = 'https://www.paypal.com/paypalme/florinbadita'

function useBuildMeta() {
  return useQuery({
    queryKey: ['build-meta'],
    queryFn: async (): Promise<BuildMeta> => {
      const response = await fetch(`${import.meta.env.BASE_URL}build.json`, { cache: 'no-store' })
      if (!response.ok) throw new Error('Build metadata unavailable')
      return response.json()
    },
    staleTime: Number.POSITIVE_INFINITY,
  })
}

function App() {
  const { snapshot, updateWorkspace, isSynced } = useWorkspace()
  const [activeFocusTaskId, setActiveFocusTaskId] = useState<string | undefined>()
  const buildMeta = useBuildMeta()

  const focusTask = useMemo<Task | undefined>(
    () => snapshot.tasks.find((task) => task.id === activeFocusTaskId) ?? snapshot.tasks[0],
    [activeFocusTaskId, snapshot.tasks],
  )

  const completedToday = snapshot.tasks.filter((task) =>
    task.completedAt?.startsWith(todayPrefix()),
  ).length
  const openTasks = snapshot.tasks.filter((task) => task.status !== 'done').length

  return (
    <main className="app-shell">
      <section className="top-band" aria-label="Gentle ADHD Flow">
        <header className="app-header">
          <div className="brand-lockup">
            <span className="brand-mark" aria-hidden="true">
              <Brain size={24} />
            </span>
            <div>
              <p className="eyebrow">Local-first ADHD flow</p>
              <h1>Gentle ADHD Flow</h1>
            </div>
          </div>
          <nav className="header-actions" aria-label="Project links">
            <a className="icon-link" href={repoUrl} target="_blank" rel="noreferrer">
              <GitFork size={18} aria-hidden="true" />
              Star repo
            </a>
            <a className="icon-link support" href={paypalUrl} target="_blank" rel="noreferrer">
              <HeartHandshake size={18} aria-hidden="true" />
              PayPal
            </a>
          </nav>
        </header>

        <div className="summary-strip" aria-label="Today summary">
          <div>
            <span>{openTasks}</span>
            <p>open loops</p>
          </div>
          <div>
            <span>{completedToday}</span>
            <p>finished today</p>
          </div>
          <div>
            <span>{snapshot.habits.length}</span>
            <p>gentle habits</p>
          </div>
          <div>
            <span>{isSynced ? 'local' : 'syncing'}</span>
            <p>Yjs IndexedDB</p>
          </div>
        </div>
      </section>

      <section className="flow-grid" aria-label="Self-management flow">
        <CapturePanel snapshot={snapshot} updateWorkspace={updateWorkspace} />
        <PlanPanel
          snapshot={snapshot}
          updateWorkspace={updateWorkspace}
          onFocusTask={(taskId) => setActiveFocusTaskId(taskId)}
        />
        <FocusPanel focusTask={focusTask} snapshot={snapshot} updateWorkspace={updateWorkspace} />
        <HabitPanel snapshot={snapshot} updateWorkspace={updateWorkspace} />
        <InsightsPanel snapshot={snapshot} />
        <SettingsPanel snapshot={snapshot} updateWorkspace={updateWorkspace} />
      </section>

      <footer className="app-footer">
        <span className="status-pill">
          <Activity size={15} aria-hidden="true" />v{buildMeta.data?.version ?? '0.1.0'}
        </span>
        <span>Commit {buildMeta.data?.commit ?? 'local'}</span>
        <span>
          {buildMeta.data?.builtAt
            ? new Date(buildMeta.data.builtAt).toLocaleString()
            : 'Local build'}
        </span>
        <a href={repoUrl} target="_blank" rel="noreferrer">
          {repoUrl}
        </a>
      </footer>
    </main>
  )
}

function todayPrefix() {
  return new Date().toISOString().slice(0, 10)
}

export default App
