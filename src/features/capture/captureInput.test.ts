import { describe, expect, it } from 'vitest'
import { normalizeCaptureText, readCaptureFiles } from './captureInput'

describe('captureInput', () => {
  it('normalizes common pasted text variants', () => {
    expect(normalizeCaptureText('\uFEFF<p>Call&nbsp;Ana</p>\r\n\r\n\r\nPay rent')).toBe(
      'Call Ana\n\nPay rent',
    )
  })

  it('reads text-like files in deterministic name order', async () => {
    const files = [
      new File(['buy milk'], 'b.md', { type: 'text/markdown' }),
      new File(['call dentist'], 'a.txt', { type: 'text/plain' }),
      new File(['binary'], 'image.png', { type: 'image/png' }),
    ]

    const result = await readCaptureFiles(files)

    expect(result.importedCount).toBe(2)
    expect(result.skipped).toEqual(['image.png'])
    expect(result.text).toContain('From a.txt:')
    expect(result.text.indexOf('a.txt')).toBeLessThan(result.text.indexOf('b.md'))
  })
})
