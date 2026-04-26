import { LayoutDashboard, BookOpen, CheckSquare, MessageSquare, Calendar, BarChart3, Settings, LogOut, Target, Users, DollarSign, Activity, User, Bell, Zap, FileText } from 'lucide-react'
import logo from '../assets/logo.png'
import { supabase } from '../lib/supabase'

const DashboardLayout = ({ children, navigate, activeView, session }) => {
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('landing')
  }

  const email = session?.user?.email || ''
  const username = email.split('@')[0] || 'User'
  const initials = username.slice(0, 2).toUpperCase()

  const navItems = [
    { name: 'Dashboard',      id: 'dashboard',     icon: <LayoutDashboard size={20} /> },
    { name: 'Interview Lab',  id: 'interview-lab',  icon: <Zap size={20} /> },
    { name: 'Resume Analyzer',id: 'resume-analyzer',icon: <FileText size={20} /> },
    { name: 'Question Bank',  id: 'question-bank', icon: <BookOpen size={20} /> },
    { name: 'MCQ Quiz',       id: 'mcq-quiz',      icon: <CheckSquare size={20} /> },
    { name: 'Mock Interview', id: 'mock-interview',icon: <MessageSquare size={20} /> },
    { name: 'Study Plan',     id: 'study-plan',    icon: <Calendar size={20} /> },
    { name: 'Progress',       id: 'progress',      icon: <BarChart3 size={20} /> },
    { name: '— Unique Features', id: null, icon: null },
    { name: 'Job DNA',        id: 'job-dna',       icon: <Target size={20} /> },
    { name: 'Panel Pressure', id: 'panel',         icon: <Users size={20} /> },
    { name: 'Salary Dojo',    id: 'negotiation',   icon: <DollarSign size={20} /> },
    { name: 'Pattern X-Ray',  id: 'patterns',      icon: <Activity size={20} /> },
    { name: 'Settings',       id: 'settings',      icon: <Settings size={20} /> },
  ]

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--warm-white)', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '280px', 
        background: 'var(--navy)', 
        color: 'white', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        zIndex: 10,
        boxShadow: '4px 0 24px rgba(0,0,0,0.1)'
      }}>
        {/* Logo Section */}
        <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img src={logo} alt="Interview Forge" style={{ width: '40px', height: '40px', borderRadius: '12px', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }} />
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'white', margin: 0, letterSpacing: '0.01em' }}>Interview Forge</h1>
            <div style={{ fontSize: '10px', color: 'var(--teal)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pro Platform</div>
          </div>
        </div>

        {/* User Card in Sidebar */}
        <div style={{ padding: '0 16px 24px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '10px', 
              background: localStorage.getItem('user_avatar') ? `url(${localStorage.getItem('user_avatar')}) center/cover` : 'linear-gradient(135deg, var(--teal), #0891b2)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: 700, 
              fontSize: '14px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              {!localStorage.getItem('user_avatar') && initials}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{username}</div>
              <div style={{ fontSize: '11px', color: 'var(--teal)', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('checkout')}>Upgrade to Pro</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 16px', overflowY: 'auto' }}>
          {navItems.map(item => {
            if (!item.id) return (
              <div key={item.name} style={{ padding: '24px 14px 8px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.25)' }}>
                {item.name.replace('— ', '')}
              </div>
            )
            const active = activeView === item.id
            return (
              <div key={item.id}
                onClick={() => navigate(item.id)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '12px 14px', 
                  marginBottom: '4px', 
                  borderRadius: '12px', 
                  cursor: 'pointer', 
                  background: active ? 'rgba(6, 182, 212, 0.15)' : 'transparent', 
                  border: active ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid transparent', 
                  color: active ? 'var(--teal-mid)' : 'rgba(255,255,255,0.55)', 
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' 
                }}
                onMouseEnter={e => !active && (e.currentTarget.style.color = 'white')}
                onMouseLeave={e => !active && (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
              >
                <span style={{ display: 'flex', flexShrink: 0, opacity: active ? 1 : 0.7 }}>{item.icon}</span>
                <span style={{ fontSize: '14px', fontWeight: active ? 600 : 500 }}>{item.name}</span>
              </div>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div style={{ padding: '20px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button 
            onClick={() => supabase.auth.signOut()}
            style={{ 
              width: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '12px 14px', 
              borderRadius: '12px', 
              border: 'none', 
              background: 'transparent', 
              color: 'rgba(255,255,255,0.4)', 
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {/* Header */}
        <header style={{ 
          height: '72px', 
          background: 'rgba(255,255,255,0.8)', 
          backdropFilter: 'blur(12px)', 
          borderBottom: '1px solid var(--border-light)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0 40px',
          position: 'sticky',
          top: 0,
          zIndex: 5
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
            {activeView.replace('-', ' ')}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', position: 'relative' }}>
              <Bell size={20} />
              <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', border: '2px solid white' }}></div>
            </button>
            <div style={{ width: '1px', height: '24px', background: 'var(--border-light)' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{username}</div>
                <div style={{ fontSize: '11px', color: 'var(--teal)', fontWeight: 700, cursor: 'pointer' }} onClick={() => navigate('checkout')}>Upgrade Plan</div>
              </div>
              <div style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '50%', 
                background: localStorage.getItem('user_avatar') ? `url(${localStorage.getItem('user_avatar')}) center/cover` : 'var(--surface-alt)', 
                border: '1.5px solid var(--border-light)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'var(--text-secondary)' 
              }}>
                {!localStorage.getItem('user_avatar') && <User size={20} />}
              </div>
            </div>
          </div>
        </header>

        {/* View Content */}
        <div style={{ flex: 1, position: 'relative' }}>
          {children}
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout
