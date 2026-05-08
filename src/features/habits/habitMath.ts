import { addDays, localDateKey } from '../../shared/time'
import type { Habit } from '../../shared/types'

export function toggleHabit(habit: Habit, date = new Date()): Habit {
  const key = localDateKey(date)
  return {
    ...habit,
    checkIns: {
      ...habit.checkIns,
      [key]: !habit.checkIns[key],
    },
  }
}

export function currentStreak(habit: Habit, date = new Date()) {
  let streak = 0
  for (let offset = 0; offset < 365; offset += 1) {
    const key = localDateKey(addDays(date, -offset))
    if (!habit.checkIns[key]) break
    streak += 1
  }
  return streak
}
