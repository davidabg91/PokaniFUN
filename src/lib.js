// Language-neutral shared data. Translatable text lives in i18n.jsx.

// Activity / food options: key + emoji. Labels come from i18n via t('activity_'+key).
export const ACTIVITIES = [
  { key: 'restaurant', emoji: '🍽️' },
  { key: 'cinema', emoji: '🎬' },
  { key: 'walk', emoji: '🌳' },
  { key: 'bowling', emoji: '🎳' },
]

export const FOODS = [
  { key: 'sushi', emoji: '🍣' },
  { key: 'pizza', emoji: '🍕' },
  { key: 'burger', emoji: '🍔' },
  { key: 'pasta', emoji: '🍝' },
  { key: 'bbq', emoji: '🍖' },
  { key: 'vegan', emoji: '🥗' },
]

export const activityEmoji = (key) =>
  ACTIVITIES.find((a) => a.key === key)?.emoji || ''
export const foodEmoji = (key) => FOODS.find((f) => f.key === key)?.emoji || ''

// Floating-background emoji sets, themed by invitation kind + recipient gender.
const BG = {
  romantic: ['❤️', '💖', '💘', '💕', '💗', '💓', '🌹', '✨', '💞', '😍'],
  friendlyMale: ['🍺', '⚽', '🎮', '🏀', '🎸', '🍕', '😎', '🚗', '🏆', '🎯', '🎲', '🥁'],
  friendlyFemale: ['☕', '🍷', '🛍️', '💅', '🌸', '🧁', '📸', '💃', '🎶', '🥂', '🌷', '🍓'],
  friendlyOther: ['🎉', '🍕', '☕', '🎮', '🍺', '🎶', '😄', '🎲', '🍿', '🥤', '🎸', '🏓'],
}

export function bgEmojis(kind, gender) {
  if (kind !== 'friendly') return BG.romantic
  if (gender === 'male') return BG.friendlyMale
  if (gender === 'female') return BG.friendlyFemale
  return BG.friendlyOther
}

export function isMobile() {
  if (typeof navigator === 'undefined') return false
  return (
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints || 0) > 1
  )
}
