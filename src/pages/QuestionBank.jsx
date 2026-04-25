import React, { useState, useEffect } from 'react'
import { Search, Filter, Bookmark, ChevronRight, MessageSquare, Sparkles, Loader2 } from 'lucide-react'
import { generateInterviewContent } from '../lib/gemini'
import { supabase } from '../lib/supabase'

const QuestionBank = () => {
  const [role, setRole] = useState('')
  const [level, setLevel] = useState('Mid')
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [expandedId, setExpandedId] = useState(null)

  const categories = ['All', 'Behavioral', 'Technical', 'System Design', 'HR', 'Product']
  const levels = ['Entry', 'Mid', 'Senior', 'Expert']

  const generateQuestions = async () => {
    if (!role.trim()) {
      alert('Please enter a job role first (e.g. Frontend Developer)')
      return
    }
    setLoading(true)
    
    const prompt = `Generate 10 professional interview questions for a ${level} level ${role}. 
    Return ONLY a JSON array of objects with these keys: 
    "question": "string", 
    "category": "Behavioral/Technical/System Design/HR/Product", 
    "difficulty": "Easy/Medium/Hard", 
    "tips": "one sentence advice".
    No markdown, just raw JSON.`

    try {
      const result = await generateInterviewContent(prompt)
      const jsonString = result.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(jsonString)
      setQuestions(parsed)

      // Save session to Supabase
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('sessions').insert({
          user_id: user.id,
          role: role,
          session_type: 'question_bank',
          questions_practiced: parsed.length
        })
      }
    } catch (error) {
      console.error("Failed to generate questions:", error)
      alert("AI was unable to generate questions. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const filtered = activeCategory === 'All' 
    ? questions 
    : questions.filter(q => q.category === activeCategory)

  return (
    <div style={{ padding: '40px', maxWidth: '1100px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 className="instrument-serif italic" style={{ fontSize: '48px', marginBottom: '16px' }}>Question Bank</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Enter your target role to generate custom AI interview questions.</p>
        
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', background: 'white', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <label className="input-label">Target Role</label>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Software Engineer, Product Manager..." 
                className="input-field"
                style={{ paddingLeft: '48px' }}
                onKeyDown={(e) => e.key === 'Enter' && generateQuestions()}
              />
            </div>
          </div>
          
          <div>
            <label className="input-label">Experience Level</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {levels.map(l => (
                <button 
                  key={l} 
                  onClick={() => setLevel(l)}
                  style={{ 
                    padding: '12px 16px', 
                    borderRadius: '10px', 
                    border: '1.5px solid',
                    borderColor: level === l ? 'var(--teal)' : 'var(--border-light)',
                    background: level === l ? 'var(--teal)' : 'white',
                    color: level === l ? 'white' : 'var(--text-secondary)',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <button 
            className="btn-primary" 
            onClick={generateQuestions} 
            disabled={loading}
            style={{ alignSelf: 'flex-end', height: '48px', padding: '0 32px', gap: '8px', background: 'linear-gradient(135deg, var(--teal), var(--accent-purple))' }}
          >
            {loading ? <Loader2 className="spin" size={18} /> : <Sparkles size={18} />}
            {loading ? 'Generating...' : 'Generate Questions'}
          </button>
        </div>
      </header>

      {questions.length > 0 && (
        <>
          <div className="category-tabs" style={{ display: 'flex', gap: '12px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px' }}>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{ 
                  padding: '8px 20px', 
                  borderRadius: '100px', 
                  border: activeCategory === cat ? '1px solid var(--teal)' : '1px solid var(--border-light)',
                  background: activeCategory === cat ? 'var(--teal-light)' : 'white',
                  color: activeCategory === cat ? 'var(--teal)' : 'var(--text-secondary)',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {filtered.map((q, i) => (
              <div 
                key={i} 
                className="card" 
                onClick={() => setExpandedId(expandedId === i ? null : i)}
                style={{ cursor: 'pointer', borderTop: '4px solid var(--teal)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span className="badge badge-teal">{q.category}</span>
                  <span className="badge badge-navy">{q.difficulty}</span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: expandedId === i ? '16px' : '0', lineHeight: 1.5 }}>{q.question}</h3>
                {expandedId === i && (
                  <div style={{ padding: '16px', background: 'var(--warm-white)', borderRadius: '12px', fontSize: '14px', color: 'var(--text-secondary)', animation: 'fadeUp 0.3s ease' }}>
                    <strong style={{ color: 'var(--teal)' }}>AI Tip:</strong> {q.tips}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {questions.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <div style={{ width: '80px', height: '80px', background: 'var(--surface-alt)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '32px' }}>💡</div>
          <h3>No questions generated yet</h3>
          <p>Enter a role above to see your customized interview questions.</p>
        </div>
      )}

      <style>{`.spin { animation: rotate 1s linear infinite; } @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default QuestionBank
