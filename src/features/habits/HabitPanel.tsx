import { useState } from 'react'
import { Check, Heart, Plus, Trash2 } from 'lucide-react'
import { newId } from '../../shared/id'
import { localDateKey } from '../../shared/time'
import { Button, EmptyState, ToolPanel } from '../../shared/ui'
import type { AppSnapshot, WorkspaceUpdater } from '../../shared/types'
import { currentStreak, toggleHabit } from './habitMath'

type Props = {
  snapshot: AppSnapshot
  updateWorkspace: WorkspaceUpdater
}

export function HabitPanel({ snapshot, updateWorkspace }: Props) {
  const [title, setTitle] = useState('')
  const today = localDateKey()

  function addHabit() {
    if (!title.trim()) return
    updateWorkspace((draft) => {
      draft.habits.unshift({
        id: newId('habit'),
        title: title.trim(),
        cue: 'Daily check-in',
        createdAt: new Date().toISOString(),
        checkIns: {},
      })
    })
    setTitle('')
  }

  function toggle(id: string) {
    updateWorkspace((draft) => {
      const index = draft.habits.findIndex((habit) => habit.id === id)
      if (index >= 0) draft.habits[index] = toggleHabit(draft.habits[index])
    })
  }

  function remove(id: string) {
    updateWorkspace((draft) => {
      draft.habits = draft.habits.filter((habit) => habit.id !== id)
    })
  }

  return (
    <ToolPanel title="Habits" className="habit-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Habits</p>
          <h2>Gentle streaks</h2>
        </div>
        <span className="soft-badge">
          <Heart size={14} aria-hidden="true" />
          no shame
        </span>
      </div>

      <div className="inline-form">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Add a tiny habit"
          aria-label="New habit"
        />
        <Button onClick={addHabit} tone="primary" aria-label="Add habit">
          <Plus size={17} aria-hidden="true" />
        </Button>
      </div>

      <div className="habit-list">
        {snapshot.habits.length === 0 ? (
          <EmptyState>One tiny repeatable thing is enough.</EmptyState>
        ) : (
          snapshot.habits.map((habit) => {
            const done = Boolean(habit.checkIns[today])
            return (
              <article className="habit-row" key={habit.id}>
                <button
                  className={`check-dot ${done ? 'done' : ''}`}
                  onClick={() => toggle(habit.id)}
                  type="button"
                  aria-label={`Toggle ${habit.title}`}
                >
                  {done && <Check size={16} aria-hidden="true" />}
                </button>
                <div>
                  <h3>{habit.title}</h3>
                  <p>
                    {currentStreak(habit)} day streak · {habit.cue}
                  </p>
                </div>
                <Button onClick={() => remove(habit.id)} tone="quiet" aria-label={`Delete ${habit.title}`}>
                  <Trash2 size={16} aria-hidden="true" />
                </Button>
              </article>
            )
          })
        )}
      </div>
    </ToolPanel>
  )
}
