import { useEffect, useState } from 'react'
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom'

import Login from './components/Login'
import SignUp from './components/SignUp'
import Layout from './components/Layout'

import Dashboard from './pages/Dashboard'
import PendingPage from './pages/PendingPage'
import CompletePage from './pages/CompletePage'
import Profile from './pages/Profile'

const App = () => {
  const navigate = useNavigate()

  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem('currentUser')
    return stored ? JSON.parse(stored) : null
  })

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('currentUser')
    }
  }, [currentUser])

  const handleAuthSubmit = data => {
    const user = {
      email: data.email,
      name: data.name || 'User',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        data.name || 'User'
      )}&background=random`,
    }

    setCurrentUser(user)
    navigate('/', { replace: true })
  }

  const handleLogout = () => {
    localStorage.clear()
    sessionStorage.clear()
    setCurrentUser(null)
    navigate('/login', { replace: true })
  }

  /* ================= PROTECTED ROUTE ================= */
  const ProtectedRoute = () => {
    const token =
      localStorage.getItem('token') ||
      sessionStorage.getItem('token')

    if (!token || !currentUser) {
      return <Navigate to="/login" replace />
    }

    return (
      <Layout user={currentUser} onLogout={handleLogout} />
    )
  }

  return (
    <Routes>
      {/* AUTH ROUTES */}
      <Route
        path="/login"
        element={
          <Login
            onSubmit={handleAuthSubmit}
            onSwitchMode={() => navigate('/signup')}
          />
        }
      />

      <Route
        path="/signup"
        element={
          <SignUp
            onSubmit={handleAuthSubmit}
            onSwitchMode={() => navigate('/login')}
          />
        }
      />

      {/* PROTECTED LAYOUT */}
      <Route element={<ProtectedRoute />}>
        <Route index element={<Dashboard />} />
        <Route path="pending" element={<PendingPage />} />
        <Route path="complete" element={<CompletePage />} />
        <Route
          path="profile"
          element={
            <Profile
              user={currentUser}
              setCurrentUser={setCurrentUser}
              onLogout={handleLogout}
            />
          }
        />
      </Route>

      {/* FALLBACK */}
      <Route
        path="*"
        element={<Navigate to={currentUser ? '/' : '/login'} replace />}
      />
    </Routes>
  )
}

export default App
