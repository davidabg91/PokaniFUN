import { useRef, useState, useCallback } from 'react'
import { useLang } from '../i18n.jsx'

const MAX_DODGES = 9 // after this many dodges the button gives up and becomes YES

// The "НЕ" button that refuses to be clicked: dodges the cursor on desktop,
// teleports on touch on mobile, stays normal size, then becomes "ДА" after max dodges.
export default function RunawayNo({ onDodge, onAccept, kind, gender }) {
  const { t } = useLang()
  
  const getTeaseKey = () => {
    if (kind !== 'friendly') return 'no_teases'
    if (gender === 'male') return 'no_teases_friendly_male'
    if (gender === 'female') return 'no_teases_friendly_female'
    return 'no_teases_friendly_other'
  }
  const TEASES = t(getTeaseKey())
  const ref = useRef(null)
  const [moved, setMoved] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [tries, setTries] = useState(0)

  const isYes = tries >= MAX_DODGES

  const jump = useCallback(() => {
    if (tries >= MAX_DODGES) return
    const el = ref.current
    const w = el?.offsetWidth || 120
    const h = el?.offsetHeight || 56
    const pad = 14
    const maxX = window.innerWidth - w - pad
    const maxY = window.innerHeight - h - pad
    const x = Math.max(pad, Math.random() * maxX)
    const y = Math.max(pad, Math.random() * maxY)
    setPos({ x, y })
    setMoved(true)
    setTries((t) => {
      const next = t + 1
      onDodge?.(next)
      return next
    })
  }, [onDodge, tries])

  const block = (e) => {
    e.preventDefault()
    e.stopPropagation()
    jump()
  }

  return (
    <button
      ref={ref}
      type="button"
      // Desktop: flee when the cursor gets near.
      onMouseEnter={isYes ? undefined : jump}
      onMouseDown={isYes ? undefined : block}
      // Mobile: teleport the instant a finger touches it, before a click fires.
      onTouchStart={isYes ? undefined : block}
      onPointerDown={isYes ? undefined : block}
      onClick={isYes ? onAccept : block}
      aria-label={isYes ? t('btn_yes') : "Не (не може да се натисне)"}
      className={`select-none whitespace-nowrap rounded-2xl border px-7 py-3.5 text-lg font-extrabold transition-all duration-300 ${
        isYes
          ? 'border-transparent bg-gradient-to-r from-rose-glow to-fuchsia-500 text-white shadow-[0_14px_34px_-8px_rgba(255,45,111,.8)] hover:scale-105 active:scale-95'
          : 'border-white/30 bg-gray-900/85 backdrop-blur-md text-white shadow-[0_8px_24px_-4px_rgba(0,0,0,.6)]'
      }`}
      style={{
        transition: 'transform .2s ease, left .25s cubic-bezier(.22,1,.36,1), top .25s cubic-bezier(.22,1,.36,1), background-color .3s, border-color .3s, shadow .3s',
        ...(moved
          ? { position: 'fixed', left: pos.x, top: pos.y, zIndex: 50 }
          : {}),
      }}
    >
      {isYes ? t('btn_yes') : TEASES[Math.min(tries, TEASES.length - 1)]}
    </button>
  )
}

