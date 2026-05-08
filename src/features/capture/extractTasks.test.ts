import { describe, expect, it } from 'vitest'
import { extractBrainDump } from './extractTasks'

describe('extractBrainDump', () => {
  it('turns a messy dump into tasks and habits', () => {
    const result = extractBrainDump(
      'call Ana tomorrow about tickets. pay rent today 15 min. daily stretch every morning',
      new Date('2026-05-08T08:00:00'),
    )

    expect(result.tasks).toHaveLength(2)
    expect(result.tasks[0]).toMatchObject({
      title: 'Call Ana about tickets',
      dueDate: '2026-05-09',
      context: 'phone',
    })
    expect(result.tasks[1]).toMatchObject({
      title: 'Pay rent 15 min',
      dueDate: '2026-05-08',
      estimateMinutes: 15,
    })
    expect(result.habits[0].title).toBe('Stretch')
  })

  it('creates a gentle clarification task for unstructured text', () => {
    const result = extractBrainDump('everything feels noisy and I do not know where to begin')

    expect(result.tasks[0].title).toBe('Clarify the brain dump')
    expect(result.tasks[0].energy).toBe('low')
  })
})
