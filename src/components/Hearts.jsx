import { useMemo } from 'react'

const ROMANTIC = ['❤️', '💖', '💘', '💕', '💗', '💓', '💞', '💝', '💟', '❤️‍🔥']

// A field of emoji that drift upward forever. Pure CSS animation -> buttery smooth.
// `emojis` lets the caller theme the background (romantic hearts, friendly hangout, etc.).
export default function Hearts({ count = 26, emojis = ROMANTIC }) {
  const set = emojis?.length ? emojis : ROMANTIC
  const seed = set.join('')

  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const size = 14 + Math.random() * 34
        return {
          id: i,
          left: Math.random() * 100,
          size,
          duration: 7 + Math.random() * 10,
          delay: -Math.random() * 16,
          emoji: set[Math.floor(Math.random() * set.length)],
          drift: (Math.random() * 2 - 1) * 40,
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [count, seed]
  )

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
      {items.map((h) => (
        <span
          key={h.id}
          className="absolute bottom-[-10vh] animate-float select-none will-change-transform"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            ['--drift']: `${h.drift}px`,
            filter: 'drop-shadow(0 4px 10px rgba(255,45,111,.3))',
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  )
}
