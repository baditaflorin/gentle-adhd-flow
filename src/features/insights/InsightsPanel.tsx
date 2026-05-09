import { useState } from 'react'
import { Database, RefreshCw } from 'lucide-react'
import { Button, ToolPanel } from '../../shared/ui'
import type { AppSnapshot } from '../../shared/types'
import { runInsights, type InsightReport } from './duckdbInsights'

type Props = {
  snapshot: AppSnapshot
}

export function InsightsPanel({ snapshot }: Props) {
  const [report, setReport] = useState<InsightReport | undefined>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()

  async function refresh() {
    setLoading(true)
    setError(undefined)
    try {
      setReport(await runInsights(snapshot))
    } catch {
      setError('Summary failed. Your tasks are still saved; try again after reload.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ToolPanel title="Insights" className="insights-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Insights</p>
          <h2>Local DuckDB</h2>
        </div>
        <span className="soft-badge">
          <Database size={14} aria-hidden="true" />
          {report?.engine ?? 'ready'}
        </span>
      </div>

      <div className="metric-grid">
        <div>
          <span>
            {report?.openTasks ?? snapshot.tasks.filter((task) => task.status !== 'done').length}
          </span>
          <p>open</p>
        </div>
        <div>
          <span>
            {report?.completedTasks ??
              snapshot.tasks.filter((task) => task.status === 'done').length}
          </span>
          <p>done</p>
        </div>
        <div>
          <span>
            {report?.focusMinutes ??
              snapshot.focusSessions.reduce((total, session) => total + session.minutes, 0)}
          </span>
          <p>focus min</p>
        </div>
      </div>

      <p className="insight-copy">
        {error ?? report?.message ?? 'Run a local summary when the board feels noisy.'}
      </p>

      <Button onClick={refresh} disabled={loading}>
        <RefreshCw size={17} aria-hidden="true" />
        {loading ? 'Running' : 'Summarize'}
      </Button>
    </ToolPanel>
  )
}
