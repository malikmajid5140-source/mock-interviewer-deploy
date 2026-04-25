import React, { useState, useRef, useEffect } from 'react'
import { Video, Mic, Layout, Play, Clock, Star, Send, User, Bot, Loader2, ArrowLeft } from 'lucide-react'
import { generateInterviewContent } from '../lib/ai'

const MockInterview = ({ navigate }) => {
  const [sessionActive, setSessionActive] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const startSession = () => {
    setSessionActive(true)
    setMessages([
      { role: 'ai', content: "Hello! I am your AI Interviewer. I'll be conducting your mock interview today. To start things off, could you please tell me a little bit about yourself and your background?" }
    ])
  }

  const handleSend = async (e) => {
    e?.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    const newMessages = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const history = newMessages.map(m => `${m.role === 'ai' ? 'INTERVIEWER' : 'CANDIDATE'}: ${m.content}`).join('\n')
      const prompt = `You are an expert technical interviewer conducting a professional mock interview.
Here is the transcript of the interview so far:
${history}

Respond to the candidate's latest message. 
Instructions:
1. Speak directly to the candidate in a professional, conversational tone.
2. Provide very brief, constructive feedback if they answered a question.
3. Ask exactly ONE relevant follow-up question or new technical/behavioral question.
4. Keep your entire response concise (under 4 sentences). Do NOT use markdown code blocks unless asking a coding question.`

      const response = await generateInterviewContent(prompt)
      setMessages(prev => [...prev, { role: 'ai', content: response }])
    } catch (err) {
      alert("Connection to AI lost. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (sessionActive) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--warm-white)' }}>
        <div style={{ padding: '24px 40px', background: 'white', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => setSessionActive(false)} className="btn-ghost" style={{ padding: '8px', borderRadius: '50%' }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Active Mock Interview</h2>
            <div style={{ fontSize: '13px', color: 'var(--teal)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--teal)', animation: 'pulse 2s infinite' }}></div>
              AI is recording
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <style>{`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }`}</style>
          
          {messages.map((msg, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '16px', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
              {msg.role === 'ai' && (
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={20} />
                </div>
              )}
              <div style={{ 
                background: msg.role === 'user' ? 'var(--teal)' : 'white', 
                color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                padding: '16px 24px', 
                borderRadius: '20px', 
                borderTopRightRadius: msg.role === 'user' ? '4px' : '20px',
                borderTopLeftRadius: msg.role === 'ai' ? '4px' : '20px',
                boxShadow: 'var(--shadow-card)',
                lineHeight: 1.6,
                fontSize: '15px'
              }}>
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--teal-light)', color: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User size={20} />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: '16px', alignSelf: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={20} />
              </div>
              <div style={{ background: 'white', padding: '16px 24px', borderRadius: '20px', borderTopLeftRadius: '4px', boxShadow: 'var(--shadow-card)', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                AI is typing...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div style={{ padding: '24px 40px', background: 'white', borderTop: '1px solid var(--border-light)' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '16px', maxWidth: '1000px', margin: '0 auto' }}>
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your response... (Speak naturally, AI will analyze your answer)" 
              className="input-field" 
              style={{ flex: 1, borderRadius: '100px', padding: '0 24px' }}
              disabled={loading}
            />
            <button type="submit" className="btn-primary" style={{ width: '56px', height: '56px', borderRadius: '50%', padding: 0, flexShrink: 0 }} disabled={loading || !input.trim()}>
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container" style={{ padding: '48px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <h1 className="instrument-serif italic" style={{ fontSize: '56px', marginBottom: '16px' }}>AI Mock Interview</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>Face your fears in a safe, AI-powered environment.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--teal)' }}>
            <Video size={32} />
          </div>
          <h3 style={{ marginBottom: '12px' }}>Video Interview</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '14px' }}>Practice with your camera on. Get feedback on body language, eye contact, and confidence.</p>
          <button className="btn-primary" style={{ width: '100%' }} onClick={() => alert("Video streams require browser permissions. Try the Audio/Text session for now!")}>Start Video Session</button>
        </div>

        <div className="card" style={{ padding: '40px', textAlign: 'center', border: '2px solid var(--accent-purple)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(108, 99, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--accent-purple)' }}>
            <Mic size={32} />
          </div>
          <h3 style={{ marginBottom: '12px' }}>Interactive Session</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '14px' }}>Real-time text-based mock interview with our Groq AI Engine. Get instant feedback.</p>
          <button className="btn-primary" style={{ width: '100%', background: 'var(--accent-purple)' }} onClick={startSession}>Start Interview</button>
        </div>
      </div>

      <div style={{ marginTop: '64px' }}>
        <h3 style={{ marginBottom: '24px' }}>Recent Sessions</h3>
        <div className="card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layout size={20} style={{ color: 'var(--text-secondary)' }} />
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>Senior Software Engineer Round</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Yesterday • 45 minutes</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--teal)' }}>84/100</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Clarity Score</div>
            </div>
            <button className="btn-ghost" style={{ padding: '8px 16px', fontSize: '13px' }}>View Feedback</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MockInterview
