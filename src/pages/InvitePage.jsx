import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Hearts from '../components/Hearts.jsx'
import Burst from '../components/Burst.jsx'
import RunawayNo from '../components/RunawayNo.jsx'
import { HopefulChar, HappyChar, SexyCat } from '../components/Characters.jsx'
import { getInvitation, saveResponse } from '../api.js'
import { getActivities, getFoods, activityEmoji, foodEmoji, bgEmojis } from '../lib.js'
import { useLang, readyWord, prettyDate, timePrank } from '../i18n.jsx'

const variants = {
  enter: { opacity: 0, y: 30, scale: 0.96 },
  center: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -30, scale: 0.96 },
}

const todayISO = () => new Date().toISOString().slice(0, 10)

export default function InvitePage() {
  const { id } = useParams()
  const { t, lang } = useLang()
  const [inv, setInv] = useState(null)
  const [error, setError] = useState('')
  const [step, setStep] = useState('ask')
  
  const preview = new URLSearchParams(window.location.search).get('preview') === 'true'
  const [burst, setBurst] = useState(false)

  const [answer, setAnswer] = useState({
    date: '',
    time: '',
    activity: '',
    food: '',
  })
  const [tease, setTease] = useState(0) // date prank: 0 none, 1 fake-no, 2 just-kidding
  const [dodges, setDodges] = useState(0) // how many times the "Не" button fled
  const [timeTease, setTimeTease] = useState(0) // time prank: 0 none, 1, 2
  const [timeMsgs, setTimeMsgs] = useState(null)
  const [cancelled, setCancelled] = useState(false) // pressed the fake "cancel" button
  const teaseTimers = useRef([])

  // Playful prank when a date gets picked: pretend "I can't make it" then reveal a joke.
  const pickDate = (e) => {
    const date = e.target.value
    setAnswer((a) => ({ ...a, date }))
    teaseTimers.current.forEach(clearTimeout)
    teaseTimers.current = []
    if (date) {
      setTease(1)
      teaseTimers.current.push(setTimeout(() => setTease(2), 2000))
    } else {
      setTease(0)
    }
  }

  // Same two-step gag for unusually early / late times.
  const pickTime = (time) => {
    setAnswer((a) => ({ ...a, time }))
    const msgs = timePrank(time, t)
    setTimeMsgs(msgs)
    if (msgs) {
      setTimeTease(1)
      teaseTimers.current.push(setTimeout(() => setTimeTease(2), 2000))
    } else {
      setTimeTease(0)
    }
  }

  useEffect(() => () => teaseTimers.current.forEach(clearTimeout), [])

  useEffect(() => {
    let alive = true
    getInvitation(id)
      .then((data) => {
        if (!alive) return
        setInv(data)
        // If already answered, jump straight to the recap.
        if (data.response?.accepted) {
          setAnswer({
            date: data.response.date || '',
            time: data.response.time || '',
            activity: data.response.activity || '',
            food: data.response.food || '',
          })
          setStep('final')
        }
      })
      .catch((e) => alive && setError(e.message))
    return () => {
      alive = false
    }
  }, [id])

  if (error) {
    return (
      <Centered>
        <div className="text-6xl">💔</div>
        <p className="mt-3 text-xl font-bold">{error}</p>
      </Centered>
    )
  }
  if (!inv) {
    return (
      <Centered>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-6xl"
        >
          💗
        </motion.div>
        <p className="mt-3 text-white/70">{t('loading')}</p>
      </Centered>
    )
  }

  const friendly = inv.kind === 'friendly'
  const ready = readyWord(inv.recipientGender, lang)
  const who = inv.recipientName ? `, ${inv.recipientName}` : ''

  const sayYes = () => {
    setBurst(true)
    setStep('yay')
    setTimeout(() => setBurst(false), 1600)
  }

  const finish = async () => {
    setStep('final')
    if (preview) {
      return // skip saving response in preview mode
    }
    try {
      await saveResponse(id, { accepted: true, ...answer, dodges })
    } catch {
      /* keep the celebration even if saving hiccups */
    }
  }

  const getCancelMsg = () => {
    if (inv.kind !== 'friendly') return t('cancel_msg')
    if (inv.recipientGender === 'male') return t('cancel_msg_friendly_male')
    if (inv.recipientGender === 'female') return t('cancel_msg_friendly_female')
    return t('cancel_msg_friendly_other')
  }

  return (
    <div className={`relative min-h-screen overflow-hidden px-5 py-8 ${preview ? 'pt-14' : ''}`}>
      {preview && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500/95 py-2.5 px-4 text-center text-xs font-black text-slate-900 shadow-md backdrop-blur-md">
          {t('preview_banner')}
        </div>
      )}
      <Hearts count={friendly ? 24 : 28} emojis={bgEmojis(inv.kind, inv.recipientGender)} />
      {burst && <Burst emojis={friendly ? ['🎉', '🥳', '⭐', '💛', '✨'] : undefined} />}

      <div className="relative z-10 mx-auto flex min-h-[88vh] w-full max-w-xl flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {/* ---------- STEP: ASK ---------- */}
          {step === 'ask' && (
            <Step key="ask">
              <FromBadge inv={inv} />
              <div className="my-3 flex justify-center">
                {inv.photoUrl ? (
                  <motion.img
                    src={inv.photoUrl}
                    alt={inv.senderName}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="h-44 w-44 rounded-full border-4 border-rose-glow/70 object-cover shadow-[0_14px_40px_-8px_rgba(255,45,111,.7)]"
                  />
                ) : (
                  <HopefulChar size={210} />
                )}
              </div>
              {inv.audioUrl && (
                <div className="mx-auto mb-1 max-w-xs">
                  <p className="mb-1 text-sm font-bold text-white/70">{t('audio_listen')}</p>
                  <audio src={inv.audioUrl} controls className="w-full" />
                </div>
              )}
              <h1 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">
                {t(friendly ? 'ask_friendly' : 'ask_romantic', { who })}
              </h1>
              {inv.message && (
                <p className="mx-auto mt-3 max-w-md rounded-2xl bg-white/5 p-3 text-white/80">
                  „{inv.message}“
                </p>
              )}
              <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={sayYes}
                  className="rounded-2xl bg-gradient-to-r from-rose-glow to-fuchsia-500 px-10 py-4 text-xl font-extrabold shadow-[0_14px_34px_-8px_rgba(255,45,111,.8)] transition-transform hover:scale-105 active:scale-95"
                >
                  {t('btn_yes')}
                </button>
                <RunawayNo onDodge={setDodges} onAccept={sayYes} kind={inv.kind} gender={inv.recipientGender} />
              </div>
              <div className="mt-5 h-5 text-xs text-white/50">
                <AnimatePresence mode="wait">
                  {dodges > 0 ? (
                    <motion.p
                      key={dodges}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="font-bold"
                    >
                      {t('dodge_counter', { n: dodges })}
                    </motion.p>
                  ) : (
                    <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      {t('dodge_hint')}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </Step>
          )}

          {/* ---------- STEP: YAY ---------- */}
          {step === 'yay' && (
            <Step key="yay">
              <div className="flex justify-center">
                <HappyChar size={220} />
              </div>
              <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
                <span className="text-gradient">{t('yay_super')}</span> 🎉
              </h1>
              <p className="mt-2 text-lg text-white/90">
                {t(friendly ? 'yay_friendly' : 'yay_romantic')}
              </p>
              <button onClick={() => setStep('when')} className="btn-primary mt-7">
                {t('btn_next_big')}
              </button>
            </Step>
          )}

          {/* ---------- STEP: WHEN ---------- */}
          {step === 'when' && (
            <Step key="when">
              <StepTitle emoji="🗓️">{t('when_title')}</StepTitle>
              <div className="mt-5 grid gap-4 text-left">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-white/80">{t('when_pick_date')}</span>
                  <input
                    type="date"
                    min={todayISO()}
                    value={answer.date}
                    onChange={pickDate}
                    className="input text-lg"
                  />
                  <TeaseBubble show={tease} messages={[t('date_tease_1'), t('date_tease_2')]} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-bold text-white/80">{t('when_time_label')}</span>
                  <input
                    type="time"
                    value={answer.time}
                    onChange={(e) => pickTime(e.target.value)}
                    className="input text-lg"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {['13:00', '17:00', '20:00'].map((time) => (
                      <button
                        key={time}
                        onClick={() => pickTime(time)}
                        className={`rounded-xl border px-3 py-1.5 text-sm font-bold ${
                          answer.time === time
                            ? 'border-rose-glow bg-rose-glow/20'
                            : 'border-white/15 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  <TeaseBubble show={timeMsgs ? timeTease : 0} messages={timeMsgs || []} />
                </label>
              </div>
              <NextBtn
                disabled={!answer.date || !answer.time}
                onClick={() => setStep('activity')}
              />
            </Step>
          )}

          {/* ---------- STEP: ACTIVITY ---------- */}
          {step === 'activity' && (
            <Step key="activity">
              <StepTitle emoji="✨">{t('activity_title')}</StepTitle>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {getActivities(inv.kind, inv.recipientGender).map((a) => (
                  <BigChoice
                    key={a.key}
                    active={answer.activity === a.key}
                    onClick={() => setAnswer((s) => ({ ...s, activity: a.key, food: '' }))}
                    emoji={a.emoji}
                    label={t('activity_' + a.key)}
                  />
                ))}
              </div>
              <QuipBubble
                text={answer.activity ? t('quip_act_' + answer.activity) : ''}
                keyName={answer.activity}
              />
              <NextBtn
                disabled={!answer.activity}
                onClick={() => (['cinema', 'walk', 'escape', 'party'].includes(answer.activity) ? finish() : setStep('food'))}
              />
            </Step>
          )}

          {/* ---------- STEP: FOOD ---------- */}
          {step === 'food' && (
            <Step key="food">
              <StepTitle emoji="🍴">{t('food_title')}</StepTitle>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {getFoods(answer.activity).map((f) => (
                  <BigChoice
                    key={f.key}
                    active={answer.food === f.key}
                    onClick={() => setAnswer((s) => ({ ...s, food: f.key }))}
                    emoji={f.emoji}
                    label={t('food_' + f.key)}
                  />
                ))}
              </div>
              <QuipBubble
                text={answer.food ? t('quip_food_' + answer.food) : ''}
                keyName={answer.food}
              />
              <NextBtn disabled={!answer.food} onClick={finish} label={t('btn_done')} />
            </Step>
          )}

          {/* ---------- STEP: FINAL ---------- */}
          {step === 'final' && (
            <Step key="final">
              <div className="flex justify-center">
                <SexyCat size={230} />
              </div>
              <h1 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">
                {t(friendly ? 'final_friendly_title' : 'final_romantic_title')}
              </h1>

              <div className="glass mx-auto mt-5 max-w-md rounded-3xl p-5 text-left">
                <p className="text-center font-display text-xl font-extrabold leading-snug">
                  {t('final_ready_pre', { ready })}{' '}
                  <span className="text-gradient">{prettyDate(answer.date, lang)}</span> {t('at_word')}{' '}
                  <span className="text-gradient">{answer.time}</span>!
                </p>
                <p className="mt-1 text-center text-white/80">
                  {t(friendly ? 'final_come_friendly' : 'final_come_romantic')}
                </p>

                <div className="mt-4 space-y-2 text-sm">
                  <Recap label={t('recap_when')}>
                    {prettyDate(answer.date, lang)} · {answer.time}
                  </Recap>
                  <Recap label={t('recap_what')}>
                    {activityEmoji(answer.activity)} {t('activity_' + answer.activity)}
                  </Recap>
                  {answer.food && (
                    <Recap label={t('recap_eat')}>
                      {foodEmoji(answer.food)} {t('food_' + answer.food)}
                    </Recap>
                  )}
                  <Recap label={t(friendly ? 'recap_from' : 'recap_with')}>{inv.senderName}</Recap>
                </div>

                <Countdown date={answer.date} time={answer.time} kind={inv.kind} gender={inv.recipientGender} />
              </div>

              <div className="mt-5">
                <AnimatePresence mode="wait">
                  {cancelled ? (
                    <motion.p
                      key="cancelled"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="font-display text-lg font-extrabold text-gradient"
                    >
                      {getCancelMsg()}
                    </motion.p>
                  ) : (
                    <motion.button
                      key="cancel"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => {
                        setCancelled(true)
                        setBurst(true)
                        setTimeout(() => setBurst(false), 1600)
                      }}
                      className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-white/50 hover:bg-white/10"
                    >
                      {t('btn_cancel_date')}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <p className="mt-4 text-sm text-white/60">{t('sent_to', { name: inv.senderName })}</p>

              <div className="mt-8 border-t border-white/10 pt-6">
                <Link
                  to="/"
                  className="inline-block rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-extrabold text-white/90 transition-all hover:scale-[1.03] hover:bg-white/10 hover:text-white active:scale-95 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.5)]"
                >
                  {t('create_own_invite')}
                </Link>
              </div>
            </Step>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ---------- small building blocks ---------- */

function Step({ children }) {
  return (
    <motion.div
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full text-center"
    >
      {children}
    </motion.div>
  )
}

function Centered({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Hearts count={14} />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

function FromBadge({ inv }) {
  const { t } = useLang()
  return (
    <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-bold backdrop-blur">
      <span>{inv.kind === 'friendly' ? '🎉' : '💌'}</span>
      {t('from_badge')} <span className="text-gradient">{inv.senderName}</span>
    </div>
  )
}

function StepTitle({ emoji, children }) {
  return (
    <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
      <span className="mr-1">{emoji}</span>
      {children}
    </h1>
  )
}

function BigChoice({ active, onClick, emoji, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 rounded-2xl border px-3 py-5 font-extrabold transition-all ${
        active
          ? 'border-rose-glow bg-rose-glow/20 shadow-[0_0_0_2px_rgba(255,91,138,.5)]'
          : 'border-white/15 bg-white/5 hover:scale-[1.03] hover:bg-white/10'
      }`}
    >
      <span className="text-3xl">{emoji}</span>
      <span>{label}</span>
    </button>
  )
}

// Two-step prank bubble (fake disappointment -> reveal). `show` is 0 / 1 / 2.
function TeaseBubble({ show, messages }) {
  return (
    <AnimatePresence mode="popLayout">
      {show > 0 && messages[show - 1] && (
        <motion.div
          key={show}
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 380, damping: 22 }}
          className={`mt-3 rounded-2xl px-4 py-3 text-center font-extrabold shadow-lg ${
            show === 1 ? 'bg-white/10 text-white/90' : 'bg-gradient-to-r from-rose-glow to-fuchsia-500 text-white'
          }`}
        >
          {messages[show - 1]}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// A cheeky one-liner that animates in when a choice is made.
function QuipBubble({ text, keyName }) {
  return (
    <div className="mt-4 min-h-[3.25rem]">
      <AnimatePresence mode="wait">
        {text && (
          <motion.div
            key={keyName}
            initial={{ opacity: 0, y: 10, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 360, damping: 22 }}
            className="mx-auto max-w-md rounded-2xl bg-white/10 px-4 py-3 font-extrabold text-white/90 shadow-lg"
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Live countdown to the chosen date + time.
function Countdown({ date, time, kind, gender }) {
  const { t } = useLang()
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!date) return null
  const target = new Date(`${date}T${time || '00:00'}:00`).getTime()
  if (Number.isNaN(target)) return null

  const diff = target - now
  if (diff <= 0) {
    return <p className="mt-4 text-center font-bold text-rose-300">{t('countdown_now')}</p>
  }

  const parts = [
    [Math.floor(diff / 86400000), t('cd_days')],
    [Math.floor((diff % 86400000) / 3600000), t('cd_hours')],
    [Math.floor((diff % 3600000) / 60000), t('cd_min')],
    [Math.floor((diff % 60000) / 1000), t('cd_sec')],
  ]

  const getCautionMsg = () => {
    if (kind !== 'friendly') return ''
    if (gender === 'male') return t('caution_friendly_male')
    if (gender === 'female') return t('caution_friendly_female')
    return t('caution_friendly_other')
  }
  const caution = getCautionMsg()

  return (
    <div className="mt-4 border-t border-white/10 pt-3 text-center flex flex-col items-center">
      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-white/50">
        {t('countdown_label')}
      </p>
      <div className="flex justify-center gap-2">
        {parts.map(([val, label]) => (
          <div key={label} className="min-w-[3rem] rounded-xl bg-white/5 px-2 py-1.5">
            <div className="font-display text-xl font-extrabold text-gradient">{val}</div>
            <div className="text-[10px] uppercase text-white/50">{label}</div>
          </div>
        ))}
      </div>
      {caution && (
        <p className="mt-3 text-[11px] font-bold text-rose-300/80 bg-white/5 py-1.5 px-3.5 rounded-xl border border-white/5 inline-block">
          {caution}
        </p>
      )}
    </div>
  )
}

function NextBtn({ disabled, onClick, label }) {
  const { t } = useLang()
  return (
    <button onClick={onClick} disabled={disabled} className="btn-primary mt-7 disabled:opacity-40">
      {label || t('btn_next')}
    </button>
  )
}

function Recap({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-2">
      <span className="text-white/60">{label}</span>
      <span className="font-bold">{children}</span>
    </div>
  )
}
