import { useState, type CSSProperties, type ReactNode } from 'react'
import { format } from 'date-fns'
import { IconCheck, IconX, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { useAppState } from '../lib/store'
import { toDateKey, todayKey, monthGrid, shiftMonth, WEEKDAY_LABELS } from '../lib/dates'
import { isDayComplete, isDayFailed } from '../lib/streak'
import { TaskName } from '../components/TaskName'
import { DaySheet } from '../components/DaySheet'
import type { DateKey, Task } from '../lib/types'
import './CalendarView.css'

type Tone = 'done' | 'missed' | 'pending'

type TextKind = 'value' | 'note'

function Chip({ tone, icon, text, kind }: { tone: Tone; icon?: ReactNode; text?: string; kind?: TextKind }) {
  return (
    <span className={`cal-chip cal-chip--${tone}`}>
      {icon}
      {text && <span className={`cal-chip-text cal-chip-text--${kind}`}>{text}</span>}
    </span>
  )
}

/**
 * One habit's chip for one day. Past days are final: done is green, anything
 * else red. Today is still in progress, so it's only red/green once decided.
 */
function HabitChip({ task, value, note, isPast }: { task: Task; value: number; note: string; isPast: boolean }) {
  const done = isDayComplete(task, value)
  const check = <IconCheck size={10} stroke={2.5} />
  const cross = <IconX size={10} stroke={2.5} />

  if (task.type === 'binary') {
    if (done) return <Chip tone="done" icon={check} />
    // Explicitly failed (even today), or left unmarked on a past day.
    if (isDayFailed(task, value) || isPast) {
      return <Chip tone="missed" icon={note ? undefined : cross} text={note} kind="note" />
    }
    return <span className="cal-chip cal-chip--empty" />
  }

  const text = `${value}${task.unit}`
  if (done) return <Chip tone="done" text={text} kind="value" />
  if (isPast) return <Chip tone="missed" icon={cross} text={text} kind="value" />
  return value > 0 ? <Chip tone="pending" text={text} kind="value" /> : <span className="cal-chip cal-chip--empty" />
}

export function CalendarView() {
  const state = useAppState()
  const [anchor, setAnchor] = useState(new Date())
  const cells = monthGrid(anchor)
  const tasks = state.tasks.filter((t) => !t.archived)
  const today = todayKey()
  const [openDay, setOpenDay] = useState<DateKey | null>(null)
  // Which way the grid slides in when changing months.
  const [direction, setDirection] = useState<'prev' | 'next'>('next')

  function goMonth(delta: number) {
    setDirection(delta < 0 ? 'prev' : 'next')
    setAnchor((d) => shiftMonth(d, delta))
  }

  return (
    <div>
      <div className="cal-header">
        <p className="cal-label">Month</p>
        <div className="cal-nav">
          <button type="button" onClick={() => goMonth(-1)} aria-label="Previous month">
            <IconChevronLeft size={18} />
          </button>
          <span key={format(anchor, 'yyyy-MM')} className={`cal-month cal-month--${direction}`}>
            {format(anchor, 'MMMM yyyy')}
          </span>
          <button type="button" onClick={() => goMonth(1)} aria-label="Next month">
            <IconChevronRight size={18} />
          </button>
        </div>
      </div>

      {tasks.length === 0 && <p className="today-empty cal-empty">No habits yet — add one to get started.</p>}

      {tasks.length > 0 && (
        <>
          <p className="cal-legend">
            Top to bottom:
            {tasks.map((t) => (
              <TaskName key={t.id} task={t} className="cal-legend-item" />
            ))}
          </p>

          <div className="cal-weekdays">
            {WEEKDAY_LABELS.map((label, i) => (
              <div key={i} className="cal-weekday">{label}</div>
            ))}
          </div>

          {/* Keyed by month so navigating replays the slide-in. */}
          <div key={format(anchor, 'yyyy-MM')} className={`cal-grid cal-grid--${direction}`}>

            {cells.map((day, i) => {
              if (!day) return <div key={`pad-${i}`} />
              const key = toDateKey(day)
              const isToday = key === today
              const isFuture = key > today
              // Habits only count on days from when they were created.
              const dayTasks = isFuture ? [] : tasks.filter((t) => t.createdAt <= key)
              const isPast = key < today
              const doneCount = dayTasks.filter((t) => isDayComplete(t, state.logs[key]?.[t.id] ?? 0)).length
              const allDone = dayTasks.length > 0 && doneCount === dayTasks.length
              const missed = dayTasks.some((t) => {
                const v = state.logs[key]?.[t.id] ?? 0
                return isDayFailed(t, v) || (isPast && !isDayComplete(t, v))
              })

              const Cell = dayTasks.length > 0 ? 'button' : 'div'

              return (
                <Cell
                  key={key}
                  {...(Cell === 'button' && { type: 'button' as const, onClick: () => setOpenDay(key) })}
                  style={{ '--i': i } as CSSProperties}
                  className={`cal-day${isToday ? ' cal-day--today' : ''}${allDone ? ' cal-day--done' : ''}${missed ? ' cal-day--missed' : ''}${isFuture ? ' cal-day--future' : ''}`}
                >
                  <span className={`cal-date${isToday ? ' cal-date--today' : ''}`}>{day.getDate()}</span>
                  {dayTasks.map((t) => (
                    <HabitChip
                      key={t.id}
                      task={t}
                      value={state.logs[key]?.[t.id] ?? 0}
                      note={state.notes[key]?.[t.id] ?? ''}
                      isPast={isPast}
                    />
                  ))}
                </Cell>
              )
            })}
          </div>
        </>
      )}

      {openDay && <DaySheet dateKey={openDay} onClose={() => setOpenDay(null)} />}
    </div>
  )
}
