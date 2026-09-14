import { format, startOfWeek, addDays, startOfMonth, endOfMonth, addMonths } from 'date-fns'
import type { DateKey } from './types'

/** Local-calendar-day key, not UTC — matters near midnight. */
export function toDateKey(date: Date): DateKey {
  return format(date, 'yyyy-MM-dd')
}

export function todayKey(): DateKey {
  return toDateKey(new Date())
}

/** Monday-start week containing `date`. */
export function weekDays(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 1 })
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

export function monthDays(date: Date): Date[] {
  const start = startOfMonth(date)
  const end = endOfMonth(date)
  const days: Date[] = []
  for (let d = start; d <= end; d = addDays(d, 1)) days.push(d)
  return days
}

export function shiftWeek(date: Date, delta: number): Date {
  return addDays(date, delta * 7)
}

export function shiftMonth(date: Date, delta: number): Date {
  return addMonths(date, delta)
}

export const WEEKDAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
