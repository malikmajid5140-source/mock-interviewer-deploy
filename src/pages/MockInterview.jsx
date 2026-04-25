import React from 'react'
import { Video, Mic, Layout, Play, Clock, Star } from 'lucide-react'

const MockInterview = ({ navigate }) => {
  return (
    <div className="page-container" style={{ padding: '48px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <h1 className="instrument-serif italic" style={{ fontSize: '56px', marginBottom: '16px' }}>AI Mock Interview</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>Face your fears in a safe, AI-powered environment.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--teal)' }}>
            <Video size={32} />
          </div>
          <h3 style={{ marginBottom: '12px' }}>Video Interview</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '14px' }}>Practice with your camera on. Get feedback on body language, eye contact, and confidence.</p>
          <button className="btn-primary" style={{ width: '100%' }} onClick={() => alert("Video Interview Mode: AI is initializing your camera... (Coming Soon in v2)")}>Start Video Session</button>
        </div>

        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(108, 99, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--accent-purple)' }}>
            <Mic size={32} />
          </div>
          <h3 style={{ marginBottom: '12px' }}>Audio Interview</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '14px' }}>Perfect for phone screenings. Focus on your tone of voice and articulation.</p>
          <button className="btn-ghost" style={{ width: '100%' }} onClick={() => alert("Audio Interview Mode: AI is listening... (Coming Soon in v2)")}>Start Audio Session</button>
        </div>
      </div>

      <div style={{ marginTop: '64px' }}>
        <h3 style={{ marginBottom: '24px' }}>Recent Sessions</h3>
        <div className="card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layout size={20} style={{ color: 'var(--text-secondary)' }} />
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>Senior Software Engineer Round</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Yesterday • 45 minutes</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--teal)' }}>84/100</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Clarity Score</div>
            </div>
            <button className="btn-ghost" style={{ padding: '8px 16px', fontSize: '13px' }}>View Feedback</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MockInterview
