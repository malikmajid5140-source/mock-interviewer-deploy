import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Landing from './pages/Landing'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Verify from './pages/Verify'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import QuestionBank from './pages/QuestionBank'
import MockInterview from './pages/MockInterview'
import McqQuiz from './pages/McqQuiz'
import DashboardLayout from './components/DashboardLayout'

function App() {
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash.replace('#', '')
    return hash || 'landing'
  })
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        const hash = window.location.hash.replace('#', '')
        setCurrentView(hash || 'dashboard')
      } else {
        const hash = window.location.hash.replace('#', '')
        if (hash) setCurrentView(hash)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        // Stay on current view if it's already a dashboard view
        if (!['dashboard', 'question-bank', 'mock-interview', 'mcq-quiz', 'study-plan', 'progress', 'settings'].includes(currentView)) {
          setCurrentView('dashboard')
        }
      } else {
        setCurrentView('landing')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const navigate = (view) => {
    setCurrentView(view)
    window.location.hash = view
    window.scrollTo(0, 0)
  }

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--warm-white)', color: 'var(--teal)', fontFamily: 'DM Sans' }}>
        <div className="mono">Loading Interview Forge...</div>
      </div>
    )
  }

  const renderView = () => {
    // Auth and Landing views (Full Page)
    if (['landing', 'signup', 'signin', 'verify', 'profile'].includes(currentView) || !session) {
      switch (currentView) {
        case 'signup': return <SignUp navigate={navigate} />
        case 'signin': return <SignIn navigate={navigate} />
        case 'verify': return <Verify navigate={navigate} />
        case 'profile': return <Profile navigate={navigate} />
        default: return <Landing navigate={navigate} session={session} />
      }
    }

    // Dashboard views (With Sidebar)
    return (
      <DashboardLayout navigate={navigate} activeView={currentView}>
        {(() => {
          switch (currentView) {
            case 'question-bank': return <QuestionBank navigate={navigate} />
            case 'mock-interview': return <MockInterview navigate={navigate} />
            case 'mcq-quiz': return <McqQuiz />
            case 'dashboard':
            default: return <Dashboard navigate={navigate} session={session} />
          }
        })()}
      </DashboardLayout>
    )
  }

  return (
    <div className="app-container">
      {renderView()}
    </div>
  )
}

export default App
