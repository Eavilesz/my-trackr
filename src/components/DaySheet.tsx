import { format, parseISO } from 'date-fns'
import { IconX } from '@tabler/icons-react'
import { DayHabits } from './DayHabits'
import { useAppState } from '../lib/store'
import type { DateKey } from '../lib/types'
import './TaskSheet.css'

type Props = {
  dateKey: DateKey
  onClose: () => void
}

/** Bottom sheet to view and change every habit's value for a single day. */
export function DaySheet({ dateKey, onClose }: Props) {
  const state = useAppState()
  // Habits only exist from the day they were created.
  const tasks = state.tasks.filter((t) => !t.archived && t.createdAt <= dateKey)

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-header">
          <h2>{format(parseISO(dateKey), 'EEEE, MMMM d')}</h2>
          <button type="button" className="sheet-close" onClick={onClose} aria-label="Close">
            <IconX size={18} />
          </button>
        </div>
        <DayHabits dateKey={dateKey} tasks={tasks} />
      </div>
    </div>
  )
}
