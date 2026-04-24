import { useState } from 'react'

const CATEGORIES = [
  { id:'electricity', icon:'⚡', label:'Electricity', providers:['TNEB','BESCOM','MSEDCL','TPDDL'] },
  { id:'water',       icon:'💧', label:'Water',       providers:['Chennai Metro Water','BWSSB','Delhi Jal Board'] },
  { id:'mobile',      icon:'📱', label:'Mobile',      providers:['Jio','Airtel','Vi','BSNL'] },
  { id:'dth',         icon:'📡', label:'DTH',         providers:['Tata Play','Airtel DTH','Dish TV','Sun Direct'] },
  { id:'broadband',   icon:'🌐', label:'Broadband',   providers:['JioFiber','Airtel Xstream','ACT Fibernet'] },
]

export default function Bills() {
  const [cat, setCat]   = useState('electricity')
  const [form, setForm] = useState({ provider:'', consumerId:'', amount:'' })
  const [step, setStep] = useState('form')
  const [ref, setRef]   = useState('')
  const current         = CATEGORIES.find(c=>c.id===cat)

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-bank-light mb-1">Bill Payments</h1>
      <p className="text-bank-muted text-sm mb-6">Pay utility bills and recharges instantly</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(c=>(
          <button key={c.id} onClick={()=>{setCat(c.id);setStep('form');setForm({provider:'',consumerId:'',amount:''})}}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all
              ${cat===c.id ? 'gold-gradient text-black font-medium' : 'bg-bank-card border border-bank-border text-bank-muted hover:text-bank-light'}`}>
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {step==='success' ? (
        <div className="bg-bank-card border border-green-500/20 rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">✓</div>
          <h2 className="text-xl font-semibold text-bank-light mb-1">Payment Successful!</h2>
          <p className="text-bank-muted text-sm mb-5">Your bill has been paid successfully</p>
          <div className="bg-bank-dark rounded-xl p-4 text-left space-y-2 mb-5 text-xs">
            {[['Reference',ref],['Provider',form.provider],['Consumer ID',form.consumerId],['Amount Paid',`₹${Number(form.amount).toLocaleString('en-IN')}`]].map(([k,v])=>(
              <div key={k} className="flex justify-between">
                <span className="text-bank-muted">{k}</span>
                <span className={`font-medium ${k==='Amount Paid'?'text-green-400':'text-bank-light'}`}>{v}</span>
              </div>
            ))}
          </div>
          <button onClick={()=>setStep('form')} className="gold-gradient text-black font-semibold px-6 py-2.5 rounded-lg text-sm">Pay Another Bill</button>
        </div>
      ) : (
        <div className="bg-bank-card border border-bank-border rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-bank-muted mb-1.5">Select Provider</label>
            <select required value={form.provider} onChange={e=>setForm(f=>({...f,provider:e.target.value}))}
              className="w-full bg-bank-dark border border-bank-border rounded-lg px-4 py-3 text-sm text-bank-light focus:outline-none focus:border-bank-accent">
              <option value="">Choose {current.label} provider</option>
              {current.providers.map(p=><option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-bank-muted mb-1.5">Consumer / Account ID</label>
            <input placeholder="Enter your consumer number" value={form.consumerId}
              onChange={e=>setForm(f=>({...f,consumerId:e.target.value}))}
              className="w-full bg-bank-dark border border-bank-border rounded-lg px-4 py-3 text-sm text-bank-light placeholder-bank-muted/40 focus:outline-none focus:border-bank-accent"/>
          </div>
          <div>
            <label className="block text-xs font-medium text-bank-muted mb-1.5">Amount (₹)</label>
            <input type="number" min="1" placeholder="Enter amount" value={form.amount}
              onChange={e=>setForm(f=>({...f,amount:e.target.value}))}
              className="w-full bg-bank-dark border border-bank-border rounded-lg px-4 py-3 text-sm text-bank-light placeholder-bank-muted/40 focus:outline-none focus:border-bank-accent"/>
          </div>
          <button
            onClick={()=>{if(form.provider&&form.consumerId&&form.amount){setRef('BILL'+Date.now());setStep('success')}}}
            className="w-full gold-gradient text-black font-semibold py-3 rounded-lg text-sm hover:opacity-90 transition-all">
            Pay {form.amount ? `₹${Number(form.amount).toLocaleString('en-IN')}` : 'Bill'}
          </button>
        </div>
      )}
    </div>
  )
}
