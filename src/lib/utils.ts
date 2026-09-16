export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

const gradients = [
  'from-brand-500 to-neon-violet',
  'from-neon-cyan to-brand-500',
  'from-neon-violet to-neon-pink',
  'from-neon-amber to-neon-pink',
  'from-neon-lime to-neon-cyan',
  'from-brand-400 to-neon-cyan',
]

export function gradientFor(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) % 997
  return gradients[hash % gradients.length]
}

export function formatDate(date: Date) {
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export function weekdayShort(date: Date) {
  return date.toLocaleDateString('en-IN', { weekday: 'short' })
}

export function relativeDayLabel(date: Date) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.round((date.getTime() - today.getTime()) / 86_400_000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff < 0) return `${Math.abs(diff)}d ago`
  return `In ${diff} days`
}

export function scoreTone(score: number) {
  if (score >= 90) return { text: 'text-neon-lime', ring: 'stroke-neon-lime', label: 'Excellent match' }
  if (score >= 80) return { text: 'text-neon-cyan', ring: 'stroke-neon-cyan', label: 'Strong match' }
  if (score >= 70) return { text: 'text-neon-amber', ring: 'stroke-neon-amber', label: 'Fair match' }
  return { text: 'text-neon-pink', ring: 'stroke-neon-pink', label: 'Needs work' }
}
