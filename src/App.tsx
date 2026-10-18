import { useState } from 'react'
import { TabBar, type ViewId } from './components/TabBar'
import { TodayView } from './views/TodayView'
import { CalendarView } from './views/CalendarView'
import './App.css'

function App() {
  const [view, setView] = useState<ViewId>('today')

  return (
    <div className="app-shell">
      <main className="app-content">
        {/* Keyed so switching tabs remounts and replays the entrance. */}
        <div key={view} className="view">
          {view === 'today' && <TodayView />}
          {view === 'month' && <CalendarView />}
        </div>
      </main>
      <TabBar active={view} onChange={setView} />
    </div>
  )
}

export default App
