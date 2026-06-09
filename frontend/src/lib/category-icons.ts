export const CATEGORY_ICON_OPTIONS = [
  'utensils',
  'car',
  'home',
  'film',
  'pill',
  'book-open',
  'shopping-cart',
  'coffee',
  'wallet',
  'laptop',
  'chart-line',
  'gift',
  'plane',
  'paw-print',
  'gamepad-2',
  'dumbbell'
]

const ICON_BY_NAME: Record<string, string> = {
  utensils: '🍽️',
  car: '🚗',
  home: '🏠',
  film: '🎬',
  pill: '💊',
  'book-open': '📚',
  'shopping-cart': '🛒',
  coffee: '☕',
  wallet: '💰',
  laptop: '💻',
  'chart-line': '📈',
  gift: '🎁',
  plane: '✈️',
  'paw-print': '🐾',
  'gamepad-2': '🎮',
  dumbbell: '🏋️'
}

const ICON_NAME_ALIASES: Record<string, string> = {
  '🍽️': 'utensils',
  '🚗': 'car',
  '🏠': 'home',
  '🎬': 'film',
  '💊': 'pill',
  '📚': 'book-open',
  '🛒': 'shopping-cart',
  '☕': 'coffee',
  '💰': 'wallet',
  '💻': 'laptop',
  '📈': 'chart-line',
  '🎁': 'gift',
  '✈️': 'plane',
  '🐾': 'paw-print',
  '🎮': 'gamepad-2',
  '🏋️': 'dumbbell',
  food: 'utensils',
  restaurant: 'utensils',
  transport: 'car',
  house: 'home',
  movie: 'film',
  entertainment: 'film',
  health: 'pill',
  medicine: 'pill',
  book: 'book-open',
  education: 'book-open',
  shopping: 'shopping-cart',
  cart: 'shopping-cart',
  money: 'wallet',
  subscription: 'wallet',
  subscriptions: 'wallet',
  assinatura: 'wallet',
  assinaturas: 'wallet',
  computer: 'laptop',
  investment: 'chart-line',
  chart: 'chart-line',
  travel: 'plane',
  pet: 'paw-print',
  game: 'gamepad-2',
  gym: 'dumbbell',
  fitness: 'dumbbell'
}

export const normalizeCategoryIconName = (icon?: string | null) => {
  if (!icon) return 'utensils'

  const trimmed = icon.trim()
  if (CATEGORY_ICON_OPTIONS.includes(trimmed)) return trimmed

  return ICON_NAME_ALIASES[trimmed.toLowerCase()] ?? 'utensils'
}

export const getCategoryIcon = (icon?: string | null) =>
  ICON_BY_NAME[normalizeCategoryIconName(icon)] ?? ICON_BY_NAME.utensils
