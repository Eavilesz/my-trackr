import { addDays } from 'date-fns'
import type { AppState, Task } from './types'
import { toDateKey } from './dates'

/** True if the task's goal was met that day (binary: logged; quantity: value >= goal). */
export function isDayComplete(task: Task, value: number): boolean {
  if (task.type === 'binary') return value > 0
  return value >= task.goal
}

/**
 * Consecutive days of completion ending today (or yesterday, so a streak
 * doesn't visually reset to 0 before today is done).
 */
export function currentStreak(state: AppState, task: Task, today: Date = new Date()): number {
  let streak = 0
  let cursor = today
  const todayKey = toDateKey(today)
  const todayValue = state.logs[todayKey]?.[task.id] ?? 0

  // If today isn't complete yet, start counting from yesterday instead —
  // an unfinished today shouldn't zero out an otherwise-live streak.
  if (!isDayComplete(task, todayValue)) {
    cursor = addDays(today, -1)
  }

  while (true) {
    const key = toDateKey(cursor)
    const value = state.logs[key]?.[task.id] ?? 0
    if (!isDayComplete(task, value)) break
    streak += 1
    cursor = addDays(cursor, -1)
  }

  return streak
}
