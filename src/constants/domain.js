export const DURATION = Object.freeze({
  SHORT: 'short',
  LONG: 'long',
})

export const DURATION_THRESHOLD = 4

export function isShortCareer(years) {
  return years <= DURATION_THRESHOLD
}

export const SKILL_LABELS = [
  { label: 'Lógico', key: 'logical' },
  { label: 'Creativo', key: 'creative' },
  { label: 'Social', key: 'social' },
  { label: 'Investigativo', key: 'investigative' },
]
