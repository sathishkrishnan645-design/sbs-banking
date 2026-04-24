import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login        from './pages/Login'
import Dashboard    from './pages/Dashboard'
import Transfer     from './pages/Transfer'
import Transactions from './pages/Transactions'
import Bills        from './pages/Bills'
import Loans        from './pages/Loans'
import Layout       from './components/Layout'

function Protected({ children }) {
  const { auth } = useAuth()
  return auth ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Protected><Layout /></Protected>}>
          <Route index               element={<Dashboard />} />
          <Route path="transfer"     element={<Transfer />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="bills"        element={<Bills />} />
          <Route path="loans"        element={<Loans />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
