import { useState } from 'react'
import { format } from 'date-fns'
import { IconPlus } from '@tabler/icons-react'
import { DayHabits } from '../components/DayHabits'
import { TaskSheet } from '../components/TaskSheet'
import { useAppState } from '../lib/store'
import { todayKey } from '../lib/dates'
import type { Task } from '../lib/types'
import './TodayView.css'

export function TodayView() {
  const state = useAppState()
  const key = todayKey()
  const tasks = state.tasks.filter((t) => !t.archived)
  const [showAdd, setShowAdd] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

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
          <IconPlus size={20} />
        </button>
      </div>

      {tasks.length === 0 && (
        <p className="today-empty">No habits yet — add one to get started.</p>
      )}

      <DayHabits dateKey={key} tasks={tasks} onEdit={setEditingTask} />

      {showAdd && <TaskSheet onClose={() => setShowAdd(false)} />}
      {editingTask && (
        <TaskSheet task={editingTask} onClose={() => setEditingTask(null)} />
      )}
    </div>
  )
}
