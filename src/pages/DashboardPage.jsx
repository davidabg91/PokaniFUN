import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { getUserInvitations } from '../api.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useLang, prettyDate } from '../i18n.jsx'
import Hearts from '../components/Hearts.jsx'
import { HopefulChar, HappyChar } from '../components/Characters.jsx'
import AdBanner from '../components/AdBanner.jsx'

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const { t, lang } = useLang()
  const navigate = useNavigate()

  const [invitations, setInvitations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copiedId, setCopiedId] = useState({ id: '', type: '' })
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login')
      return
    }

    if (user) {
      getUserInvitations()
        .then((data) => {
          setInvitations(data)
        })
        .catch((err) => {
          setError(err.message || 'Грешка при зареждане на поканите')
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [user, authLoading, navigate])

  const copy = async (text, id, type) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId({ id, type })
      setTimeout(() => setCopiedId({ id: '', type: '' }), 1800)
    } catch {
      setCopiedId({ id: '', type: '' })
    }
  }

  const origin = window.location.origin

  if (authLoading || (loading && !error)) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <Hearts count={10} />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-glow mx-auto mb-4"></div>
          <p className="text-white/70">{t('loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen px-4 pt-16 pb-20 sm:pt-8">
      <Hearts count={15} />

      <div className="relative z-10 mx-auto w-full max-w-2xl">
        <header className="mb-8 text-center flex flex-col items-center">
          <Link to="/" className="mb-2 text-rose-glow hover:underline text-sm font-bold">
            ← {t('back_home')}
          </Link>
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
            <span className="text-gradient">{t('dashboard_title')}</span>
          </h1>
          {user && (
            <p className="text-white/60 mt-1 text-sm">
              Влязъл като: <span className="text-white font-bold">{user.username}</span>
            </p>
          )}
        </header>

        {error && (
          <div className="glass rounded-3xl p-6 text-center text-rose-300 font-bold mb-6">
            {error}
          </div>
        )}

        {!error && invitations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-8 text-center"
          >
            <div className="mx-auto mb-4 flex justify-center">
              <HopefulChar size={130} />
            </div>
            <p className="text-white/70 mb-6">{t('dashboard_no_invites')}</p>
            <Link
              to="/"
              className="inline-block rounded-2xl bg-gradient-to-r from-rose-glow to-fuchsia-500 px-8 py-3.5 text-lg font-extrabold shadow-[0_12px_30px_-8px_rgba(255,45,111,.7)] hover:scale-[1.02] active:scale-95 transition-transform text-white"
            >
              {t('btn_create')}
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {invitations.map((inv, idx) => {
              const hasResponse = !!inv.response
              const inviteUrl = `${origin}/i/${inv.id}`
              const resultUrl = `${origin}/r/${inv.id}`
              const isExpanded = expandedId === inv.id

              return (
                <motion.div
                  key={inv.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass rounded-2xl overflow-hidden border border-white/10"
                >
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : inv.id)}
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition select-none"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                          {inv.kind === 'romantic' ? '💕 Романтична' : '🎉 Приятелска'}
                        </span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            hasResponse
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {hasResponse ? t('status_accepted') : t('status_pending')}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-white truncate">
                        За: <span className="text-rose-glow">{inv.recipientName || t('recipient_generic')}</span>
                      </h3>
                      <p className="text-xs text-white/50">
                        Създадена на: {new Date(inv.createdAt).toLocaleDateString(lang === 'bg' ? 'bg-BG' : 'en-GB')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="text-white/60 hover:text-white transition p-1 text-sm font-semibold">
                        {isExpanded ? 'Скрий ▲' : 'Виж ▼'}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/5 bg-black/20 p-5 space-y-4 text-sm"
                      >
                        {inv.message && (
                          <div>
                            <span className="text-xs font-bold text-white/40 block mb-1">СЪОБЩЕНИЕ</span>
                            <p className="text-white/90 italic bg-white/5 p-3 rounded-xl border border-white/5">
                              "{inv.message}"
                            </p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-xs font-bold text-white/40 block mb-1">ПОДАТЕЛ</span>
                            <span className="text-white font-bold">{inv.senderName}</span>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white/40 block mb-1">ПОЛУЧАТЕЛ</span>
                            <span className="text-white font-bold">{inv.recipientName || 'Анонимен'}</span>
                          </div>
                        </div>

                        {hasResponse ? (
                          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 space-y-3">
                            <div className="flex items-center gap-2">
                              <HappyChar size={40} />
                              <div>
                                <h4 className="font-bold text-emerald-400 text-base">{t('status_accepted')}</h4>
                                <p className="text-xs text-white/60">
                                  Отговорено на: {new Date(inv.response.createdAt).toLocaleString(lang === 'bg' ? 'bg-BG' : 'en-GB')}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-emerald-500/10">
                              <div>
                                <span className="text-white/40 block font-semibold">КОГА</span>
                                <span className="text-white font-bold">
                                  {prettyDate(inv.response.date, lang)} в {inv.response.time || '--:--'}
                                </span>
                              </div>
                              <div>
                                <span className="text-white/40 block font-semibold">АКТИВНОСТ</span>
                                <span className="text-white font-bold">
                                  {t(`activity_${inv.response.activity}`) || 'Не е избрано'}
                                </span>
                              </div>
                              {inv.response.food && (
                                <div className="col-span-2">
                                  <span className="text-white/40 block font-semibold">ХРАНА</span>
                                  <span className="text-white font-bold">
                                    {t(`food_${inv.response.food}`) || inv.response.food}
                                  </span>
                                </div>
                              )}
                              <div className="col-span-2 text-rose-300">
                                <span>🙈 Опита се да натисне „Не“: <b>{inv.response.dodges}</b> {inv.response.dodges === 1 ? 'път' : 'пъти'}</span>
                              </div>
                            </div>
                            <div className="pt-2 text-center">
                              <Link
                                to={`/r/${inv.id}`}
                                className="inline-block text-xs font-bold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/35 px-4 py-2 rounded-xl border border-emerald-500/30 transition"
                              >
                                Виж пълния резултат →
                              </Link>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
                            <p className="text-amber-300 text-xs font-bold mb-2">Очаква се отговор на поканата</p>
                            <Link
                              to={`/i/${inv.id}`}
                              target="_blank"
                              className="inline-block text-xs font-bold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 px-4 py-2 rounded-xl border border-amber-500/20 transition"
                            >
                              Отвори като получател ↗
                            </Link>
                          </div>
                        )}

                        <div className="pt-3 border-t border-white/5 flex gap-2">
                          <button
                            onClick={() => copy(inviteUrl, inv.id, 'invite')}
                            className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-2.5 px-3 rounded-xl border border-white/10 text-xs transition"
                          >
                            {copiedId.id === inv.id && copiedId.type === 'invite' ? 'Копирано! ✓' : 'Копирай покана 🔗'}
                          </button>
                          <button
                            onClick={() => copy(resultUrl, inv.id, 'result')}
                            className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-2.5 px-3 rounded-xl border border-white/10 text-xs transition"
                          >
                            {copiedId.id === inv.id && copiedId.type === 'result' ? 'Копирано! ✓' : 'Копирай отговор 🔗'}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        )}
        <AdBanner />
      </div>
    </div>
  )
}
