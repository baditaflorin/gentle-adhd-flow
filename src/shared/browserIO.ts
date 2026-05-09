export function downloadJson(filename: string, value: unknown) {
  const blob = new Blob([`${JSON.stringify(value, null, 2)}\n`], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export async function copyText(text: string) {
  if (!navigator.clipboard?.writeText) {
    throw new Error('Clipboard write is not available in this browser')
  }
  await navigator.clipboard.writeText(text)
}

export async function readClipboardText() {
  if (!navigator.clipboard?.readText) {
    throw new Error('Clipboard read is not available in this browser')
  }
  const text = await navigator.clipboard.readText()
  if (!text.trim()) throw new Error('Clipboard is empty')
  return text
}

export function printPage() {
  window.print()
}
