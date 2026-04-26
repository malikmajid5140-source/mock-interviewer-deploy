import React, { useState, useEffect } from 'react'
import { User, Bell, Shield, LogOut, Save, Loader2, CheckCircle2, Camera } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const Settings = ({ navigate, session }) => {
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    target_role: '',
    experience_level: 'Mid',
    industry: '',
    avatar_url: null
  })

  useEffect(() => {
    if (session?.user) fetchProfile()
  }, [session])

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
    
    const localAvatar = localStorage.getItem('user_avatar')
    
    if (data) {
      setProfile({ ...data, avatar_url: localAvatar || data.avatar_url || null })
    } else {
      setProfile(p => ({ ...p, avatar_url: localAvatar || null }))
    }
  }

  const saveProfile = async () => {
    setLoading(true)
    
    if (profile.avatar_url) {
      localStorage.setItem('user_avatar', profile.avatar_url)
    }
    
    const { avatar_url, ...dbProfile } = profile
    
    await supabase.from('profiles').upsert({
      id: session.user.id,
      ...dbProfile
    })
    
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Please choose an image smaller than 2MB")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfile(p => ({ ...p, avatar_url: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('landing')
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
  ]

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 className="instrument-serif italic" style={{ fontSize: '48px', marginBottom: '12px' }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your account preferences and profile.</p>
      </header>

      <div style={{ display: 'flex', gap: '32px' }}>
        {/* Sidebar Tabs */}
        <div style={{ width: '200px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
              borderRadius: '12px', border: 'none', textAlign: 'left', cursor: 'pointer',
              background: activeTab === tab.id ? 'var(--teal-light)' : 'transparent',
              color: activeTab === tab.id ? 'var(--teal)' : 'var(--text-secondary)',
              fontWeight: activeTab === tab.id ? 600 : 400, fontSize: '14px',
              transition: 'all 0.2s ease'
            }}>
              {tab.icon} {tab.label}
            </button>
          ))}
          <button onClick={handleSignOut} style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
            borderRadius: '12px', border: 'none', textAlign: 'left', cursor: 'pointer',
            background: 'transparent', color: 'var(--error)', fontSize: '14px', marginTop: '16px'
          }}>
            <LogOut size={18} /> Sign Out
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1 }}>
          {activeTab === 'profile' && (
            <div className="card" style={{ padding: '32px' }}>
              <h3 style={{ marginBottom: '32px' }}>Profile Information</h3>

              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', padding: '20px', background: 'var(--warm-white)', borderRadius: '16px' }}>
                <label style={{ cursor: 'pointer', position: 'relative' }}>
                  <div style={{ 
                    width: '72px', height: '72px', borderRadius: '50%', 
                    background: profile.avatar_url ? `url(${profile.avatar_url}) center/cover` : 'linear-gradient(135deg, var(--teal), var(--accent-purple))', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '28px', fontWeight: 700 
                  }}>
                    {!profile.avatar_url && (profile.first_name?.[0] || session?.user?.email?.[0] || '?').toUpperCase()}
                  </div>
                  <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: 'white', color: 'var(--teal)', padding: '6px', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <Camera size={14} />
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </label>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '18px' }}>{profile.first_name || session?.user?.email?.split('@')[0]}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{session?.user?.email}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label className="input-label">First Name</label>
                  <input className="input-field" value={profile.first_name} onChange={e => setProfile(p => ({ ...p, first_name: e.target.value }))} placeholder="First name" />
                </div>
                <div>
                  <label className="input-label">Last Name</label>
                  <input className="input-field" value={profile.last_name} onChange={e => setProfile(p => ({ ...p, last_name: e.target.value }))} placeholder="Last name" />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label className="input-label">Target Role</label>
                <input className="input-field" value={profile.target_role} onChange={e => setProfile(p => ({ ...p, target_role: e.target.value }))} placeholder="e.g. Software Engineer" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                <div>
                  <label className="input-label">Experience Level</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['Entry', 'Mid', 'Senior'].map(l => (
                      <button key={l} onClick={() => setProfile(p => ({ ...p, experience_level: l }))} style={{ flex: 1, padding: '10px 0', borderRadius: '10px', border: '1.5px solid', borderColor: profile.experience_level === l ? 'var(--teal)' : 'var(--border-light)', background: profile.experience_level === l ? 'var(--teal)' : 'white', color: profile.experience_level === l ? 'white' : 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>{l}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="input-label">Industry</label>
                  <input className="input-field" value={profile.industry} onChange={e => setProfile(p => ({ ...p, industry: e.target.value }))} placeholder="e.g. Fintech, Healthcare" />
                </div>
              </div>

              <button className="btn-primary" onClick={saveProfile} disabled={loading} style={{ gap: '8px' }}>
                {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
                {loading ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
              </button>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card" style={{ padding: '32px' }}>
              <h3 style={{ marginBottom: '32px' }}>Notification Preferences</h3>
              {[
                { label: 'Daily practice reminders', desc: 'Get reminded to practice every day' },
                { label: 'Weekly progress report', desc: 'Summary of your weekly performance' },
                { label: 'New question alerts', desc: 'Be notified when new questions are added' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>{item.label}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{item.desc}</div>
                  </div>
                  <div style={{ width: '44px', height: '24px', borderRadius: '12px', background: 'var(--teal)', cursor: 'pointer', position: 'relative' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'white', position: 'absolute', right: '2px', top: '2px' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card" style={{ padding: '32px' }}>
              <h3 style={{ marginBottom: '32px' }}>Security Settings</h3>
              <div style={{ marginBottom: '24px', padding: '20px', background: 'var(--teal-light)', borderRadius: '14px', borderLeft: '4px solid var(--teal)' }}>
                <div style={{ fontWeight: 600, color: 'var(--teal)', marginBottom: '4px' }}>Account Secured</div>
                <div style={{ fontSize: '14px', color: '#0f7d6a' }}>Signed in as <strong>{session?.user?.email}</strong></div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label className="input-label">New Password</label>
                <input className="input-field" type="password" placeholder="Enter new password" />
              </div>
              <div style={{ marginBottom: '32px' }}>
                <label className="input-label">Confirm Password</label>
                <input className="input-field" type="password" placeholder="Confirm new password" />
              </div>
              <button className="btn-primary" onClick={() => alert('Password update requires Supabase email verification.')}>Update Password</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings

