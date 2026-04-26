import React, { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Award, Target, Loader2, BookOpen, CheckSquare, MessageSquare } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const Progress = ({ session }) => {
  const [stats, setStats] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProgress()
  }, [session])

  const fetchProgress = async () => {
    try {
      // Seed demo data if localStorage is empty (for demo purposes)
      const existing = JSON.parse(localStorage.getItem('local_sessions') || '[]')
      if (existing.length === 0) {
        const demoSessions = [
          { role: 'Software Engineer', session_type: 'mcq', score: 8, total: 10, questions_practiced: 10, created_at: new Date(Date.now() - 4 * 86400000).toISOString() },
          { role: 'Product Manager', session_type: 'question_bank', score: null, total: null, questions_practiced: 15, created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
          { role: 'Data Scientist', session_type: 'study_plan', score: null, total: null, questions_practiced: 20, created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
          { role: 'Software Engineer', session_type: 'mock_interview', score: null, total: null, questions_practiced: 6, created_at: new Date(Date.now() - 86400000).toISOString() },
        ]
        localStorage.setItem('local_sessions', JSON.stringify(demoSessions))
      }

      let dbSessions = []
      let dbMcq = []

      if (session?.user) {
        const uid = session.user.id
        const { data: sData } = await supabase.from('sessions').select('*').eq('user_id', uid)
        const { data: mData } = await supabase.from('mcq_attempts').select('*').eq('user_id', uid)
        if (sData) dbSessions = sData
        if (mData) dbMcq = mData
      }

      // Merge localStorage + Supabase (deduplicate by created_at)
      const localSessions = JSON.parse(localStorage.getItem('local_sessions') || '[]')
      const localMcq = localSessions
        .filter(s => s.session_type === 'mcq' && s.score != null && s.total)
        .map(s => ({ score_percentage: Math.round((s.score / s.total) * 100) }))

      const allSessions = [...dbSessions, ...localSessions].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      const allMcq = [...dbMcq, ...localMcq]

      const totalQ = allSessions.reduce((s, x) => s + (x.questions_practiced || x.total || 0), 0)
      const avgMcq = allMcq.length ? Math.round(allMcq.reduce((s, x) => s + x.score_percentage, 0) / allMcq.length) : 0
      const mockCount = allSessions.filter(s => s.session_type === 'mock_interview').length

      setStats({ totalQ, avgMcq, mockCount, totalSessions: allSessions.length, mcqAttempts: allMcq.length })
      setHistory(allSessions)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={48} style={{ color: 'var(--teal)', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  const typeIcon = {
    question_bank: <BookOpen size={16} />,
    mcq: <CheckSquare size={16} />,
    mock_interview: <MessageSquare size={16} />,
    study_plan: <Award size={16} />
  }
  const typeLabel = {
    question_bank: 'Question Bank',
    mcq: 'MCQ Quiz',
    mock_interview: 'Mock Interview',
    study_plan: 'Study Plan'
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1100px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
        <div>
          <h1 className="instrument-serif italic" style={{ fontSize: '48px', marginBottom: '12px' }}>Your Progress</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track your interview preparation journey over time.</p>
        </div>
        <div style={{ 
          width: '56px', 
          height: '56px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, var(--teal), var(--accent-purple))', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          color: 'white', 
          fontWeight: 700, 
          fontSize: '18px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          {(session?.user?.email?.[0] || 'U').toUpperCase()}
        </div>
      </header>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '48px' }}>
        {[
          { label: 'Questions Practiced', value: stats?.totalQ, icon: <BookOpen size={24} />, color: 'var(--teal)' },
          { label: 'Avg MCQ Score', value: `${stats?.avgMcq}%`, icon: <Target size={24} />, color: 'var(--accent-purple)' },
          { label: 'Mock Sessions', value: stats?.mockCount, icon: <MessageSquare size={24} />, color: 'var(--accent-amber)' },
          { label: 'Total Sessions', value: stats?.totalSessions, icon: <TrendingUp size={24} />, color: 'var(--accent-coral)' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ textAlign: 'center', padding: '28px 20px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: s.color }}>{s.icon}</div>
            <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>{s.value ?? 0}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Activity history */}
      <div className="card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <h3>Session History</h3>
          <span className="badge badge-navy">{history.length} sessions</span>
        </div>

        {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <BarChart3 size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p>No sessions yet. Complete a quiz or question bank session to see your progress here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {history.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderRadius: '14px', background: 'var(--warm-white)', border: '1px solid var(--border-light)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal)' }}>
                  {typeIcon[item.session_type] || <BookOpen size={16} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{item.role}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{typeLabel[item.session_type] || item.session_type}</div>
                </div>
                {item.score !== null && item.total && (
                  <div style={{ textAlign: 'right', marginRight: '16px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--teal)' }}>{Math.round((item.score / item.total) * 100)}%</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.score}/{item.total}</div>
                  </div>
                )}
                {item.questions_practiced > 0 && !item.score && (
                  <div style={{ textAlign: 'right', marginRight: '16px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--navy)' }}>{item.questions_practiced}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>questions</div>
                  </div>
                )}
                <div style={{ fontSize: '12px', color: 'var(--text-hint)' }}>
                  {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Progress

