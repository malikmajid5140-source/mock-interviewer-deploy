import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Landing from './pages/Landing'
import SignUp from './pages/auth/SignUp'
import SignIn from './pages/auth/SignIn'
import Verify from './pages/auth/Verify'
import Profile from './pages/auth/Profile'
import Dashboard from './pages/dashboard/Dashboard'
import QuestionBank from './pages/dashboard/QuestionBank'
import MockInterview from './pages/dashboard/MockInterview'
import McqQuiz from './pages/dashboard/McqQuiz'
import StudyPlan from './pages/dashboard/StudyPlan'
import Progress from './pages/dashboard/Progress'
import Settings from './pages/dashboard/Settings'
import DashboardLayout from './components/DashboardLayout'
import JobDNA from './pages/dashboard/JobDNA'
import NegotiationDojo from './pages/dashboard/NegotiationDojo'
import PanelInterview from './pages/dashboard/PanelInterview'
import PatternAnalysis from './pages/dashboard/PatternAnalysis'
import InterviewLab from './pages/dashboard/InterviewLab'
import ResumeAnalyzer from './pages/dashboard/ResumeAnalyzer'
import Checkout from './pages/dashboard/Checkout'

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
        if (!['dashboard', 'question-bank', 'mock-interview', 'mcq-quiz', 'study-plan', 'progress', 'settings', 'job-dna', 'panel', 'negotiation', 'patterns'].includes(currentView)) {
          setCurrentView('dashboard')
        }
      } else {
        // Only redirect to landing if not on a demo-able page
        if (!['dashboard', 'interview-lab', 'resume-analyzer', 'question-bank'].includes(currentView)) {
          setCurrentView('landing')
        }
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
    if ((['landing', 'signup', 'signin', 'verify', 'profile'].includes(currentView) && currentView !== 'dashboard') || (!session && !['dashboard', 'question-bank', 'mock-interview', 'mcq-quiz', 'study-plan', 'progress', 'settings', 'job-dna', 'panel', 'negotiation', 'patterns', 'interview-lab', 'resume-analyzer'].includes(currentView))) {
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
      <DashboardLayout navigate={navigate} activeView={currentView} session={session}>
        {(() => {
          switch (currentView) {
            case 'question-bank':  return <QuestionBank navigate={navigate} />
            case 'mock-interview':  return <MockInterview navigate={navigate} />
            case 'mcq-quiz':        return <McqQuiz />
            case 'study-plan':      return <StudyPlan session={session} />
            case 'progress':        return <Progress session={session} />
            case 'settings':        return <Settings navigate={navigate} session={session} />
            case 'job-dna':         return <JobDNA navigate={navigate} />
            case 'panel':           return <PanelInterview navigate={navigate} />
            case 'negotiation':     return <NegotiationDojo navigate={navigate} />
            case 'patterns':        return <PatternAnalysis session={session} />
            case 'interview-lab':   return <InterviewLab navigate={navigate} session={session} />
            case 'resume-analyzer': return <ResumeAnalyzer navigate={navigate} />
            case 'checkout':        return <Checkout navigate={navigate} />
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
