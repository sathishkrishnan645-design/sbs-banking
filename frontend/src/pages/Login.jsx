import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm]       = useState({ customerId: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { login }  = useAuth()
  const navigate   = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault(); setError(''); setLoading(true)
    await new Promise(r => setTimeout(r, 800)) // simulate API delay
    if (form.customerId === 'CUS001' && form.password === 'password123') {
      login({ token: 'mock-jwt-token', customerId: 'CUS001', fullName: 'Sathish Krishnan' })
      navigate('/')
    } else {
      setError('Invalid Customer ID or password. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-bank-dark flex">
      <div className="hidden lg:flex lg:w-1/2 bg-bank-card border-r border-bank-border flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center">
            <span className="text-black font-bold">SBS</span>
          </div>
          <span className="text-bank-light font-semibold text-lg">Sricharan Banking</span>
        </div>
        <div>
          <div className="text-bank-muted text-xs font-medium tracking-widest uppercase mb-4">Internet Banking</div>
          <h1 className="text-4xl font-light text-bank-light leading-snug mb-4">
            Your finances,<br/>
            <span className="text-bank-accent font-semibold">always in control.</span>
          </h1>
          <p className="text-bank-muted text-sm leading-relaxed max-w-sm">
            Secure 24×7 banking. Transfers, bills, loans — all in one place.
            MAS-compliant and enterprise-grade security.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[['99.9%','Uptime SLA'],['256-bit','SSL Encryption'],['24×7','Support']].map(([v,l])=>(
            <div key={l} className="border border-bank-border rounded-xl p-4">
              <div className="text-bank-accent font-bold">{v}</div>
              <div className="text-bank-muted text-xs mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 gold-gradient rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">SBS</span>
            </div>
            <span className="text-bank-light font-semibold">Sricharan Banking</span>
          </div>
          <h2 className="text-2xl font-semibold text-bank-light mb-1">Welcome back</h2>
          <p className="text-bank-muted text-sm mb-8">Sign in to Internet Banking</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-bank-muted mb-1.5">Customer ID</label>
              <input type="text" required placeholder="e.g. CUS001"
                value={form.customerId}
                onChange={e => setForm(f=>({...f, customerId: e.target.value}))}
                className="w-full bg-bank-card border border-bank-border rounded-lg px-4 py-3 text-sm
                           text-bank-light placeholder-bank-muted/40
                           focus:outline-none focus:border-bank-accent focus:ring-1 focus:ring-bank-accent/20 transition-all"/>
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-xs font-medium text-bank-muted">Password</label>
                <span className="text-xs text-bank-accent cursor-pointer hover:underline">Forgot password?</span>
              </div>
              <input type="password" required placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm(f=>({...f, password: e.target.value}))}
                className="w-full bg-bank-card border border-bank-border rounded-lg px-4 py-3 text-sm
                           text-bank-light placeholder-bank-muted/40
                           focus:outline-none focus:border-bank-accent focus:ring-1 focus:ring-bank-accent/20 transition-all"/>
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-xs">{error}</div>
            )}
            <button type="submit" disabled={loading}
              className="w-full gold-gradient text-black font-semibold py-3 rounded-lg text-sm
                         hover:opacity-90 disabled:opacity-60 transition-all">
              {loading ? 'Signing in...' : 'Sign in to Internet Banking'}
            </button>
          </form>
          <div className="mt-6 p-3 border border-bank-border rounded-lg bg-bank-card/50">
            <div className="text-xs text-bank-muted mb-1 font-medium">Demo credentials</div>
            <div className="text-xs text-bank-light font-mono">ID: CUS001 &nbsp;|&nbsp; Password: password123</div>
          </div>
          <p className="text-center text-bank-muted text-xs mt-6">🔒 Protected by 256-bit SSL encryption</p>
        </div>
      </div>
    </div>
  )
}
