import { useState } from 'react'
import { format } from 'date-fns'
import { IconPlus } from '@tabler/icons-react'
import { DayHabits } from '../components/DayHabits'
import { TaskSheet } from '../components/TaskSheet'
import { useAppState } from '../lib/store'
import { todayKey } from '../lib/dates'
import { isDayComplete } from '../lib/streak'
import type { Task } from '../lib/types'
import './TodayView.css'

export function TodayView() {
  const state = useAppState()
  const key = todayKey()
  const tasks = state.tasks.filter((t) => !t.archived)
  const [showAdd, setShowAdd] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const doneCount = tasks.filter((t) => isDayComplete(t, state.logs[key]?.[t.id] ?? 0)).length
  const allDone = tasks.length > 0 && doneCount === tasks.length

  return (
    <div className="today-view">
      <div className="today-header">
        <div>
          <p className="today-date">{format(new Date(), 'EEEE, MMMM d')}</p>
          <h1 className="today-title">Today</h1>
        </div>
        <button
          type="button"
          className="today-add"
          onClick={() => setShowAdd(true)}
          aria-label="Add habit"
        >
          <IconPlus size={20} stroke={2.25} />
        </button>
      </div>

      {tasks.length > 0 && (
        <div className={`today-progress${allDone ? ' is-complete' : ''}`}>
          <div className="today-progress-label">
            <span>{allDone ? 'All done for today' : 'Daily progress'}</span>
            <span className="today-progress-count">
              <span key={doneCount} className="today-progress-num">
                {doneCount}
              </span>
              /{tasks.length}
            </span>
          </div>
          <div className="today-progress-bar" aria-hidden>
            {tasks.map((t, i) => (
              <span key={t.id} className={`today-progress-seg${i < doneCount ? ' on' : ''}`} />
            ))}
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <button type="button" className="today-empty" onClick={() => setShowAdd(true)}>
          <IconPlus size={18} />
          <span>No habits yet — add your first one</span>
        </button>
      )}

      <DayHabits dateKey={key} tasks={tasks} onEdit={setEditingTask} />

      {showAdd && <TaskSheet onClose={() => setShowAdd(false)} />}
      {editingTask && <TaskSheet task={editingTask} onClose={() => setEditingTask(null)} />}
    </div>
  )
}
