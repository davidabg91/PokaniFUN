import { motion } from 'framer-motion'
import { useMemo } from 'react'

// One-shot celebratory emoji explosion from the center of the screen.
export default function Burst({ emojis = ['🎉', '💖', '✨', '💞', '⭐', '💝'], count = 28 }) {
  const parts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (Math.PI * 2 * i) / count + Math.random()
        const dist = 120 + Math.random() * 260
        return {
          id: i,
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          rot: (Math.random() * 2 - 1) * 360,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          size: 18 + Math.random() * 26,
        }
      }),
    [count]
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center">
      {parts.map((p) => (
        <motion.span
          key={p.id}
          className="absolute"
          style={{ fontSize: p.size }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 1.2, rotate: p.rot }}
          transition={{ duration: 1.3 + Math.random() * 0.6, ease: 'easeOut' }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  )
}
