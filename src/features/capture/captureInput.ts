export type CaptureReadResult = {
  text: string
  importedCount: number
  skipped: string[]
}

const textLikeExtensions = ['.txt', '.md', '.markdown', '.csv', '.json', '.log']

export function normalizeCaptureText(input: string) {
  return decodeHtmlEntities(input)
    .replace(/^\uFEFF/, '')
    .replace(/\r\n?/g, '\n')
    .replace(/\u00A0/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export async function readCaptureFiles(files: FileList | File[]): Promise<CaptureReadResult> {
  const fileArray = Array.from(files).sort((a, b) => a.name.localeCompare(b.name))
  const parts: string[] = []
  const skipped: string[] = []

  for (const file of fileArray) {
    if (!isTextLikeFile(file)) {
      skipped.push(file.name)
      continue
    }
    const text = normalizeCaptureText(await file.text())
    if (text) parts.push(`From ${file.name}:\n${text}`)
  }

  return {
    text: parts.join('\n\n'),
    importedCount: parts.length,
    skipped,
  }
}

export function readTextFromDrop(event: DragEvent) {
  return event.dataTransfer?.getData('text/plain') ?? ''
}

export const sampleBrainDump =
  'Call dentist tomorrow about crown estimate. Pay electricity bill today 15 min. Every morning take meds after coffee. Buy oat milk and batteries after work. Ask Sam for the tax portal password before Monday.'

function isTextLikeFile(file: File) {
  const lowerName = file.name.toLowerCase()
  return file.type.startsWith('text/') || textLikeExtensions.some((ext) => lowerName.endsWith(ext))
}

function decodeHtmlEntities(input: string) {
  const withoutTags = input.replace(/<[^>]+>/g, ' ')
  return withoutTags
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
}
