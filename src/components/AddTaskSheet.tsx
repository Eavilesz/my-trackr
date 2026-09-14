import { useState } from 'react'
import { IconX } from '@tabler/icons-react'
import { addTask } from '../lib/store'
import { newId } from '../lib/id'
import { todayKey } from '../lib/dates'
import type { Task } from '../lib/types'
import './AddTaskSheet.css'

type Props = {
  onClose: () => void
}

export function AddTaskSheet({ onClose }: Props) {
  const [type, setType] = useState<'binary' | 'quantity'>('binary')
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('')
  const [unit, setUnit] = useState('')
  const [quickAdds, setQuickAdds] = useState('10, 20')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) return

    const base = { id: newId(), name: trimmedName, createdAt: todayKey() }

    let task: Task
    if (type === 'binary') {
      task = { ...base, type: 'binary' }
    } else {
      const parsedGoal = Number(goal)
      if (!Number.isFinite(parsedGoal) || parsedGoal <= 0) return
      const parsedQuickAdds = quickAdds
        .split(',')
        .map((s) => Number(s.trim()))
        .filter((n) => Number.isFinite(n) && n > 0)
      task = {
        ...base,
        type: 'quantity',
        goal: parsedGoal,
        unit: unit.trim() || 'units',
        quickAdds: parsedQuickAdds.length > 0 ? parsedQuickAdds : [10],
      }
    }

    addTask(task)
    onClose()
  }

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <form className="sheet" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="sheet-header">
          <h2>New habit</h2>
          <button type="button" className="sheet-close" onClick={onClose} aria-label="Close">
            <IconX size={18} />
          </button>
        </div>

        <label className="sheet-field">
          <span>Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Meditate"
            autoFocus
          />
        </label>

        <div className="sheet-type-toggle">
          <button
            type="button"
            className={type === 'binary' ? 'active' : ''}
            onClick={() => setType('binary')}
          >
            Yes / no
          </button>
          <button
            type="button"
            className={type === 'quantity' ? 'active' : ''}
            onClick={() => setType('quantity')}
          >
            Amount per day
          </button>
        </div>

        {type === 'quantity' && (
          <>
            <div className="sheet-row">
              <label className="sheet-field">
                <span>Daily goal</span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="150"
                />
              </label>
              <label className="sheet-field">
                <span>Unit</span>
                <input
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="g"
                />
              </label>
            </div>
            <label className="sheet-field">
              <span>Quick-add amounts (comma separated)</span>
              <input
                value={quickAdds}
                onChange={(e) => setQuickAdds(e.target.value)}
                placeholder="10, 20"
              />
            </label>
          </>
        )}

        <button type="submit" className="sheet-submit">
          Add habit
        </button>
      </form>
    </div>
  )
}
