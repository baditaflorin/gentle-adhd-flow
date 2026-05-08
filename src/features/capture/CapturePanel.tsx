import { useRef, useState } from 'react'
import { Bot, Check, Mic, Square, WandSparkles } from 'lucide-react'
import { newId } from '../../shared/id'
import { Button, ToolPanel } from '../../shared/ui'
import type { AppSnapshot, WorkspaceUpdater } from '../../shared/types'
import { refineWithLocalLlm } from '../ai/localLlm'
import { speakCue } from '../voice/piper'
import { transcribeWithWhisper } from '../voice/whisper'
import { extractBrainDump } from './extractTasks'

type Props = {
  snapshot: AppSnapshot
  updateWorkspace: WorkspaceUpdater
}

export function CapturePanel({ snapshot, updateWorkspace }: Props) {
  const [text, setText] = useState('')
  const [status, setStatus] = useState('Ready')
  const [recording, setRecording] = useState(false)
  const recorder = useRef<MediaRecorder | undefined>(undefined)
  const chunks = useRef<BlobPart[]>([])

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
    const result = await refineWithLocalLlm(text)
    setText(result.text)
    setStatus(result.engine === 'transformers' ? 'Local model refined it' : 'Deterministic mode kept it steady')
  }

  async function handleSpeak() {
    const nextTask = snapshot.tasks.find((task) => task.status !== 'done')
    const message = nextTask
      ? `One small step: ${nextTask.nextAction}.`
      : 'No pressure. Capture one thought, then choose one tiny next step.'
    const engine = await speakCue(message)
    setStatus(engine === 'piper' ? 'Piper voice played' : 'Browser voice played')
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
        const result = await transcribeWithWhisper(new Blob(chunks.current, { type: 'audio/webm' }))
        if (result.text) setText((current) => `${current}\n${result.text}`.trim())
        setStatus(result.engine === 'whisper' ? 'Whisper transcript added' : 'Recording saved, transcript unavailable')
      }
      mediaRecorder.start()
      setRecording(true)
      setStatus('Recording')
    } catch {
      setStatus('Microphone unavailable')
    }
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
        placeholder="Call Ana tomorrow, pay rent today, daily stretch after coffee..."
        aria-label="Brain dump"
      />

      <div className="button-row">
        <Button tone="primary" onClick={handleExtract}>
          <Check size={17} aria-hidden="true" />
          Extract
        </Button>
        <Button onClick={handleRefine}>
          <WandSparkles size={17} aria-hidden="true" />
          Local LLM
        </Button>
        <Button onClick={toggleRecording} tone={recording ? 'danger' : 'secondary'}>
          {recording ? <Square size={17} aria-hidden="true" /> : <Mic size={17} aria-hidden="true" />}
          {recording ? 'Stop' : 'Whisper'}
        </Button>
        <Button onClick={handleSpeak} tone="quiet">
          <Bot size={17} aria-hidden="true" />
          Voice cue
        </Button>
      </div>
    </ToolPanel>
  )
}
