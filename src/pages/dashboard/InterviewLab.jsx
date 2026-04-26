import React, { useState, useEffect, useRef } from 'react'
import { Camera, Mic, Play, Square, MessageSquare, AlertTriangle, CheckCircle, Zap, Shield, Sparkles, ArrowRight, Loader2 } from 'lucide-react'

const InterviewLab = ({ navigate, session }) => {
  const [stage, setStage] = useState('setup') // setup, active, review
  const [isRecording, setIsRecording] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [confidence, setConfidence] = useState(75)
  const [stressLevel, setStressLevel] = useState(20)
  const [timer, setTimer] = useState(0)
  const videoRef = useRef(null)

  const questions = [
    "Tell me about a time you had to handle a critical system failure under pressure.",
    "How do you approach a situation where you disagree with your manager's technical decision?",
    "Describe your most significant technical achievement and its business impact."
  ]

  useEffect(() => {
    let interval
    if (isRecording) {
      interval = setInterval(() => {
        setTimer(t => t + 1)
        // Simulate real-time analysis
        setConfidence(prev => Math.max(40, Math.min(95, prev + (Math.random() * 10 - 5))))
        setStressLevel(prev => Math.max(10, Math.min(90, prev + (Math.random() * 6 - 3))))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const startSession = () => {
    setStage('active')
    setIsRecording(true)
  }

  const stopSession = () => {
    setIsRecording(false)
    setStage('review')
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (stage === 'setup') {
    return (
      <div className="animate-fade-up" style={{ padding: '60px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'var(--teal-light)', color: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
          <Shield size={40} />
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px' }}>Interview Lab <span style={{ color: 'var(--teal)' }}>Pro</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', marginBottom: '40px' }}>
          This advanced simulation uses AI to monitor your eye contact, vocal conviction, and stress markers in real-time.
        </p>
        
        <div className="card" style={{ padding: '32px', textAlign: 'left', marginBottom: '40px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 700 }}>Calibration Checklist</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Camera size={18} color="var(--teal)" /> <span>Camera access granted</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Mic size={18} color="var(--teal)" /> <span>Microphone sensitivity calibrated</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Zap size={18} color="var(--accent-amber)" /> <span>AI Confidence Engine online</span>
            </div>
          </div>
        </div>

        <button className="btn-primary" onClick={startSession} style={{ padding: '16px 48px', fontSize: '18px' }}>
          Begin Simulation <ArrowRight size={20} />
        </button>
      </div>
    )
  }

  if (stage === 'active') {
    return (
      <div style={{ height: 'calc(100vh - 80px)', display: 'grid', gridTemplateColumns: '1fr 350px' }}>
        {/* Main Simulation View */}
        <div style={{ background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
          {/* Mock Camera Feed */}
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.1)' }}>
             <div style={{ textAlign: 'center' }}>
                <Camera size={80} style={{ marginBottom: '20px' }} />
                <p>LIVE CAMERA FEED (SIMULATED)</p>
             </div>
          </div>

          {/* HUD Overlay */}
          <div style={{ position: 'absolute', top: '40px', left: '40px', right: '40px', display: 'flex', justifyContent: 'space-between' }}>
             <div className="badge" style={{ background: 'rgba(255,0,0,0.2)', color: '#ff4444', border: '1px solid rgba(255,0,0,0.3)', padding: '8px 16px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff4444', marginRight: '8px', display: 'inline-block', animation: 'pulse 1s infinite' }}></div>
                REC {formatTime(timer)}
             </div>
             <div style={{ display: 'flex', gap: '12px' }}>
                <div className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', backdropFilter: 'blur(10px)' }}>PROCTOR ACTIVE</div>
             </div>
          </div>

          {/* Question Overlay */}
          <div style={{ position: 'absolute', bottom: '120px', left: '50%', transform: 'translateX(-50%)', width: '80%', maxWidth: '800px' }}>
             <div className="glass-card" style={{ padding: '32px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                <div style={{ color: 'var(--teal)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px' }}>Question {currentQuestion + 1} of {questions.length}</div>
                <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 600 }}>{questions[currentQuestion]}</h2>
             </div>
          </div>

          {/* Controls */}
          <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '20px' }}>
             <button className="btn-ghost" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }}>Skip</button>
             <button className="btn-primary" onClick={() => currentQuestion < questions.length - 1 ? setCurrentQuestion(q => q + 1) : stopSession()}>
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Session'}
             </button>
          </div>
        </div>

        {/* Real-time Analysis Sidebar */}
        <div style={{ background: '#111', borderLeft: '1px solid #222', padding: '32px', color: 'white' }}>
           <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Zap size={20} color="var(--teal)" /> AI BIOMETRICS
           </h3>

           <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                 <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>CONFIDENCE SCORE</span>
                 <span style={{ fontWeight: 800, color: 'var(--teal)' }}>{Math.round(confidence)}%</span>
              </div>
              <div style={{ height: '6px', background: '#222', borderRadius: '3px', overflow: 'hidden' }}>
                 <div style={{ height: '100%', width: `${confidence}%`, background: 'var(--teal)', transition: 'width 0.5s ease' }}></div>
              </div>
           </div>

           <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                 <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>STRESS MARKERS</span>
                 <span style={{ fontWeight: 800, color: stressLevel > 70 ? '#ff4444' : 'var(--accent-amber)' }}>{Math.round(stressLevel)}%</span>
              </div>
              <div style={{ height: '6px', background: '#222', borderRadius: '3px', overflow: 'hidden' }}>
                 <div style={{ height: '100%', width: `${stressLevel}%`, background: stressLevel > 70 ? '#ff4444' : 'var(--accent-amber)', transition: 'width 0.5s ease' }}></div>
              </div>
           </div>

           <div className="card" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #333', padding: '20px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--teal)', marginBottom: '12px' }}>REAL-TIME FEEDBACK</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                 {confidence < 60 && <li style={{ color: '#ff4444', display: 'flex', gap: '8px' }}><AlertTriangle size={14} /> Eye contact dropped.</li>}
                 {stressLevel > 60 && <li style={{ color: 'var(--accent-amber)', display: 'flex', gap: '8px' }}><AlertTriangle size={14} /> Speaking pace too high.</li>}
                 <li style={{ color: 'var(--success)', display: 'flex', gap: '8px' }}><CheckCircle size={14} /> Good structural usage.</li>
              </ul>
           </div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-up" style={{ padding: '60px', maxWidth: '1000px', margin: '0 auto' }}>
      <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
        <Sparkles size={48} color="var(--teal)" style={{ marginBottom: '24px' }} />
        <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>Session Complete!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Your AI-generated performance report is ready for review.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
           <div style={{ padding: '20px', borderRadius: '16px', background: 'var(--surface-alt)' }}>
              <div style={{ fontSize: '24px', fontWeight: 800 }}>88%</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>CLARITY</div>
           </div>
           <div style={{ padding: '20px', borderRadius: '16px', background: 'var(--surface-alt)' }}>
              <div style={{ fontSize: '24px', fontWeight: 800 }}>92%</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>CONFIDENCE</div>
           </div>
           <div style={{ padding: '20px', borderRadius: '16px', background: 'var(--surface-alt)' }}>
              <div style={{ fontSize: '24px', fontWeight: 800 }}>74%</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>EYE CONTACT</div>
           </div>
        </div>

        <button className="btn-primary" onClick={() => navigate('dashboard')}>Return to Dashboard</button>
      </div>
    </div>
  )
}

export default InterviewLab

