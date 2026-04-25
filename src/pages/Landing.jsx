import React from 'react'
import { Sparkles, CheckCircle, Globe, Play, ArrowRight, Star } from 'lucide-react'

const Landing = ({ navigate, session }) => {
  const handleGetStarted = () => {
    if (session) {
      navigate('dashboard')
    } else {
      navigate('signup')
    }
  }

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav style={{ 
        height: '80px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0 48px',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--navy)', cursor: 'pointer' }} onClick={() => navigate('landing')}>Interview Forge</div>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', cursor: 'pointer' }}>Features</span>
          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', cursor: 'pointer' }}>Pricing</span>
          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', cursor: 'pointer' }} onClick={() => navigate('signin')}>Sign In</span>
          <button className="btn-primary" onClick={handleGetStarted} style={{ padding: '8px 20px' }}>Get Started</button>
        </div>
      </nav>

      {/* Section 1: Hero */}
      <section className="hero" style={{ 
        minHeight: '92vh', 
        background: 'radial-gradient(circle at 2px 2px, rgba(14, 27, 46, 0.08) 1px, transparent 0)',
        backgroundSize: '40px 40px',
        display: 'flex',
        alignItems: 'center',
        padding: '96px 0'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center' }}>
          <div className="hero-left" style={{ flex: '0 0 55%', animation: 'fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both' }}>
            <div className="badge badge-teal" style={{ marginBottom: '24px' }}>AI-POWERED INTERVIEW PREP</div>
            <h1 style={{ marginBottom: '24px' }}>
              Land your <span className="instrument-serif italic">dream job</span> with confidence.
            </h1>
            <p style={{ fontSize: '18px', fontWeight: 300, color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '540px' }}>
              Interview Forge prepares you for every question, every format, and every round — with AI that thinks like a real recruiter.
            </p>
            
            <div className="social-proof" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
              <div className="avatar-group" style={{ display: 'flex' }}>
                {[
                  { color: '#6c63ff', role: 'SWE' },
                  { color: '#18b89a', role: 'PM' },
                  { color: '#ff6b6b', role: 'ML' }
                ].map((badge, i) => (
                  <div key={i} style={{ 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '10px', 
                    background: badge.color,
                    border: '2px solid white',
                    marginLeft: i === 0 ? '0' : '-12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 700,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }}>
                    {badge.role}
                  </div>
                ))}
              </div>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                Joined by <strong style={{ color: 'var(--navy)' }}>50,000+ candidates</strong> worldwide
              </span>
            </div>

            <div className="hero-ctas" style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
              <button className="btn-primary" onClick={handleGetStarted}>
                Start Practicing Free <ArrowRight size={18} style={{ marginLeft: '8px' }} />
              </button>
              <button className="btn-ghost">
                Watch 2-min demo <Play size={16} style={{ marginLeft: '8px', fill: 'currentColor' }} />
              </button>
            </div>

            <div className="trust-signals" style={{ display: 'flex', gap: '24px' }}>
              {['No credit card', 'AI-powered feedback', '10,000+ questions'].map(text => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <CheckCircle size={14} style={{ color: 'var(--teal)' }} /> {text}
                </div>
              ))}
            </div>
          </div>

          <div className="hero-right" style={{ flex: '0 0 45%', position: 'relative' }}>
            <div style={{ 
              position: 'absolute', 
              width: '120%', 
              height: '120%', 
              top: '-10%', 
              left: '-10%',
              background: '#e8f9f6',
              borderRadius: '40% 60% 70% 30%',
              zIndex: -1
            }} />
            <div className="card" style={{ 
              transform: 'rotate(-2deg)', 
              animation: 'float 3s ease-in-out infinite alternate',
              maxWidth: '400px',
              margin: '0 auto'
            }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <div className="badge badge-purple">MOCK INTERVIEW</div>
                <div className="badge badge-teal">ACTIVE</div>
              </div>
              <h3 className="instrument-serif italic" style={{ marginBottom: '16px' }}>"Tell me about a time you had to handle a difficult stakeholder..."</h3>
              <div style={{ height: '40px', background: 'var(--surface-alt)', borderRadius: '8px', marginBottom: '8px' }} />
              <div style={{ height: '40px', background: 'var(--surface-alt)', borderRadius: '8px', width: '80%' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>Get Feedback</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Stats Bar */}
      <section className="stats-bar" style={{ background: 'var(--navy)', padding: '64px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '48px', textAlign: 'center' }}>
            {[
              { label: 'Candidates prepared', value: '50,000+' },
              { label: 'Questions answered', value: '200,000+' },
              { label: 'Report more confidence', value: '94%' },
              { label: 'Average rating', value: '4.9 ★' }
            ].map(stat => (
              <div key={stat.label}>
                <div className="mono" style={{ fontSize: '52px', color: 'white', marginBottom: '8px' }}>{stat.value}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Features Grid */}
      <section className="features" style={{ padding: '96px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="badge badge-teal" style={{ marginBottom: '16px' }}>FEATURES</div>
            <h2>Everything you need to <span className="instrument-serif italic">crush your interview</span>.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              { title: 'Question Bank', desc: 'Over 10,000 role-specific questions updated daily.', icon: <Globe size={24} /> },
              { title: 'MCQ Quiz', desc: 'Test your technical knowledge with instant scoring.', icon: <CheckCircle size={24} /> },
              { title: 'Mock Interview', desc: 'Practice real-time with our recuiter-trained AI.', icon: <Sparkles size={24} /> },
              { title: 'AI Answer Coach', desc: 'Get instant feedback on your tone and content.', icon: <Sparkles size={24} /> },
              { title: 'Study Plan', desc: 'A personalized roadmap to get you ready in 5 days.', icon: <Sparkles size={24} /> },
              { title: 'Progress Tracker', desc: 'Visualize your improvement across categories.', icon: <Star size={24} /> }
            ].map((f, i) => (
              <div key={i} className="card">
                <div style={{ color: 'var(--teal)', marginBottom: '20px' }}>{f.icon}</div>
                <h3 style={{ marginBottom: '12px' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 8: CTA Banner */}
      <section style={{ padding: '96px 0', background: 'linear-gradient(135deg, var(--navy), var(--navy-mid))', textAlign: 'center', color: 'white' }}>
        <div className="container">
          <div className="badge badge-teal" style={{ marginBottom: '24px' }}>FREE TO START</div>
          <h2 style={{ color: 'white', marginBottom: '32px' }}>Your next interview is coming. Are you ready?</h2>
          <button className="btn-primary" onClick={() => navigate('signup')} style={{ padding: '16px 32px' }}>
            Start Practicing Free <ArrowRight size={20} style={{ marginLeft: '12px' }} />
          </button>
        </div>
      </section>

      {/* Section 9: Footer */}
      <footer style={{ background: 'var(--warm-white)', borderTop: '1px solid var(--border-light)', padding: '96px 0 48px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr', gap: '48px', marginBottom: '64px' }}>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--navy)', marginBottom: '24px' }}>Interview Forge</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
                The world's most advanced AI interview preparation platform. Trusted by candidates from top tech companies.
              </p>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>𝕏</div>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>in</div>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>📸</div>
              </div>
            </div>
            
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--navy)', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                <li style={{ cursor: 'pointer' }} onClick={() => navigate('question-bank')}>Question Bank</li>
                <li style={{ cursor: 'pointer' }} onClick={() => navigate('mock-interview')}>Mock Interviews</li>
                <li style={{ cursor: 'pointer' }} onClick={() => navigate('landing')}>AI Answer Coach</li>
                <li style={{ cursor: 'pointer' }} onClick={() => navigate('landing')}>Pricing</li>
              </ul>
            </div>

            <div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--navy)', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resources</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                <li style={{ cursor: 'pointer' }}>Blog</li>
                <li style={{ cursor: 'pointer' }}>Success Stories</li>
                <li style={{ cursor: 'pointer' }}>Interview Tips</li>
                <li style={{ cursor: 'pointer' }}>FAQ</li>
              </ul>
            </div>

            <div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--navy)', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Company</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                <li style={{ cursor: 'pointer' }}>About Us</li>
                <li style={{ cursor: 'pointer' }}>Careers</li>
                <li style={{ cursor: 'pointer' }}>Contact</li>
                <li style={{ cursor: 'pointer' }}>Partner Program</li>
              </ul>
            </div>

            <div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--navy)', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Legal</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                <li style={{ cursor: 'pointer' }}>Privacy Policy</li>
                <li style={{ cursor: 'pointer' }}>Terms of Service</li>
                <li style={{ cursor: 'pointer' }}>Cookie Policy</li>
                <li style={{ cursor: 'pointer' }}>Security</li>
              </ul>
            </div>
          </div>

          <div style={{ paddingTop: '32px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              © 2026 Interview Forge. All rights reserved. Built with ❤️ for candidates everywhere.
            </div>
            <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <span>Privacy</span>
              <span>Terms</span>
              <span>Cookies</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
