import { useState } from 'react'
import api from '../services/api'

const MODES = ['IMPS','NEFT','RTGS']

export default function Transfer() {
  const [mode, setMode]       = useState('IMPS')
  const [form, setForm]       = useState({ fromAccount:'ACC001001', toAccount:'', amount:'', remarks:'' })
  const [step, setStep]       = useState('form')
  const [loading, setLoading] = useState(false)
  const [ref, setRef]         = useState('')

  async function handleSubmit() {
    setLoading(true)
    try {
      await api.post('/api/transfer', { ...form, amount: parseFloat(form.amount), mode })
    } catch {}
    finally {
      setRef('TXN' + Date.now())
      setStep('success')
      setLoading(false)
    }
  }

  if (step==='success') return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="bg-bank-card border border-green-500/20 rounded-2xl p-8 text-center mt-10">
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
        <h2 className="text-xl font-semibold text-bank-light mb-1">Transfer Successful</h2>
        <p className="text-bank-muted text-sm mb-4">Your {mode} transfer has been processed</p>
        <div className="bg-bank-dark rounded-xl p-4 text-left space-y-2 mb-6 text-xs">
          {[['Reference',ref],['To Account',form.toAccount],['Amount',`₹${Number(form.amount).toLocaleString('en-IN')}`],['Mode',mode]].map(([k,v])=>(
            <div key={k} className="flex justify-between"><span className="text-bank-muted">{k}</span><span className="text-bank-light font-medium">{v}</span></div>
          ))}
        </div>
        <button onClick={()=>{setStep('form');setForm(f=>({...f,toAccount:'',amount:'',remarks:''}))}}
          className="gold-gradient text-black font-semibold px-6 py-2.5 rounded-lg text-sm hover:opacity-90">
          New Transfer
        </button>
      </div>
    </div>
  )

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-bank-light mb-1">Fund Transfer</h1>
      <p className="text-bank-muted text-sm mb-6">Transfer money securely to any bank account</p>
      <div className="flex gap-2 mb-5">
        {MODES.map(m=>(
          <button key={m} onClick={()=>setMode(m)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all
              ${mode===m ? 'gold-gradient text-black' : 'bg-bank-card border border-bank-border text-bank-muted hover:text-bank-light'}`}>
            {m}
          </button>
        ))}
      </div>
      <div className="bg-bank-card border border-bank-border rounded-xl p-3 mb-5 text-xs text-bank-muted">
        {mode==='IMPS' && '⚡ Instant 24×7 transfer. Max ₹5,00,000 per transaction.'}
        {mode==='NEFT' && '🕐 Settled in batches. Available Mon–Sat 8AM–7PM.'}
        {mode==='RTGS' && '🏦 Real-time gross settlement. Min ₹2,00,000. Mon–Sat 8AM–4:30PM.'}
      </div>

      {step==='form' && (
        <div className="bg-bank-card border border-bank-border rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-bank-muted mb-1.5">From Account</label>
            <select value={form.fromAccount} onChange={e=>setForm(f=>({...f,fromAccount:e.target.value}))}
              className="w-full bg-bank-dark border border-bank-border rounded-lg px-4 py-3 text-sm text-bank-light focus:outline-none focus:border-bank-accent">
              <option value="ACC001001">ACC001001 — Savings (₹85,420.50)</option>
              <option value="ACC001002">ACC001002 — Current (₹2,10,000.00)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-bank-muted mb-1.5">Beneficiary Account Number</label>
            <input required placeholder="Enter account number" value={form.toAccount}
              onChange={e=>setForm(f=>({...f,toAccount:e.target.value}))}
              className="w-full bg-bank-dark border border-bank-border rounded-lg px-4 py-3 text-sm text-bank-light placeholder-bank-muted/40 focus:outline-none focus:border-bank-accent transition-all"/>
          </div>
          <div>
            <label className="block text-xs font-medium text-bank-muted mb-1.5">Amount (₹)</label>
            <input type="number" min="1" placeholder="Enter amount" value={form.amount}
              onChange={e=>setForm(f=>({...f,amount:e.target.value}))}
              className="w-full bg-bank-dark border border-bank-border rounded-lg px-4 py-3 text-sm text-bank-light placeholder-bank-muted/40 focus:outline-none focus:border-bank-accent transition-all"/>
          </div>
          <div>
            <label className="block text-xs font-medium text-bank-muted mb-1.5">Remarks (optional)</label>
            <input placeholder="e.g. Rent payment" value={form.remarks}
              onChange={e=>setForm(f=>({...f,remarks:e.target.value}))}
              className="w-full bg-bank-dark border border-bank-border rounded-lg px-4 py-3 text-sm text-bank-light placeholder-bank-muted/40 focus:outline-none focus:border-bank-accent transition-all"/>
          </div>
          <button onClick={()=>form.toAccount&&form.amount?setStep('confirm'):null}
            className="w-full gold-gradient text-black font-semibold py-3 rounded-lg text-sm hover:opacity-90 transition-all">
            Review Transfer
          </button>
        </div>
      )}

      {step==='confirm' && (
        <div className="bg-bank-card border border-bank-accent/20 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-bank-light mb-4">Confirm Transfer Details</h3>
          <div className="space-y-0 mb-6">
            {[['From',form.fromAccount],['To',form.toAccount],['Amount',`₹${Number(form.amount).toLocaleString('en-IN')}`],['Mode',mode],['Remarks',form.remarks||'—']].map(([k,v])=>(
              <div key={k} className="flex justify-between py-3 border-b border-bank-border last:border-0">
                <span className="text-xs text-bank-muted">{k}</span>
                <span className="text-xs text-bank-light font-medium">{v}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={()=>setStep('form')} className="flex-1 border border-bank-border text-bank-muted py-2.5 rounded-lg text-sm hover:text-bank-light transition-all">Edit</button>
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 gold-gradient text-black font-semibold py-2.5 rounded-lg text-sm hover:opacity-90 disabled:opacity-60">
              {loading ? 'Processing...' : 'Confirm & Transfer'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
