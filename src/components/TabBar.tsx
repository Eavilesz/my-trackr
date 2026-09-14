import { IconSun, IconChartBar, IconCalendar } from '@tabler/icons-react'
import './TabBar.css'

export type ViewId = 'today' | 'week' | 'month'

const TABS: { id: ViewId; label: string; Icon: typeof IconSun }[] = [
  { id: 'today', label: 'Today', Icon: IconSun },
  { id: 'week', label: 'Week', Icon: IconChartBar },
  { id: 'month', label: 'Month', Icon: IconCalendar },
]

type Props = {
  active: ViewId
  onChange: (id: ViewId) => void
}

export function TabBar({ active, onChange }: Props) {
  return (
    <nav className="tab-bar">
      {TABS.map(({ id, label, Icon }) => {
        const isActive = id === active
        return (
          <button
            key={id}
            type="button"
            className={`tab-item${isActive ? ' active' : ''}`}
            onClick={() => onChange(id)}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon size={18} stroke={1.75} />
            <span>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
