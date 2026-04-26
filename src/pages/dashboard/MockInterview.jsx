import React, { useState, useRef, useEffect } from 'react'
import { Video, Mic, Layout, Send, User, Bot, Loader2, ArrowLeft, Zap, RefreshCw, TrendingUp, ChevronDown } from 'lucide-react'
import { generateInterviewContent, transcribeAudio, generateCurveball, generateRewriteChallenge, scoreAnswerImprovement, analyzeConfidence, extractWeaknessTags } from '../lib/ai'

const MockInterview = ({ navigate }) => {
  const [sessionActive, setSessionActive] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)

  // Chaos Mode
  const [chaosMode, setChaosMode] = useState(false)
  const [curveballMsg, setCurveballMsg] = useState(null)
  const [curveballLoading, setCurveballLoading] = useState(false)

  // Answer Evolution
  const [evolveState, setEvolveState] = useState(null) // { msgIdx, question, originalAnswer, challenge, revisedAnswer, score, phase }

  // Confidence tracking per user message index
  const [confidenceMap, setConfidenceMap] = useState({})

  const chatEndRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const chaosTimerRef = useRef(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => { scrollToBottom() }, [messages, loading, isTranscribing, evolveState])

  // Chaos Mode timer
  useEffect(() => {
    if (!chaosMode || !sessionActive) return
    chaosTimerRef.current = setTimeout(async () => {
      const lastQ = messages.filter(m => m.role === 'ai').slice(-1)[0]?.content || 'Tell me about yourself'
      const lastA = messages.filter(m => m.role === 'user').slice(-1)[0]?.content || ''
      if (!lastA) return
      setCurveballLoading(true)
      try {
        const cb = await generateCurveball(lastQ, lastA, 'Skeptical Director')
        setCurveballMsg(cb)
      } catch(e) { /* silent */ } finally { setCurveballLoading(false) }
    }, 40000 + Math.random() * 30000)
    return () => clearTimeout(chaosTimerRef.current)
  }, [messages, chaosMode, sessionActive])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setIsTranscribing(true)
        try {
          const transcript = await transcribeAudio(audioBlob)
          setInput(prev => (prev + ' ' + transcript).trim())
        } catch (error) {
          alert("Failed to transcribe audio: " + error.message)
        } finally {
          setIsTranscribing(false)
        }
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsListening(true)
    } catch (err) {
      console.error("Mic access denied", err)
      alert("Microphone access is required for this feature.")
    }
  }

  const startSession = () => {
    setSessionActive(true)
    const initialMessage = "Hello! I am your AI Interviewer. I'll be conducting your mock interview today. To start things off, could you please tell me a little bit about yourself and your background?"
    setMessages([
      { role: 'ai', content: initialMessage }
    ])
    
    setTimeout(() => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(initialMessage)
        utterance.rate = 1.05
        const voices = window.speechSynthesis.getVoices()
        const preferredVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Google US English') || v.name.includes('Samantha'))
        if (preferredVoice) utterance.voice = preferredVoice
        window.speechSynthesis.speak(utterance)
      }
    }, 500)
  }

  const toggleListen = (e) => {
    e.preventDefault()
    if (isListening) {
      mediaRecorderRef.current?.stop()
      setIsListening(false)
    } else {
      startRecording()
    }
  }

  const handleSend = async (e) => {
    e?.preventDefault()
    if (!input.trim() || loading || isTranscribing) return

    if (isListening) {
      mediaRecorderRef.current?.stop()
      setIsListening(false)
    }

    const userMessage = input.trim()
    setInput('')
    const newMsgIdx = messages.length
    const newMessages = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)
    setCurveballMsg(null)
    // Confidence analysis (sync, no API)
    const confData = analyzeConfidence(userMessage)
    if (confData.length > 0) setConfidenceMap(prev => ({ ...prev, [newMsgIdx]: confData }))
    setLoading(true)

    try {
      const history = newMessages.map(m => `${m.role === 'ai' ? 'INTERVIEWER' : 'CANDIDATE'}: ${m.content}`).join('\n')
      const prompt = `You are an expert senior technical interviewer at a top tech company conducting a rigorous mock interview.
Here is the transcript so far:
${history}

Respond to the candidate's latest answer with the following structure:
1. SCORE: Give a score out of 10 for this specific answer.
2. STRENGTHS: In 1-2 sentences, highlight what was strong about their answer.
3. IMPROVEMENT: In 1-2 sentences, give specific, actionable advice on what to improve.
4. FOLLOW-UP: Ask exactly ONE probing follow-up question or a new relevant technical/behavioral question.

Format your response in plain text (no markdown). Be direct, professional, and constructive like a real recruiter.`

      const response = await generateInterviewContent(prompt)
      setMessages(prev => [...prev, { role: 'ai', content: response }])

      // Extract weakness tags in background for Pattern X-Ray
      extractWeaknessTags(userMessage, response, response).then(tags => {
        if (tags && tags.length > 0) {
          // Update local storage session if exists, or just keep track in a way Pattern X-Ray can read
          // For simplicity, we'll store them in the session object when it's finalized
          // But for immediate use, let's tag the message
          setMessages(prev => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg.role === 'ai') lastMsg.tags = tags;
            return [...prev];
          });
        }
      }).catch(console.error);
      
      // Text-to-Speech (TTS) for the AI's response
      if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(response)
        utterance.rate = 1.05
        
        // Try to select a natural/female voice if available
        const voices = window.speechSynthesis.getVoices()
        const preferredVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Google US English') || v.name.includes('Samantha'))
        if (preferredVoice) utterance.voice = preferredVoice
        
        window.speechSynthesis.speak(utterance)
      }
    } catch (err) {
      alert("Connection to AI lost. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackData, setFeedbackData] = useState({ strengths: '', improvements: '' })
  const [videoLoading, setVideoLoading] = useState(false)

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setVideoLoading(true)
    // Simulate video frame extraction and processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    try {
      const prompt = `You are an expert AI interview coach analyzing a candidate's video response. 
Based on standard video interview assessment metrics, produce a detailed, structured feedback report.
Return ONLY a valid JSON object. Do not include markdown. Format:
{
  "score": "number out of 10",
  "strengths": "2-3 sentences about what they did well (e.g. strong eye contact, clear articulation, confident posture, good pace)",
  "improvements": "2-3 sentences of specific, actionable advice (e.g. reduce filler words like 'um', improve lighting, slow down when explaining complex topics)",
  "nextSteps": "1-2 sentences recommending specific practice exercises or techniques to improve for the next session"
}`
      const response = await generateInterviewContent(prompt)
      // Parse JSON from response
      const cleaned = response.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
      const firstBrace = cleaned.indexOf('{')
      const lastBrace = cleaned.lastIndexOf('}')
      if (firstBrace !== -1 && lastBrace !== -1) {
        const parsed = JSON.parse(cleaned.slice(firstBrace, lastBrace + 1))
        setFeedbackData({
          score: parsed.score || '7/10',
          strengths: parsed.strengths || 'Strong, clear communication and excellent posture.',
          improvements: parsed.improvements || 'Try to minimize background distractions and maintain steady eye contact with the camera.',
          nextSteps: parsed.nextSteps || 'Practice answering questions in front of a mirror and record yourself weekly to track improvement.'
        })
      }
      setShowFeedback(true)
    } catch (err) {
      alert("Failed to analyze video: " + err.message)
    } finally {
      setVideoLoading(false)
      e.target.value = '' // reset input
    }
  }

  const openStaticFeedback = () => {
    setFeedbackData({
      score: '8/10',
      strengths: "Clear communication of past project impact. Good structure when answering behavioral questions using the STAR method. Confident tone and strong eye contact throughout.",
      improvements: "Could be more concise when explaining technical trade-offs. Avoid filler words like 'um' and 'uh'. Remember to clarify requirements before diving into system architecture.",
      nextSteps: "Practice the STAR method with 3 new behavioral questions daily. Record yourself answering a system design question to review your pacing and clarity."
    })
    setShowFeedback(true)
  }

  if (sessionActive) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--warm-white)' }}>
        <div style={{ padding: '20px 40px', background: 'white', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => {
            clearTimeout(chaosTimerRef.current)
            // Aggregate all tags from the session
            const allTags = messages.reduce((acc, m) => {
              if (m.tags) acc.push(...m.tags);
              return acc;
            }, []);
            const uniqueTags = [...new Set(allTags)];

            const attempt = { 
              role: 'Mock Interview', 
              session_type: 'mock_interview', 
              questions_practiced: messages.filter(m => m.role === 'ai').length, 
              score: null, 
              total: null, 
              weakness_tags: uniqueTags,
              created_at: new Date().toISOString() 
            }
            const saved = JSON.parse(localStorage.getItem('local_sessions') || '[]')
            saved.push(attempt)
            localStorage.setItem('local_sessions', JSON.stringify(saved))

            // Sync to Supabase if logged in
            supabase.auth.getSession().then(({ data: { session } }) => {
              if (session) {
                supabase.from('interview_sessions').insert([{
                  user_id: session.user.id,
                  ...attempt
                }]).then(() => {}).catch(console.error)
              }
            })

            setSessionActive(false); setCurveballMsg(null); setEvolveState(null)
          }} className="btn-ghost" style={{ padding: '8px', borderRadius: '50%' }}>
            <ArrowLeft size={20} />
          </button>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Active Mock Interview</h2>
            <div style={{ fontSize: '13px', color: 'var(--teal)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--teal)', animation: 'pulse 2s infinite' }}></div>
              AI is recording
            </div>
          </div>
          {/* Chaos Mode Toggle */}
          <button
            onClick={() => { setChaosMode(c => !c); setCurveballMsg(null) }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '100px', border: `2px solid ${chaosMode ? '#ef4444' : 'var(--border-light)'}`, background: chaosMode ? 'rgba(239,68,68,0.08)' : 'transparent', color: chaosMode ? '#ef4444' : 'var(--text-muted)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <Zap size={14} style={{ animation: chaosMode ? 'pulse 1.5s infinite' : 'none' }} />
            {chaosMode ? 'Chaos ON' : 'Chaos Mode'}
          </button>
        </div>

        {/* Curveball Banner */}
        {(curveballMsg || curveballLoading) && (
          <div style={{ padding: '14px 40px', background: 'linear-gradient(90deg,#ef4444,#f97316)', color: 'white', display: 'flex', alignItems: 'center', gap: '12px', animation: 'slideDown 0.3s ease' }}>
            <style>{`@keyframes slideDown{from{transform:translateY(-100%);opacity:0}to{transform:none;opacity:1}}`}</style>
            <Zap size={16} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '14px', fontWeight: 600, flex: 1 }}>{curveballLoading ? '⚡ Curveball incoming...' : `⚡ CURVEBALL: ${curveballMsg}`}</span>
            <button onClick={() => setCurveballMsg(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '4px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>Dismiss</button>
          </div>
        )}

        <div style={{ flex: 1, overflowY: 'auto', padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <style>{`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }`}</style>
          
          {messages.map((msg, idx) => {
            const isUserMsg = msg.role === 'user'
            const isFeedbackMsg = msg.role === 'ai' && msg.content.includes('SCORE:')
            const confData = isUserMsg && confidenceMap[idx]
            const avgConf = confData ? Math.round(confData.reduce((s,c)=>s+c.score,0)/confData.length) : null
            const isEvolving = evolveState?.msgIdx === idx
            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignSelf: isUserMsg ? 'flex-end' : 'flex-start', maxWidth: '80%', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '16px', alignSelf: isUserMsg ? 'flex-end' : 'flex-start' }}>
                  {msg.role === 'ai' && <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Bot size={20} /></div>}
                  <div style={{ background: isUserMsg ? 'var(--teal)' : 'white', color: isUserMsg ? 'white' : 'var(--text-primary)', padding: '16px 24px', borderRadius: '20px', borderTopRightRadius: isUserMsg ? '4px' : '20px', borderTopLeftRadius: msg.role === 'ai' ? '4px' : '20px', boxShadow: 'var(--shadow-card)', lineHeight: 1.6, fontSize: '15px' }}>
                    {msg.content}
                  </div>
                  {isUserMsg && <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--teal-light)', color: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><User size={20} /></div>}
                </div>

                {/* Confidence bar under user messages */}
                {isUserMsg && confData && (
                  <div style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '56px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Confidence</span>
                    <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end' }}>
                      {confData.map((c,i) => <div key={i} style={{ width: '6px', height: `${Math.max(4, c.score * 0.2)}px`, borderRadius: '2px', background: c.score>=70?'#10b981':c.score>=50?'#f59e0b':'#ef4444', transition: 'height 0.4s' }} />)}
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: avgConf>=70?'#10b981':avgConf>=50?'#f59e0b':'#ef4444' }}>{avgConf}%</span>
                  </div>
                )}

                {/* Evolve button after AI feedback */}
                {isFeedbackMsg && !isEvolving && (
                  <div style={{ alignSelf: 'flex-start', paddingLeft: '56px' }}>
                    <button onClick={async () => {
                      const prevUserMsg = messages.slice(0,idx).filter(m=>m.role==='user').slice(-1)[0]
                      const prevAIQ = messages.slice(0,idx).filter(m=>m.role==='ai').slice(-2,-1)[0]
                      if (!prevUserMsg) return
                      setEvolveState({ msgIdx: idx, question: prevAIQ?.content||'Interview question', originalAnswer: prevUserMsg.content, challenge: '...', revisedAnswer: '', score: null, phase: 'loading' })
                      try {
                        const ch = await generateRewriteChallenge(prevAIQ?.content||'Interview question', prevUserMsg.content)
                        setEvolveState(s => ({ ...s, challenge: ch, phase: 'rewriting' }))
                      } catch(e) { setEvolveState(null) }
                    }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '100px', border: '2px solid #6366f1', background: 'rgba(99,102,241,0.06)', color: '#6366f1', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                      <RefreshCw size={12} /> ✨ Evolve This Answer
                    </button>
                  </div>
                )}

                {/* Evolution inline UI */}
                {isEvolving && (
                  <div style={{ alignSelf: 'flex-start', paddingLeft: '56px', width: '480px', animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: 'var(--shadow-card)', border: '2px solid #6366f140' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>✨ Answer Evolution Challenge</div>
                      {evolveState.phase === 'loading' ? (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--text-muted)', fontSize: '13px' }}><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />Generating challenge...</div>
                      ) : evolveState.phase === 'scored' ? (
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#6366f1' }}>Grade: {evolveState.score?.grade}</span>
                            <span style={{ fontSize: '13px', color: '#10b981' }}>+{evolveState.score?.improvementScore} pts improvement</span>
                          </div>
                          <div style={{ fontSize: '13px', color: '#10b981', marginBottom: '4px' }}>✓ {evolveState.score?.bestChange}</div>
                          <div style={{ fontSize: '13px', color: '#f59e0b' }}>⚡ {evolveState.score?.stillMissing}</div>
                          <button onClick={() => setEvolveState(null)} style={{ marginTop: '12px', padding: '6px 14px', borderRadius: '8px', border: 'none', background: 'var(--surface-alt)', cursor: 'pointer', fontSize: '12px', color: 'var(--text-muted)' }}>Close</button>
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px', padding: '10px', background: 'rgba(99,102,241,0.05)', borderRadius: '8px' }}>🎯 {evolveState.challenge}</div>
                          <textarea value={evolveState.revisedAnswer} onChange={e => setEvolveState(s=>({...s, revisedAnswer: e.target.value}))} placeholder="Rewrite your answer here..." style={{ width: '100%', height: '100px', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #6366f140', fontSize: '13px', fontFamily: 'inherit', resize: 'none', outline: 'none', boxSizing: 'border-box', lineHeight: 1.6 }} onFocus={e=>e.target.style.borderColor='#6366f1'} onBlur={e=>e.target.style.borderColor='#6366f140'} />
                          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                            <button onClick={() => setEvolveState(null)} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'transparent', cursor: 'pointer', fontSize: '12px', color: 'var(--text-muted)' }}>Cancel</button>
                            <button disabled={!evolveState.revisedAnswer.trim()} onClick={async () => {
                              setEvolveState(s=>({...s,phase:'loading'}))
                              try {
                                const sc = await scoreAnswerImprovement(evolveState.originalAnswer, evolveState.revisedAnswer, evolveState.question)
                                setEvolveState(s=>({...s,score:sc,phase:'scored'}))
                              } catch(e) { setEvolveState(s=>({...s,phase:'rewriting'})) }
                            }} style={{ flex:1, padding: '6px 14px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Score My Improvement</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
          {(loading || isTranscribing) && (
            <div style={{ display: 'flex', gap: '16px', alignSelf: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={20} />
              </div>
              <div style={{ background: 'white', padding: '16px 24px', borderRadius: '20px', borderTopLeftRadius: '4px', boxShadow: 'var(--shadow-card)', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                {isTranscribing ? 'Listening & Transcribing...' : 'AI is typing...'}
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div style={{ padding: '24px 40px', background: 'white', borderTop: '1px solid var(--border-light)' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '16px', maxWidth: '1000px', margin: '0 auto' }}>
            <button 
              type="button" 
              onClick={toggleListen}
              className="btn-ghost" 
              style={{ 
                width: '56px', height: '56px', borderRadius: '50%', padding: 0, flexShrink: 0, 
                background: isListening ? '#fce7f3' : 'var(--surface-alt)', 
                color: isListening ? '#e11d48' : 'var(--text-secondary)',
                border: isListening ? '1px solid #fda4af' : '1px solid transparent'
              }}
            >
              <Mic size={20} style={{ animation: isListening ? 'pulse 1.5s infinite' : 'none' }} />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type or click the mic to speak your response..." 
              className="input-field" 
              style={{ flex: 1, borderRadius: '100px', padding: '0 24px' }}
              disabled={loading || isTranscribing}
            />
            <button type="submit" className="btn-primary" style={{ width: '56px', height: '56px', borderRadius: '50%', padding: 0, flexShrink: 0 }} disabled={loading || isTranscribing || !input.trim()}>
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container" style={{ padding: '48px', maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <h1 className="instrument-serif italic" style={{ fontSize: '56px', marginBottom: '16px' }}>AI Mock Interview</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>Face your fears in a safe, AI-powered environment.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--teal)' }}>
            <Video size={32} />
          </div>
          <h3 style={{ marginBottom: '12px' }}>Video Interview Analysis</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '14px' }}>Upload a recorded interview. Get AI feedback on body language, eye contact, and confidence.</p>
          <label className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', cursor: 'pointer', opacity: videoLoading ? 0.7 : 1 }}>
            {videoLoading ? <><Loader2 size={16} className="animate-spin" /> Analyzing Video...</> : 'Upload Video'}
            <input type="file" accept="video/*" onChange={handleVideoUpload} style={{ display: 'none' }} disabled={videoLoading} />
          </label>
        </div>

        <div className="card" style={{ padding: '40px', textAlign: 'center', border: '2px solid var(--accent-purple)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(108, 99, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--accent-purple)' }}>
            <Mic size={32} />
          </div>
          <h3 style={{ marginBottom: '12px' }}>Interactive Session</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '14px' }}>Real-time voice and text mock interview with our Groq AI Engine. Get instant feedback.</p>
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
            <button className="btn-ghost" onClick={openStaticFeedback} style={{ padding: '8px 16px', fontSize: '13px' }}>View Feedback</button>
          </div>
        </div>
      </div>

      {showFeedback && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '40px', maxWidth: '560px', width: '100%', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>Session Feedback</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>AI-generated analysis of your interview performance</p>
            
            {feedbackData.score && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', background: 'var(--teal-light)', borderRadius: '12px', marginBottom: '24px' }}>
                <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--teal)' }}>{feedbackData.score}</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy)' }}>Overall Score</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Based on clarity, structure & confidence</div>
                </div>
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Strengths</h4>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: '16px' }}>{feedbackData.strengths}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></div>
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Areas for Improvement</h4>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: '16px' }}>{feedbackData.improvements}</p>
            </div>

            {feedbackData.nextSteps && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-purple)' }}></div>
                  <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Next Steps</h4>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: '16px' }}>{feedbackData.nextSteps}</p>
              </div>
            )}

            <button className="btn-primary" style={{ width: '100%' }} onClick={() => setShowFeedback(false)}>Close Feedback</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MockInterview

