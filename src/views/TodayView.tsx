import { useState } from 'react'
import { format } from 'date-fns'
import { IconPlus } from '@tabler/icons-react'
import { BinaryTaskCard } from '../components/BinaryTaskCard'
import { QuantityTaskCard } from '../components/QuantityTaskCard'
import { TaskSheet } from '../components/TaskSheet'
import { useAppState, toggleBinary, addToLog, setLog, getLog } from '../lib/store'
import { todayKey } from '../lib/dates'
import { currentStreak } from '../lib/streak'
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

      <div className="today-list">
        {tasks.map((task) => {
          if (task.type === 'binary') {
            const done = getLog(key, task.id) > 0
            return (
              <BinaryTaskCard
                key={task.id}
                task={task}
                done={done}
                streak={currentStreak(state, task)}
                onToggle={() => toggleBinary(key, task.id)}
                onEdit={() => setEditingTask(task)}
              />
            )
          }
          const value = getLog(key, task.id)
          return (
            <QuantityTaskCard
              key={task.id}
              task={task}
              value={value}
              onAdd={(amount) => addToLog(key, task.id, amount)}
              onComplete={() => setLog(key, task.id, value >= task.goal ? 0 : task.goal)}
              onEdit={() => setEditingTask(task)}
            />
          )
        })}
      </div>

      {showAdd && <TaskSheet onClose={() => setShowAdd(false)} />}
      {editingTask && (
        <TaskSheet task={editingTask} onClose={() => setEditingTask(null)} />
      )}
    </div>
  )
}
