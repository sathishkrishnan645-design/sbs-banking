import { useState } from 'react'

const ALL = [
  { id:1, type:'CREDIT', amount:25000, description:'Salary credit — April 2026',        date:'2026-04-20', ref:'TXN001' },
  { id:2, type:'DEBIT',  amount:4500,  description:'NEFT transfer to ACC002001',         date:'2026-04-19', ref:'TXN002' },
  { id:3, type:'DEBIT',  amount:1200,  description:'Bill payment — Electricity (TNEB)',  date:'2026-04-18', ref:'TXN003' },
  { id:4, type:'CREDIT', amount:5000,  description:'IMPS received from Kumar R',         date:'2026-04-17', ref:'TXN004' },
  { id:5, type:'DEBIT',  amount:800,   description:'Mobile recharge — Jio 84 days',      date:'2026-04-16', ref:'TXN005' },
  { id:6, type:'DEBIT',  amount:2500,  description:'Amazon Pay — Online shopping',       date:'2026-04-15', ref:'TXN006' },
  { id:7, type:'CREDIT', amount:12000, description:'Freelance payment — Project SBS',    date:'2026-04-14', ref:'TXN007' },
  { id:8, type:'DEBIT',  amount:600,   description:'DTH recharge — Tata Play',           date:'2026-04-13', ref:'TXN008' },
]

export default function Transactions() {
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  const filtered = ALL
    .filter(t => filter==='ALL' || t.type===filter)
    .filter(t => t.description.toLowerCase().includes(search.toLowerCase()))

  const credits = ALL.filter(t=>t.type==='CREDIT').reduce((s,t)=>s+t.amount,0)
  const debits  = ALL.filter(t=>t.type==='DEBIT').reduce((s,t)=>s+t.amount,0)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-bank-light mb-1">Transaction History</h1>
      <p className="text-bank-muted text-sm mb-6">ACC001001 — Savings Account</p>

      <div className="flex flex-wrap gap-3 mb-5">
        <input placeholder="Search transactions..." value={search}
          onChange={e=>setSearch(e.target.value)}
          className="flex-1 min-w-48 bg-bank-card border border-bank-border rounded-lg px-4 py-2 text-sm text-bank-light placeholder-bank-muted/40 focus:outline-none focus:border-bank-accent"/>
        {['ALL','CREDIT','DEBIT'].map(f=>(
          <button key={f} onClick={()=>setFilter(f)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all
              ${filter===f ? 'gold-gradient text-black' : 'bg-bank-card border border-bank-border text-bank-muted hover:text-bank-light'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="bg-bank-card border border-bank-border rounded-xl overflow-hidden mb-4">
        <table className="w-full">
          <thead>
            <tr className="border-b border-bank-border">
              {['Date','Reference','Description','Type','Amount'].map(h=>(
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-bank-muted uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-bank-border">
            {filtered.map(t=>(
              <tr key={t.id} className="hover:bg-white/[0.02] transition-all">
                <td className="px-4 py-3 text-xs text-bank-muted whitespace-nowrap">{t.date}</td>
                <td className="px-4 py-3 text-xs text-bank-light font-mono">{t.ref}</td>
                <td className="px-4 py-3 text-xs text-bank-light max-w-xs truncate">{t.description}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                    ${t.type==='CREDIT' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {t.type}
                  </span>
                </td>
                <td className={`px-4 py-3 text-sm font-bold ${t.type==='CREDIT' ? 'text-green-400' : 'text-red-400'}`}>
                  {t.type==='CREDIT' ? '+' : '−'}₹{t.amount.toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
            {filtered.length===0 && (
              <tr><td colSpan="5" className="text-center py-10 text-bank-muted text-sm">No transactions found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-bank-card border border-bank-border rounded-xl p-4 text-center">
          <div className="text-xs text-bank-muted mb-1">Total Credits</div>
          <div className="text-green-400 font-bold text-lg">+₹{credits.toLocaleString('en-IN')}</div>
        </div>
        <div className="bg-bank-card border border-bank-border rounded-xl p-4 text-center">
          <div className="text-xs text-bank-muted mb-1">Total Debits</div>
          <div className="text-red-400 font-bold text-lg">−₹{debits.toLocaleString('en-IN')}</div>
        </div>
      </div>
    </div>
  )
}
