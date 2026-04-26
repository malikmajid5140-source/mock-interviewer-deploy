import React, { useState, useEffect } from 'react'
import { Plus, Search, BookOpen, CheckSquare, MessageSquare, ArrowRight, Loader2, Sparkles, TrendingUp, Target, Zap, Clock, Calendar, Award, FileText, BarChart } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import logo from '../../assets/logo.png'
import FloatingBackground from '../../components/FloatingBackground'

const Dashboard = ({ navigate, session }) => {
  const [stats, setStats] = useState({
    questionsPracticed: 0,
    mcqAccuracy: 0,
    mockSessions: 0,
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  const userEmail = session?.user?.email || 'Candidate'
  const userName = userEmail.split('@')[0]

  useEffect(() => {
    fetchDashboardData()
  }, [session])

  async function fetchDashboardData() {
    if (!session?.user) return
    
    try {
      // Fetch core stats
      const { data: sessionsData } = await supabase.from('sessions').select('questions_practiced').eq('user_id', session.user.id)
      const totalQuestions = sessionsData?.reduce((acc, curr) => acc + (curr.questions_practiced || 0), 0) || 0

      const { data: mcqData } = await supabase.from('mcq_attempts').select('score_percentage').eq('user_id', session.user.id)
      const avgAccuracy = mcqData?.length ? Math.round(mcqData.reduce((acc, curr) => acc + curr.score_percentage, 0) / mcqData.length) : 0

      const { count: mockCount } = await supabase.from('sessions').select('*', { count: 'exact', head: true }).eq('user_id', session.user.id).eq('session_type', 'mock_interview')
      const { data: recent } = await supabase.from('sessions').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(5)

      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      const localAvatar = localStorage.getItem('user_avatar')
      setProfile({ ...profileData, avatar_url: localAvatar || null })

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

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  const aiInsights = [
    { title: "Skill Gap Identified", desc: "Your React hooks knowledge is 20% below target. Try a dedicated MCQ set.", icon: <Zap size={16} />, color: 'var(--accent-amber)' },
    { title: "Confidence Surge", desc: "Your tone in mock interviews has improved by 15% this week. Keep going!", icon: <TrendingUp size={16} />, color: 'var(--success)' },
    { title: "Strategy Alert", desc: "Recruiters are asking more about System Design for your target roles.", icon: <Sparkles size={16} />, color: 'var(--accent-purple)' }
  ]

  if (loading) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={48} style={{ color: 'var(--teal)' }} />
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'var(--warm-white)' }}>
      <FloatingBackground />
      <div style={{ padding: '40px 60px', maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Welcome Section */}
        <header className="animate-fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span className="badge badge-teal" style={{ background: 'var(--teal-light)', color: 'var(--teal)', fontWeight: 700 }}>PRO ACCESS</span>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>System Status: <span style={{ color: 'var(--success)' }}>Optimal</span></span>
            </div>
            <h1 style={{ fontSize: '42px', fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.02em' }}>
              {getGreeting()}, <span style={{ color: 'var(--teal)' }}>{profile?.first_name || userName}</span>
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginTop: '4px' }}>You have 2 practice sessions recommended for today.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-ghost" style={{ padding: '12px 24px', background: 'white' }}>
              <Calendar size={18} /> Schedule
            </button>
            <button className="btn-primary" onClick={() => navigate('mock-interview')} style={{ padding: '12px 24px' }}>
              <Plus size={18} /> New Session
            </button>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '2.4fr 1fr', gap: '32px' }}>
          {/* Main Content Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* AI Insights Bar */}
            <div className="animate-fade-up" style={{ animationDelay: '0.1s', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {aiInsights.map((insight, i) => (
                <div key={i} className="glass-card" style={{ padding: '24px', background: 'white', border: '1px solid var(--border-light)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: insight.color }}></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: insight.color }}>
                    {insight.icon}
                    <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{insight.title}</span>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{insight.desc}</p>
                </div>
              ))}
            </div>

            {/* Performance Matrix */}
            <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="card" style={{ padding: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Performance Matrix</h3>
                  <div className="badge badge-navy" style={{ background: 'var(--navy)', color: 'white' }}>LIVE ANALYTICS</div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 20px' }}>
                      <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" strokeWidth="2" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--teal)" strokeWidth="2" strokeDasharray={`${stats.mcqAccuracy}, 100`} />
                      </svg>
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '24px', fontWeight: 800 }}>{stats.mcqAccuracy}%</div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>MCQ Accuracy</div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--navy)', marginBottom: '10px' }}>{stats.questionsPracticed}</div>
                    <div style={{ height: '8px', background: '#eee', borderRadius: '4px', width: '80%', margin: '0 auto 12px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '65%', background: 'var(--accent-purple)' }}></div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Questions Mastered</div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--navy)', marginBottom: '10px' }}>{stats.mockSessions}</div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '12px' }}>
                      {[1,1,1,0,0].map((v, i) => <div key={i} style={{ width: '20px', height: '8px', borderRadius: '2px', background: v ? 'var(--accent-amber)' : '#eee' }}></div>)}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mock Sessions</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity & Global Pulse */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div className="card" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h4 style={{ fontWeight: 800, fontSize: '18px' }}>Activity Stream</h4>
                  <Activity size={18} color="var(--teal)" />
                </div>
                {stats.recentActivity.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {stats.recentActivity.map((activity, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', background: 'var(--surface-alt)' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal)' }}>
                          {activity.session_type === 'mcq' ? <CheckSquare size={16} /> : <MessageSquare size={16} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', fontWeight: 700 }}>{activity.role}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(activity.created_at).toLocaleDateString()}</div>
                        </div>
                        {activity.score !== null && <div style={{ fontWeight: 800, color: 'var(--teal)', fontSize: '13px' }}>{activity.score}%</div>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.5 }}>
                    <Clock size={40} style={{ marginBottom: '12px' }} />
                    <p style={{ fontSize: '14px' }}>No recent activity detected.</p>
                  </div>
                )}
              </div>

              <div className="card" style={{ padding: '32px', background: 'var(--navy)', color: 'white' }}>
                <h4 style={{ fontWeight: 800, fontSize: '18px', color: 'white', marginBottom: '16px' }}>Global Pulse</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>Most practiced today</span>
                    <span style={{ fontWeight: 700, color: 'var(--teal-mid)' }}>Python / AI</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>Hiring trend</span>
                    <span style={{ fontWeight: 700, color: 'var(--accent-coral)' }}>+24% Remote Roles</span>
                  </div>
                  <div style={{ marginTop: '12px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--teal-mid)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>Recruiter Tip</div>
                    <p style={{ fontSize: '12px', lineHeight: 1.5, color: 'rgba(255,255,255,0.8)' }}>"Candidates who mention specific impact metrics in their STAR answers are 40% more likely to get an offer."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Resume Score Card */}
            <div className="card animate-fade-up" style={{ animationDelay: '0.3s', background: 'linear-gradient(135deg, var(--teal), #0891b2)', color: 'white', border: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <FileText size={20} />
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'white' }}>Resume Analyzer</h4>
              </div>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ fontSize: '48px', fontWeight: 900, marginBottom: '4px' }}>82</div>
                <div style={{ fontSize: '12px', fontWeight: 700, opacity: 0.8, textTransform: 'uppercase' }}>Readiness Score</div>
              </div>
              <button 
                className="btn-primary" 
                onClick={() => navigate('resume-analyzer')}
                style={{ width: '100%', background: 'white', color: 'var(--teal)', border: 'none', boxShadow: 'none', fontWeight: 800 }}
              >
                Analyze Resume
              </button>
            </div>

            {/* Daily Challenge */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Award size={20} color="var(--accent-amber)" />
                <h4 style={{ fontSize: '16px', fontWeight: 800 }}>Daily Challenge</h4>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
                Explain the difference between <strong>Concurrency</strong> and <strong>Parallelism</strong>.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Reward: +50 XP</span>
                <button className="btn-ghost" onClick={() => navigate('mcq-quiz')} style={{ padding: '6px 12px', fontSize: '12px' }}>Accept</button>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="card" style={{ padding: '24px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '20px' }}>Advanced Tools</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { name: 'Interview Lab (Biometric)', id: 'interview-lab', icon: <Zap size={14} /> },
                  { name: 'Salary Negotiation Dojo', id: 'negotiation', icon: <DollarSign size={14} /> },
                  { name: 'Panel Pressure Mode', id: 'panel', icon: <Users size={14} /> },
                  { name: 'Job DNA Mapping', id: 'job-dna', icon: <Target size={14} /> },
                  { name: 'Pattern Diagnosis', id: 'patterns', icon: <Activity size={14} /> }
                ].map(tool => (
                  <div 
                    key={tool.id} 
                    onClick={() => navigate(tool.id)}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '12px', background: 'var(--surface-alt)', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--teal-light)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-alt)'}
                  >
                    <div style={{ color: 'var(--teal)' }}>{tool.icon}</div>
                    <span style={{ fontSize: '13px', fontWeight: 700 }}>{tool.name}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

