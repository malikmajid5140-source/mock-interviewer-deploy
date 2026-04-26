import React, { useState } from 'react'
import { Target, Loader2, ChevronRight, AlertCircle, CheckCircle, Zap, ArrowRight, RefreshCw, Star } from 'lucide-react'
import { parseJobDescription, generateInterviewContent, generateGapReport, parseJsonFromAI } from '../lib/ai'

const DIFFICULTY_COLOR = { Easy: '#10b981', Medium: '#f59e0b', Hard: '#ef4444' }

const JobDNA = ({ navigate }) => {
  const [jdText, setJdText] = useState('')
  const [parsing, setParsing] = useState(false)
  const [jobData, setJobData] = useState(null)
  const [phase, setPhase] = useState('input') // input | setup | interview | report
  const [currentQIdx, setCurrentQIdx] = useState(0)
  const [answer, setAnswer] = useState('')
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [aiFeedback, setAiFeedback] = useState('')
  const [report, setReport] = useState(null)
  const [generatingReport, setGeneratingReport] = useState(false)

  const handleParseJD = async () => {
    if (!jdText.trim() || jdText.trim().length < 100) return
    setParsing(true)
    try {
      const data = await parseJobDescription(jdText)
      setJobData(data)
      setPhase('setup')
    } catch (e) {
      alert('Failed to parse job description. Please try again.')
    } finally {
      setParsing(false)
    }
  }

  const handleStartInterview = () => {
    setCurrentQIdx(0)
    setAnswers({})
    setAiFeedback('')
    setPhase('interview')
  }

  const handleSubmitAnswer = async () => {
    if (!answer.trim() || submitting) return
    setSubmitting(true)
    const q = jobData.customQuestions[currentQIdx]
    try {
      const prompt = `You are evaluating a candidate for: ${jobData.role} at ${jobData.company}.
Question: "${q.question}" (Competency: ${q.competency})
Candidate's Answer: "${answer}"

Give sharp, specific feedback in 2-3 sentences. Score 1-10. Format:
SCORE: X/10 — [one sentence on strength]. [One sentence on what's missing or could be sharper].`
      const fb = await generateInterviewContent(prompt)
      setAiFeedback(fb)
      setAnswers(prev => ({ ...prev, [q.question]: { answer, feedback: fb, competency: q.competency } }))
    } catch (e) {
      setAiFeedback('Could not generate feedback. Your answer was saved.')
      setAnswers(prev => ({ ...prev, [q.question]: { answer, feedback: '', competency: q.competency } }))
    } finally {
      setSubmitting(false)
    }
  }

  const handleNext = () => {
    const nextIdx = currentQIdx + 1
    if (nextIdx >= jobData.customQuestions.length) {
      handleFinish()
    } else {
      setCurrentQIdx(nextIdx)
      setAnswer('')
      setAiFeedback('')
    }
  }

  const handleFinish = async () => {
    setPhase('report')
    setGeneratingReport(true)
    try {
      const data = await generateGapReport(jobData.coreCompetencies, answers)
      setReport(data)
    } catch (e) {
      setReport({ competencyScores: [], overallReadiness: 60, topGap: 'Unknown', verdict: 'Report could not be generated fully.' })
    } finally {
      setGeneratingReport(false)
    }
  }

  const progress = jobData ? Math.round(((currentQIdx + (aiFeedback ? 1 : 0)) / jobData.customQuestions.length) * 100) : 0

  // ── INPUT PHASE ──────────────────────────────────────────────────────────────
  if (phase === 'input') return (
    <div style={{ padding: '48px', maxWidth: '820px', margin: '0 auto' }}>
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={26} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '4px' }}>Job DNA</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Paste any job description → get a custom interview built for that exact role</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '24px', marginTop: '24px' }}>
          {['Competency-mapped questions','Company culture signals','Gap report after interview'].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <CheckCircle size={14} color="#10b981" />{f}
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: '40px' }}>
        <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--navy)', display: 'block', marginBottom: '12px' }}>
          Paste the full job description below
        </label>
        <textarea
          value={jdText}
          onChange={e => setJdText(e.target.value)}
          placeholder="Copy and paste the full job description here — include the role title, responsibilities, requirements, and company details for the most accurate results..."
          style={{
            width: '100%', height: '280px', padding: '16px 20px', borderRadius: '16px',
            border: '2px solid var(--border-light)', fontSize: '14px', lineHeight: 1.7,
            resize: 'vertical', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
            background: 'var(--surface-alt)', color: 'var(--text-primary)',
            transition: 'border-color 0.2s'
          }}
          onFocus={e => e.target.style.borderColor = '#6366f1'}
          onBlur={e => e.target.style.borderColor = 'var(--border-light)'}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
          <span style={{ fontSize: '12px', color: jdText.length < 100 ? '#f59e0b' : '#10b981' }}>
            {jdText.length < 100 ? `${100 - jdText.length} more characters needed` : `✓ ${jdText.length} characters — ready to analyze`}
          </span>
          <button
            className="btn-primary"
            onClick={handleParseJD}
            disabled={parsing || jdText.trim().length < 100}
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 28px' }}
          >
            {parsing ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />Analyzing JD...</> : <>Analyze Job Description <ArrowRight size={16} /></>}
          </button>
        </div>
      </div>
    </div>
  )

  // ── SETUP PHASE ──────────────────────────────────────────────────────────────
  if (phase === 'setup') return (
    <div style={{ padding: '48px', maxWidth: '820px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Target size={26} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700 }}>{jobData.role}{jobData.company ? ` @ ${jobData.company}` : ''}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Job DNA extracted — {jobData.customQuestions?.length || 8} custom questions ready</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '16px' }}>Core Competencies</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {(jobData.coreCompetencies || []).map((c, i) => (
              <span key={i} style={{ padding: '5px 12px', borderRadius: '100px', background: 'rgba(99,102,241,0.1)', color: '#6366f1', fontSize: '13px', fontWeight: 500 }}>{c}</span>
            ))}
          </div>
        </div>
        <div className="card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '16px' }}>Culture Signals</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {(jobData.cultureKeywords || []).map((c, i) => (
              <span key={i} style={{ padding: '5px 12px', borderRadius: '100px', background: 'rgba(16,185,129,0.1)', color: '#059669', fontSize: '13px', fontWeight: 500 }}>{c}</span>
            ))}
          </div>
        </div>
      </div>

      {(jobData.redFlags || []).length > 0 && (
        <div className="card" style={{ padding: '24px', marginBottom: '32px', borderLeft: '4px solid #f59e0b', background: 'rgba(245,158,11,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <AlertCircle size={16} color="#f59e0b" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#92400e' }}>Watch out for these</span>
          </div>
          {(jobData.redFlags || []).map((rf, i) => (
            <div key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>• {rf}</div>
          ))}
        </div>
      )}

      <div className="card" style={{ padding: '28px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '16px' }}>Your Custom Interview ({jobData.customQuestions?.length} Questions)</h3>
        {(jobData.customQuestions || []).map((q, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 0', borderBottom: i < jobData.customQuestions.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'white', background: DIFFICULTY_COLOR[q.difficulty] || '#6366f1', padding: '2px 8px', borderRadius: '100px', flexShrink: 0, marginTop: '2px' }}>{q.difficulty}</span>
            <div>
              <div style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: '2px' }}>{q.question}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{q.competency}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <button className="btn-ghost" onClick={() => setPhase('input')} style={{ flex: 1 }}>← Change JD</button>
        <button className="btn-primary" onClick={handleStartInterview} style={{ flex: 2, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Zap size={16} /> Start Custom Interview
        </button>
      </div>
    </div>
  )

  // ── INTERVIEW PHASE ───────────────────────────────────────────────────────────
  if (phase === 'interview') {
    const q = jobData.customQuestions[currentQIdx]
    const isLast = currentQIdx === jobData.customQuestions.length - 1
    return (
      <div style={{ padding: '48px', maxWidth: '820px', margin: '0 auto' }}>
        {/* Progress */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Question {currentQIdx + 1} of {jobData.customQuestions.length}</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#6366f1' }}>{progress}% complete</span>
          </div>
          <div style={{ height: '6px', background: 'var(--surface-alt)', borderRadius: '100px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: '100px', transition: 'width 0.5s ease' }} />
          </div>
        </div>

        {/* Question Card */}
        <div className="card" style={{ padding: '40px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'white', background: DIFFICULTY_COLOR[q.difficulty] || '#6366f1', padding: '4px 12px', borderRadius: '100px' }}>{q.difficulty}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'var(--surface-alt)', padding: '4px 12px', borderRadius: '100px' }}>{q.competency}</span>
          </div>
          <p style={{ fontSize: '20px', fontWeight: 600, lineHeight: 1.5, color: 'var(--text-primary)', marginBottom: '32px' }}>{q.question}</p>

          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Type your answer here... Use STAR format where applicable (Situation, Task, Action, Result)"
            disabled={!!aiFeedback}
            style={{
              width: '100%', height: '180px', padding: '16px 20px', borderRadius: '16px',
              border: `2px solid ${aiFeedback ? 'var(--border-light)' : '#6366f1'}`,
              fontSize: '14px', lineHeight: 1.7, resize: 'vertical', fontFamily: 'inherit',
              outline: 'none', boxSizing: 'border-box', background: aiFeedback ? 'var(--surface-alt)' : 'white',
              color: 'var(--text-primary)'
            }}
          />

          {!aiFeedback && (
            <button className="btn-primary" onClick={handleSubmitAnswer} disabled={submitting || !answer.trim()}
              style={{ marginTop: '16px', width: '100%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {submitting ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />Getting feedback...</> : <>Submit Answer <ChevronRight size={16} /></>}
            </button>
          )}
        </div>

        {/* AI Feedback */}
        {aiFeedback && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:none } }`}</style>
            <div className="card" style={{ padding: '28px', marginBottom: '24px', borderLeft: '4px solid #6366f1', background: 'rgba(99,102,241,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Star size={16} color="#6366f1" />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#6366f1' }}>AI Feedback</span>
              </div>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--text-primary)' }}>{aiFeedback}</p>
            </div>
            <button className="btn-primary" onClick={handleNext}
              style={{ width: '100%', background: isLast ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {isLast ? '🎯 Generate Gap Report' : <>Next Question <ChevronRight size={16} /></>}
            </button>
          </div>
        )}
      </div>
    )
  }

  // ── REPORT PHASE ─────────────────────────────────────────────────────────────
  if (phase === 'report') return (
    <div style={{ padding: '48px', maxWidth: '820px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎯</div>
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Competency Gap Report</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{jobData.role}{jobData.company ? ` @ ${jobData.company}` : ''}</p>
      </div>

      {generatingReport ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
          <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: '#6366f1', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Analyzing your competency coverage...</p>
        </div>
      ) : report && (
        <>
          {/* Overall Score */}
          <div className="card" style={{ padding: '40px', marginBottom: '24px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))' }}>
            <div style={{ fontSize: '72px', fontWeight: 700, color: '#6366f1', lineHeight: 1 }}>{report.overallReadiness || 70}<span style={{ fontSize: '32px' }}>%</span></div>
            <div style={{ fontSize: '18px', fontWeight: 600, marginTop: '8px', marginBottom: '12px' }}>Interview Readiness</div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>{report.verdict}</div>
            {report.topGap && (
              <div style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(245,158,11,0.12)', color: '#92400e', padding: '8px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 500 }}>
                <AlertCircle size={14} /> Top gap to fix: {report.topGap}
              </div>
            )}
          </div>

          {/* Competency breakdown */}
          <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '24px' }}>Competency Coverage</h3>
            {(report.competencyScores || []).map((cs, i) => (
              <div key={i} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>{cs.name}</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: cs.score >= 7 ? '#10b981' : cs.score >= 5 ? '#f59e0b' : '#ef4444' }}>{cs.score}/10</span>
                </div>
                <div style={{ height: '8px', background: 'var(--surface-alt)', borderRadius: '100px', overflow: 'hidden', marginBottom: '6px' }}>
                  <div style={{ height: '100%', width: `${cs.score * 10}%`, background: cs.score >= 7 ? '#10b981' : cs.score >= 5 ? '#f59e0b' : '#ef4444', borderRadius: '100px', transition: 'width 0.6s ease' }} />
                </div>
                <div style={{ fontSize: '12px', color: '#10b981' }}>✓ {cs.covered}</div>
                {cs.missing && <div style={{ fontSize: '12px', color: '#f59e0b', marginTop: '2px' }}>⚡ {cs.missing}</div>}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="btn-ghost" onClick={() => { setPhase('input'); setJobData(null); setJdText('') }} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <RefreshCw size={16} /> Try New JD
            </button>
            <button className="btn-primary" onClick={() => navigate('mock-interview')} style={{ flex: 1, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
              Practice More in Mock Interview
            </button>
          </div>
        </>
      )}
    </div>
  )

  return null
}

export default JobDNA

