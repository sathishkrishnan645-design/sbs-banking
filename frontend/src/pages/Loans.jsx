import { useState } from 'react'

const ACTIVE_LOANS = [
  { id:'LN001', type:'Home Loan',     amount:2500000, emi:22500, tenure:240, paid:48 },
  { id:'LN002', type:'Personal Loan', amount:500000,  emi:11200, tenure:60,  paid:12 },
]

export default function Loans() {
  const [tab, setTab]         = useState('active')
  const [form, setForm]       = useState({ type:'Personal Loan', amount:'', tenure:'' })
  const [emi, setEmi]         = useState(null)
  const [applied, setApplied] = useState(false)

  function calcEmi() {
    const P=parseFloat(form.amount), n=parseInt(form.tenure), r=10.5/(12*100)
    const e=P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1)
    setEmi(isNaN(e)?null:e.toFixed(2))
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-bank-light mb-1">Loan Management</h1>
      <p className="text-bank-muted text-sm mb-6">Manage your loans and apply for new credit</p>

      <div className="flex gap-2 mb-6">
        {[['active','Active Loans'],['apply','Apply for Loan'],['calculator','EMI Calculator']].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${tab===t ? 'gold-gradient text-black' : 'bg-bank-card border border-bank-border text-bank-muted hover:text-bank-light'}`}>
            {l}
          </button>
        ))}
      </div>

      {tab==='active' && (
        <div className="space-y-4">
          {ACTIVE_LOANS.map(loan=>{
            const pct=Math.round((loan.paid/loan.tenure)*100)
            return (
              <div key={loan.id} className="bg-bank-card border border-bank-border rounded-xl p-5 card-hover">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm font-semibold text-bank-light">{loan.type}</div>
                    <div className="text-xs text-bank-muted mt-0.5">ID: {loan.id}</div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">ACTIVE</span>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div><div className="text-xs text-bank-muted mb-1">Loan Amount</div><div className="text-sm font-semibold text-bank-light">₹{loan.amount.toLocaleString('en-IN')}</div></div>
                  <div><div className="text-xs text-bank-muted mb-1">Monthly EMI</div><div className="text-sm font-semibold text-bank-accent">₹{loan.emi.toLocaleString('en-IN')}</div></div>
                  <div><div className="text-xs text-bank-muted mb-1">Remaining</div><div className="text-sm font-semibold text-bank-light">{loan.tenure-loan.paid} months</div></div>
                </div>
                <div className="text-xs text-bank-muted mb-1.5 flex justify-between"><span>Repayment progress</span><span>{pct}%</span></div>
                <div className="h-1.5 bg-bank-dark rounded-full overflow-hidden">
                  <div className="h-full gold-gradient rounded-full" style={{width:`${pct}%`}}/>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {tab==='apply' && (
        applied ? (
          <div className="bg-bank-card border border-green-500/20 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-xl font-semibold text-bank-light mb-2">Application Submitted!</h2>
            <p className="text-bank-muted text-sm mb-4">Decision within 24 hours via SMS and email.</p>
            <div className="bg-bank-dark rounded-xl p-3 text-xs text-bank-accent font-mono mb-5">APP{Date.now()}</div>
            <button onClick={()=>setApplied(false)} className="gold-gradient text-black font-semibold px-6 py-2.5 rounded-lg text-sm">Apply Another</button>
          </div>
        ) : (
          <div className="bg-bank-card border border-bank-border rounded-xl p-6 space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-medium text-bank-muted mb-1.5">Loan Type</label>
              <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}
                className="w-full bg-bank-dark border border-bank-border rounded-lg px-4 py-3 text-sm text-bank-light focus:outline-none focus:border-bank-accent">
                {['Personal Loan','Home Loan','Vehicle Loan','Education Loan','Business Loan'].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-bank-muted mb-1.5">Amount (₹)</label>
              <input type="number" placeholder="Enter required amount" value={form.amount}
                onChange={e=>setForm(f=>({...f,amount:e.target.value}))}
                className="w-full bg-bank-dark border border-bank-border rounded-lg px-4 py-3 text-sm text-bank-light placeholder-bank-muted/40 focus:outline-none focus:border-bank-accent"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-bank-muted mb-1.5">Tenure (months)</label>
              <input type="number" placeholder="e.g. 60" value={form.tenure}
                onChange={e=>setForm(f=>({...f,tenure:e.target.value}))}
                className="w-full bg-bank-dark border border-bank-border rounded-lg px-4 py-3 text-sm text-bank-light placeholder-bank-muted/40 focus:outline-none focus:border-bank-accent"/>
            </div>
            {form.amount&&form.tenure&&(
              <div className="bg-bank-dark border border-bank-accent/20 rounded-xl p-4">
                <div className="text-xs text-bank-muted mb-1">Estimated EMI @ 10.5% p.a.</div>
                <div className="text-bank-accent font-bold text-xl">
                  ₹{(()=>{const P=parseFloat(form.amount),n=parseInt(form.tenure),r=10.5/(12*100);return(P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1)).toFixed(2)})()}
                  <span className="text-sm font-normal text-bank-muted">/month</span>
                </div>
              </div>
            )}
            <button onClick={()=>setApplied(true)}
              className="w-full gold-gradient text-black font-semibold py-3 rounded-lg text-sm hover:opacity-90">
              Submit Application
            </button>
          </div>
        )
      )}

      {tab==='calculator' && (
        <div className="bg-bank-card border border-bank-border rounded-xl p-6 space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-medium text-bank-muted mb-1.5">Loan Amount (₹)</label>
            <input type="number" placeholder="e.g. 500000" value={form.amount}
              onChange={e=>setForm(f=>({...f,amount:e.target.value}))}
              className="w-full bg-bank-dark border border-bank-border rounded-lg px-4 py-3 text-sm text-bank-light placeholder-bank-muted/40 focus:outline-none focus:border-bank-accent"/>
          </div>
          <div>
            <label className="block text-xs font-medium text-bank-muted mb-1.5">Tenure (months)</label>
            <input type="number" placeholder="e.g. 60" value={form.tenure}
              onChange={e=>setForm(f=>({...f,tenure:e.target.value}))}
              className="w-full bg-bank-dark border border-bank-border rounded-lg px-4 py-3 text-sm text-bank-light placeholder-bank-muted/40 focus:outline-none focus:border-bank-accent"/>
          </div>
          <button onClick={calcEmi} className="w-full gold-gradient text-black font-semibold py-3 rounded-lg text-sm hover:opacity-90">Calculate EMI</button>
          {emi&&(
            <div className="bg-bank-dark border border-bank-accent/20 rounded-xl p-5 text-center">
              <div className="text-xs text-bank-muted mb-2">Monthly EMI @ 10.5% p.a.</div>
              <div className="text-3xl font-bold text-bank-accent mb-2">₹{Number(emi).toLocaleString('en-IN')}</div>
              <div className="text-xs text-bank-muted">
                Total: ₹{(emi*form.tenure).toLocaleString('en-IN',{maximumFractionDigits:0})}
                &nbsp;|&nbsp; Interest: ₹{(emi*form.tenure-form.amount).toLocaleString('en-IN',{maximumFractionDigits:0})}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
