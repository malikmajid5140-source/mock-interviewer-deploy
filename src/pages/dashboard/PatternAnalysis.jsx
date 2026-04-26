import React, { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, AlertCircle, CheckCircle2, Loader2, Calendar, Target } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const PatternAnalysis = ({ session }) => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [sessions, setSessions] = useState([])

  useEffect(() => {
    fetchPatterns()
  }, [])

  const fetchPatterns = async () => {
    setLoading(true)
    try {
      // In a real app, we query Supabase. For demo/local, we also check localStorage
      const { data: dbSessions } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false })

      const localSessions = JSON.parse(localStorage.getItem('local_sessions') || '[]')
      const allSessions = [...(dbSessions || []), ...localSessions]
      setSessions(allSessions)

      // Count weakness tags
      const tagCounts = {}
      allSessions.forEach(s => {
        const tags = s.weakness_tags || []
        tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1
        })
      })

      const sortedTags = Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)

      setStats({
        topWeaknesses: sortedTags,
        totalSessions: allSessions.length,
        avgImprovement: 12 // Placeholder for demo
      })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--teal)' }}>
      <Loader2 className="animate-spin" />
    </div>
  )

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Pattern X-Ray</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Identifying recurring weaknesses across your interview history</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '40px' }}>
        <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--navy)' }}>{stats.totalSessions}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total Sessions</div>
        </div>
        <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981' }}>+{stats.avgImprovement}%</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Avg. Improvement</div>
        </div>
        <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#6366f1' }}>{stats.topWeaknesses[0]?.[0] || 'N/A'}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Primary Focus</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
        <div className="card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <TrendingUp size={20} color="var(--teal)" />
            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Weakness Distribution</h3>
          </div>
          {stats.topWeaknesses.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {stats.topWeaknesses.map(([tag, count], i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                    <span style={{ fontWeight: 500 }}>{tag}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{count} sessions</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--surface-alt)', borderRadius: '100px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(count / stats.totalSessions) * 100}%`, background: 'var(--teal)', borderRadius: '100px' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Practice more to generate pattern data.</p>
          )}
        </div>

        <div className="card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <AlertCircle size={20} color="#f59e0b" />
            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Coach's Verdict</h3>
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {stats.topWeaknesses.length > 0 ? (
              <>
                Your performance data suggests that <strong>{stats.topWeaknesses[0][0]}</strong> is your most frequent hurdle. 
                Focus your next 3 sessions specifically on this area to break the pattern.
              </>
            ) : (
              "Complete at least 3 mock interviews to unlock deep pattern analysis and personalized coaching advice."
            )}
          </div>
          <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(99,102,241,0.06)', borderRadius: '12px', fontSize: '13px' }}>
            <div style={{ fontWeight: 600, color: '#6366f1', marginBottom: '4px' }}>Pro Tip</div>
            <div style={{ color: 'var(--text-muted)' }}>Use the "Answer Evolution" feature in Mock Interview to specifically target your identified weaknesses.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatternAnalysis

