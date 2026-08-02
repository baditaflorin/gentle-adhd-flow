export type SpeakEngine = 'piper' | 'browser' | 'silent'

let piperEngine: Promise<unknown> | undefined

export async function speakCue(text: string): Promise<SpeakEngine> {
  if (!text.trim()) return 'silent'

  try {
    const engine = await getPiperEngine()
    const response = (await (
      engine as {
        generate: (text: string, voice: string, speaker: number) => Promise<unknown>
      }
    ).generate(text, 'en_US-libritts_r-medium', 0)) as {
      wav?: BlobPart
      audio?: BlobPart
      file?: Blob
    }
    const audioBytes = response.file ?? response.wav ?? response.audio
    if (audioBytes) {
      const blob =
        audioBytes instanceof Blob ? audioBytes : new Blob([audioBytes], { type: 'audio/wav' })
      await new Audio(URL.createObjectURL(blob)).play()
      return 'piper'
    }
  } catch {
    return speakWithBrowser(text)
  }

  return speakWithBrowser(text)
}

async function getPiperEngine() {
  piperEngine ??= import('piper-tts-web').then((module) => {
    const piper = module as Record<string, new (...args: unknown[]) => unknown>
    const base = import.meta.env.BASE_URL
    const onnxRuntime =
      'gpu' in navigator && piper.OnnxWebGPURuntime
        ? new piper.OnnxWebGPURuntime({ basePath: `${base}onnx/` })
        : new piper.OnnxWebRuntime({ basePath: `${base}onnx/` })
    const phonemizeRuntime = new piper.PhonemizeWebRuntime({ basePath: `${base}piper/` })
    return new piper.PiperWebEngine({ onnxRuntime, phonemizeRuntime })
  })
  return piperEngine
}

function speakWithBrowser(text: string): SpeakEngine {
  if (!('speechSynthesis' in window)) return 'silent'

  // Prefer an explicitly local voice so this fallback keeps the app's
  // local-first privacy promise: some browsers (notably Chrome) ship
  // "network" voices whose text is sent to a remote TTS service to be
  // synthesized, which would leak this derived task text off the device.
  // If the voice list is populated and none of the available voices are
  // local, stay silent rather than risk sending personal data over the
  // network. If the list has not loaded yet (a well-known async quirk in
  // some browsers), fall through and let the browser pick, matching the
  // prior behavior since we cannot tell local from remote yet.
  const voices = window.speechSynthesis.getVoices()
  if (voices.length > 0 && !voices.some((voice) => voice.localService)) {
    return 'silent'
  }

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 0.92
  utterance.pitch = 0.95
  const localVoice = voices.find((voice) => voice.localService)
  if (localVoice) utterance.voice = localVoice
  window.speechSynthesis.speak(utterance)
  return 'browser'
}
