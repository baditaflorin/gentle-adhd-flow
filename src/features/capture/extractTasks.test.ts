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

  it('splits conjunction-chained tasks that have no sentence punctuation', () => {
    // Real (especially voice-transcribed) brain dumps routinely chain several
    // distinct tasks with "and"/"then"/commas instead of periods, e.g. "call
    // mom and email boss and buy milk". Splitting only on sentence
    // punctuation collapsed a run like that into one garbled task and
    // silently dropped the other two as distinct actionable items.
    const result = extractBrainDump(
      'call mom and email boss and buy milk and pick up the kids from school',
    )
    const titles = result.tasks.map((task) => task.title)
    expect(titles).toEqual(['Call mom', 'Email boss', 'Buy milk', 'Pick up the kids from school'])
  })

  it('splits comma-separated task lists', () => {
    const result = extractBrainDump('call the dentist, email my boss, buy milk, pay rent')
    const titles = result.tasks.map((task) => task.title)
    expect(titles).toEqual(['Call the dentist', 'Email my boss', 'Buy milk', 'Pay rent'])
  })

  it('splits a long rambling voice-transcript-style dump into every task', () => {
    const result = extractBrainDump(
      'so like i was thinking i really need to call ana about the tickets and also i should probably ' +
        'email my landlord about the leak and dont forget buy oat milk when at the store and also gotta ' +
        'pay the electricity bill before friday',
      new Date('2026-05-08T08:00:00'),
    )
    expect(result.tasks).toHaveLength(4)
    const titles = result.tasks.map((task) => task.title)
    expect(titles[0]).toMatch(/call ana about the tickets$/i)
    expect(titles[1]).toMatch(/email my landlord about the leak$/i)
    expect(titles[2]).toMatch(/buy oat milk when at the store$/i)
    expect(titles[3]).toMatch(/pay the electricity bill$/i)
  })

  it('does not shred a plain item list that has no verb after "and"', () => {
    // "and eggs" / "and bread" are not followed by a task verb, so this must
    // stay a single task instead of being split into fragments that would
    // fail the task-signal check and silently disappear.
    const result = extractBrainDump('buy milk and eggs and bread')
    expect(result.tasks.map((task) => task.title)).toEqual(['Buy milk and eggs and bread'])
  })

  it('keeps the shipped sample brain dump behavior stable', () => {
    const result = extractBrainDump(
      'Call dentist tomorrow about crown estimate. Pay electricity bill today 15 min. ' +
        'Every morning take meds after coffee. Buy oat milk and batteries after work. ' +
        'Ask Sam for the tax portal password before Monday.',
      new Date('2026-05-08T08:00:00'),
    )
    expect(result.tasks.map((task) => task.title)).toEqual([
      'Call dentist about crown estimate',
      'Pay electricity bill 15 min',
      'Buy oat milk and batteries',
      'Ask Sam for the tax portal password',
    ])
    expect(result.habits.map((habit) => habit.title)).toEqual(['Take meds after coffee'])
  })
})
