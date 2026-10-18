import { useRef, useState } from 'react'
import { IconNote } from '@tabler/icons-react'
import { BINARY_DONE, BINARY_FAILED, type BinaryTask } from '../lib/types'
import { TaskName } from './TaskName'
import { Burst, CheckMark, CrossMark } from './Marks'
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

/** The state a tap just moved the habit into — drives the one-shot feedback animation. */
type Fx = 'done' | 'failed' | 'cleared'

export function BinaryTaskCard({ task, value, streak, note, onToggle, onEdit, onNoteChange }: Props) {
  const done = value === BINARY_DONE
  const failed = value === BINARY_FAILED
  const [editingNote, setEditingNote] = useState(false)
  const [draft, setDraft] = useState('')
  // Only animate after a tap, not when the card first renders in an already-marked state.
  const [fx, setFx] = useState<Fx | null>(null)
  // Escape unmounts the input, which can still fire blur — don't save then.
  const cancelled = useRef(false)

  function toggle() {
    // Mirrors cycleBinary: unmarked → done → failed → unmarked.
    setFx(done ? 'failed' : failed ? 'cleared' : 'done')
    onToggle()
  }

  function startNote() {
    cancelled.current = false
    setDraft(note)
    setEditingNote(true)
  }

  function commitNote() {
    if (!cancelled.current) onNoteChange(draft.trim())
    setEditingNote(false)
  }

  const stateClass = done ? ' is-done' : failed ? ' is-failed' : ''

  return (
    <div className={`task-card binary-card${stateClass}${fx ? ` fx-${fx}` : ''}`}>
      {fx === 'done' && done && <span className="card-sweep" aria-hidden />}
      <button
        type="button"
        className="check-btn binary-check"
        onClick={toggle}
        aria-label={`"${task.name}" is ${done ? 'done' : failed ? 'not done' : 'unmarked'}. Tap to change.`}
      >
        {done && <CheckMark size={22} />}
        {failed && <CrossMark size={20} />}
        {fx === 'done' && done && <Burst />}
      </button>
      <div className="binary-body">
        <TaskName task={task} onEdit={onEdit} />
        <span className="task-subtext">
          {streak > 0 ? (
            <>
              <span key={streak} className="streak-num">
                {streak}
              </span>{' '}
              day streak
            </>
          ) : (
            'No streak yet'
          )}
        </span>
        {failed &&
          (editingNote ? (
            <input
              className="task-note-input"
              value={draft}
              maxLength={30}
              placeholder="What got in the way?"
              autoFocus
              enterKeyHint="done"
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitNote}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.currentTarget.blur()
                if (e.key === 'Escape') {
                  e.preventDefault()
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
