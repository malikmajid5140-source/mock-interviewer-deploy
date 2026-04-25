import React, { useState } from 'react'
import { Sparkles, CheckCircle2, XCircle, ArrowRight, RefreshCw, Loader2, Award } from 'lucide-react'
import { generateInterviewContent } from '../lib/gemini'
import { supabase } from '../lib/supabase'

const McqQuiz = () => {
  const [screen, setScreen] = useState('setup') // setup | loading | quiz | results
  const [role, setRole] = useState('')
  const [level, setLevel] = useState('Mid')
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [answered, setAnswered] = useState(false)

  const generateQuiz = async () => {
    if (!role.trim()) {
      alert('Please enter a target role (e.g. Backend Engineer)')
      return
    }
    setScreen('loading')
    
    const prompt = `Generate 10 multiple choice questions for a ${level} level ${role} interview. 
    Return ONLY a JSON array of objects with: 
    "question": "string",
    "options": ["A", "B", "C", "D"],
    "correctIndex": 0-3,
    "explanation": "why this is correct".
    No markdown, just raw JSON.`

    try {
      const result = await generateInterviewContent(prompt)
      const jsonString = result.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(jsonString)
      setQuestions(parsed)
      setScreen('quiz')
    } catch (error) {
      console.error("Quiz Generation Error:", error)
      alert("Failed to generate quiz. Try a different role.")
      setScreen('setup')
    }
  }

  const handleAnswer = (index) => {
    if (answered) return
    setSelectedOption(index)
    setAnswered(true)
    if (index === questions[currentIndex].correctIndex) {
      setScore(s => s + 1)
    }
  }

  const nextQuestion = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1)
      setSelectedOption(null)
      setAnswered(false)
    } else {
      // Save results to Supabase
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('mcq_attempts').insert({
          user_id: user.id,
          role,
          total_questions: questions.length,
          correct_answers: score,
          score_percentage: Math.round((score / questions.length) * 100)
        })
        
        await supabase.from('sessions').insert({
          user_id: user.id,
          role,
          session_type: 'mcq',
          score: score,
          total: questions.length
        })
      }
      setScreen('results')
    }
  }

  if (screen === 'setup') {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '48px', textAlign: 'center', boxShadow: '0 8px 32px rgba(14,27,46,0.1)' }}>
          <div style={{ width: '80px', height: '80px', background: 'var(--teal-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--teal)' }}>
            <Sparkles size={40} />
          </div>
          <h2 className="instrument-serif italic" style={{ fontSize: '32px', marginBottom: '8px' }}>Ready for a challenge?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Generate a custom MCQ quiz for any role using AI.</p>
          
          <div style={{ textAlign: 'left', marginBottom: '32px' }}>
            <label className="input-label">What role are you targeting?</label>
            <input 
              type="text" 
              value={role}
              onChange={e => setRole(e.target.value)}
              placeholder="e.g. Data Scientist, UX Designer"
              className="input-field"
              style={{ marginBottom: '24px' }}
              onKeyDown={e => e.key === 'Enter' && generateQuiz()}
            />
            
            <label className="input-label">Experience Level</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['Entry', 'Mid', 'Senior'].map(l => (
                <button key={l} onClick={() => setLevel(l)} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1.5px solid', borderColor: level === l ? 'var(--teal)' : 'var(--border-light)', background: level === l ? 'var(--teal)' : 'white', color: level === l ? 'white' : 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>{l}</button>
              ))}
            </div>
          </div>

          <button className="btn-primary" onClick={generateQuiz} style={{ width: '100%', height: '52px', fontSize: '16px', gap: '8px' }}>
            <Sparkles size={18} /> Start Quiz Session
          </button>
        </div>
      </div>
    )
  }

  if (screen === 'loading') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="spin" size={64} style={{ color: 'var(--teal)', marginBottom: '24px' }} />
        <h3 className="instrument-serif italic" style={{ fontSize: '28px' }}>Crafting your AI Quiz...</h3>
        <style>{`.spin { animation: rotate 1s linear infinite; } @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (screen === 'results') {
    const percentage = Math.round((score / questions.length) * 100)
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '48px', textAlign: 'center' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: percentage >= 70 ? 'var(--teal-light)' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: percentage >= 70 ? 'var(--teal)' : 'var(--error)' }}>
            <Award size={64} />
          </div>
          <h2 className="instrument-serif italic" style={{ fontSize: '48px', marginBottom: '8px' }}>{percentage}% Score</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>{percentage >= 70 ? "Excellent work! You're ready for the real thing." : "Good effort. Review the explanations to improve."}</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
            <div style={{ padding: '16px', background: 'var(--warm-white)', borderRadius: '16px' }}>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{score}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>CORRECT</div>
            </div>
            <div style={{ padding: '16px', background: 'var(--warm-white)', borderRadius: '16px' }}>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{questions.length - score}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>WRONG</div>
            </div>
          </div>

          <button className="btn-primary" onClick={() => setScreen('setup')} style={{ width: '100%', gap: '8px' }}>
            <RefreshCw size={18} /> Take New Quiz
          </button>
        </div>
      </div>
    )
  }

  const q = questions[currentIndex]

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
        <span className="badge badge-navy" style={{ fontSize: '14px', padding: '8px 16px' }}>Question {currentIndex + 1} / {questions.length}</span>
        <div style={{ flex: 1, height: '6px', background: 'var(--border-light)', margin: '0 24px', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${((currentIndex + 1) / questions.length) * 100}%`, background: 'var(--teal)', transition: 'width 0.3s ease' }} />
        </div>
        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--teal)' }}>Score: {score}</span>
      </div>

      <div className="card" style={{ padding: '40px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '40px', lineHeight: 1.4 }}>{q.question}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {q.options.map((opt, i) => {
            const isSelected = selectedOption === i
            const isCorrect = i === q.correctIndex
            let borderColor = 'var(--border-light)'
            let background = 'white'
            
            if (answered) {
              if (isCorrect) {
                borderColor = 'var(--teal)'
                background = 'var(--teal-light)'
              } else if (isSelected) {
                borderColor = 'var(--error)'
                background = '#fee2e2'
              }
            } else if (isSelected) {
              borderColor = 'var(--teal)'
              background = 'rgba(24, 184, 154, 0.05)'
            }

            return (
              <button key={i} onClick={() => handleAnswer(i)} disabled={answered} style={{ padding: '20px 24px', borderRadius: '16px', border: `1.5px solid ${borderColor}`, background, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: answered ? 'default' : 'pointer', transition: 'all 0.2s ease', textAlign: 'left', fontWeight: isSelected ? 600 : 400 }}>
                <span style={{ fontSize: '16px' }}>{opt}</span>
                {answered && isCorrect && <CheckCircle2 size={20} style={{ color: 'var(--teal)' }} />}
                {answered && isSelected && !isCorrect && <XCircle size={20} style={{ color: 'var(--error)' }} />}
              </button>
            )
          })}
        </div>
      </div>

      {answered && (
        <div style={{ padding: '24px', background: 'var(--teal-light)', borderRadius: '16px', marginBottom: '32px', animation: 'fadeUp 0.3s ease' }}>
          <div style={{ fontWeight: 700, color: 'var(--teal)', marginBottom: '8px', fontSize: '14px', textTransform: 'uppercase' }}>Explanation</div>
          <p style={{ color: '#0f7d6a', fontSize: '15px', lineHeight: 1.6 }}>{q.explanation}</p>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn-primary" onClick={nextQuestion} disabled={!answered} style={{ padding: '14px 40px', gap: '12px', fontSize: '16px', opacity: answered ? 1 : 0.5 }}>
          {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'} <ArrowRight size={20} />
        </button>
      </div>
    </div>
  )
}

export default McqQuiz
