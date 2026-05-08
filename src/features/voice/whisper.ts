export type WhisperResult = {
  text: string
  engine: 'whisper' | 'fallback'
}

export async function transcribeWithWhisper(blob: Blob): Promise<WhisperResult> {
  try {
    const audio = await decodeAudio(blob)
    const transformers = await import('@huggingface/transformers')
    const pipeline = transformers.pipeline as unknown as (
      task: string,
      model: string,
      options: Record<string, unknown>,
    ) => Promise<(audioData: Float32Array, options: Record<string, unknown>) => Promise<unknown>>

    const device = 'gpu' in navigator ? 'webgpu' : 'wasm'
    const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en', {
      device,
      dtype: 'q8',
    })
    const output = await transcriber(audio, { chunk_length_s: 30, stride_length_s: 5 })
    return {
      text: extractText(output),
      engine: 'whisper',
    }
  } catch {
    return {
      text: '',
      engine: 'fallback',
    }
  }
}

async function decodeAudio(blob: Blob) {
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext
  const context = new AudioContextCtor()
  try {
    const buffer = await context.decodeAudioData(await blob.arrayBuffer())
    return buffer.getChannelData(0)
  } finally {
    await context.close().catch(() => undefined)
  }
}

function extractText(output: unknown) {
  if (typeof output === 'string') return output
  if (typeof output === 'object' && output && 'text' in output) {
    return String((output as { text: unknown }).text)
  }
  return ''
}
