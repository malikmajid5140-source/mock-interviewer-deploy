import React, { useState } from 'react'
import { DollarSign, Loader2, ArrowRight, TrendingUp, RefreshCw, Trophy, AlertCircle } from 'lucide-react'
import { negotiationResponse, scoreNegotiation } from '../lib/ai'

const SCENARIOS = [
  { id: 1, label: 'Entry Level — First Job Offer', role: 'Junior Software Developer', initial: 65, market: 80, emoji: '🌱', desc: 'Your first real offer. It feels exciting but something is off...' },
  { id: 2, label: 'Mid-Level Counter Offer', role: 'Product Manager', initial: 110, market: 135, emoji: '💼', desc: 'You have 3 years of experience. You know your worth.' },
  { id: 3, label: 'Senior + Competing Offer', role: 'Senior Software Engineer', initial: 155, market: 185, emoji: '⚡', desc: 'You have a competing offer from another company. Use it wisely.' },
  { id: 4, label: 'Lowball Startup Offer', role: 'Marketing Manager', initial: 72, market: 98, emoji: '🚀', desc: 'A hot startup. Low cash but they promise equity and growth.' },
]

const TIPS = [
  { title: 'Anchoring', desc: 'Name your number first. The first number sets the range.', tag: 'Tactic' },
  { title: 'Strategic Silence', desc: 'After naming your ask, stop talking. Let them respond.', tag: 'Tactic' },
  { title: 'Competing Offer', desc: '"I have another offer at $X. Can you match or beat it?"', tag: 'Leverage' },
  { title: 'Total Comp', desc: 'Negotiate equity, bonus, PTO, not just base salary.', tag: 'Smart' },
]

const NegotiationDojo = ({ navigate }) => {
  const [phase, setPhase] = useState('pick') // pick | tips | session | result
  const [scenario, setScenario] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [finalOffer, setFinalOffer] = useState(null)
  const [scoring, setScoring] = useState(false)
  const [turnCount, setTurnCount] = useState(0)

  const startSession = (sc) => {
    setScenario(sc)
    setMessages([{
      role: 'manager',
      content: `[extends hand] Congratulations! We'd like to offer you the ${sc.role} position. We're offering $${sc.initial}k per year. We think it's a competitive offer for your level — what do you think?`
    }])
    setTurnCount(0)
    setInput('')
    setResult(null)
    setFinalOffer(null)
    setPhase('session')
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    const newMessages = [...messages, { role: 'candidate', content: userMsg }]
    setMessages(newMessages)
    setLoading(true)
    setTurnCount(t => t + 1)
    try {
      const reply = await negotiationResponse(
        scenario.role, scenario.market, scenario.initial,
        newMessages, userMsg
      )
      // Detect if a number is mentioned in the reply — track as latest offer
      const numMatch = reply.match(/\$(\d{2,3})k/i)
      if (numMatch) setFinalOffer(parseInt(numMatch[1]))
      setMessages(prev => [...prev, { role: 'manager', content: reply }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'manager', content: 'Connection issue. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleWrapUp = async () => {
    setScoring(true)
    setPhase('result')
    try {
      const finalSalary = finalOffer || scenario.initial
      const data = await scoreNegotiation(
        scenario.role, scenario.initial, finalSalary, scenario.market, messages
      )
      setResult({ ...data, finalSalary })
    } catch (e) {
      setResult({ grade: 'B', outcomeScore: 65, tacticsScore: 60, mainTacticUsed: 'direct ask', missedOpportunity: 'Try anchoring with a higher number next time.', totalGained: (finalOffer || scenario.initial) - scenario.initial, verdict: 'Good effort! Review the debrief for improvements.', finalSalary: finalOffer || scenario.initial })
    } finally {
      setScoring(false)
    }
  }

  // ── PICK SCENARIO ──────────────────────────────────────────────────────────
  if (phase === 'pick') return (
    <div style={{ padding: '48px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={26} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '4px' }}>Negotiation Dojo</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Practice salary negotiation against a realistic AI hiring manager</p>
          </div>
        </div>
        <div style={{ padding: '16px 20px', background: 'rgba(16,185,129,0.06)', borderRadius: '12px', borderLeft: '4px solid #10b981', marginTop: '20px' }}>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            💡 <strong>No other interview platform has this.</strong> The average professional leaves <strong>$1M+ on the table</strong> over their career by not negotiating effectively. Fix that here.
          </p>
        </div>
      </div>

      <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>Choose your scenario</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '48px' }}>
        {SCENARIOS.map(sc => (
          <div key={sc.id} className="card" onClick={() => startSession(sc)}
            style={{ padding: '32px', cursor: 'pointer', transition: 'all 0.2s ease', border: '2px solid transparent' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'none' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>{sc.emoji}</div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>{sc.label}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>{sc.desc}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Initial: <strong style={{ color: '#ef4444' }}>${sc.initial}k</strong></span>
              <span style={{ color: 'var(--text-muted)' }}>Market: <strong style={{ color: '#10b981' }}>${sc.market}k</strong></span>
              <span style={{ color: 'var(--text-muted)' }}>Gap: <strong style={{ color: '#6366f1' }}>${sc.market - sc.initial}k</strong></span>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Quick Tactics Reference</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }}>
          {TIPS.map((t, i) => (
            <div key={i} className="card" style={{ padding: '20px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#6366f1', background: 'rgba(99,102,241,0.1)', padding: '2px 8px', borderRadius: '100px' }}>{t.tag}</span>
              <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '10px 0 6px' }}>{t.title}</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // ── NEGOTIATION SESSION ────────────────────────────────────────────────────
  if (phase === 'session') return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '20px 40px', background: 'white', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '24px' }}>{scenario.emoji}</span>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 600 }}>{scenario.label}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Initial: ${scenario.initial}k → Market: ${scenario.market}k → Gap: ${scenario.market - scenario.initial}k</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {finalOffer && (
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '6px 14px', borderRadius: '100px' }}>
              Current: ${finalOffer}k
            </div>
          )}
          <button className="btn-primary" onClick={handleWrapUp} style={{ background: 'linear-gradient(135deg,#10b981,#059669)', fontSize: '13px', padding: '8px 20px' }}>
            End & Get Score
          </button>
        </div>
      </div>

      {/* Chat */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: '14px', alignSelf: m.role === 'candidate' ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
            {m.role === 'manager' && (
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '16px' }}>👔</div>
            )}
            <div style={{
              padding: '14px 20px', borderRadius: '18px', fontSize: '14px', lineHeight: 1.65,
              background: m.role === 'candidate' ? '#10b981' : 'white',
              color: m.role === 'candidate' ? 'white' : 'var(--text-primary)',
              boxShadow: 'var(--shadow-card)',
              borderTopRightRadius: m.role === 'candidate' ? '4px' : '18px',
              borderTopLeftRadius: m.role === 'manager' ? '4px' : '18px',
              fontStyle: m.content.includes('[') ? 'normal' : 'normal'
            }}>
              {m.content}
            </div>
            {m.role === 'candidate' && (
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '16px' }}>👤</div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: '14px', alignSelf: 'flex-start' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>👔</div>
            <div style={{ background: 'white', padding: '14px 20px', borderRadius: '18px', borderTopLeftRadius: '4px', boxShadow: 'var(--shadow-card)', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px' }}>
              <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: '20px 40px', background: 'white', borderTop: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', gap: '12px', maxWidth: '900px', margin: '0 auto' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder='Reply to the hiring manager... (e.g. "Based on my research, the market rate is $X. I was expecting closer to $Y.")'
            className="input-field"
            style={{ flex: 1, borderRadius: '100px', padding: '0 24px' }}
            disabled={loading}
          />
          <button className="btn-primary" onClick={handleSend} disabled={loading || !input.trim()}
            style={{ background: 'linear-gradient(135deg,#10b981,#059669)', borderRadius: '100px', padding: '0 28px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Send <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )

  // ── RESULT ─────────────────────────────────────────────────────────────────
  if (phase === 'result') return (
    <div style={{ padding: '48px', maxWidth: '820px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>💰</div>
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Negotiation Debrief</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{scenario.role}</p>
      </div>

      {scoring ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
          <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: '#10b981', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Scoring your negotiation...</p>
        </div>
      ) : result && (
        <>
          {/* Grade + Financials */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div className="card" style={{ padding: '28px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', fontWeight: 700, color: '#6366f1' }}>{result.grade}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Negotiation Grade</div>
            </div>
            <div className="card" style={{ padding: '28px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#10b981' }}>${result.finalSalary}k</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Final Salary</div>
              <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>+${result.finalSalary - scenario.initial}k gained</div>
            </div>
            <div className="card" style={{ padding: '28px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#f59e0b' }}>${scenario.market - result.finalSalary}k</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Left on the table</div>
              <div style={{ fontSize: '12px', color: '#f59e0b', marginTop: '4px' }}>vs market rate</div>
            </div>
          </div>

          {/* Scores */}
          <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '24px' }}>Performance Breakdown</h3>
            {[{ label: 'Outcome Score', value: result.outcomeScore, color: '#6366f1' }, { label: 'Tactics Score', value: result.tacticsScore, color: '#10b981' }].map((s, i) => (
              <div key={i} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>
                  <span>{s.label}</span><span style={{ color: s.color }}>{s.value}/100</span>
                </div>
                <div style={{ height: '8px', background: 'var(--surface-alt)', borderRadius: '100px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${s.value}%`, background: s.color, borderRadius: '100px', transition: 'width 0.8s ease' }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(99,102,241,0.06)', borderRadius: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              Main tactic used: <strong>{result.mainTacticUsed}</strong>
            </div>
          </div>

          <div className="card" style={{ padding: '28px', marginBottom: '24px', borderLeft: '4px solid #f59e0b', background: 'rgba(245,158,11,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <AlertCircle size={16} color="#f59e0b" />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#92400e' }}>Missed Opportunity</span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{result.missedOpportunity}</p>
          </div>

          <div className="card" style={{ padding: '28px', marginBottom: '32px', borderLeft: '4px solid #10b981', background: 'rgba(16,185,129,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Trophy size={16} color="#10b981" />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#065f46' }}>Verdict</span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{result.verdict}</p>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="btn-ghost" onClick={() => setPhase('pick')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <RefreshCw size={16} /> Try Another Scenario
            </button>
            <button className="btn-primary" onClick={() => startSession(scenario)} style={{ flex: 1, background: 'linear-gradient(135deg,#10b981,#059669)' }}>
              Retry This Scenario
            </button>
          </div>
        </>
      )}
    </div>
  )

  return null
}

export default NegotiationDojo

