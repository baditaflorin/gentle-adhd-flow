import { CalendarCheck, Check, Clock, Play, Trash2 } from 'lucide-react'
import { Button, EmptyState, ToolPanel } from '../../shared/ui'
import type { AppSnapshot, Task, WorkspaceUpdater } from '../../shared/types'

type Props = {
  snapshot: AppSnapshot
  updateWorkspace: WorkspaceUpdater
  onFocusTask: (taskId: string) => void
}

export function PlanPanel({ snapshot, updateWorkspace, onFocusTask }: Props) {
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

  return (
    <ToolPanel title="Plan" className="plan-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Scaffold</p>
          <h2>Next actions</h2>
        </div>
        <span className="soft-badge">{tasks.length} open</span>
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
