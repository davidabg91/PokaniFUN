import { useMemo } from 'react'

const ROMANTIC = ['❤️', '💖', '💘', '💕', '💗', '💓', '💞', '💝', '💟', '❤️‍🔥']
const PINK_SHADES = [
  '#ff4b82', // Rose pink
  '#ff6b9d', // Pastel pink
  '#ff2d70', // Deep pink
  '#f472b6', // Hot pink
  '#ec4899', // Magenta-pink
  '#f43f5e', // Vibrant rose
  '#fda4af', // Light pink
]

// A field of elements that drift upward forever. Pure CSS animation -> buttery smooth.
// For romantic kind, we render beautiful custom vector SVG hearts in pink shades that "gush" from the bottom center.
// For friendly kind, we fall back to the themed emojis (beer, pizza, stars, etc.) spreading evenly.
export default function Hearts({ count = 26, emojis = ROMANTIC, kind = 'romantic' }) {
  const isRomantic = kind === 'romantic'
  const set = emojis?.length ? emojis : ROMANTIC
  const seed = set.join('') + kind

  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const size = isRomantic 
          ? 16 + Math.random() * 32  // Custom sizes for SVGs
          : 14 + Math.random() * 34  // Emoji sizes
          
        // Gushing/fountain effect for romantic hearts: cluster around bottom-center
        const left = isRomantic
          ? 38 + Math.random() * 24  // Starts between 38% and 62%
          : Math.random() * 100      // Spreads evenly for friendly invites
          
        const drift = isRomantic
          ? (Math.random() * 2 - 1) * 360  // Wide spread as they rise
          : (Math.random() * 2 - 1) * 40   // Mild drift for emojis
          
        return {
          id: i,
          left,
          size,
          duration: isRomantic
            ? 6 + Math.random() * 7        // Flow speed
            : 7 + Math.random() * 10,
          delay: -Math.random() * 15,
          emoji: set[Math.floor(Math.random() * set.length)],
          drift,
          color: isRomantic 
            ? PINK_SHADES[Math.floor(Math.random() * PINK_SHADES.length)]
            : undefined,
          opacity: isRomantic 
            ? 0.35 + Math.random() * 0.5   // Translucent layering
            : undefined,
        }
      }),
    [count, seed, isRomantic]
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
            width: isRomantic ? `${h.size}px` : undefined,
            height: isRomantic ? `${h.size}px` : undefined,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            ['--drift']: `${h.drift}px`,
            color: h.color,
            opacity: h.opacity,
            filter: isRomantic 
              ? 'drop-shadow(0 4px 12px rgba(255,75,130,0.35))'
              : 'drop-shadow(0 4px 10px rgba(255,45,111,.3))',
          }}
        >
          {isRomantic ? (
            <svg
              className="w-full h-full fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 4.248c-3.148-5.402-12-3.825-12 2.944 0 4.661 5.571 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z" />
            </svg>
          ) : (
            h.emoji
          )}
        </span>
      ))}
    </div>
  )
}
