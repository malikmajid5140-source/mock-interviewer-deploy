import React, { useState } from 'react'
import { Sparkles, CheckCircle2, XCircle, ArrowRight, RefreshCw } from 'lucide-react'
import { generateInterviewContent } from '../lib/gemini'

const McqQuiz = () => {
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [answered, setAnswered] = useState(false)

  const startQuiz = async () => {
    setLoading(true)
    setQuestions([])
    setCurrentIndex(0)
    setScore(0)
    setShowResult(false)

    const prompt = `Generate 5 multiple choice questions for a Software Engineering technical interview. 
    Format each question as a JSON object with: 
    "question": "string",
    "options": ["string", "string", "string", "string"],
    "correctIndex": number (0-3).
    Return only a JSON array of 5 such objects.`
    
    try {
      const result = await generateInterviewContent(prompt)
      // Clean result if Gemini adds markdown code blocks
      const jsonString = result.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(jsonString)
      setQuestions(parsed)
    } catch (error) {
      console.error("Failed to parse AI questions", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (index) => {
    if (answered) return
    setSelectedOption(index)
    setAnswered(true)
    if (index === questions[currentIndex].correctIndex) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedOption(null)
      setAnswered(false)
    } else {
      setShowResult(true)
    }
  }

  if (loading) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '24px' }}>
           <div style={{ position: 'absolute', inset: 0, border: '4px solid var(--teal-light)', borderRadius: '50%' }} />
           <div style={{ position: 'absolute', inset: 0, border: '4px solid var(--teal)', borderRadius: '50%', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
        </div>
        <h3 className="instrument-serif italic" style={{ fontSize: '24px' }}>Gemini is crafting your quiz...</h3>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (questions.length === 0 || showResult) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center' }}>
        {showResult ? (
          <>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>{score >= 3 ? '🎉' : '💪'}</div>
            <h2 className="instrument-serif italic" style={{ fontSize: '48px', marginBottom: '8px' }}>
              {score >= 3 ? 'Excellent Work!' : 'Keep Practicing!'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>You scored {score} out of {questions.length}</p>
            <button className="btn-primary" onClick={startQuiz} style={{ gap: '8px' }}><RefreshCw size={18} /> Try Again</button>
          </>
        ) : (
          <>
            <div style={{ width: '80px', height: '80px', background: 'var(--teal-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal)', marginBottom: '24px' }}>
              <Sparkles size={40} />
            </div>
            <h2 className="instrument-serif italic" style={{ fontSize: '40px', marginBottom: '16px' }}>Ready for a challenge?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '400px' }}>Generate a unique MCQ quiz powered by Gemini AI to test your technical knowledge.</p>
            <button className="btn-primary" onClick={startQuiz} style={{ padding: '16px 32px', gap: '8px' }}>
              <Sparkles size={18} /> Generate AI Quiz
            </button>
          </>
        )}
      </div>
    )
  }

  const q = questions[currentIndex]

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
        <span className="badge badge-navy">Question {currentIndex + 1} of {questions.length}</span>
        <div style={{ height: '8px', width: '200px', background: 'var(--border-light)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${((currentIndex + 1) / questions.length) * 100}%`, background: 'var(--teal)', transition: 'width 0.3s ease' }} />
        </div>
      </div>

      <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '40px', lineHeight: 1.4 }}>{q.question}</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '48px' }}>
        {q.options.map((opt, i) => {
          const isSelected = selectedOption === i
          const isCorrect = i === q.correctIndex
          let bg = 'white'
          let border = '1.5px solid var(--border-light)'
          let color = 'var(--text-primary)'

          if (answered) {
            if (isCorrect) {
              bg = 'var(--teal-light)'
              border = '1.5px solid var(--teal)'
              color = '#0f7d6a'
            } else if (isSelected) {
              bg = '#fee2e2'
              border = '1.5px solid #ef4444'
              color = '#ef4444'
            }
          } else if (isSelected) {
            border = '1.5px solid var(--teal)'
            bg = 'rgba(24, 184, 154, 0.05)'
          }

          return (
            <div 
              key={i}
              onClick={() => handleAnswer(i)}
              style={{ 
                padding: '20px 24px', 
                borderRadius: '16px', 
                border, 
                background: bg,
                color,
                cursor: answered ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                fontWeight: isSelected ? 600 : 400
              }}
            >
              <span>{opt}</span>
              {answered && isCorrect && <CheckCircle2 size={20} />}
              {answered && isSelected && !isCorrect && <XCircle size={20} />}
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          className="btn-primary" 
          disabled={!answered}
          onClick={nextQuestion}
          style={{ gap: '8px', padding: '12px 32px', opacity: answered ? 1 : 0.5 }}
        >
          {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'} <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}

export default McqQuiz
