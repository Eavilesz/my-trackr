import { useState } from 'react'
import { format } from 'date-fns'
import { IconCheck, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { useAppState } from '../lib/store'
import { toDateKey, todayKey, monthGrid, shiftMonth, WEEKDAY_LABELS } from '../lib/dates'
import { isDayComplete } from '../lib/streak'
import type { Task } from '../lib/types'
import './CalendarView.css'

function Chip({ task, value }: { task: Task; value: number }) {
  if (value <= 0) return <span className="cal-chip cal-chip--empty" />

  const done = isDayComplete(task, value)
  if (task.type === 'binary') {
    return (
      <span className="cal-chip cal-chip--done">
        <IconCheck size={11} stroke={2.5} />
      </span>
    )
  }
  return (
    <span className={`cal-chip ${done ? 'cal-chip--done' : 'cal-chip--partial'}`}>
      {done && <IconCheck size={9} stroke={3} />}
      <span className="cal-chip-text">{value} {task.unit}</span>
    </span>
  )
}

export function CalendarView() {
  const state = useAppState()
  const [anchor, setAnchor] = useState(new Date())
  const cells = monthGrid(anchor)
  const tasks = state.tasks.filter((t) => !t.archived)
  const today = todayKey()

  return (
    <div>
      <div className="cal-header">
        <p className="cal-label">Month</p>
        <div className="cal-nav">
          <button type="button" onClick={() => setAnchor((d) => shiftMonth(d, -1))} aria-label="Previous month">
            <IconChevronLeft size={18} />
          </button>
          <span>{format(anchor, 'MMMM yyyy')}</span>
          <button type="button" onClick={() => setAnchor((d) => shiftMonth(d, 1))} aria-label="Next month">
            <IconChevronRight size={18} />
          </button>
        </div>
      </div>

      {tasks.length === 0 && <p className="today-empty">No habits yet — add one to get started.</p>}

      {tasks.length > 0 && (
        <>
          <p className="cal-legend">
            Top to bottom: {tasks.map((t) => t.name).join(' · ')}
          </p>

          <div className="cal-grid">
            {WEEKDAY_LABELS.map((label, i) => (
              <div key={i} className="cal-weekday">{label}</div>
            ))}

            {cells.map((day, i) => {
              if (!day) return <div key={`pad-${i}`} />
              const key = toDateKey(day)
              const isToday = key === today
              const isFuture = key > today
              // Habits only count on days from when they were created.
              const dayTasks = isFuture ? [] : tasks.filter((t) => t.createdAt <= key)
              const allDone =
                dayTasks.length > 0 &&
                dayTasks.every((t) => isDayComplete(t, state.logs[key]?.[t.id] ?? 0))

              return (
                <div
                  key={key}
                  className={`cal-day${allDone ? ' cal-day--done' : ''}${isFuture ? ' cal-day--future' : ''}`}
                >
                  <span className={`cal-date${isToday ? ' cal-date--today' : ''}`}>{day.getDate()}</span>
                  {dayTasks.map((t) => (
                    <Chip key={t.id} task={t} value={state.logs[key]?.[t.id] ?? 0} />
                  ))}
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
