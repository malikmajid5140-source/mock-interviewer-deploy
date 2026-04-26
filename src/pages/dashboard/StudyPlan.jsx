import React, { useState, useEffect } from 'react'
import { Calendar, CheckCircle2, Circle, Sparkles, Loader2, Lock } from 'lucide-react'
import { generateInterviewContent, parseJsonFromAI } from '../lib/ai'
import { supabase } from '../../lib/supabase'

const StudyPlan = ({ session }) => {
  const [role, setRole] = useState('')
  const [weeks, setWeeks] = useState(4)
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [completedDays, setCompletedDays] = useState({})

  const generatePlan = async () => {
    if (!role.trim()) {
      alert('Please enter your target role first')
      return
    }
    setLoading(true)
    const prompt = `Create a detailed ${weeks}-week interview study plan for a ${role} candidate.
Provide a unique, highly customized plan specifically tailored to the skills and knowledge needed for a ${role}. 
Do NOT just copy the example below. The example is ONLY to show you the required JSON structure.
Generate a full plan for all ${weeks} weeks, with 5 days of tasks per week.

Return ONLY a valid JSON object, no markdown formatting. Use this exact schema:
{
  "title": "Study Plan for ${role}",
  "totalWeeks": ${weeks},
  "weeks": [
    {
      "weekNumber": 1,
      "theme": "<Week's Focus Theme>",
      "days": [
        { "day": "Monday", "task": "<specific task for ${role}>", "type": "Technical", "duration": "1h" },
        { "day": "Tuesday", "task": "<specific task for ${role}>", "type": "Behavioral", "duration": "45m" },
        { "day": "Wednesday", "task": "<specific task for ${role}>", "type": "Coding", "duration": "1.5h" },
        { "day": "Thursday", "task": "<specific task for ${role}>", "type": "System Design", "duration": "1h" },
        { "day": "Friday", "task": "<mock interview focus>", "type": "Practice", "duration": "1h" }
      ]
    }
  ]
}`

    try {
      const text = await generateInterviewContent(prompt)
      let parsed = parseJsonFromAI(text)
      
      // Defensive fallback if AI hallucinates and returns an array of weeks directly
      if (Array.isArray(parsed)) {
        parsed = {
          title: `Study Plan for ${role}`,
          totalWeeks: parsed.length || weeks,
          weeks: parsed
        }
      }
      
      setPlan(parsed)

      // Save session to localStorage so Progress page tracks it
      const attempt = {
        role,
        session_type: 'study_plan',
        questions_practiced: (parsed.weeks?.length || weeks) * 5,
        score: null,
        total: null,
        created_at: new Date().toISOString()
      }
      const saved = JSON.parse(localStorage.getItem('local_sessions') || '[]')
      saved.push(attempt)
      localStorage.setItem('local_sessions', JSON.stringify(saved))

    } catch (err) {
      alert(`Failed to generate plan: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const toggleDay = (weekIdx, dayIdx) => {
    const key = `${weekIdx}-${dayIdx}`
    setCompletedDays(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const typeColors = {
    'Technical':    { bg: '#ede9ff', color: '#4c44b3' },
    'Behavioral':   { bg: 'var(--teal-light)', color: '#0f7d6a' },
    'Coding':       { bg: '#fef3c7', color: '#92400e' },
    'System Design':{ bg: '#fce7f3', color: '#9d174d' },
    'Practice':     { bg: '#e8edf3', color: 'var(--navy)' },
  }

  if (loading) return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <Loader2 size={48} style={{ color: 'var(--teal)', animation: 'spin 1s linear infinite' }} />
      <p className="instrument-serif italic" style={{ fontSize: '24px' }}>Building your personalised study plan...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 className="instrument-serif italic" style={{ fontSize: '48px', marginBottom: '12px' }}>Study Plan</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Generate a week-by-week AI study schedule tailored to your role.</p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', background: 'white', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <label className="input-label">Target Role</label>
            <input
              type="text"
              value={role}
              onChange={e => setRole(e.target.value)}
              placeholder="e.g. Frontend Engineer, Data Scientist"
              className="input-field"
              onKeyDown={e => e.key === 'Enter' && generatePlan()}
            />
          </div>
          <div>
            <label className="input-label">Study Duration</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[2, 4, 6, 8].map(w => (
                <button key={w} onClick={() => setWeeks(w)} style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid', borderColor: weeks === w ? 'var(--teal)' : 'var(--border-light)', background: weeks === w ? 'var(--teal)' : 'white', color: weeks === w ? 'white' : 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}>{w}W</button>
              ))}
            </div>
          </div>
          <button className="btn-primary" onClick={generatePlan} style={{ alignSelf: 'flex-end', height: '48px', padding: '0 32px', gap: '8px', background: 'linear-gradient(135deg, var(--teal), var(--accent-purple))' }}>
            <Sparkles size={18} /> Generate Plan
          </button>
        </div>
      </header>

      {plan && (
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>{plan.title}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>{plan.totalWeeks} weeks · 5 days/week · Structured learning path</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {plan.weeks?.map((week, wIdx) => (
              <div key={wIdx} className="card" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{week.weekNumber}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '18px' }}>Week {week.weekNumber}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{week.theme}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--teal)' }}>
                    {week.days?.filter((_, dIdx) => completedDays[`${wIdx}-${dIdx}`]).length}/{week.days?.length} done
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {week.days?.map((day, dIdx) => {
                    const key = `${wIdx}-${dIdx}`
                    const done = completedDays[key]
                    const style = typeColors[day.type] || typeColors['Practice']
                    return (
                      <div key={dIdx} onClick={() => toggleDay(wIdx, dIdx)} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderRadius: '14px', background: done ? 'var(--teal-light)' : 'var(--warm-white)', border: `1px solid ${done ? 'var(--teal-mid)' : 'var(--border-light)'}`, cursor: 'pointer', transition: 'all 0.2s ease' }}>
                        {done ? <CheckCircle2 size={22} style={{ color: 'var(--teal)', flexShrink: 0 }} /> : <Circle size={22} style={{ color: 'var(--text-hint)', flexShrink: 0 }} />}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 500, textDecoration: done ? 'line-through' : 'none', color: done ? 'var(--text-muted)' : 'var(--text-primary)' }}>{day.task}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{day.day} · {day.duration}</div>
                        </div>
                        <span style={{ padding: '4px 12px', borderRadius: '100px', background: style.bg, color: style.color, fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap' }}>{day.type}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!plan && !loading && (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <Calendar size={64} style={{ color: 'var(--text-hint)', margin: '0 auto 24px' }} />
          <h3 style={{ marginBottom: '8px' }}>No plan generated yet</h3>
          <p style={{ color: 'var(--text-muted)' }}>Enter your target role above and click Generate Plan.</p>
        </div>
      )}
    </div>
  )
}

export default StudyPlan

