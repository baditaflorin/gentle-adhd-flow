import { useEffect, useRef, useState } from 'react'
import { AudioWaveform, Pause, Play } from 'lucide-react'
import { newId } from '../../shared/id'
import { minutesBetween } from '../../shared/time'
import { Button, ToolPanel } from '../../shared/ui'
import type { AppSnapshot, Task, WorkspaceUpdater } from '../../shared/types'
import { FocusCanvas } from './FocusCanvas'
import { startAmbient, type AmbientHandle } from './toneEngine'

type Props = {
  focusTask: Task | undefined
  snapshot: AppSnapshot
  updateWorkspace: WorkspaceUpdater
}

export function FocusPanel({ focusTask, snapshot, updateWorkspace }: Props) {
  const [running, setRunning] = useState(false)
  const [startedAt, setStartedAt] = useState<string | undefined>()
  const [elapsed, setElapsed] = useState(0)
  const [status, setStatus] = useState('ready')
  const ambient = useRef<AmbientHandle | undefined>(undefined)

  useEffect(() => {
    if (!running || !startedAt) return
    const interval = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000))
    }, 1000)
    return () => window.clearInterval(interval)
  }, [running, startedAt])

  async function start() {
    try {
      const handle = await startAmbient(snapshot.settings.soundscape)
      ambient.current = handle
      setStartedAt(new Date().toISOString())
      setElapsed(0)
      setRunning(true)
      setStatus('running')
    } catch {
      setStatus('audio blocked; try again after a click')
    }
  }

  function stop() {
    ambient.current?.stop()
    ambient.current = undefined
    setRunning(false)
    setStatus('landed')
    const endedAt = new Date().toISOString()
    if (startedAt) {
      updateWorkspace((draft) => {
        draft.focusSessions.unshift({
          id: newId('focus'),
          taskId: focusTask?.id,
          taskTitle: focusTask?.title ?? 'Open focus',
          startedAt,
          endedAt,
          minutes: minutesBetween(startedAt, endedAt),
          soundscape: snapshot.settings.soundscape,
        })
      })
    }
  }

  function setMinutes(minutes: number) {
    updateWorkspace((draft) => {
      draft.settings.focusMinutes = minutes
    })
  }

  function setSoundscape(soundscape: AppSnapshot['settings']['soundscape']) {
    updateWorkspace((draft) => {
      draft.settings.soundscape = soundscape
    })
  }

  const remaining = Math.max(snapshot.settings.focusMinutes * 60 - elapsed, 0)

  return (
    <ToolPanel title="Focus" className="focus-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Focus</p>
          <h2>{focusTask?.title ?? 'Open focus'}</h2>
        </div>
        <span className="soft-badge">
          {formatTime(remaining)} · {status}
        </span>
      </div>

      <FocusCanvas running={running} soundscape={snapshot.settings.soundscape} />

      <div className="segmented" aria-label="Focus duration">
        {[15, 25, 45].map((minutes) => (
          <button
            className={snapshot.settings.focusMinutes === minutes ? 'selected' : ''}
            key={minutes}
            type="button"
            onClick={() => setMinutes(minutes)}
          >
            {minutes}
          </button>
        ))}
      </div>

      <div className="segmented soundscape" aria-label="Soundscape">
        {(['forest', 'lofi', 'rainline'] as const).map((option) => (
          <button
            className={snapshot.settings.soundscape === option ? 'selected' : ''}
            key={option}
            type="button"
            onClick={() => setSoundscape(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="button-row">
        <Button tone="primary" onClick={running ? stop : start}>
          {running ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}
          {running ? 'Land' : 'Begin'}
        </Button>
        <span className="inline-note">
          <AudioWaveform size={16} aria-hidden="true" />
          Tone.js
        </span>
      </div>
    </ToolPanel>
  )
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
