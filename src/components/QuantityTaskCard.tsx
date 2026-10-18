import { useRef, useState } from 'react'
import type { QuantityTask } from '../lib/types'
import { TaskName } from './TaskName'
import { Burst, CheckMark } from './Marks'
import { AmountPad } from './AmountPad'
import './TaskCard.css'

type Props = {
  task: QuantityTask
  value: number
  onAdd: (amount: number) => void
  onComplete: () => void
  onEdit?: () => void
}

type Floater = { id: number; text: string }

export function QuantityTaskCard({ task, value, onAdd, onComplete, onEdit }: Props) {
  const pct = Math.min(100, (value / task.goal) * 100)
  const done = value >= task.goal
  // Bumped each time a tap crosses the goal; used as a key to replay the celebration.
  const [celebration, setCelebration] = useState(0)
  // "+10" labels that float up from the figure and remove themselves.
  const [floaters, setFloaters] = useState<Floater[]>([])
  const [touched, setTouched] = useState(false)
  const nextFloaterId = useRef(0)
  // Inline "Other" keypad. Not window.prompt: iOS home-screen apps never show it.
  const [customOpen, setCustomOpen] = useState(false)

  function add(amount: number) {
    if (value < task.goal && value + amount >= task.goal) setCelebration((c) => c + 1)
    const id = nextFloaterId.current++
    setFloaters((f) => [...f, { id, text: `${amount > 0 ? '+' : ''}${amount}` }])
    setTouched(true)
    onAdd(amount)
  }

  function complete() {
    if (!done) setCelebration((c) => c + 1)
    setTouched(true)
    onComplete()
  }

  const celebrating = celebration > 0 && done

  return (
    <div className={`task-card quantity-card${done ? ' is-done' : ''}`}>
      {celebrating && <span key={celebration} className="card-sweep" aria-hidden />}
      <div className="quantity-header">
        <button
          type="button"
          className="check-btn quantity-check"
          onClick={complete}
          aria-pressed={done}
          aria-label={`Mark "${task.name}" goal as ${done ? 'not met' : 'met'}`}
        >
          {/* Keyed so the pop replays on every celebration. */}
          <span key={celebration} className={`check-box${celebrating ? ' pop' : ''}`}>
            {done && <CheckMark size={14} />}
          </span>
          {celebrating && <Burst key={`burst-${celebration}`} />}
        </button>
        <TaskName task={task} className="quantity-name" onEdit={onEdit} />
        <span className="quantity-figure">
          <span key={value} className={`quantity-value${touched ? ' bump' : ''}`}>
            {value}
          </span>
          <span className="quantity-goal">
            {' '}/ {task.goal} {task.unit}
          </span>
          {floaters.map((f) => (
            <span
              key={f.id}
              className="quantity-floater"
              aria-hidden
              onAnimationEnd={() => setFloaters((all) => all.filter((x) => x.id !== f.id))}
            >
              {f.text}
            </span>
          ))}
        </span>
      </div>
      <div className="quantity-track">
        <div className="quantity-fill" style={{ width: `${pct}%` }}>
          {celebrating && <span key={celebration} className="quantity-shine" />}
        </div>
      </div>
      {customOpen ? (
        <AmountPad
          unit={task.unit}
          onSubmit={(amount) => {
            add(amount)
            setCustomOpen(false)
          }}
          onCancel={() => setCustomOpen(false)}
        />
      ) : (
        <div className="quantity-chips">
          {task.quickAdds.map((amount) => (
            <button key={amount} type="button" className="quantity-chip" onClick={() => add(amount)}>
              +{amount} {task.unit}
            </button>
          ))}
          <button type="button" className="quantity-chip quantity-chip--other" onClick={() => setCustomOpen(true)}>
            Other
          </button>
        </div>
      )}
    </div>
  )
}
