import { useState } from 'react'
import { IconX } from '@tabler/icons-react'
import { addTask, updateTask, deleteTask } from '../lib/store'
import { newId } from '../lib/id'
import { todayKey } from '../lib/dates'
import type { Task } from '../lib/types'
import './TaskSheet.css'

type Props = {
  /** Task being edited, or undefined to create a new one. */
  task?: Task
  onClose: () => void
}

export function TaskSheet({ task, onClose }: Props) {
  const isEditing = task !== undefined
  const [type, setType] = useState<'binary' | 'quantity'>(task?.type ?? 'binary')
  const [name, setName] = useState(task?.name ?? '')
  const [goal, setGoal] = useState(task?.type === 'quantity' ? String(task.goal) : '')
  const [unit, setUnit] = useState(task?.type === 'quantity' ? task.unit : '')
  const [quickAdds, setQuickAdds] = useState(
    task?.type === 'quantity' ? task.quickAdds.join(', ') : '10, 20',
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) return

    if (type === 'binary') {
      if (isEditing) {
        updateTask(task.id, { name: trimmedName, type: 'binary' })
      } else {
        addTask({ id: newId(), name: trimmedName, createdAt: todayKey(), type: 'binary' })
      }
    } else {
      const parsedGoal = Number(goal)
      if (!Number.isFinite(parsedGoal) || parsedGoal <= 0) return
      const parsedQuickAdds = quickAdds
        .split(',')
        .map((s) => Number(s.trim()))
        .filter((n) => Number.isFinite(n) && n > 0)
      const quantityFields = {
        name: trimmedName,
        type: 'quantity' as const,
        goal: parsedGoal,
        unit: unit.trim() || 'units',
        quickAdds: parsedQuickAdds.length > 0 ? parsedQuickAdds : [10],
      }
      if (isEditing) {
        updateTask(task.id, quantityFields)
      } else {
        addTask({ id: newId(), createdAt: todayKey(), ...quantityFields })
      }
    }

    onClose()
  }

  function handleDelete() {
    if (!task) return
    if (!window.confirm(`Delete "${task.name}"? This removes its full history.`)) return
    deleteTask(task.id)
    onClose()
  }

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <form className="sheet" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="sheet-header">
          <h2>{isEditing ? 'Edit habit' : 'New habit'}</h2>
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
          {isEditing ? 'Save changes' : 'Add habit'}
        </button>

        {isEditing && (
          <button type="button" className="sheet-delete" onClick={handleDelete}>
            Delete habit
          </button>
        )}
      </form>
    </div>
  )
}
