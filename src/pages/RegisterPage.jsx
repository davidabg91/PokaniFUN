import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useLang } from '../i18n.jsx'
import Hearts from '../components/Hearts.jsx'
import { HopefulChar } from '../components/Characters.jsx'

export default function RegisterPage() {
  const { register } = useAuth()
  const { t } = useLang()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const nameTrimmed = username.trim()
    if (!nameTrimmed || !password || !confirmPassword) {
      return setError('Моля, попълнете всички полета')
    }

    if (nameTrimmed.length < 3) {
      return setError('Потребителското име трябва да е поне 3 символа')
    }

    if (password.length < 6) {
      return setError('Паролата трябва да е поне 6 символа')
    }

    if (password !== confirmPassword) {
      return setError('Паролите не съвпадат')
    }

    setLoading(true)
    try {
      await register(nameTrimmed, password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Грешка при регистрация')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-5 pt-16 pb-6 sm:pt-6">
      <Hearts count={15} />

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-6 sm:p-8 text-center"
        >
          <div className="mx-auto mb-4 flex justify-center">
            <HopefulChar size={110} />
          </div>

          <h2 className="font-display text-3xl font-extrabold mb-6">
            <span className="text-gradient">{t('nav_register')}</span>
          </h2>

          <form onSubmit={handleSubmit} className="text-left space-y-4">
            <div>
              <label className="block text-sm font-bold text-white/80 mb-1.5">
                {t('auth_username')}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="потребителско име"
                className="input"
                maxLength={30}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-white/80 mb-1.5">
                {t('auth_password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-white/80 mb-1.5">
                Повтори парола
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••"
                className="input"
              />
            </div>

            {error && (
              <p className="text-center font-bold text-rose-300 text-sm">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-rose-glow to-fuchsia-500 px-6 py-3.5 text-lg font-extrabold shadow-[0_12px_30px_-8px_rgba(255,45,111,.7)] transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60 text-white"
            >
              {loading ? 'Зареждане...' : t('auth_register_btn')}
            </button>
          </form>

          <p className="mt-6 text-sm text-white/60">
            <Link
              to="/login"
              className="underline underline-offset-4 hover:text-white transition"
            >
              {t('auth_have_account')}
            </Link>
          </p>

          <p className="mt-4 text-xs text-white/40">
            <Link to="/" className="hover:text-white transition">
              ← Назад към създаването
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
