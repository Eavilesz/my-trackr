import type { QuantityTask } from '../lib/types'
import './TaskCard.css'

type Props = {
  task: QuantityTask
  value: number
  onAdd: (amount: number) => void
}

export function QuantityTaskCard({ task, value, onAdd }: Props) {
  const pct = Math.min(100, (value / task.goal) * 100)

  return (
    <div className="task-card quantity-card">
      <div className="quantity-header">
        <span className="task-label">{task.name}</span>
        <span className="quantity-figure">
          {value} / {task.goal} {task.unit}
        </span>
      </div>
      <div className="quantity-track">
        <div className="quantity-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="quantity-chips">
        {task.quickAdds.map((amount) => (
          <button
            key={amount}
            type="button"
            className="quantity-chip"
            onClick={() => onAdd(amount)}
          >
            +{amount} {task.unit}
          </button>
        ))}
        <button
          type="button"
          className="quantity-chip"
          onClick={() => {
            const input = window.prompt(`Add how much ${task.unit}?`)
            const amount = Number(input)
            if (input && Number.isFinite(amount) && amount !== 0) onAdd(amount)
          }}
        >
          other
        </button>
      </div>
    </div>
  )
}
