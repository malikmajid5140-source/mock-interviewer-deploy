import { ArrowRight, CheckCircle, Eye, EyeOff } from 'lucide-react'
import FloatingBackground from '../../components/FloatingBackground'

const SignUp = ({ navigate }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    smsOptIn: false,
    terms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    if (!formData.terms) {
      setError("You must agree to the Terms of Service.")
      return
    }
    
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone
          }
        }
      })

      if (error) throw error

      if (data) {
        navigate('verify')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-page" style={{ minHeight: '100vh', display: 'flex', position: 'relative', background: 'var(--warm-white)' }}>
      <FloatingBackground />
      {/* Left Panel */}
      <div className="left-panel" style={{ 
        width: '45%',
        background: 'rgba(10, 15, 29, 0.95)', 
        backdropFilter: 'blur(10px)',
        color: 'white', 
        padding: '80px 60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 1,
        overflow: 'hidden',
        borderRight: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div>
          <div className="logo" style={{ fontSize: '24px', fontWeight: 600, marginBottom: '64px' }}>Interview Forge</div>
          
          <div className="progress-steps" style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 600 }}>1</div>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>Create Account</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', opacity: 0.5 }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>2</div>
              <span style={{ fontSize: '14px' }}>Verify Email</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.5 }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>3</div>
              <span style={{ fontSize: '14px' }}>Set Up Profile</span>
            </div>
          </div>

          <h2 className="instrument-serif italic" style={{ color: 'white', fontSize: '40px', lineHeight: 1.2, marginBottom: '24px' }}>
            "Your journey to the perfect job starts here."
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '48px' }}>Join candidates preparing smarter every day.</p>
          
          <div className="avatar-strip" style={{ overflow: 'hidden', position: 'relative', marginBottom: '48px', padding: '24px 0' }}>
             <div style={{ display: 'flex', gap: '20px', animation: 'scrollLeft 40s linear infinite' }}>
                {[
                  { name: 'Arjun', role: 'SWE', color: '#6c63ff' },
                  { name: 'Sarah', role: 'PM', color: '#18b89a' },
                  { name: 'Kenji', role: 'ML', color: '#ff6b6b' },
                  { name: 'Elena', role: 'UX', color: '#f59e0b' },
                  { name: 'Omar', role: 'DS', color: '#6c63ff' },
                  { name: 'Lia', role: 'SWE', color: '#18b89a' },
                  { name: 'Marcus', role: 'PM', color: '#ff6b6b' },
                  { name: 'Sofia', role: 'UX', color: '#f59e0b' },
                  { name: 'Chen', role: 'ML', color: '#6c63ff' },
                  { name: 'Zara', role: 'DS', color: '#18b89a' }
                ].map((candidate, i) => (
                  <div key={i} className="candidate-card">
                    <div className="candidate-avatar" style={{ 
                      background: `linear-gradient(135deg, ${candidate.color}, ${candidate.color}88)`,
                      boxShadow: `0 8px 16px ${candidate.color}33`
                    }}>
                      {candidate.name[0]}
                    </div>
                    <div className="candidate-role">
                      {candidate.role}
                    </div>
                    <div className="candidate-status" />
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="trust-signals">
          <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={14} style={{ color: 'var(--teal)' }} /> Free forever plan</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={14} style={{ color: 'var(--teal)' }} /> No credit card</div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="right-panel" style={{ 
        width: '55%', 
        background: 'rgba(255, 255, 255, 0.75)', 
        backdropFilter: 'blur(20px)',
        padding: '120px 5vw 80px', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowY: 'auto',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '480px', width: '100%' }}>
          <h2 style={{ fontSize: '42px', fontWeight: 800, marginBottom: '12px', color: 'var(--navy)', letterSpacing: '-0.02em' }}>Create Account</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '15px' }}>
            Already prepping? <span style={{ color: 'var(--teal)', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('signin')}>Sign in instead.</span>
          </p>

          {error && <div style={{ background: '#fef2f2', border: '1.5px solid #ef4444', color: '#ef4444', padding: '12px', borderRadius: '10px', marginBottom: '24px', fontSize: '14px' }}>{error}</div>}

          <form onSubmit={handleSignUp}>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label className="input-label">First Name</label>
                <input type="text" name="firstName" className="input-field" required onChange={handleChange} />
              </div>
              <div style={{ flex: 1 }}>
                <label className="input-label">Last Name</label>
                <input type="text" name="lastName" className="input-field" required onChange={handleChange} />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="input-label">Email</label>
              <input type="email" name="email" className="input-field" required onChange={handleChange} />
            </div>

            <div style={{ marginBottom: '20px', position: 'relative' }}>
              <label className="input-label">Password</label>
              <input 
                type={showPassword ? 'text' : 'password'} 
                name="password" 
                className="input-field" 
                required 
                onChange={handleChange} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '16px', top: '38px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label className="input-label">Phone Number (Optional)</label>
              <input type="tel" name="phone" className="input-field" onChange={handleChange} />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '12px' }}>
                <input type="checkbox" name="smsOptIn" onChange={handleChange} /> SMS updates opt-in
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input type="checkbox" name="terms" required onChange={handleChange} /> I agree to the Terms of Service & Privacy Policy
              </label>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', height: '48px', marginBottom: '24px' }} disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }} />
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }} />
          </div>

          <button className="btn-ghost" style={{ width: '100%', gap: '12px' }} onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" alt="Google" />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  )
}

export default SignUp

