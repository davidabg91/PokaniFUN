import { useRef, useState, useCallback } from 'react'
import { useLang } from '../i18n.jsx'

const MAX_DODGES = 9 // after this many dodges the button gives up and vanishes

// The "НЕ" button that refuses to be clicked: dodges the cursor on desktop,
// teleports on touch on mobile, shrinks with every attempt, then disappears.
export default function RunawayNo({ onDodge }) {
  const { t } = useLang()
  const TEASES = t('no_teases')
  const ref = useRef(null)
  const [moved, setMoved] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [tries, setTries] = useState(0)
  const [gone, setGone] = useState(false)

  const jump = useCallback(() => {
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
      if (next >= MAX_DODGES) setGone(true)
      return next
    })
  }, [onDodge])

  const block = (e) => {
    e.preventDefault()
    e.stopPropagation()
    jump()
  }

  if (gone) return null

  // Shrink as it gets chased, but never smaller than a tiny nub.
  const scale = Math.max(0.32, 1 - tries * 0.1)

  return (
    <button
      ref={ref}
      type="button"
      // Desktop: flee when the cursor gets near.
      onMouseEnter={jump}
      onMouseDown={block}
      // Mobile: teleport the instant a finger touches it, before a click fires.
      onTouchStart={block}
      onPointerDown={block}
      onClick={block}
      aria-label="Не (не може да се натисне)"
      className="select-none whitespace-nowrap rounded-2xl border border-white/20 bg-white/10 px-7 py-3.5 text-lg font-extrabold text-white/80 backdrop-blur"
      style={{
        transform: `scale(${scale})`,
        transition: 'transform .2s ease, left .25s cubic-bezier(.22,1,.36,1), top .25s cubic-bezier(.22,1,.36,1)',
        ...(moved
          ? { position: 'fixed', left: pos.x, top: pos.y, zIndex: 50 }
          : {}),
      }}
    >
      {TEASES[Math.min(tries, TEASES.length - 1)]}
    </button>
  )
}
