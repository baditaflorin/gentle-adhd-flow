import { useMemo, useRef, useState } from 'react'
import { Download, Info, Trash2, Upload } from 'lucide-react'
import { appSnapshotSchema, type AppSnapshot, type WorkspaceUpdater } from '../../shared/types'
import { Button, ToolPanel } from '../../shared/ui'

type Props = {
  snapshot: AppSnapshot
  updateWorkspace: WorkspaceUpdater
}

export function SettingsPanel({ snapshot, updateWorkspace }: Props) {
  const [status, setStatus] = useState('Private by default')
  const fileInput = useRef<HTMLInputElement | null>(null)

  const capabilities = useMemo(
    () => [
      ['WebGPU', 'gpu' in navigator ? 'available' : 'fallback'],
      ['Whisper', 'lazy'],
      ['Piper', 'lazy'],
      ['DuckDB', 'lazy'],
      ['Tone.js', 'lazy'],
    ],
    [],
  )

  function exportJson() {
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `gentle-adhd-flow-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
    setStatus('Exported')
  }

  async function importJson(file: File | undefined) {
    if (!file) return
    const parsed = appSnapshotSchema.safeParse(JSON.parse(await file.text()))
    if (!parsed.success) {
      setStatus('Import did not match v1 schema')
      return
    }
    updateWorkspace(() => parsed.data)
    setStatus('Imported')
  }

  function resetLocal() {
    updateWorkspace((draft) => {
      draft.tasks = []
      draft.focusSessions = []
      draft.captures = []
    })
    setStatus('Cleared tasks and sessions')
  }

  return (
    <ToolPanel title="Settings" className="settings-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Local</p>
          <h2>Stack status</h2>
        </div>
        <span className="soft-badge">
          <Info size={14} aria-hidden="true" />
          {status}
        </span>
      </div>

      <div className="capability-list">
        {capabilities.map(([name, value]) => (
          <div key={name}>
            <span>{name}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <div className="button-row">
        <Button onClick={exportJson}>
          <Download size={17} aria-hidden="true" />
          Export
        </Button>
        <Button onClick={() => fileInput.current?.click()}>
          <Upload size={17} aria-hidden="true" />
          Import
        </Button>
        <Button tone="danger" onClick={resetLocal}>
          <Trash2 size={17} aria-hidden="true" />
          Clear
        </Button>
      </div>
      <input
        ref={fileInput}
        hidden
        type="file"
        accept="application/json"
        onChange={(event) => void importJson(event.target.files?.[0])}
      />
    </ToolPanel>
  )
}
