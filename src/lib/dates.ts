import { format, getISODay, addDays, startOfMonth, endOfMonth, addMonths } from 'date-fns'
import type { DateKey } from './types'

/** Local-calendar-day key, not UTC — matters near midnight. */
export function toDateKey(date: Date): DateKey {
  return format(date, 'yyyy-MM-dd')
}

export function todayKey(): DateKey {
  return toDateKey(new Date())
}

/**
 * Cells for a Monday-start calendar grid of `date`'s month: `null` padding for
 * the days before the 1st, then every day of the month.
 */
export function monthGrid(date: Date): (Date | null)[] {
  const start = startOfMonth(date)
  const end = endOfMonth(date)
  const cells: (Date | null)[] = Array.from({ length: getISODay(start) - 1 }, () => null)
  for (let d = start; d <= end; d = addDays(d, 1)) cells.push(d)
  return cells
}

export function shiftMonth(date: Date, delta: number): Date {
  return addMonths(date, delta)
}

export const WEEKDAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
