import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import './index.css'
import { LangProvider, LanguageToggle, useLang } from './i18n.jsx'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import CreatePage from './pages/CreatePage.jsx'
import InvitePage from './pages/InvitePage.jsx'
import ResultsPage from './pages/ResultsPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import NotFound from './pages/NotFound.jsx'

function Navigation() {
  const { user, logout } = useAuth()
  const { t } = useLang()
  const location = useLocation()

  // Hide navigation on invitation view page to keep it clean for the recipient
  const isRecipientView = location.pathname.startsWith('/i/')
  if (isRecipientView) return null

  return (
    <div className="fixed left-3 top-3 z-[60] flex items-center gap-1 rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur text-xs sm:text-sm">
      {user ? (
        <>
          <Link
            to="/dashboard"
            className="rounded-full px-2.5 py-1 font-bold text-white hover:bg-white/10 transition"
          >
            {t('nav_dashboard')}
          </Link>
          <button
            onClick={logout}
            className="rounded-full px-2.5 py-1 font-bold text-white/70 hover:text-rose-300 transition"
          >
            {t('nav_logout')}
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="rounded-full px-2.5 py-1 font-bold text-white hover:bg-white/10 transition"
          >
            {t('nav_login')}
          </Link>
          <Link
            to="/register"
            className="rounded-full px-2.5 py-1 font-bold text-white/70 hover:bg-white/10 transition"
          >
            {t('nav_register')}
          </Link>
        </>
      )}
    </div>
  )
}

function MainApp() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navigation />
        <LanguageToggle />
        <Routes>
          <Route path="/" element={<CreatePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/i/:id" element={<InvitePage />} />
          <Route path="/r/:id" element={<ResultsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LangProvider>
      <MainApp />
    </LangProvider>
  </React.StrictMode>
)
