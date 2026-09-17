import { IconCheck, IconPencil } from '@tabler/icons-react'
import type { BinaryTask } from '../lib/types'
import './TaskCard.css'

type Props = {
  task: BinaryTask
  done: boolean
  streak: number
  onToggle: () => void
  onEdit: () => void
}

export function BinaryTaskCard({ task, done, streak, onToggle, onEdit }: Props) {
  return (
    <div className="task-card binary-card">
      <button
        type="button"
        className={`binary-check${done ? ' checked' : ''}`}
        onClick={onToggle}
        aria-pressed={done}
        aria-label={`Mark "${task.name}" as ${done ? 'not done' : 'done'}`}
      >
        {done && <IconCheck size={20} stroke={2.5} />}
      </button>
      <div className="binary-body">
        <span className="task-label">{task.name}</span>
        <span className="task-subtext">
          {streak > 0 ? `${streak} day streak` : 'No streak yet'}
        </span>
      </div>
      <button
        type="button"
        className="task-edit"
        onClick={onEdit}
        aria-label={`Edit "${task.name}"`}
      >
        <IconPencil size={16} />
      </button>
    </div>
  )
}
