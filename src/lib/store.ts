import { useSyncExternalStore } from 'react'
import type { AppState, Task, DateKey } from './types'

const STORAGE_KEY = 'my-trackr:state'

const EMPTY_STATE: AppState = { tasks: [], logs: {} }

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_STATE
    const parsed = JSON.parse(raw)
    return { tasks: parsed.tasks ?? [], logs: parsed.logs ?? {} }
  } catch {
    // Corrupt or inaccessible storage (e.g. private mode) — fall back rather than crash.
    return EMPTY_STATE
  }
}

let state: AppState = load()
const listeners = new Set<() => void>()

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage full or unavailable — keep working in memory for this session.
  }
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot(): AppState {
  return state
}

export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, getSnapshot)
}

export function addTask(task: Task) {
  state = { ...state, tasks: [...state.tasks, task] }
  persist()
}

export function updateTask(id: string, patch: Partial<Task>) {
  state = {
    ...state,
    tasks: state.tasks.map((t) => (t.id === id ? ({ ...t, ...patch } as Task) : t)),
  }
  persist()
}

export function archiveTask(id: string) {
  updateTask(id, { archived: true })
}

/** Permanently removes a task and its logged history for every day. */
export function deleteTask(id: string) {
  const logs: typeof state.logs = {}
  for (const [day, entries] of Object.entries(state.logs)) {
    const { [id]: _removed, ...rest } = entries
    logs[day] = rest
  }
  state = { tasks: state.tasks.filter((t) => t.id !== id), logs }
  persist()
}

/** Set a task's value for a given day. Binary tasks use 0/1. */
export function setLog(dateKey: DateKey, taskId: string, value: number) {
  const dayLogs = { ...(state.logs[dateKey] ?? {}) }
  if (value <= 0) {
    delete dayLogs[taskId]
  } else {
    dayLogs[taskId] = value
  }
  state = { ...state, logs: { ...state.logs, [dateKey]: dayLogs } }
  persist()
}

/** Add an amount to a quantity task's value for a day (clamped at 0). */
export function addToLog(dateKey: DateKey, taskId: string, delta: number) {
  const current = state.logs[dateKey]?.[taskId] ?? 0
  setLog(dateKey, taskId, Math.max(0, current + delta))
}

export function toggleBinary(dateKey: DateKey, taskId: string) {
  const current = state.logs[dateKey]?.[taskId] ?? 0
  setLog(dateKey, taskId, current > 0 ? 0 : 1)
}

export function getLog(dateKey: DateKey, taskId: string): number {
  return state.logs[dateKey]?.[taskId] ?? 0
}
