import { useState } from 'react'
import { format } from 'date-fns'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { useAppState } from '../lib/store'
import { toDateKey, monthDays, shiftMonth } from '../lib/dates'
import { isDayComplete } from '../lib/streak'
import type { AppState } from '../lib/types'
import './GridView.css'

/** Fraction of active tasks completed on this day, in [0, 1]. */
function completionRatio(state: AppState, dateKey: string): number {
  const tasks = state.tasks.filter((t) => !t.archived)
  if (tasks.length === 0) return 0
  const done = tasks.filter((t) => isDayComplete(t, state.logs[dateKey]?.[t.id] ?? 0)).length
  return done / tasks.length
}

export function MonthView() {
  const state = useAppState()
  const [anchor, setAnchor] = useState(new Date())
  const days = monthDays(anchor)

  return (
    <div className="grid-view">
      <div className="grid-view-header">
        <p className="grid-view-label">Month</p>
        <div className="grid-nav">
          <button type="button" onClick={() => setAnchor((d) => shiftMonth(d, -1))} aria-label="Previous month">
            <IconChevronLeft size={18} />
          </button>
          <span>{format(anchor, 'MMMM yyyy')}</span>
          <button type="button" onClick={() => setAnchor((d) => shiftMonth(d, 1))} aria-label="Next month">
            <IconChevronRight size={18} />
          </button>
        </div>
      </div>

      {state.tasks.length === 0 && <p className="today-empty">No habits yet — add one to get started.</p>}

      {state.tasks.length > 0 && (
        <div className="month-heatmap">
          {days.map((day) => {
            const key = toDateKey(day)
            const ratio = completionRatio(state, key)
            const level = ratio === 0 ? 'none' : ratio >= 1 ? 'full' : 'partial'
            return (
              <div key={key} className={`month-cell month-cell--${level}`} title={format(day, 'MMM d')} />
            )
          })}
        </div>
      )}
    </div>
  )
}
