import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const MOCK_ACCOUNTS = [
  { accountNumber:'ACC001001', type:'SAVINGS',  balance: 85420.50 },
  { accountNumber:'ACC001002', type:'CURRENT',  balance: 210000.00 },
]
const MOCK_TXNS = [
  { id:1, type:'CREDIT', amount:25000, description:'Salary credit — April 2026',       date:'2026-04-20' },
  { id:2, type:'DEBIT',  amount:4500,  description:'NEFT transfer to ACC002001',        date:'2026-04-19' },
  { id:3, type:'DEBIT',  amount:1200,  description:'Bill payment — Electricity (TNEB)', date:'2026-04-18' },
  { id:4, type:'CREDIT', amount:5000,  description:'IMPS received from Kumar R',        date:'2026-04-17' },
  { id:5, type:'DEBIT',  amount:800,   description:'Mobile recharge — Jio 84 days',     date:'2026-04-16' },
]

export default function Dashboard() {
  const { auth } = useAuth()
  const [accounts, setAccounts] = useState(MOCK_ACCOUNTS)
  const [txns, setTxns]         = useState(MOCK_TXNS)

  useEffect(() => {
    api.get(`/api/accounts?customerId=${auth?.customerId}`).then(r => setAccounts(r.data.accounts)).catch(()=>{})
    api.get(`/api/transactions?accountNumber=ACC001001`).then(r => setTxns(r.data.transactions?.slice(0,5))).catch(()=>{})
  }, [])

  const total   = accounts.reduce((s,a) => s + a.balance, 0)
  const hour    = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-bank-light">{greeting}, {auth?.fullName?.split(' ')[0]} 👋</h1>
        <p className="text-bank-muted text-sm mt-1">
          {new Date().toLocaleDateString('en-SG',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
        </p>
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-bank-card border border-bank-accent/30 rounded-xl p-5 card-hover">
          <div className="text-bank-muted text-xs font-medium mb-2 tracking-wider">TOTAL BALANCE</div>
          <div className="text-2xl font-bold text-bank-accent">₹{total.toLocaleString('en-IN',{minimumFractionDigits:2})}</div>
          <div className="text-bank-muted text-xs mt-1">{accounts.length} linked accounts</div>
        </div>
        <div className="bg-bank-card border border-bank-border rounded-xl p-5 card-hover">
          <div className="text-bank-muted text-xs font-medium mb-2 tracking-wider">MONTH CREDITS</div>
          <div className="text-2xl font-semibold text-green-400">₹30,000.00</div>
          <div className="text-bank-muted text-xs mt-1">↑ 2 transactions</div>
        </div>
        <div className="bg-bank-card border border-bank-border rounded-xl p-5 card-hover">
          <div className="text-bank-muted text-xs font-medium mb-2 tracking-wider">MONTH DEBITS</div>
          <div className="text-2xl font-semibold text-red-400">₹6,500.00</div>
          <div className="text-bank-muted text-xs mt-1">↓ 3 transactions</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Accounts */}
        <div className="lg:col-span-2 bg-bank-card border border-bank-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-bank-light mb-4">Your Accounts</h2>
          <div className="space-y-3">
            {accounts.map(acc => (
              <div key={acc.accountNumber}
                className="flex items-center justify-between p-4 bg-bank-dark rounded-xl border border-bank-border hover:border-bank-accent/30 transition-all">
                <div>
                  <div className="text-xs text-bank-muted font-medium tracking-wider">{acc.type} ACCOUNT</div>
                  <div className="text-sm text-bank-light font-mono mt-0.5 tracking-wider">{acc.accountNumber}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-bank-light">₹{acc.balance.toLocaleString('en-IN',{minimumFractionDigits:2})}</div>
                  <div className="text-xs text-green-400 mt-0.5">● Available</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-bank-card border border-bank-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-bank-light mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { to:'/transfer',     icon:'⇄', label:'Fund Transfer',  sub:'NEFT / RTGS / IMPS' },
              { to:'/bills',        icon:'◈', label:'Pay Bills',       sub:'Utility & mobile'   },
              { to:'/loans',        icon:'⬡', label:'Apply for Loan',  sub:'Instant processing' },
              { to:'/transactions', icon:'☰', label:'Statements',      sub:'Download PDF / CSV' },
            ].map(({ to, icon, label, sub }) => (
              <Link key={to} to={to}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-all group">
                <div className="w-9 h-9 rounded-lg bg-bank-accent/10 border border-bank-accent/20 flex items-center justify-center text-bank-accent flex-shrink-0">
                  {icon}
                </div>
                <div>
                  <div className="text-xs font-medium text-bank-light group-hover:text-bank-accent transition-colors">{label}</div>
                  <div className="text-xs text-bank-muted">{sub}</div>
                </div>
                <span className="ml-auto text-bank-muted text-xs group-hover:text-bank-accent">›</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-bank-card border border-bank-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-bank-light">Recent Transactions</h2>
          <Link to="/transactions" className="text-xs text-bank-accent hover:underline">View all →</Link>
        </div>
        <div className="divide-y divide-bank-border">
          {txns.map(t => (
            <div key={t.id} className="flex items-center gap-4 py-3 hover:bg-white/[0.02] px-1 transition-all">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0
                ${t.type==='CREDIT' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {t.type==='CREDIT' ? '↓' : '↑'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-bank-light truncate">{t.description}</div>
                <div className="text-xs text-bank-muted mt-0.5">{t.date}</div>
              </div>
              <div className={`text-sm font-bold flex-shrink-0 ${t.type==='CREDIT' ? 'text-green-400' : 'text-red-400'}`}>
                {t.type==='CREDIT' ? '+' : '−'}₹{Number(t.amount).toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
