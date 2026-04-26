import React, { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Camera } from 'lucide-react'

const Profile = ({ navigate }) => {
  const [formData, setFormData] = useState({
    targetRole: '',
    experienceLevel: 'Mid',
    industry: 'Technology',
    interviewDate: ''
  })
  const [avatar, setAvatar] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert("Please choose an image smaller than 2MB")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleComplete = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (avatar) {
        localStorage.setItem('user_avatar', avatar)
      }
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { error } = await supabase.from('profiles').upsert({
          id: user.id,
          target_role: formData.targetRole,
          experience_level: formData.experienceLevel,
          industry: formData.industry,
          interview_date: formData.interviewDate
        })
        if (error) throw error
      }
      navigate('dashboard')
    } catch (err) {
      console.error(err)
      // Navigate anyway for demo
      navigate('dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-page" style={{ height: '100vh', display: 'flex' }}>
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
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>✓</div>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Verify Email</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 600 }}>3</div>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Set Up Profile</span>
          </div>
        </div>

        <h2 className="instrument-serif italic" style={{ color: 'white', fontSize: '40px', lineHeight: 1.2, marginBottom: '24px' }}>
          "Almost there. Help us personalize your prep."
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)' }}>Takes 30 seconds. Makes everything smarter.</p>
      </div>

      {/* Right Panel */}
      <div className="right-panel" style={{ flex: '1', background: 'white', padding: '64px', display: 'flex', alignItems: 'center', overflowY: 'auto' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%', padding: '40px 0' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>Set Up Your Profile</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
            You can update this anytime in settings.
          </p>

          <form onSubmit={handleComplete}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
              <label style={{ cursor: 'pointer', position: 'relative' }}>
                <div style={{ 
                  width: '100px', 
                  height: '100px', 
                  borderRadius: '50%', 
                  background: avatar ? `url(${avatar}) center/cover` : 'var(--surface-alt)',
                  border: '2px dashed var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  transition: 'all 0.2s ease'
                }}>
                  {!avatar && <Camera size={32} />}
                </div>
                <div style={{ 
                  position: 'absolute', 
                  bottom: '2px', 
                  right: '2px', 
                  background: 'var(--teal)', 
                  color: 'white', 
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%', 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(24,184,154,0.4)',
                  border: '3px solid white'
                }}>
                  <Camera size={14} />
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </label>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label className="input-label">Target Role</label>
              <input type="text" name="targetRole" className="input-field" placeholder="e.g. Product Manager, ML Engineer" required onChange={handleChange} />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label className="input-label">Experience Level</label>
              <div style={{ display: 'flex', gap: '8px', background: 'var(--surface-alt)', padding: '4px', borderRadius: '12px' }}>
                {['Entry', 'Mid', 'Senior', 'Expert'].map(level => (
                  <button 
                    key={level}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, experienceLevel: level }))}
                    style={{ 
                      flex: 1, 
                      padding: '8px', 
                      borderRadius: '8px', 
                      border: 'none', 
                      fontSize: '13px', 
                      fontWeight: 500,
                      cursor: 'pointer',
                      background: formData.experienceLevel === level ? 'white' : 'transparent',
                      color: formData.experienceLevel === level ? 'var(--navy)' : 'var(--text-secondary)',
                      boxShadow: formData.experienceLevel === level ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                    }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label className="input-label">Industry</label>
              <select name="industry" className="input-field" style={{ background: 'white' }} onChange={handleChange}>
                {['Technology', 'Finance', 'Healthcare', 'Consulting', 'Marketing', 'Legal', 'Education', 'Other'].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <label className="input-label">Next Interview Date</label>
              <input type="date" name="interviewDate" className="input-field" onChange={handleChange} />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', height: '48px', marginBottom: '16px' }} disabled={loading}>
              {loading ? 'Saving...' : 'Complete Setup'}
            </button>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => navigate('dashboard')}>Skip for now, I'll do this later</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile

