import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Hearts from '../components/Hearts.jsx'
import { HopefulChar, SexyCat } from '../components/Characters.jsx'
import { getInvitation } from '../api.js'
import { activityEmoji, foodEmoji, bgEmojis } from '../lib.js'
import { useLang, prettyDate } from '../i18n.jsx'

export default function ResultsPage() {
  const { id } = useParams()
  const { t, lang } = useLang()
  const [inv, setInv] = useState(null)
  const [error, setError] = useState('')
  const timer = useRef(null)

  useEffect(() => {
    let alive = true
    const load = () =>
      getInvitation(id)
        .then((data) => {
          if (!alive) return
          setInv(data)
          // Stop polling once we have an answer.
          if (data.response && timer.current) {
            clearInterval(timer.current)
            timer.current = null
          }
        })
        .catch((e) => alive && setError(e.message))

    load()
    timer.current = setInterval(load, 5000)
    return () => {
      alive = false
      if (timer.current) clearInterval(timer.current)
    }
  }, [id])

  if (error) {
    return (
      <Wrap>
        <div className="text-6xl">💔</div>
        <p className="mt-3 text-xl font-bold">{error}</p>
        <Link to="/" className="btn-primary mt-6 inline-block">
          {t('back_home')}
        </Link>
      </Wrap>
    )
  }

  if (!inv) {
    return (
      <Wrap>
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} className="text-6xl">
          💗
        </motion.div>
        <p className="mt-3 text-white/70">{t('loading')}</p>
      </Wrap>
    )
  }

  const r = inv.response
  const name = inv.recipientName || t('recipient_generic')

  return (
    <Wrap emojis={bgEmojis(inv.kind, inv.recipientGender)}>
      <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-bold">
        {t('your_invite')}
      </div>

      {!r ? (
        <>
          <div className="my-4 flex justify-center">
            <HopefulChar size={190} />
          </div>
          <h1 className="font-display text-3xl font-extrabold">{t('waiting_title')}</h1>
          <p className="mt-2 text-white/70">{t('waiting_desc', { name })}</p>
          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-white/50">
            <span className="inline-block h-2 w-2 animate-ping rounded-full bg-rose-glow" />
            {t('watching_live')}
          </div>
        </>
      ) : (
        <>
          <div className="my-3 flex justify-center">
            <SexyCat size={210} />
          </div>
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
            <span className="text-gradient">{t('said_yes')}</span> 🎉
          </h1>
          <div className="glass mx-auto mt-5 max-w-md rounded-3xl p-5 text-left">
            <p className="text-center font-display text-xl font-extrabold leading-snug">
              {t('result_meeting_pre')} <span className="text-gradient">{prettyDate(r.date, lang)}</span>{' '}
              {t('at_word')} <span className="text-gradient">{r.time}</span>!
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <Row label={t('recap_when')}>
                {prettyDate(r.date, lang)} · {r.time}
              </Row>
              {r.activity && (
                <Row label={t('recap_what')}>
                  {activityEmoji(r.activity)} {t('activity_' + r.activity)}
                </Row>
              )}
              {r.food && (
                <Row label={t('result_eat')}>
                  {foodEmoji(r.food)} {t('food_' + r.food)}
                </Row>
              )}
            </div>

            {r.dodges > 0 && (
              <div className="mt-4 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-3 text-center">
                <p className="font-extrabold text-amber-200">{t('dodges_result', { n: r.dodges })}</p>
                <p className="mt-0.5 text-xs text-white/60">{t('dodges_result_sub')}</p>
              </div>
            )}
          </div>
          <p className="mt-5 text-white/70">{t('dont_be_late')}</p>
        </>
      )}

      <Link
        to="/"
        className="mt-7 inline-block text-sm font-bold text-white/60 underline underline-offset-4 hover:text-white"
      >
        {t('create_new')}
      </Link>
    </Wrap>
  )
}

function Wrap({ children, emojis }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Hearts count={18} emojis={emojis} />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-xl"
      >
        {children}
      </motion.div>
    </div>
  )
}

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-2">
      <span className="text-white/60">{label}</span>
      <span className="font-bold">{children}</span>
    </div>
  )
}
