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

  it('keeps noun phrases after by/before/after intact', () => {
    // The old impl stripped "by/before/after \w+" indiscriminately, so
    // "pay rent before the deadline" lost "the" and turned into the
    // nonsense "Pay rent deadline". Time-clause stripping now only fires
    // for recognized time words.
    const result = extractBrainDump(
      'pay rent before the deadline. call dentist by noon. submit report after the meeting',
      new Date('2026-05-08T08:00:00'),
    )
    const titles = result.tasks.map((task) => task.title)
    expect(titles).toContain('Pay rent before the deadline')
    expect(titles).toContain('Call dentist')
    expect(titles).toContain('Submit report')
  })
})
