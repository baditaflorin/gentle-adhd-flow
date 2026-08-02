import { useEffect, useRef, useState, type DragEvent } from 'react'
import { Bot, Check, Clipboard, FileUp, Mic, RotateCcw, Square, WandSparkles } from 'lucide-react'
import { newId } from '../../shared/id'
import { readClipboardText } from '../../shared/browserIO'
import { Button, ToolPanel } from '../../shared/ui'
import type { AppSnapshot, WorkspaceUpdater } from '../../shared/types'
import { refineWithLocalLlm } from '../ai/localLlm'
import { speakCue } from '../voice/piper'
import { transcribeWithWhisper } from '../voice/whisper'
import { normalizeCaptureText, readCaptureFiles, sampleBrainDump } from './captureInput'
import { extractBrainDump } from './extractTasks'

type Props = {
  snapshot: AppSnapshot
  updateWorkspace: WorkspaceUpdater
}

export function CapturePanel({ snapshot, updateWorkspace }: Props) {
  const [text, setText] = useState(loadDraft)
  const [status, setStatus] = useState('Ready')
  const [recording, setRecording] = useState(false)
  const recorder = useRef<MediaRecorder | undefined>(undefined)
  const chunks = useRef<BlobPart[]>([])
  const fileInput = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    localStorage.setItem(captureDraftKey, text)
  }, [text])

  function saveExtraction(input: string) {
    const result = extractBrainDump(input)
    updateWorkspace((draft) => {
      draft.tasks.unshift(...result.tasks)
      draft.habits.unshift(...result.habits)
      draft.captures.unshift({
        id: newId('capture'),
        text: input,
        createdAt: new Date().toISOString(),
        taskIds: result.tasks.map((task) => task.id),
      })
    })
    setStatus(`${result.tasks.length} tasks, ${result.habits.length} habits`)
  }

  async function handleExtract() {
    if (!text.trim()) {
      setStatus('Add a brain dump first')
      return
    }
    saveExtraction(text)
  }

  async function handleRefine() {
    if (!text.trim()) return
    setStatus('Local model warming up')
    try {
      const result = await refineWithLocalLlm(text)
      setText(result.text)
      setStatus(
        result.engine === 'transformers'
          ? 'Local model refined it'
          : 'Deterministic mode kept it steady',
      )
    } catch {
      setStatus('Local model unavailable. Keep the text here and use Extract.')
    }
  }

  async function handleSpeak() {
    if (!snapshot.settings.gentleVoice) {
      setStatus('Voice cues are off in Settings')
      return
    }
    const nextTask = snapshot.tasks.find((task) => task.status !== 'done')
    const message = nextTask
      ? `One small step: ${nextTask.nextAction}.`
      : 'No pressure. Capture one thought, then choose one tiny next step.'
    try {
      const engine = await speakCue(message)
      setStatus(
        engine === 'piper'
          ? 'Piper voice played'
          : engine === 'browser'
            ? 'Browser voice played'
            : 'Voice unavailable locally. Read the next action above.',
      )
    } catch {
      setStatus('Voice unavailable. Read the next action above.')
    }
  }

  async function toggleRecording() {
    if (recording) {
      recorder.current?.stop()
      setRecording(false)
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      chunks.current = []
      const mediaRecorder = new MediaRecorder(stream)
      recorder.current = mediaRecorder
      mediaRecorder.ondataavailable = (event) => chunks.current.push(event.data)
      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop())
        setStatus('Whisper transcribing locally')
        try {
          const result = await transcribeWithWhisper(
            new Blob(chunks.current, { type: 'audio/webm' }),
          )
          if (result.text) appendText(result.text)
          setStatus(
            result.engine === 'whisper'
              ? 'Whisper transcript added'
              : 'Recording saved, transcript unavailable. Type or paste the thought instead.',
          )
        } catch {
          setStatus(
            'Recording stopped, but transcription failed. Type or paste the thought instead.',
          )
        }
      }
      mediaRecorder.start()
      setRecording(true)
      setStatus('Recording')
    } catch {
      setStatus('Microphone unavailable. Allow access or type the thought instead.')
    }
  }

  async function handleFiles(files: FileList | File[] | undefined) {
    if (!files || files.length === 0) return
    try {
      const result = await readCaptureFiles(files)
      if (result.text) appendText(result.text)
      const skipped = result.skipped.length ? `; skipped ${result.skipped.length}` : ''
      setStatus(
        `Imported ${result.importedCount} file${result.importedCount === 1 ? '' : 's'}${skipped}`,
      )
    } catch {
      setStatus('File import failed. Use a plain text, Markdown, CSV, or JSON note file.')
    } finally {
      if (fileInput.current) fileInput.current.value = ''
    }
  }

  async function handleClipboard() {
    try {
      appendText(normalizeCaptureText(await readClipboardText()))
      setStatus('Clipboard text added')
    } catch {
      setStatus('Clipboard unavailable. Paste into the brain dump box instead.')
    }
  }

  function handleDrop(event: DragEvent<HTMLTextAreaElement>) {
    event.preventDefault()
    const droppedText = event.dataTransfer.getData('text/plain')
    if (event.dataTransfer.files.length > 0) {
      void handleFiles(event.dataTransfer.files)
      return
    }
    if (droppedText.trim()) {
      appendText(normalizeCaptureText(droppedText))
      setStatus('Dropped text added')
    }
  }

  function loadSample() {
    setText(sampleBrainDump)
    setStatus('Sample loaded')
  }

  function clearDraft() {
    setText('')
    localStorage.removeItem(captureDraftKey)
    setStatus('Draft cleared')
  }

  function appendText(nextText: string) {
    setText((current) => [current.trim(), nextText.trim()].filter(Boolean).join('\n\n'))
  }

  return (
    <ToolPanel title="Capture" className="capture-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Capture</p>
          <h2>Brain dump</h2>
        </div>
        <span className="soft-badge">{status}</span>
      </div>

      <textarea
        className="brain-dump"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        placeholder="Call Ana tomorrow, pay rent today, daily stretch after coffee..."
        aria-label="Brain dump"
      />

      <div className="button-row">
        <Button onClick={() => fileInput.current?.click()}>
          <FileUp size={17} aria-hidden="true" />
          File
        </Button>
        <Button onClick={handleClipboard}>
          <Clipboard size={17} aria-hidden="true" />
          Paste
        </Button>
        <Button onClick={loadSample} tone="quiet">
          <WandSparkles size={17} aria-hidden="true" />
          Sample
        </Button>
        <Button tone="primary" onClick={handleExtract}>
          <Check size={17} aria-hidden="true" />
          Extract
        </Button>
        <Button onClick={handleRefine}>
          <WandSparkles size={17} aria-hidden="true" />
          Local LLM
        </Button>
        <Button onClick={toggleRecording} tone={recording ? 'danger' : 'secondary'}>
          {recording ? (
            <Square size={17} aria-hidden="true" />
          ) : (
            <Mic size={17} aria-hidden="true" />
          )}
          {recording ? 'Stop' : 'Whisper'}
        </Button>
        <Button onClick={handleSpeak} tone="quiet">
          <Bot size={17} aria-hidden="true" />
          Voice cue
        </Button>
        <Button onClick={clearDraft} tone="quiet">
          <RotateCcw size={17} aria-hidden="true" />
          Clear draft
        </Button>
      </div>
      <input
        ref={fileInput}
        hidden
        multiple
        type="file"
        accept=".txt,.md,.markdown,.csv,.json,text/plain,text/markdown,text/csv,application/json"
        onChange={(event) => void handleFiles(event.target.files ?? undefined)}
      />
    </ToolPanel>
  )
}

const captureDraftKey = 'gentle-adhd-flow.capture-draft.v1'

function loadDraft() {
  return localStorage.getItem(captureDraftKey) ?? ''
}
