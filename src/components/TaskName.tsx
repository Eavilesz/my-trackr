import type { Task } from '../lib/types'
import { HABIT_ICONS } from '../lib/icons'

type Props = {
  task: Task
  className?: string
  /** When given, the name is a button that opens the habit for editing. */
  onEdit?: () => void
}

/** A habit's icon (if any) followed by its name. */
export function TaskName({ task, className = '', onEdit }: Props) {
  const icon = HABIT_ICONS.find((i) => i.id === task.icon)
  const content = (
    <>
      {icon && <icon.Icon size={16} stroke={1.75} className="task-icon" />}
      {task.name}
    </>
  )

  return onEdit ? (
    <button type="button" className={`task-label task-name-btn ${className}`} onClick={onEdit}>
      {content}
    </button>
  ) : (
    <span className={`task-label ${className}`}>{content}</span>
  )
}
