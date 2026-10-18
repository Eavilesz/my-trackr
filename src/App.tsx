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
        {view === 'today' && <TodayView />}
        {view === 'month' && <CalendarView />}
      </main>
      <TabBar active={view} onChange={setView} />
    </div>
  )
}

export default App
