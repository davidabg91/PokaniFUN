import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../i18n.jsx'
import { HopefulChar, HappyChar, SexyCat } from './Characters.jsx'

export default function FeatureShowcase() {
  const { t } = useLang()
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(0) // 0: button, 1: pranks, 2: dashboard, 3: how-it-works, 4: security
  const containerRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        containerRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 120)
    }
  }, [isOpen])

  return (
    <div ref={containerRef} className="mt-8 w-full">
      {/* Centered Modern Pill Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative group overflow-hidden flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 font-display text-sm font-extrabold text-white/95 transition-all duration-300 hover:border-rose-glow/50 hover:bg-white/10 hover:shadow-[0_0_20px_-3px_rgba(255,91,138,0.35)]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rose-glow/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          
          <span className="relative z-10 flex items-center gap-2">
            <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-rose-glow/10 text-rose-glow border border-rose-glow/20 group-hover:scale-110 transition-transform duration-300 text-xs">
              <span className="absolute inset-0 rounded-full bg-rose-glow/20 animate-ping opacity-75" />
              ℹ️
            </span>
            <span className="group-hover:text-rose-glow transition-colors duration-200">
              {isOpen ? t('showcase_hide') : t('showcase_title')}
            </span>
          </span>
          <span className="relative z-10 text-white/50 group-hover:text-white transition-colors duration-200">
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>
      </div>

      {/* Expanded Showcase Area */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="glass mt-5 rounded-3xl border border-white/10 bg-black/40 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                {/* Tabs & Descriptions */}
                <div className="flex flex-col gap-3 md:col-span-6 lg:col-span-7">
                  {/* Tab 1: How it works */}
                  <TabButton
                    active={activeTab === 0}
                    onClick={() => setActiveTab(0)}
                    title={t('showcase_feature_4_title')}
                    desc={t('showcase_feature_4_desc')}
                  />
                  {/* Tab 2: Runaway NO */}
                  <TabButton
                    active={activeTab === 1}
                    onClick={() => setActiveTab(1)}
                    title={t('showcase_feature_1_title')}
                    desc={t('showcase_feature_1_desc')}
                  />
                  {/* Tab 3: Pranks */}
                  <TabButton
                    active={activeTab === 2}
                    onClick={() => setActiveTab(2)}
                    title={t('showcase_feature_2_title')}
                    desc={t('showcase_feature_2_desc')}
                  />
                  {/* Tab 4: Dashboard */}
                  <TabButton
                    active={activeTab === 3}
                    onClick={() => setActiveTab(3)}
                    title={t('showcase_feature_3_title')}
                    desc={t('showcase_feature_3_desc')}
                  />
                  {/* Tab 5: Security */}
                  <TabButton
                    active={activeTab === 4}
                    onClick={() => setActiveTab(4)}
                    title={t('showcase_feature_5_title')}
                    desc={t('showcase_feature_5_desc')}
                  />
                </div>

                {/* Animated Mockup Viewport */}
                <div className="flex justify-center items-center md:col-span-6 lg:col-span-5">
                  <div className="relative w-[240px] h-[427px] rounded-[36px] border-4 border-white/20 bg-slate-950 p-3 shadow-2xl shadow-rose-glow/10 overflow-hidden shrink-0">
                    {/* Speaker notch */}
                    <div className="absolute top-1 left-1/2 h-3.5 w-20 -translate-x-1/2 rounded-full bg-slate-900 border border-white/10 z-30" />
                    
                    {/* Simulated screen container */}
                    <div className="relative h-full w-full rounded-[28px] overflow-hidden bg-gradient-to-b from-indigo-950 to-slate-900 p-2">
                      
                      {/* Floating hearts inside the mockup screen */}
                      <MockupHearts active={activeTab === 0 || activeTab === 1 || activeTab === 3} />

                      {/* Mockup Screens switcher */}
                      <AnimatePresence mode="wait">
                        {activeTab === 0 && <HowItWorksDemo key="demo0" />}
                        {activeTab === 1 && <RunawayDemo key="demo1" />}
                        {activeTab === 2 && <PranksDemo key="demo2" />}
                        {activeTab === 3 && <DashboardDemo key="demo3" />}
                        {activeTab === 4 && <SecurityDemo key="demo4" />}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------- Tab Button Component ---------- */
function TabButton({ active, onClick, title, desc }) {
  return (
    <button
      onClick={onClick}
      className={`group flex flex-col gap-1 rounded-2xl border p-4 text-left transition-all ${
        active
          ? 'border-rose-glow bg-rose-glow/10 shadow-[0_0_15px_-3px_rgba(255,91,138,0.2)]'
          : 'border-white/5 bg-white/5 hover:bg-white/10'
      }`}
    >
      <span className={`text-base font-extrabold transition-colors ${active ? 'text-rose-glow' : 'text-white'}`}>
        {title}
      </span>
      <span className="text-xs text-white/60 leading-relaxed">{desc}</span>
    </button>
  )
}

/* ---------- Animation 1: Runaway Button Demo ---------- */
function RunawayDemo() {
  const { t } = useLang()
  const [step, setStep] = useState(0) // 0: initial, 1: dodge1, 2: dodge2, 3: transform, 4: clicked
  const [btnPos, setBtnPos] = useState({ x: 110, y: 48 })
  const [cursorPos, setCursorPos] = useState({ x: 160, y: 100 })

  useEffect(() => {
    let alive = true
    const runTimeline = async () => {
      // Loop timeline
      while (alive) {
        setStep(0)
        setBtnPos({ x: 110, y: 48 })
        setCursorPos({ x: 160, y: 100 })
        await sleep(1500)
        if (!alive) break

        // Dodge 1
        setCursorPos({ x: 125, y: 55 })
        await sleep(300)
        setBtnPos({ x: 80, y: 15 })
        setStep(1)
        await sleep(1000)
        if (!alive) break

        // Dodge 2
        setCursorPos({ x: 95, y: 25 })
        await sleep(300)
        setBtnPos({ x: 110, y: 80 })
        setStep(2)
        await sleep(1000)
        if (!alive) break

        // Pre-transform & Chase to final
        setCursorPos({ x: 125, y: 85 })
        await sleep(300)
        // Transform on 3rd attempt
        setStep(3)
        await sleep(1000)
        if (!alive) break

        // Click it!
        setCursorPos({ x: 120, y: 90 })
        await sleep(300)
        setStep(4) // clicked!
        await sleep(2500)
      }
    }
    runTimeline()
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between py-5 text-center text-white select-none">
      {/* Title */}
      <div>
        <h4 className="font-display text-[11px] font-black text-rose-glow">Pokani.FUN</h4>
        <p className="text-[10px] text-white/80 font-bold mt-1 px-1">
          {t('ask_romantic', { who: '' })}
        </p>
      </div>

      {/* Simulated Char */}
      <div className="my-1 scale-75">
        {step === 4 ? <HappyChar size={90} /> : <HopefulChar size={90} />}
      </div>

      {/* Button Row Container */}
      <div className="relative w-full h-[120px] bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
        {/* Yes Button */}
        <button
          type="button"
          className="absolute left-6 top-12 rounded-xl bg-gradient-to-r from-rose-glow to-fuchsia-500 px-3 py-1.5 text-[10px] font-black pointer-events-none"
        >
          {t('btn_yes')}
        </button>

        {/* Evasive "NO" button / "YES" button */}
        <motion.button
          animate={{ left: btnPos.x, top: btnPos.y }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          className={`absolute rounded-xl px-3 py-1.5 text-[10px] font-black select-none pointer-events-none border ${
            step >= 3
              ? 'border-transparent bg-gradient-to-r from-rose-glow to-fuchsia-500 shadow-md text-white'
              : 'border-white/10 bg-white/10 text-white/80'
          }`}
          style={{ left: btnPos.x, top: btnPos.y }}
        >
          {step >= 3 ? t('btn_yes') : t('no_teases')[0]}
        </motion.button>

        {/* Simulated Cursor */}
        <motion.div
          animate={{ left: cursorPos.x, top: cursorPos.y }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="absolute z-40 text-lg pointer-events-none"
          style={{ left: cursorPos.x, top: cursorPos.y }}
        >
          🖱️
        </motion.div>
      </div>

      {/* Bottom Counter */}
      <div className="text-[8px] font-bold text-white/50 h-3">
        {step > 0 && `${t('showcase_demo_dodge_counter')}${step >= 3 ? 2 : step}`}
      </div>
    </div>
  )
}

/* ---------- Animation 2: Pranks Demo ---------- */
function PranksDemo() {
  const { t } = useLang()
  const [bubbleState, setBubbleState] = useState(0) // 0: hidden, 1: fake-no, 2: jokes-on-you
  const [cursorPos, setCursorPos] = useState({ x: 140, y: 160 })

  useEffect(() => {
    let alive = true
    const runTimeline = async () => {
      while (alive) {
        setBubbleState(0)
        setCursorPos({ x: 140, y: 160 })
        await sleep(1500)
        if (!alive) break

        // Click Date field
        setCursorPos({ x: 100, y: 80 })
        await sleep(400)
        // Show disappointed bubble
        setBubbleState(1)
        await sleep(1800)
        if (!alive) break

        // Transition to joke bubble
        setBubbleState(2)
        await sleep(3000)
      }
    }
    runTimeline()
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="relative flex h-full w-full flex-col justify-between py-6 text-white select-none">
      {/* Header */}
      <div className="text-center">
        <h4 className="font-display text-[10px] font-black text-rose-glow">Pokani.FUN</h4>
        <p className="text-[9px] text-white/70 mt-1">{t('when_title')}</p>
      </div>

      {/* Simulated Form Inputs */}
      <div className="space-y-2 mt-4 px-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-1.5 text-[9px] text-left">
          <span className="block text-[7px] text-white/40 font-bold">ДАТА / DATE</span>
          <div className="flex justify-between items-center text-white/90 font-bold mt-0.5">
            <span>{bubbleState > 0 ? '2026-06-12' : '---- -- --'}</span>
            <span>📅</span>
          </div>
        </div>
      </div>

      {/* Pop-up bubble */}
      <div className="flex-1 flex items-center justify-center min-h-[60px] px-1.5">
        <AnimatePresence mode="wait">
          {bubbleState > 0 && (
            <motion.div
              key={bubbleState}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              className={`rounded-2xl p-2.5 text-[9px] font-extrabold text-center shadow-lg leading-snug ${
                bubbleState === 1
                  ? 'bg-white/15 text-white border border-white/10'
                  : 'bg-gradient-to-r from-rose-glow to-fuchsia-500 text-white'
              }`}
            >
              {bubbleState === 1 ? t('date_tease_1') : t('date_tease_2')}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Simulated Cursor */}
      <motion.div
        animate={{ left: cursorPos.x, top: cursorPos.y }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="absolute z-40 text-lg pointer-events-none"
        style={{ left: cursorPos.x, top: cursorPos.y }}
      >
        🖱️
      </motion.div>
    </div>
  )
}

/* ---------- Animation 3: Dashboard Demo ---------- */
function DashboardDemo() {
  const { t } = useLang()

  return (
    <div className="relative flex h-full w-full flex-col justify-between py-5 text-white select-none">
      {/* Header */}
      <div className="text-center border-b border-white/5 pb-2">
        <span className="text-[7px] font-black text-rose-glow tracking-widest block uppercase">LIVE UPDATES</span>
        <h4 className="font-display text-[10px] font-black text-white mt-0.5">📊 {t('nav_dashboard')}</h4>
      </div>

      {/* Dashboard Card */}
      <div className="bg-white/5 rounded-2xl border border-white/10 p-2.5 space-y-1.5 mt-2">
        <div className="flex justify-between items-center text-[7px] font-bold text-white/50">
          <span>Среща с Мария</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping" />
            Active
          </span>
        </div>
        
        {/* Status accepted */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2 text-center text-emerald-400 font-extrabold text-[9px]">
          {t('status_accepted')} 🎉
        </div>

        {/* Details list */}
        <div className="text-[7px] space-y-1 text-white/80 font-medium">
          <div className="flex justify-between border-b border-white/5 pb-0.5">
            <span>{t('recap_when')}:</span>
            <span className="font-bold text-gradient">12 Юни в 20:00</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-0.5">
            <span>Хапване:</span>
            <span className="font-bold text-gradient">🍕 Пица</span>
          </div>
          <div className="flex justify-between text-rose-300">
            <span>{t('showcase_demo_dodge_counter')}</span>
            <span className="font-bold">14 🙈</span>
          </div>
        </div>
      </div>

      {/* Bouncing character */}
      <div className="flex justify-center my-1">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <SexyCat size={60} />
        </motion.div>
      </div>
    </div>
  )
}

/* ---------- Utility Helper: Hearts Simulation ---------- */
function MockupHearts({ active }) {
  const [hearts, setHearts] = useState([])

  useEffect(() => {
    if (!active) return
    const interval = setInterval(() => {
      setHearts((hs) => [
        ...hs.slice(-6),
        {
          id: Math.random(),
          x: 20 + Math.random() * 60,
          scale: 0.5 + Math.random() * 0.5,
          delay: Math.random() * 0.5,
        },
      ])
    }, 900)
    return () => clearInterval(interval)
  }, [active])

  if (!active) return null

  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {hearts.map((h) => (
          <motion.span
            key={h.id}
            initial={{ bottom: -20, opacity: 0, left: `${h.x}%` }}
            animate={{ bottom: '110%', opacity: [0, 0.9, 0.9, 0], scale: h.scale }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.2, ease: 'easeOut' }}
            className="absolute text-sm select-none"
          >
            💖
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}

/* ---------- Animation 4: How It Works Demo ---------- */
function HowItWorksDemo() {
  const { t } = useLang()
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4)
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  const steps = [
    { num: '1', title: t('showcase_demo_how_step_1'), icon: '✍️' },
    { num: '2', title: t('showcase_demo_how_step_2'), icon: '📤' },
    { num: '3', title: t('showcase_demo_how_step_3'), icon: '💖' },
    { num: '4', title: t('showcase_demo_how_step_4'), icon: '📊' },
  ]

  return (
    <div className="relative flex h-full w-full flex-col justify-between py-5 text-white select-none">
      <div className="text-center border-b border-white/5 pb-2">
        <span className="text-[7px] font-black text-rose-glow tracking-widest block uppercase">
          {t('showcase_demo_how_subtitle')}
        </span>
        <h4 className="font-display text-[10px] font-black text-white mt-0.5">
          {t('showcase_demo_how_title')}
        </h4>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-2 px-1 mt-2">
        {steps.map((step, idx) => {
          const isActive = idx === activeStep
          const isCompleted = idx < activeStep
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0.5, x: -5 }}
              animate={{
                opacity: isActive ? 1 : isCompleted ? 0.8 : 0.45,
                scale: isActive ? 1.04 : 1,
              }}
              transition={{ duration: 0.3 }}
              className={`flex items-center gap-2 rounded-xl p-2 border transition-all ${
                isActive
                  ? 'bg-rose-glow/10 border-rose-glow/30 shadow-[0_0_10px_rgba(255,91,138,0.15)]'
                  : 'bg-white/5 border-white/5'
              }`}
            >
              <div
                className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-[9px] font-black transition-colors ${
                  isActive
                    ? 'bg-rose-glow text-white'
                    : isCompleted
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white/10 text-white/40'
                }`}
              >
                {isCompleted ? '✓' : step.num}
              </div>
              <div className="text-[9px] text-left leading-tight">
                <span className={`block font-bold ${isActive ? 'text-rose-glow' : 'text-white/90'}`}>
                  {step.title}
                </span>
              </div>
              <span className="ml-auto text-xs">{step.icon}</span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

/* ---------- Animation 5: Security & Privacy Demo ---------- */
function SecurityDemo() {
  const { t } = useLang()
  const [pulse, setPulse] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((p) => !p)
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  const securityItems = [
    { title: t('showcase_demo_sec_item_1_title'), desc: t('showcase_demo_sec_item_1_desc') },
    { title: t('showcase_demo_sec_item_2_title'), desc: t('showcase_demo_sec_item_2_desc') },
    { title: t('showcase_demo_sec_item_3_title'), desc: t('showcase_demo_sec_item_3_desc') },
  ]

  return (
    <div className="relative flex h-full w-full flex-col justify-between py-5 text-white select-none">
      <div className="text-center border-b border-white/5 pb-2">
        <span className="text-[7px] font-black text-rose-glow tracking-widest block uppercase">
          {t('showcase_demo_sec_subtitle')}
        </span>
        <h4 className="font-display text-[10px] font-black text-white mt-0.5">
          {t('showcase_demo_sec_title')}
        </h4>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center my-2 gap-3">
        {/* Animated Shield/Lock */}
        <div className="relative my-1">
          <motion.div
            animate={{ scale: pulse ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-rose-glow/20 blur-md pointer-events-none"
          />
          <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-rose-glow to-fuchsia-600 border border-white/20 shadow-lg shadow-rose-glow/20">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
        </div>

        {/* Security checks */}
        <div className="w-full space-y-1.5 px-1">
          {securityItems.map((item, idx) => (
            <div key={idx} className="flex items-start gap-1.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-1.5">
              <span className="text-[9px] text-emerald-400 font-extrabold mt-0.5">✓</span>
              <div className="text-left leading-none">
                <span className="block text-[8px] font-black text-white/95">{item.title}</span>
                <span className="text-[6.5px] text-white/40 block mt-0.5">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-[7.5px] text-white/40 text-center font-bold">
        {t('showcase_demo_sec_footer')}
      </div>
    </div>
  )
}

/* Helper sleep function */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
