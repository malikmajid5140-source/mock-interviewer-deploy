import React, { useState, useRef } from 'react'
import { Users, Loader2, ArrowRight, RefreshCw, Star, Zap } from 'lucide-react'
import { generatePanelQuestion, generatePanelistReaction, generateInterviewContent } from '../lib/ai'

const PANELISTS = [
  {
    name: 'Alex Chen',
    trait: 'a skeptical technical lead who demands proof, depth, and specifics for every claim',
    short: 'Technical Lead',
    emoji: '🔬',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.3)',
    personality: 'Demands proof. Challenges vague answers. Asks follow-ups like "Can you prove that?" and "Walk me through the exact code."'
  },
  {
    name: 'Sarah Kim',
    trait: 'an empathetic HR manager who cares deeply about cultural fit, values, and team dynamics',
    short: 'HR Manager',
    emoji: '💜',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.08)',
    border: 'rgba(139,92,246,0.3)',
    personality: 'Focuses on people, culture, and values. Asks about team conflicts, communication style, and long-term goals.'
  },
  {
    name: 'Marcus Webb',
    trait: 'an aggressive VP-level executive who interrupts, challenges authority, and tests decisiveness under pressure',
    short: 'VP / Director',
    emoji: '⚡',
    color: '#f97316',
    bg: 'rgba(249,115,22,0.08)',
    border: 'rgba(249,115,22,0.3)',
    personality: 'Cuts you off. Tests if you crack under pressure. Loves "Why should I hire you over 10 other candidates?"'
  }
]

const ROLES = ['Software Engineer', 'Product Manager', 'Data Scientist', 'UX Designer', 'Marketing Manager', 'Business Analyst']

const PanelInterview = ({ navigate }) => {
  const [phase, setPhase] = useState('setup') // setup | interview | done
  const [role, setRole] = useState('Software Engineer')
  const [round, setRound] = useState(0) // 0-5 rounds
  const [activePanelistIdx, setActivePanelistIdx] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [reactions, setReactions] = useState([])
  const [answer, setAnswer] = useState('')
  const [qa, setQA] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [finalScores, setFinalScores] = useState(null)
  const [scoring, setScoring] = useState(false)
  const chatRef = useRef(null)

  const MAX_ROUNDS = 5

  const startInterview = async () => {
    setPhase('interview')
    setRound(1)
    setQA([])
    setReactions([])
    setActivePanelistIdx(0)
    setLoading(true)
    try {
      const q = await generatePanelQuestion(role, PANELISTS[0], [])
      setCurrentQuestion(q)
    } catch (e) {
      setCurrentQuestion('Tell me about yourself and what brings you to interview for this role today.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitAnswer = async () => {
    if (!answer.trim() || submitting) return
    setSubmitting(true)
    const currentP = PANELISTS[activePanelistIdx]
    const newQA = [...qa, { panelist: currentP.name, question: currentQuestion, answer: answer.trim() }]
    setQA(newQA)

    try {
      // Get reactions from all 3 panelists simultaneously
      const reactionPromises = PANELISTS.map(p => generatePanelistReaction(p, answer.trim()))
      const reactionResults = await Promise.all(reactionPromises)
      setReactions(reactionResults.map((r, i) => ({ panelist: PANELISTS[i], text: r })))

      if (round >= MAX_ROUNDS) {
        // Last round — go to scoring
        await handleFinish(newQA)
      } else {
        // Next round — next panelist asks
        const nextIdx = (activePanelistIdx + 1) % PANELISTS.length
        setActivePanelistIdx(nextIdx)
        const nextQ = await generatePanelQuestion(role, PANELISTS[nextIdx], newQA)
        setCurrentQuestion(nextQ)
        setAnswer('')
        setRound(r => r + 1)
      }
    } catch (e) {
      setReactions([{ panelist: PANELISTS[0], text: 'Interesting perspective.' }, { panelist: PANELISTS[1], text: 'I appreciate your transparency.' }, { panelist: PANELISTS[2], text: 'Fair enough, but tell me more.' }])
    } finally {
      setSubmitting(false)
    }
  }

  const handleFinish = async (finalQA) => {
    setPhase('done')
    setScoring(true)
    try {
      const prompt = `You just observed a panel interview for ${role}. Here is the full Q&A:\n${(finalQA || qa).map(e => `${e.panelist}: "${e.question}"\nCandidate: "${e.answer}"`).join('\n\n')}\n\nScore the candidate from each panelist's perspective.\nReturn ONLY valid JSON:\n{\n  "alexScore": { "score": 7, "verdict": "..." },\n  "sarahScore": { "score": 8, "verdict": "..." },\n  "marcusScore": { "score": 5, "verdict": "..." },\n  "overallScore": 67,\n  "hired": true,\n  "finalVerdict": "...",\n  "topStrength": "...",\n  "topWeakness": "..."\n}`
      const text = await generateInterviewContent(prompt)
      const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
      const start = Math.min(cleaned.indexOf('{') >= 0 ? cleaned.indexOf('{') : Infinity)
      const end = cleaned.lastIndexOf('}')
      setFinalScores(JSON.parse(cleaned.slice(start, end + 1)))
    } catch (e) {
      setFinalScores({ alexScore: { score: 6, verdict: 'Showed technical competence but lacked specifics.' }, sarahScore: { score: 8, verdict: 'Great cultural fit. Values aligned well.' }, marcusScore: { score: 5, verdict: 'Needs more decisiveness under pressure.' }, overallScore: 63, hired: false, finalVerdict: 'A strong candidate with room to grow. Practice more under pressure.', topStrength: 'Communication', topWeakness: 'Handling pressure' })
    } finally {
      setScoring(false)
    }
  }

  // ── SETUP ──────────────────────────────────────────────────────────────────
  if (phase === 'setup') return (
    <div style={{ padding: '48px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'linear-gradient(135deg,#f97316,#ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={26} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '4px' }}>Panel Pressure</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Face 3 simultaneous AI interviewers, each with a different agenda</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', marginBottom: '40px' }}>
        {PANELISTS.map((p, i) => (
          <div key={i} className="card" style={{ padding: '28px', borderTop: `4px solid ${p.color}` }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>{p.emoji}</div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: p.color, marginBottom: '4px' }}>{p.name}</h3>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 500 }}>{p.short}</div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{p.personality}</p>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: '32px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Choose your role</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {ROLES.map(r => (
            <button key={r} onClick={() => setRole(r)}
              style={{
                padding: '8px 20px', borderRadius: '100px', fontSize: '14px', cursor: 'pointer', border: '2px solid',
                borderColor: role === r ? '#f97316' : 'var(--border-light)',
                background: role === r ? 'rgba(249,115,22,0.08)' : 'transparent',
                color: role === r ? '#f97316' : 'var(--text-secondary)',
                fontWeight: role === r ? 600 : 400, transition: 'all 0.2s'
              }}>{r}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 24px', background: 'rgba(249,115,22,0.06)', borderRadius: '12px', borderLeft: '4px solid #f97316', marginBottom: '32px' }}>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          ⚡ You'll face <strong>5 rounds</strong>. Each round, one panelist asks the question but all 3 react to your answer. Manage the room — not just the question.
        </p>
      </div>

      <button className="btn-primary" onClick={startInterview}
        style={{ width: '100%', background: 'linear-gradient(135deg,#f97316,#ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '16px' }}>
        <Zap size={20} /> Enter the Panel
      </button>
    </div>
  )

  // ── INTERVIEW ──────────────────────────────────────────────────────────────
  if (phase === 'interview') {
    const activeP = PANELISTS[activePanelistIdx]
    return (
      <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Round progress */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {Array.from({ length: MAX_ROUNDS }, (_, i) => (
              <div key={i} style={{ width: '32px', height: '6px', borderRadius: '100px', background: i < round ? '#f97316' : 'var(--surface-alt)', transition: 'background 0.3s' }} />
            ))}
          </div>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Round {round} of {MAX_ROUNDS}</span>
        </div>

        {/* Panelist avatars */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          {PANELISTS.map((p, i) => (
            <div key={i} style={{
              flex: 1, padding: '16px', borderRadius: '16px', textAlign: 'center',
              background: activePanelistIdx === i ? p.bg : 'var(--surface-alt)',
              border: `2px solid ${activePanelistIdx === i ? p.border : 'transparent'}`,
              transition: 'all 0.3s'
            }}>
              <div style={{ fontSize: '28px', marginBottom: '6px' }}>{p.emoji}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: activePanelistIdx === i ? p.color : 'var(--text-muted)' }}>{p.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.short}</div>
              {activePanelistIdx === i && <div style={{ fontSize: '10px', color: p.color, fontWeight: 600, marginTop: '4px' }}>ASKING</div>}
            </div>
          ))}
        </div>

        {/* Current Question */}
        <div className="card" style={{ padding: '32px', marginBottom: '24px', borderLeft: `4px solid ${activeP.color}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ fontSize: '20px' }}>{activeP.emoji}</span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: activeP.color }}>{activeP.name} asks:</span>
          </div>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Loading question...
            </div>
          ) : (
            <p style={{ fontSize: '18px', fontWeight: 600, lineHeight: 1.55, color: 'var(--text-primary)' }}>{currentQuestion}</p>
          )}
        </div>

        {/* Panelist Reactions (after answer) */}
        {reactions.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '24px', animation: 'fadeIn 0.4s ease' }}>
            <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:none } }`}</style>
            {reactions.map((r, i) => (
              <div key={i} style={{ padding: '16px', borderRadius: '12px', background: r.panelist.bg, border: `1px solid ${r.panelist.border}` }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: r.panelist.color, marginBottom: '6px' }}>{r.panelist.emoji} {r.panelist.name}</div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, fontStyle: 'italic' }}>"{r.text}"</p>
              </div>
            ))}
          </div>
        )}

        {/* Answer input */}
        {!submitting && round <= MAX_ROUNDS && (
          <>
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder={`Address ${activeP.name}'s question. Tip: ${activeP.short === 'Technical Lead' ? 'Be specific and use real examples with numbers.' : activeP.short === 'HR Manager' ? 'Focus on your values and how you work with others.' : 'Be decisive. Show you can handle pressure.'}`}
              style={{
                width: '100%', height: '150px', padding: '16px 20px', borderRadius: '16px',
                border: `2px solid ${activeP.color}40`, fontSize: '14px', lineHeight: 1.7,
                resize: 'vertical', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
                background: 'white', color: 'var(--text-primary)', marginBottom: '16px',
                transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = activeP.color}
              onBlur={e => e.target.style.borderColor = `${activeP.color}40`}
              disabled={reactions.length > 0 && round < MAX_ROUNDS}
            />
            {reactions.length === 0 ? (
              <button className="btn-primary" onClick={handleSubmitAnswer} disabled={submitting || !answer.trim()}
                style={{ width: '100%', background: `linear-gradient(135deg,${activeP.color},${activeP.color}cc)`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {submitting ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />Getting reactions...</> : <>Submit Answer <ArrowRight size={16} /></>}
              </button>
            ) : round < MAX_ROUNDS ? (
              <button className="btn-primary" onClick={() => { setReactions([]); setAnswer('') }}
                style={{ width: '100%', background: 'linear-gradient(135deg,#f97316,#ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                Next Question <ArrowRight size={16} />
              </button>
            ) : (
              <button className="btn-primary" onClick={() => handleFinish(qa)}
                style={{ width: '100%', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                🎯 See Panel Verdict
              </button>
            )}
          </>
        )}
      </div>
    )
  }

  // ── DONE ───────────────────────────────────────────────────────────────────
  if (phase === 'done') return (
    <div style={{ padding: '48px', maxWidth: '820px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>{scoring ? '⏳' : (finalScores?.hired ? '🎉' : '📋')}</div>
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Panel Verdict</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{role}</p>
      </div>

      {scoring ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
          <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: '#f97316', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Panel is deliberating...</p>
        </div>
      ) : finalScores && (
        <>
          <div className="card" style={{
            padding: '40px', marginBottom: '24px', textAlign: 'center',
            background: finalScores.hired ? 'linear-gradient(135deg,rgba(16,185,129,0.08),rgba(5,150,105,0.08))' : 'linear-gradient(135deg,rgba(239,68,68,0.06),rgba(245,158,11,0.06))',
            border: `2px solid ${finalScores.hired ? '#10b98133' : '#ef444433'}`
          }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: finalScores.hired ? '#10b981' : '#ef4444', marginBottom: '8px' }}>
              {finalScores.hired ? '✅ Panel recommends HIRE' : '❌ Panel recommends PASS'}
            </div>
            <div style={{ fontSize: '48px', fontWeight: 700, color: 'var(--navy)', margin: '16px 0' }}>{finalScores.overallScore}<span style={{ fontSize: '24px' }}>/100</span></div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>{finalScores.finalVerdict}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '24px' }}>
            {[
              { p: PANELISTS[0], s: finalScores.alexScore },
              { p: PANELISTS[1], s: finalScores.sarahScore },
              { p: PANELISTS[2], s: finalScores.marcusScore }
            ].map(({ p, s }, i) => (
              <div key={i} className="card" style={{ padding: '24px', borderTop: `4px solid ${p.color}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span>{p.emoji}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: p.color }}>{p.name}</span>
                </div>
                <div style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>{s?.score || 6}<span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/10</span></div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s?.verdict}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
            <div className="card" style={{ padding: '24px', borderLeft: '4px solid #10b981', background: 'rgba(16,185,129,0.03)' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#10b981', marginBottom: '8px' }}>✓ TOP STRENGTH</div>
              <p style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{finalScores.topStrength}</p>
            </div>
            <div className="card" style={{ padding: '24px', borderLeft: '4px solid #f59e0b', background: 'rgba(245,158,11,0.03)' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#f59e0b', marginBottom: '8px' }}>⚡ TOP WEAKNESS</div>
              <p style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{finalScores.topWeakness}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="btn-ghost" onClick={() => setPhase('setup')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <RefreshCw size={16} /> New Panel
            </button>
            <button className="btn-primary" onClick={startInterview} style={{ flex: 1, background: 'linear-gradient(135deg,#f97316,#ef4444)' }}>
              Retry Same Role
            </button>
          </div>
        </>
      )}
    </div>
  )

  return null
}

export default PanelInterview

