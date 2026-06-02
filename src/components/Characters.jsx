import { motion } from 'framer-motion'

/* A soft drop shadow used by all characters */
const shadow = { filter: 'drop-shadow(0 14px 22px rgba(0,0,0,.35))' }

/* ---------- Sad / hopeful blob holding a tiny heart ---------- */
export function HopefulChar({ size = 200 }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={shadow}
      initial={{ y: 0 }}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <defs>
        <radialGradient id="bodyH" cx="40%" cy="35%" r="75%">
          <stop offset="0" stopColor="#ffe6f0" />
          <stop offset="1" stopColor="#ff9ec2" />
        </radialGradient>
      </defs>

      {/* ears */}
      <path d="M55 70 Q40 25 70 45 Z" fill="#ff9ec2" />
      <path d="M145 70 Q160 25 130 45 Z" fill="#ff9ec2" />

      {/* body */}
      <ellipse cx="100" cy="110" rx="64" ry="62" fill="url(#bodyH)" />

      {/* big hopeful eyes */}
      <g>
        <circle cx="78" cy="100" r="17" fill="#fff" />
        <circle cx="122" cy="100" r="17" fill="#fff" />
        <motion.g
          animate={{ x: [0, 2, -2, 0], y: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <circle cx="80" cy="103" r="9" fill="#3a2233" />
          <circle cx="124" cy="103" r="9" fill="#3a2233" />
          <circle cx="84" cy="99" r="3" fill="#fff" />
          <circle cx="128" cy="99" r="3" fill="#fff" />
        </motion.g>
        {/* hopeful sparkle tears */}
        <circle cx="70" cy="116" r="3.4" fill="#9fe3ff" opacity="0.8" />
        <circle cx="131" cy="116" r="3.4" fill="#9fe3ff" opacity="0.8" />
      </g>

      {/* slightly worried mouth */}
      <path
        d="M88 134 Q100 126 112 134"
        fill="none"
        stroke="#a23b63"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* blush */}
      <circle cx="62" cy="120" r="8" fill="#ff6f9f" opacity="0.45" />
      <circle cx="138" cy="120" r="8" fill="#ff6f9f" opacity="0.45" />

      {/* tiny offered heart */}
      <motion.path
        d="M100 150 l-9 -9 a6.4 6.4 0 1 1 9 -8 a6.4 6.4 0 1 1 9 8 z"
        fill="#ff2d6f"
        animate={{ scale: [1, 1.18, 1] }}
        transition={{ duration: 1.1, repeat: Infinity }}
        style={{ transformOrigin: '100px 145px' }}
      />
    </motion.svg>
  )
}

/* ---------- Happy / celebrating blob ---------- */
export function HappyChar({ size = 200 }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={shadow}
      animate={{ y: [0, -16, 0], rotate: [0, -3, 3, 0] }}
      transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
    >
      <defs>
        <radialGradient id="bodyJ" cx="40%" cy="30%" r="75%">
          <stop offset="0" stopColor="#fff4d6" />
          <stop offset="1" stopColor="#ffb84d" />
        </radialGradient>
      </defs>

      {/* arms up */}
      <path d="M44 96 Q22 70 30 58" stroke="#ffb84d" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M156 96 Q178 70 170 58" stroke="#ffb84d" strokeWidth="14" strokeLinecap="round" fill="none" />

      <ellipse cx="100" cy="112" rx="62" ry="60" fill="url(#bodyJ)" />

      {/* happy closed eyes ^ ^ */}
      <path d="M70 100 q10 -12 20 0" stroke="#5a3210" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M110 100 q10 -12 20 0" stroke="#5a3210" strokeWidth="5" fill="none" strokeLinecap="round" />

      {/* big open smile */}
      <path d="M78 124 Q100 152 122 124 Z" fill="#7a2b12" />
      <path d="M86 132 Q100 140 114 132 Z" fill="#ff7a8a" />

      <circle cx="64" cy="124" r="9" fill="#ff7a4d" opacity="0.5" />
      <circle cx="136" cy="124" r="9" fill="#ff7a4d" opacity="0.5" />

      {/* confetti sparkles */}
      {[
        [28, 40, '#ff5b8a'],
        [172, 44, '#ffd166'],
        [40, 150, '#7bd0ff'],
        [164, 150, '#b06ff0'],
      ].map(([x, y, c], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r="5"
          fill={c}
          animate={{ scale: [0, 1.4, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.25 }}
        />
      ))}
    </motion.svg>
  )
}

/* ---------- "Sexy" cat with sunglasses & rose ---------- */
export function SexyCat({ size = 220 }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 220 200"
      style={shadow}
      animate={{ rotate: [-2, 2, -2] }}
      transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <defs>
        <radialGradient id="catBody" cx="42%" cy="32%" r="80%">
          <stop offset="0" stopColor="#5b5b66" />
          <stop offset="1" stopColor="#26262e" />
        </radialGradient>
      </defs>

      {/* ears */}
      <path d="M60 58 L52 18 L92 46 Z" fill="#34343d" />
      <path d="M160 58 L168 18 L128 46 Z" fill="#34343d" />
      <path d="M64 52 L60 30 L82 46 Z" fill="#ff7aa2" />
      <path d="M156 52 L160 30 L138 46 Z" fill="#ff7aa2" />

      {/* head */}
      <ellipse cx="110" cy="100" rx="68" ry="62" fill="url(#catBody)" />

      {/* cool sunglasses */}
      <g>
        <rect x="58" y="84" width="44" height="26" rx="10" fill="#0c0c10" />
        <rect x="118" y="84" width="44" height="26" rx="10" fill="#0c0c10" />
        <rect x="100" y="92" width="20" height="6" rx="3" fill="#0c0c10" />
        {/* shine */}
        <motion.rect
          x="64" y="88" width="10" height="18" rx="4" fill="#ffffff" opacity="0.25"
          animate={{ x: [64, 90, 64] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </g>

      {/* nose + smirk */}
      <path d="M104 118 h12 l-6 7 z" fill="#ff7aa2" />
      <path d="M110 125 q-12 12 -24 4" stroke="#11111a" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M110 125 q12 10 22 2" stroke="#11111a" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* whiskers */}
      <g stroke="#cfcfe0" strokeWidth="2" strokeLinecap="round">
        <line x1="60" y1="120" x2="26" y2="114" />
        <line x1="60" y1="128" x2="28" y2="132" />
        <line x1="160" y1="120" x2="194" y2="114" />
        <line x1="160" y1="128" x2="192" y2="132" />
      </g>

      {/* rose in mouth */}
      <line x1="118" y1="132" x2="158" y2="150" stroke="#2e7d32" strokeWidth="4" strokeLinecap="round" />
      <motion.g
        animate={{ rotate: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ transformOrigin: '160px 150px' }}
      >
        <circle cx="160" cy="150" r="11" fill="#e11d48" />
        <circle cx="160" cy="150" r="5" fill="#9f1239" />
      </motion.g>

      {/* heart eyes peeking over glasses */}
      <motion.text
        x="110" y="78" textAnchor="middle" fontSize="20"
        animate={{ scale: [1, 1.25, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      >
        💕
      </motion.text>
    </motion.svg>
  )
}
