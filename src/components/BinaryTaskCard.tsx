import { useRef, useState } from 'react'
import { IconCheck, IconNote, IconX } from '@tabler/icons-react'
import { BINARY_DONE, BINARY_FAILED, type BinaryTask } from '../lib/types'
import { TaskName } from './TaskName'
import './TaskCard.css'

type Props = {
  task: BinaryTask
  /** 0 = unmarked, BINARY_DONE, or BINARY_FAILED. */
  value: number
  streak: number
  note: string
  onToggle: () => void
  onEdit?: () => void
  onNoteChange: (text: string) => void
}

export function BinaryTaskCard({ task, value, streak, note, onToggle, onEdit, onNoteChange }: Props) {
  const done = value === BINARY_DONE
  const failed = value === BINARY_FAILED
  const [editingNote, setEditingNote] = useState(false)
  const [draft, setDraft] = useState('')
  // Escape unmounts the input, which can still fire blur — don't save then.
  const cancelled = useRef(false)

  function startNote() {
    cancelled.current = false
    setDraft(note)
    setEditingNote(true)
  }

  function commitNote() {
    if (!cancelled.current) onNoteChange(draft.trim())
    setEditingNote(false)
  }

  return (
    <div className="task-card binary-card">
      <button
        type="button"
        className={`binary-check${done ? ' checked' : ''}${failed ? ' failed' : ''}`}
        onClick={onToggle}
        aria-label={`"${task.name}" is ${done ? 'done' : failed ? 'not done' : 'unmarked'}. Tap to change.`}
      >
        {done && <IconCheck size={20} stroke={2.5} />}
        {failed && <IconX size={20} stroke={2.5} />}
      </button>
      <div className="binary-body">
        <TaskName task={task} onEdit={onEdit} />
        <span className="task-subtext">
          {streak > 0 ? `${streak} day streak` : 'No streak yet'}
        </span>
        {failed &&
          (editingNote ? (
            <input
              className="task-note-input"
              value={draft}
              maxLength={30}
              placeholder="Note"
              autoFocus
              enterKeyHint="done"
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitNote}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.currentTarget.blur()
                if (e.key === 'Escape') {
                  cancelled.current = true
                  e.currentTarget.blur()
                }
              }}
            />
          ) : (
            <button type="button" className={`task-note${note ? ' has-note' : ''}`} onClick={startNote}>
              <IconNote size={13} />
              {note || 'Add note'}
            </button>
          ))}
      </div>
    </div>
  )
}
