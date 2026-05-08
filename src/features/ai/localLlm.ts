export type LocalLlmResult = {
  text: string
  engine: 'transformers' | 'fallback'
}

export async function refineWithLocalLlm(input: string): Promise<LocalLlmResult> {
  try {
    const transformers = await import('@huggingface/transformers')
    const pipeline = transformers.pipeline as unknown as (
      task: string,
      model: string,
      options: Record<string, unknown>,
    ) => Promise<(text: string, options: Record<string, unknown>) => Promise<unknown>>

    const device = 'gpu' in navigator ? 'webgpu' : 'wasm'
    const generator = await pipeline('text2text-generation', 'Xenova/flan-t5-small', {
      device,
      dtype: 'q8',
    })
    const output = await generator(
      `Rewrite as concise ADHD-friendly next actions. Keep it kind and practical:\n${input}`,
      { max_new_tokens: 160 },
    )
    return {
      text: extractGeneratedText(output) || input,
      engine: 'transformers',
    }
  } catch {
    return {
      text: input,
      engine: 'fallback',
    }
  }
}

function extractGeneratedText(output: unknown) {
  if (Array.isArray(output)) {
    const first = output[0] as { generated_text?: string } | undefined
    return first?.generated_text?.trim()
  }
  if (typeof output === 'object' && output && 'generated_text' in output) {
    return String((output as { generated_text: unknown }).generated_text).trim()
  }
  return ''
}
