import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const nav = [
  { to: '/',             icon: '⊞', label: 'Dashboard'     },
  { to: '/transfer',     icon: '⇄', label: 'Fund Transfer'  },
  { to: '/transactions', icon: '☰', label: 'Transactions'   },
  { to: '/bills',        icon: '◈', label: 'Bill Payments'  },
  { to: '/loans',        icon: '⬡', label: 'Loans'          },
]

export default function Layout() {
  const { auth, logout } = useAuth()
  const navigate = useNavigate()
  function handleLogout() { logout(); navigate('/login') }

  return (
    <div className="flex h-screen bg-bank-dark overflow-hidden">
      <aside className="w-60 bg-bank-card border-r border-bank-border flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-bank-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 gold-gradient rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">SBS</span>
            </div>
            <div>
              <div className="text-bank-light font-semibold text-sm">Sricharan</div>
              <div className="text-bank-accent text-xs">Banking Service</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {nav.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                 ${isActive
                   ? 'bg-bank-accent/10 text-bank-accent border border-bank-accent/20'
                   : 'text-bank-muted hover:text-bank-light hover:bg-white/5'}`}>
              <span className="text-base w-5 text-center">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-bank-border">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center flex-shrink-0">
              <span className="text-black text-xs font-bold">{auth?.fullName?.[0] || 'U'}</span>
            </div>
            <div className="min-w-0">
              <div className="text-bank-light text-xs font-medium truncate">{auth?.fullName}</div>
              <div className="text-bank-muted text-xs">{auth?.customerId}</div>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg text-xs text-bank-muted hover:text-red-400 hover:bg-red-400/10 transition-all">
            ⎋  Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto"><Outlet /></main>
    </div>
  )
}
