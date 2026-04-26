import React, { useState } from 'react'
import { CreditCard, Shield, CheckCircle, ArrowRight, Zap, Globe, Lock, ShieldCheck, ChevronRight } from 'lucide-react'

const Checkout = ({ navigate }) => {
  const [selectedPlan, setSelectedPlan] = useState('pro')

  const plans = [
    {
      id: 'free',
      name: 'Starter',
      price: '$0',
      period: 'forever',
      features: ['10 Mock Interviews / month', 'Basic Question Bank', 'Community Access'],
      accent: 'var(--text-muted)'
    },
    {
      id: 'pro',
      name: 'Pro Forge',
      price: '$19',
      period: 'per month',
      features: ['Unlimited Mock Interviews', 'AI Biometric HUD', 'Resume Intelligence', 'Salary Negotiation Dojo', 'Custom Study Plans'],
      accent: 'var(--teal)',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Elite',
      price: '$49',
      period: 'per month',
      features: ['Everything in Pro', 'Human-in-the-loop Review', '1-on-1 Strategy Call', 'Referral Network Access'],
      accent: 'var(--accent-purple)'
    }
  ]

  return (
    <div className="animate-fade-up" style={{ padding: '60px 5vw', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '64px' }}>
        <div className="badge badge-teal" style={{ marginBottom: '16px' }}>SECURE CHECKOUT</div>
        <h1 style={{ fontSize: '48px', fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.02em' }}>Upgrade to <span style={{ color: 'var(--teal)' }}>Pro</span></h1>
        <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginTop: '8px' }}>Unlock the full power of AI-driven interview preparation.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '64px' }}>
        {plans.map((plan) => (
          <div 
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className="card" 
            style={{ 
              padding: '32px', 
              cursor: 'pointer',
              borderColor: selectedPlan === plan.id ? plan.accent : 'var(--border-light)',
              borderWidth: selectedPlan === plan.id ? '2px' : '1.5px',
              position: 'relative',
              background: selectedPlan === plan.id ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.5)',
              transform: selectedPlan === plan.id ? 'scale(1.02)' : 'scale(1)'
            }}
          >
            {plan.popular && (
              <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--navy)', color: 'white', fontSize: '10px', fontWeight: 800, padding: '4px 12px', borderRadius: '100px', letterSpacing: '0.1em' }}>MOST POPULAR</div>
            )}
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>{plan.name}</h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
              <span style={{ fontSize: '36px', fontWeight: 900 }}>{plan.price}</span>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/{plan.period}</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {plan.features.map((f, i) => (
                <li key={i} style={{ fontSize: '14px', display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--text-secondary)' }}>
                  <CheckCircle size={14} color={plan.accent} /> {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
        <div className="card" style={{ padding: '40px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CreditCard color="var(--teal)" /> Payment Details
          </h3>
          <div style={{ display: 'grid', gap: '24px' }}>
            <div>
              <label className="input-label">Cardholder Name</label>
              <input type="text" className="input-field" placeholder="John Doe" />
            </div>
            <div>
              <label className="input-label">Card Number</label>
              <div style={{ position: 'relative' }}>
                <input type="text" className="input-field" placeholder="0000 0000 0000 0000" />
                <Lock size={16} style={{ position: 'absolute', right: '16px', top: '18px', color: 'var(--text-muted)' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <label className="input-label">Expiry Date</label>
                <input type="text" className="input-field" placeholder="MM/YY" />
              </div>
              <div>
                <label className="input-label">CVC</label>
                <input type="text" className="input-field" placeholder="123" />
              </div>
            </div>
          </div>
          <button className="btn-primary" style={{ width: '100%', marginTop: '40px', height: '56px', fontSize: '18px' }} onClick={() => navigate('dashboard')}>
            Confirm Purchase <ArrowRight size={20} />
          </button>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '32px', opacity: 0.5 }}>
             <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" height="12" alt="Visa" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" height="20" alt="Mastercard" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" height="15" alt="Paypal" />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card" style={{ padding: '32px', background: 'var(--surface-alt)' }}>
            <h4 style={{ fontWeight: 800, marginBottom: '16px' }}>Order Summary</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
              <span>{plans.find(p => p.id === selectedPlan).name} Plan</span>
              <span>{plans.find(p => p.id === selectedPlan).price}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '14px' }}>
              <span>Platform Fee</span>
              <span>$0.00</span>
            </div>
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
              <span>Total</span>
              <span style={{ fontSize: '20px', color: 'var(--teal)' }}>{plans.find(p => p.id === selectedPlan).price}</span>
            </div>
          </div>
          <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
            <ShieldCheck size={32} color="var(--success)" style={{ margin: '0 auto 16px' }} />
            <h4 style={{ fontWeight: 800, marginBottom: '8px' }}>Money Back Guarantee</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Try Interview Forge Pro risk-free for 14 days. If you're not hired or satisfied, we'll refund your full payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

