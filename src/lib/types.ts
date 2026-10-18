/** ISO date string, e.g. "2026-09-14". Always the local calendar day. */
export type DateKey = string

export type TaskBase = {
  id: string
  name: string
  createdAt: DateKey
  archived?: boolean
}

export type BinaryTask = TaskBase & {
  type: 'binary'
}

export type QuantityTask = TaskBase & {
  type: 'quantity'
  goal: number
  unit: string
  /** Suggested quick-add amounts, e.g. [10, 20] for "+10 g" / "+20 g" chips. */
  quickAdds: number[]
}

export type Task = BinaryTask | QuantityTask

/** Binary habit values: unmarked (0, or absent), done, or explicitly failed. */
export const BINARY_DONE = 1
export const BINARY_FAILED = 2

/** Per-task, per-day value. Binary: 0 / BINARY_DONE / BINARY_FAILED. Quantity: accumulated amount. */
export type LogEntry = number

/** logs[dateKey][taskId] = value */
export type Logs = Record<DateKey, Record<string, LogEntry>>

/** notes[dateKey][taskId] = free-text note for that habit on that day */
export type Notes = Record<DateKey, Record<string, string>>

export type AppState = {
  tasks: Task[]
  logs: Logs
  notes: Notes
}
