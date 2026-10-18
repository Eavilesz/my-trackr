import type { CSSProperties } from 'react'
import { parseISO } from 'date-fns'
import { BinaryTaskCard } from './BinaryTaskCard'
import { QuantityTaskCard } from './QuantityTaskCard'
import { useAppState, cycleBinary, addToLog, setLog, setNote, getLog, getNote } from '../lib/store'
import { currentStreak } from '../lib/streak'
import type { DateKey, Task } from '../lib/types'

type Props = {
  dateKey: DateKey
  tasks: Task[]
  /** When given, tapping a habit's name opens it for editing. */
  onEdit?: (task: Task) => void
}

/** Habit cards wired to the store for one specific day. */
export function DayHabits({ dateKey, tasks, onEdit }: Props) {
  const state = useAppState()

  return (
    <div className="today-list">
      {tasks.map((task, i) => {
        const edit = onEdit && (() => onEdit(task))
        const value = getLog(dateKey, task.id)
        return (
          // --i staggers each card's entrance (see .habit-item).
          <div key={task.id} className="habit-item" style={{ '--i': i } as CSSProperties}>
            {task.type === 'binary' ? (
              <BinaryTaskCard
                task={task}
                value={value}
                streak={currentStreak(state, task, parseISO(dateKey))}
                note={getNote(dateKey, task.id)}
                onNoteChange={(text) => setNote(dateKey, task.id, text)}
                onToggle={() => cycleBinary(dateKey, task.id)}
                onEdit={edit}
              />
            ) : (
              <QuantityTaskCard
                task={task}
                value={value}
                onAdd={(amount) => addToLog(dateKey, task.id, amount)}
                onComplete={() => setLog(dateKey, task.id, value >= task.goal ? 0 : task.goal)}
                onEdit={edit}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
