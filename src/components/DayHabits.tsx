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
      {tasks.map((task) => {
        const edit = onEdit && (() => onEdit(task))
        if (task.type === 'binary') {
          return (
            <BinaryTaskCard
              key={task.id}
              task={task}
              value={getLog(dateKey, task.id)}
              streak={currentStreak(state, task, parseISO(dateKey))}
              note={getNote(dateKey, task.id)}
              onNoteChange={(text) => setNote(dateKey, task.id, text)}
              onToggle={() => cycleBinary(dateKey, task.id)}
              onEdit={edit}
            />
          )
        }
        const value = getLog(dateKey, task.id)
        return (
          <QuantityTaskCard
            key={task.id}
            task={task}
            value={value}
            onAdd={(amount) => addToLog(dateKey, task.id, amount)}
            onComplete={() => setLog(dateKey, task.id, value >= task.goal ? 0 : task.goal)}
            onEdit={edit}
          />
        )
      })}
    </div>
  )
}
