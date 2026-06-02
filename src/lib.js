// Language-neutral shared data. Translatable text lives in i18n.jsx.

// Activity / food options: key + emoji. Labels come from i18n via t('activity_'+key).
export function getActivities(kind, gender) {
  if (kind !== 'friendly') {
    return [
      { key: 'restaurant', emoji: '🍽️' },
      { key: 'cinema', emoji: '🎬' },
      { key: 'walk', emoji: '🌳' },
      { key: 'bowling', emoji: '🎳' },
    ]
  }
  if (gender === 'male') {
    return [
      { key: 'beer', emoji: '🍺' },
      { key: 'match', emoji: '⚽' },
      { key: 'gaming', emoji: '🎮' },
      { key: 'billiards', emoji: '🎱' },
    ]
  }
  if (gender === 'female') {
    return [
      { key: 'gossip', emoji: '☕' },
      { key: 'cocktails', emoji: '🍷' },
      { key: 'shopping', emoji: '🛍️' },
      { key: 'beauty', emoji: '💅' },
    ]
  }
  return [
    { key: 'escape', emoji: '🎲' },
    { key: 'party', emoji: '🎵' },
    { key: 'bowling', emoji: '🎳' },
    { key: 'cinema', emoji: '🎬' },
  ]
}

export function getFoods(activityKey) {
  if (['beer', 'match', 'gaming', 'billiards'].includes(activityKey)) {
    return [
      { key: 'fries', emoji: '🍟' },
      { key: 'nuts', emoji: '🥜' },
      { key: 'burger', emoji: '🍔' },
      { key: 'bbq', emoji: '🍖' },
      { key: 'wings', emoji: '🍗' },
      { key: 'pizza', emoji: '🍕' },
    ]
  }
  if (['gossip', 'cocktails', 'shopping', 'beauty'].includes(activityKey)) {
    return [
      { key: 'cupcake', emoji: '🧁' },
      { key: 'croissant', emoji: '🥐' },
      { key: 'strawberries', emoji: '🍓' },
      { key: 'cheese', emoji: '🧀' },
      { key: 'pasta', emoji: '🍝' },
      { key: 'sushi', emoji: '🍣' },
    ]
  }
  // Default foods
  return [
    { key: 'sushi', emoji: '🍣' },
    { key: 'pizza', emoji: '🍕' },
    { key: 'burger', emoji: '🍔' },
    { key: 'pasta', emoji: '🍝' },
    { key: 'bbq', emoji: '🍖' },
    { key: 'vegan', emoji: '🥗' },
  ]
}

const EMOJIS = {
  restaurant: '🍽️',
  cinema: '🎬',
  walk: '🌳',
  bowling: '🎳',
  beer: '🍺',
  match: '⚽',
  gaming: '🎮',
  billiards: '🎱',
  gossip: '☕',
  cocktails: '🍷',
  shopping: '🛍️',
  beauty: '💅',
  escape: '🎲',
  party: '🎵',
  sushi: '🍣',
  pizza: '🍕',
  burger: '🍔',
  pasta: '🍝',
  bbq: '🍖',
  vegan: '🥗',
  fries: '🍟',
  nuts: '🥜',
  wings: '🍗',
  cupcake: '🧁',
  croissant: '🥐',
  strawberries: '🍓',
  cheese: '🧀',
}

export const activityEmoji = (key) => EMOJIS[key] || ''
export const foodEmoji = (key) => EMOJIS[key] || ''

// Floating-background emoji sets, themed by invitation kind + recipient gender.
const BG = {
  romantic: ['❤️', '💖', '💘', '💕', '💗', '💓', '💞', '💝', '💟', '❤️‍🔥'],
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
