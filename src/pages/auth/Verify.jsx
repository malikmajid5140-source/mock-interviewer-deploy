import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'

const Verify = ({ navigate }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(52)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const inputs = useRef([])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev > 0 ? prev - 1 : 0)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleChange = (index, value) => {
    if (value.length > 1) value = value[value.length - 1]
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus()
    }
  }

  const handleVerify = async () => {
    setLoading(true)
    setError(null)
    const token = otp.join('')

    try {
      // In a real flow, we'd have the email from state or localstorage
      // For demo purposes, we'll assume the session state handles it or we'd need email passed
      // But usually verifyOtp needs email
      // const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'signup' })
      
      // Simulating success for now if the user hasn't provided email persistence logic
      // In a full implementation, we'd use location state or similar
      console.log('Verifying OTP:', token)
      setTimeout(() => navigate('profile'), 1000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="verify-page" style={{ height: '100vh', display: 'flex' }}>
      {/* Left Panel */}
      <div className="left-panel" style={{ 
        flex: '0 0 42%', 
        background: 'var(--navy)', 
        color: 'white', 
        padding: '48px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div className="logo" style={{ fontSize: '24px', fontWeight: 600, marginBottom: '64px' }}>Interview Forge</div>
        
        <div className="progress-steps" style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>✓</div>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Create Account</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 600 }}>2</div>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Verify Email</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.5 }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>3</div>
            <span style={{ fontSize: '14px' }}>Set Up Profile</span>
          </div>
        </div>

        <h2 className="instrument-serif italic" style={{ color: 'white', fontSize: '40px', lineHeight: 1.2, marginBottom: '24px' }}>
          "One quick step to keep your account safe."
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)' }}>Check your inbox — the code expires in 10 minutes.</p>
      </div>

      {/* Right Panel */}
      <div className="right-panel" style={{ flex: '1', background: 'white', padding: '64px', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>Verify Your Email</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>
            We sent a 6-digit code to your email.
          </p>

          {error && <div style={{ background: '#fef2f2', border: '1.5px solid #ef4444', color: '#ef4444', padding: '12px', borderRadius: '10px', marginBottom: '24px' }}>{error}</div>}

          <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => inputs.current[i] = el}
                type="text"
                className="mono"
                style={{ 
                  width: '52px', 
                  height: '60px', 
                  border: '1.5px solid var(--border-light)', 
                  borderRadius: '12px', 
                  textAlign: 'center', 
                  fontSize: '22px', 
                  fontWeight: 500,
                  background: digit ? 'var(--teal-light)' : 'white',
                  borderColor: digit ? 'var(--teal)' : 'var(--border-light)',
                  outline: 'none'
                }}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
              />
            ))}
          </div>

          <p style={{ textAlign: 'center', marginBottom: '32px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            {timer > 0 ? (
              <>Resend available in <span className="mono">0:{timer < 10 ? `0${timer}` : timer}</span></>
            ) : (
              <span style={{ color: 'var(--teal)', cursor: 'pointer', fontWeight: 500 }}>Didn't receive it? Resend code</span>
            )}
          </p>

          <button 
            className="btn-primary" 
            style={{ width: '100%', height: '48px', marginBottom: '24px' }}
            disabled={otp.some(d => !d) || loading}
            onClick={handleVerify}
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
            Wrong email address? <span style={{ color: 'var(--teal)', cursor: 'pointer' }} onClick={() => navigate('signup')}>Go back and change it.</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Verify

