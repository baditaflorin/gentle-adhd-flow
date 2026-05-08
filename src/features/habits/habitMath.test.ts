import { describe, expect, it } from 'vitest'
import type { Habit } from '../../shared/types'
import { currentStreak, toggleHabit } from './habitMath'

const habit: Habit = {
  id: 'habit_1',
  title: 'Water',
  cue: 'Morning',
  createdAt: '2026-05-01T00:00:00.000Z',
  checkIns: {},
}

describe('habitMath', () => {
  it('toggles a habit for the local day', () => {
    const next = toggleHabit(habit, new Date('2026-05-08T08:00:00'))

    expect(next.checkIns['2026-05-08']).toBe(true)
  })

  it('counts the current streak', () => {
    const streak = currentStreak(
      {
        ...habit,
        checkIns: {
          '2026-05-06': true,
          '2026-05-07': true,
          '2026-05-08': true,
        },
      },
      new Date('2026-05-08T08:00:00'),
    )

    expect(streak).toBe(3)
  })
})
