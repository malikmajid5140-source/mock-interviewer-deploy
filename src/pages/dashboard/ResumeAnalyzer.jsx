import React, { useState } from 'react'
import { FileText, Search, Shield, Zap, CheckCircle, AlertCircle, ArrowRight, Loader2, BarChart3, Target, Briefcase } from 'lucide-react'

const ResumeAnalyzer = ({ navigate }) => {
  const [resumeText, setResumeText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState(null)

  const handleAnalyze = () => {
    if (!resumeText.trim()) return
    setIsAnalyzing(true)
    // Simulate deep AI analysis
    setTimeout(() => {
      setResult({
        score: 84,
        matchRole: "Senior Frontend Engineer",
        strengths: ["Strong React Ecosystem knowledge", "Solid performance optimization skills", "Clear architectural thinking"],
        gaps: ["Needs more System Design project examples", "Limited mention of testing frameworks (Jest/Cypress)", "Missing cloud deployment experience"],
        keywords: ["React", "TypeScript", "Vite", "Performance", "UI/UX"]
      })
      setIsAnalyzing(false)
    }, 2500)
  }

  return (
    <div style={{ padding: '60px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '48px', textAlign: 'center' }}>
        <div className="badge badge-teal" style={{ marginBottom: '16px' }}>AI SCANNER V4.0</div>
        <h1 style={{ fontSize: '42px', fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.02em' }}>Resume <span style={{ color: 'var(--teal)' }}>Intelligence</span></h1>
        <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginTop: '8px' }}>Scan your resume against thousands of high-tier hiring patterns.</p>
      </header>

      {!result ? (
        <div className="animate-fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
          <div className="card" style={{ padding: '40px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText color="var(--teal)" /> Paste Resume Content
            </h3>
            <textarea 
              placeholder="Paste your full resume text here (Markdown or Plain Text)..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              style={{ 
                width: '100%', 
                height: '400px', 
                padding: '24px', 
                borderRadius: '16px', 
                border: '1.5px solid var(--border-light)', 
                background: 'var(--surface-alt)',
                fontSize: '15px',
                lineHeight: 1.6,
                fontFamily: 'inherit',
                resize: 'none'
              }}
            />
            <button 
              className="btn-primary" 
              onClick={handleAnalyze} 
              style={{ width: '100%', marginTop: '32px', height: '56px', fontSize: '18px' }}
              disabled={isAnalyzing || !resumeText.trim()}
            >
              {isAnalyzing ? <><Loader2 className="animate-spin" /> Deep Scanning...</> : 'Analyze My Readiness'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
             <div className="card" style={{ padding: '24px', background: 'var(--navy)', color: 'white' }}>
                <h4 style={{ color: 'white', fontWeight: 800, marginBottom: '12px' }}>How it works</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                   <li style={{ display: 'flex', gap: '8px' }}><Zap size={14} color="var(--teal)" /> Keyword extraction & density analysis.</li>
                   <li style={{ display: 'flex', gap: '8px' }}><Target size={14} color="var(--teal)" /> Role-based alignment scoring.</li>
                   <li style={{ display: 'flex', gap: '8px' }}><Shield size={14} color="var(--teal)" /> Bias detection & formatting audit.</li>
                </ul>
             </div>
             <div className="card" style={{ padding: '24px' }}>
                <h4 style={{ fontWeight: 800, marginBottom: '12px' }}>Pro Tip</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                   ATS systems often reject resumes that use multiple columns or complex tables. Our scanner flags these formatting risks.
                </p>
             </div>
          </div>
        </div>
      ) : (
        <div className="animate-fade-up">
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px', marginBottom: '40px' }}>
              <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                 <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 24px' }}>
                    <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                       <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" strokeWidth="2" />
                       <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--teal)" strokeWidth="2" strokeDasharray={`${result.score}, 100`} />
                    </svg>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '36px', fontWeight: 900 }}>{result.score}</div>
                 </div>
                 <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Interview Ready</h2>
                 <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Matched Role: {result.matchRole}</p>
                 <button className="btn-ghost" style={{ marginTop: '24px', width: '100%' }} onClick={() => setResult(null)}>Re-scan Resume</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                 <div className="card" style={{ padding: '32px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                       <CheckCircle color="var(--success)" size={20} /> AI Strength Analysis
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                       {result.strengths.map((s, i) => (
                          <div key={i} style={{ padding: '16px', borderRadius: '12px', background: 'var(--success-light)', border: '1px solid rgba(22, 163, 74, 0.1)', fontSize: '14px', fontWeight: 600, color: '#166534' }}>{s}</div>
                       ))}
                    </div>
                 </div>

                 <div className="card" style={{ padding: '32px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                       <AlertCircle color="var(--accent-amber)" size={20} /> Readiness Gaps
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                       {result.gaps.map((g, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--surface-alt)', borderRadius: '10px', fontSize: '14px' }}>
                             <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-amber)' }}></div>
                             {g}
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           <div className="card" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px' }}>Identified High-Value Keywords</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                 {result.keywords.map(kw => (
                    <span key={kw} className="badge badge-teal" style={{ padding: '8px 16px', fontSize: '13px' }}>{kw}</span>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  )
}

export default ResumeAnalyzer

