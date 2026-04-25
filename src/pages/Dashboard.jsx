import React, { useState, useEffect } from 'react'
import { Plus, Search, BookOpen, CheckSquare, MessageSquare, ArrowRight, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

const Dashboard = ({ navigate, session }) => {
  const [stats, setStats] = useState({
    questionsPracticed: 0,
    mcqAccuracy: 0,
    mockSessions: 0,
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)

  const userEmail = session?.user?.email || 'Candidate'
  const userName = userEmail.split('@')[0]

  useEffect(() => {
    fetchDashboardData()
  }, [session])

  async function fetchDashboardData() {
    if (!session?.user) return
    
    try {
      // 1. Total questions practiced
      const { data: sessionsData } = await supabase
        .from('sessions')
        .select('questions_practiced')
        .eq('user_id', session.user.id)
      
      const totalQuestions = sessionsData?.reduce((acc, curr) => acc + (curr.questions_practiced || 0), 0) || 0

      // 2. MCQ Accuracy
      const { data: mcqData } = await supabase
        .from('mcq_attempts')
        .select('score_percentage')
        .eq('user_id', session.user.id)
      
      const avgAccuracy = mcqData?.length 
        ? Math.round(mcqData.reduce((acc, curr) => acc + curr.score_percentage, 0) / mcqData.length)
        : 0

      // 3. Mock sessions
      const { count: mockCount } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .eq('session_type', 'mock_interview')

      // 4. Recent Activity
      const { data: recent } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      setStats({
        questionsPracticed: totalQuestions,
        mcqAccuracy: avgAccuracy,
        mockSessions: mockCount || 0,
        recentActivity: recent || []
      })
    } catch (error) {
      console.error("Dashboard Fetch Error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="spin" size={48} style={{ color: 'var(--teal)' }} />
      </div>
    )
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 600, marginBottom: '8px' }}>
            Good morning, {userName} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Ready to crush your next interview?</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search roles..." style={{ padding: '12px 16px 12px 48px', borderRadius: '12px', border: '1.5px solid var(--border-light)', width: '240px' }} />
          </div>
          <button className="btn-primary" onClick={() => navigate('question-bank')} style={{ gap: '8px' }}><Plus size={18} /> Generate</button>
        </div>
      </header>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '48px' }}>
        <div className="card">
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Questions Practiced</div>
          <div style={{ fontSize: '40px', fontWeight: 700, color: 'var(--navy)' }}>{stats.questionsPracticed}</div>
          <div style={{ fontSize: '13px', color: 'var(--teal)', marginTop: '8px' }}>Global average: 42</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>MCQ Accuracy</div>
          <div style={{ fontSize: '40px', fontWeight: 700, color: 'var(--navy)' }}>{stats.mcqAccuracy}%</div>
          <div style={{ fontSize: '13px', color: 'var(--teal)', marginTop: '8px' }}>Target: 90%</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Mock Sessions</div>
          <div style={{ fontSize: '40px', fontWeight: 700, color: 'var(--navy)' }}>{stats.mockSessions}</div>
          <div style={{ fontSize: '13px', color: 'var(--teal)', marginTop: '8px' }}>Keep it up!</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        {/* Recent Activity */}
        <div className="card">
          <h3 style={{ marginBottom: '24px' }}>Recent Activity</h3>
          {stats.recentActivity.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {stats.recentActivity.map((activity, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal)' }}>
                      {activity.session_type === 'question_bank' ? <BookOpen size={18} /> : activity.session_type === 'mcq' ? <CheckSquare size={18} /> : <MessageSquare size={18} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '15px' }}>{activity.role}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{activity.session_type.replace('_', ' ').toUpperCase()}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-hint)' }}>{new Date(activity.created_at).toLocaleDateString()}</div>
                    {activity.score !== null && <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--teal)' }}>{activity.score}/{activity.total}</div>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <p>No activity yet. Start your first session!</p>
              <button className="btn-ghost" onClick={() => navigate('question-bank')} style={{ marginTop: '16px' }}>Generate Questions <ArrowRight size={16} /></button>
            </div>
          )}
        </div>

        {/* Quick Start */}
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Quick Start</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>Jump back into your top practiced roles.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {['SOFTWARE ENGINEER', 'PRODUCT MANAGER', 'DATA SCIENTIST', 'UX DESIGNER'].map(role => (
              <button 
                key={role} 
                onClick={() => navigate('question-bank')}
                className="badge badge-navy" 
                style={{ padding: '8px 16px', border: 'none', cursor: 'pointer' }}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
