import { Fragment, useState } from 'react'
import { format } from 'date-fns'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { useAppState, getLog } from '../lib/store'
import { toDateKey, weekDays, shiftWeek, WEEKDAY_LABELS } from '../lib/dates'
import { isDayComplete } from '../lib/streak'
import './GridView.css'

export function WeekView() {
  const state = useAppState()
  const [anchor, setAnchor] = useState(new Date())
  const days = weekDays(anchor)
  const tasks = state.tasks.filter((t) => !t.archived)

  return (
    <div className="grid-view">
      <div className="grid-view-header">
        <p className="grid-view-label">Week</p>
        <div className="grid-nav">
          <button type="button" onClick={() => setAnchor((d) => shiftWeek(d, -1))} aria-label="Previous week">
            <IconChevronLeft size={18} />
          </button>
          <span>{format(days[0], 'MMM d')} – {format(days[6], 'MMM d')}</span>
          <button type="button" onClick={() => setAnchor((d) => shiftWeek(d, 1))} aria-label="Next week">
            <IconChevronRight size={18} />
          </button>
        </div>
      </div>

      {tasks.length === 0 && <p className="today-empty">No habits yet — add one to get started.</p>}

      {tasks.length > 0 && (
        <div className="grid-table" style={{ gridTemplateColumns: `1fr repeat(7, 28px)` }}>
          <div className="grid-cell grid-corner" />
          {WEEKDAY_LABELS.map((label, i) => (
            <div key={i} className="grid-cell grid-day-label">{label}</div>
          ))}

          {tasks.map((task) => (
            <Fragment key={task.id}>
              <div className="grid-cell grid-row-label">{task.name}</div>
              {days.map((day) => {
                const key = toDateKey(day)
                const value = getLog(key, task.id)
                const complete = isDayComplete(task, value)
                const hasSome = value > 0 && !complete
                return (
                  <div key={`${task.id}-${key}`} className="grid-cell">
                    {task.type === 'binary' ? (
                      <span className={`week-dot${complete ? ' filled' : ''}`} />
                    ) : (
                      <span
                        className={`week-square${complete ? ' filled' : hasSome ? ' partial' : ''}`}
                      />
                    )}
                  </div>
                )
              })}
            </Fragment>
          ))}
        </div>
      )}
    </div>
  )
}
