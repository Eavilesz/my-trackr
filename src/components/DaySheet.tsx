import { format, parseISO } from 'date-fns'
import { DayHabits } from './DayHabits'
import { Sheet } from './Sheet'
import { useAppState } from '../lib/store'
import type { DateKey } from '../lib/types'

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
    <Sheet title={format(parseISO(dateKey), 'EEEE, MMMM d')} onClose={onClose}>
      {() => <DayHabits dateKey={dateKey} tasks={tasks} />}
    </Sheet>
  )
}
