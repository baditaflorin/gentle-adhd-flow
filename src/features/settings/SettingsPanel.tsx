import { useMemo, useRef, useState } from 'react'
import { Download, Info, Link, RotateCcw, ToggleLeft, ToggleRight, Upload } from 'lucide-react'
import { copyText, downloadJson } from '../../shared/browserIO'
import { createDefaultSnapshot } from '../../shared/storage/defaultSnapshot'
import type { AppSnapshot, BuildMeta, WorkspaceUpdater } from '../../shared/types'
import { Button, ToolPanel } from '../../shared/ui'
import {
  createWorkspaceExport,
  encodeShareState,
  getShareStateFromHash,
  parseWorkspaceImportText,
} from '../../shared/workspaceIO'

type Props = {
  buildMeta: BuildMeta | undefined
  snapshot: AppSnapshot
  updateWorkspace: WorkspaceUpdater
  replaceWorkspace: (snapshot: AppSnapshot) => void
}

export function SettingsPanel({ buildMeta, snapshot, updateWorkspace, replaceWorkspace }: Props) {
  const [status, setStatus] = useState('Private by default')
  const [hasShareHash, setHasShareHash] = useState(() => window.location.hash.includes('state='))
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
    const envelope = createWorkspaceExport(snapshot, {
      appVersion: buildMeta?.version ?? '0.2.0',
      commit: buildMeta?.commit ?? 'local',
    })
    downloadJson(`gentle-adhd-flow-${new Date().toISOString().slice(0, 10)}.json`, envelope)
    setStatus('Exported')
  }

  async function importJson(file: File | undefined) {
    if (!file) return
    try {
      const parsed = parseWorkspaceImportText(await file.text())
      replaceWorkspace(parsed.snapshot)
      setStatus(`Imported ${parsed.format}`)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Import failed. Choose a JSON export.')
    } finally {
      if (fileInput.current) fileInput.current.value = ''
    }
  }

  function resetWorkspace() {
    replaceWorkspace(createDefaultSnapshot())
    setStatus('Workspace reset')
  }

  function toggleGentleVoice() {
    updateWorkspace((draft) => {
      draft.settings.gentleVoice = !draft.settings.gentleVoice
    })
    setStatus(`Voice cues ${snapshot.settings.gentleVoice ? 'off' : 'on'}`)
  }

  async function copyShareLink() {
    const encoded = encodeShareState(snapshot)
    if (encoded.length > 6000) {
      setStatus('Share link is too large. Use Export instead.')
      return
    }
    const url = `${window.location.origin}${window.location.pathname}#state=${encoded}`
    window.history.replaceState(null, '', `#state=${encoded}`)
    setHasShareHash(true)
    try {
      await copyText(url)
      setStatus('Share link copied')
    } catch {
      setStatus('Share link ready in address bar')
    }
  }

  function openSharedState() {
    try {
      const shared = getShareStateFromHash(window.location.hash)
      if (!shared) {
        setStatus('No shared state found in this URL')
        return
      }
      replaceWorkspace(shared)
      window.history.replaceState(null, '', window.location.pathname)
      setHasShareHash(false)
      setStatus('Opened shared state')
    } catch {
      setStatus('Shared link could not be opened. Ask for a fresh link or use Import.')
    }
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
        <Button
          onClick={toggleGentleVoice}
          tone={snapshot.settings.gentleVoice ? 'secondary' : 'quiet'}
        >
          {snapshot.settings.gentleVoice ? (
            <ToggleRight size={17} aria-hidden="true" />
          ) : (
            <ToggleLeft size={17} aria-hidden="true" />
          )}
          Voice {snapshot.settings.gentleVoice ? 'on' : 'off'}
        </Button>
        <Button onClick={exportJson}>
          <Download size={17} aria-hidden="true" />
          Export
        </Button>
        <Button onClick={() => fileInput.current?.click()}>
          <Upload size={17} aria-hidden="true" />
          Import
        </Button>
        <Button onClick={copyShareLink}>
          <Link size={17} aria-hidden="true" />
          Share
        </Button>
        {hasShareHash && (
          <Button onClick={openSharedState} tone="primary">
            <Download size={17} aria-hidden="true" />
            Open link
          </Button>
        )}
        <Button tone="danger" onClick={resetWorkspace}>
          <RotateCcw size={17} aria-hidden="true" />
          Reset workspace
        </Button>
      </div>
      <input
        ref={fileInput}
        hidden
        type="file"
        accept=".json,application/json"
        onChange={(event) => void importJson(event.target.files?.[0])}
      />
    </ToolPanel>
  )
}
