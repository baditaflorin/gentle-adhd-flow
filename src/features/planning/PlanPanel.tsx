import { CalendarCheck, Check, Clipboard, Clock, Play, Printer, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { copyText, printPage } from '../../shared/browserIO'
import { Button, EmptyState, ToolPanel } from '../../shared/ui'
import type { AppSnapshot, Task, WorkspaceUpdater } from '../../shared/types'
import { formatPlanText } from '../../shared/workspaceIO'

type Props = {
  snapshot: AppSnapshot
  updateWorkspace: WorkspaceUpdater
  onFocusTask: (taskId: string) => void
}

export function PlanPanel({ snapshot, updateWorkspace, onFocusTask }: Props) {
  const [status, setStatus] = useState('ready')
  const tasks = snapshot.tasks.filter((task) => task.status !== 'done')

  function patchTask(taskId: string, patch: Partial<Task>) {
    updateWorkspace((draft) => {
      const task = draft.tasks.find((item) => item.id === taskId)
      if (task) Object.assign(task, patch, { updatedAt: new Date().toISOString() })
    })
  }

  function completeTask(taskId: string) {
    patchTask(taskId, {
      status: 'done',
      completedAt: new Date().toISOString(),
    })
  }

  function deleteTask(taskId: string) {
    updateWorkspace((draft) => {
      draft.tasks = draft.tasks.filter((task) => task.id !== taskId)
    })
  }

  async function copyPlan() {
    try {
      await copyText(formatPlanText(snapshot))
      setStatus('copied')
    } catch {
      setStatus('copy failed')
    }
  }

  function printPlan() {
    setStatus('print ready')
    printPage()
  }

  return (
    <ToolPanel title="Plan" className="plan-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Scaffold</p>
          <h2>Next actions</h2>
        </div>
        <span className="soft-badge">
          {tasks.length} open · {status}
        </span>
      </div>

      <div className="button-row">
        <Button onClick={copyPlan} tone="quiet">
          <Clipboard size={17} aria-hidden="true" />
          Copy plan
        </Button>
        <Button onClick={printPlan} tone="quiet">
          <Printer size={17} aria-hidden="true" />
          Print
        </Button>
      </div>

      <div className="task-list">
        {tasks.length === 0 ? (
          <EmptyState>Capture one thought to make the first step visible.</EmptyState>
        ) : (
          tasks.map((task) => (
            <article className={`task-card energy-${task.energy}`} key={task.id}>
              <div className="task-card-main">
                <h3>{task.title}</h3>
                <p>{task.nextAction}</p>
              </div>
              <div className="task-meta" aria-label="Task metadata">
                <span>
                  <Clock size={14} aria-hidden="true" />
                  {task.estimateMinutes}m
                </span>
                <span>
                  <CalendarCheck size={14} aria-hidden="true" />
                  {task.dueDate ?? task.urgency}
                </span>
                <span>{task.context}</span>
              </div>
              <div className="task-actions">
                <Button
                  onClick={() => onFocusTask(task.id)}
                  tone="primary"
                  aria-label={`Focus on ${task.title}`}
                >
                  <Play size={16} aria-hidden="true" />
                </Button>
                <Button onClick={() => completeTask(task.id)} aria-label={`Complete ${task.title}`}>
                  <Check size={16} aria-hidden="true" />
                </Button>
                <Button
                  onClick={() => deleteTask(task.id)}
                  tone="quiet"
                  aria-label={`Delete ${task.title}`}
                >
                  <Trash2 size={16} aria-hidden="true" />
                </Button>
              </div>
            </article>
          ))
        )}
      </div>
    </ToolPanel>
  )
}
