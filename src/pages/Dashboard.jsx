import React from 'react'
import { Plus, Search } from 'lucide-react'

const Dashboard = ({ navigate, session }) => {
  const userEmail = session?.user?.email || 'Candidate'
  const userName = userEmail.split('@')[0]

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
          <button className="btn-primary" style={{ gap: '8px' }}><Plus size={18} /> Generate</button>
        </div>
      </header>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '48px' }}>
        <div className="card">
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Questions Practiced</div>
          <div style={{ fontSize: '40px', fontWeight: 700, color: 'var(--navy)' }}>128</div>
          <div style={{ fontSize: '13px', color: 'var(--teal)', marginTop: '8px' }}>+12% this week</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>MCQ Accuracy</div>
          <div style={{ fontSize: '40px', fontWeight: 700, color: 'var(--navy)' }}>84%</div>
          <div style={{ fontSize: '13px', color: 'var(--teal)', marginTop: '8px' }}>+5% improvement</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Mock Sessions</div>
          <div style={{ fontSize: '40px', fontWeight: 700, color: 'var(--navy)' }}>12</div>
          <div style={{ fontSize: '13px', color: 'var(--teal)', marginTop: '8px' }}>2 today</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        {/* Recent Activity */}
        <div className="card">
          <h3 style={{ marginBottom: '24px' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { title: 'React Frontend Developer', type: 'Question Bank', time: '2 hours ago', icon: 'BookOpen' },
              { title: 'Technical JavaScript Essentials', type: 'MCQ Quiz', time: 'Yesterday', icon: 'CheckSquare' },
              { title: 'Product Manager Behavioral', type: 'Mock Interview', time: '2 days ago', icon: 'MessageSquare' }
            ].map((activity, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal)' }}>
                    {/* Placeholder for Icon */}
                    <div style={{ fontSize: '18px' }}>📖</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '15px' }}>{activity.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{activity.type}</div>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-hint)' }}>{activity.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Start */}
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Quick Start</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>Jump back into your top practiced roles.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {['SOFTWARE ENGINEER', 'PRODUCT MANAGER', 'DATA SCIENTIST', 'UX DESIGNER'].map(role => (
              <button key={role} className="badge badge-navy" style={{ padding: '8px 16px', border: 'none', cursor: 'pointer' }}>{role}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
