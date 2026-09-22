import { apiGet } from '@/lib/api'
import {
  buildMetaLabel,
  type Update,
  type UpdateFlag,
  type UpdateTag,
  UPDATE_FLAGS,
  UPDATE_TAGS,
} from '@/data/updates'

/** Matches backend `UpdateTag`. */
export type { UpdateTag }

/** Matches Swagger `LatestUpdateResponse`. */
export type LatestUpdate = {
  id: number
  title: string
  description: string
  tag: UpdateTag
  appliedCount?: number | null
  registrationCount?: number | null
  shortlistedCount?: number | null
  totalOpenings?: number | null
  attentionNeeded?: boolean | null
  closingSoon?: boolean | null
  needYourAttention?: boolean | null
  /** Server-built badge text, e.g. "12 applied", "Closing soon". */
  metaLabel: string
  createdAt: string
}

const PUBLIC_PATH = '/api/public/updates'

export function fetchPublicUpdates() {
  return apiGet<LatestUpdate[]>(PUBLIC_PATH)
}

function isUpdateTag(value: string): value is UpdateTag {
  return (UPDATE_TAGS as readonly string[]).includes(value)
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const diffSec = Math.max(0, Math.floor((Date.now() - then) / 1000))
  if (diffSec < 60) return 'just now'
  const mins = Math.floor(diffSec / 60)
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

/** Map API payload → UI `Update` (icons/filters consume this shape). */
export function toUiUpdate(item: LatestUpdate): Update | null {
  if (!isUpdateTag(item.tag)) return null

  const flags: UpdateFlag[] = []
  // One attention flag only — avoid duplicate chips in the UI.
  if (item.needYourAttention) flags.push('NEED_YOUR_ATTENTION')
  else if (item.attentionNeeded) flags.push('ATTENTION_NEEDED')
  if (item.closingSoon) flags.push('CLOSING_SOON')

  // Keep only known flags (defensive if API adds more later)
  const safeFlags = flags.filter((f) => (UPDATE_FLAGS as readonly string[]).includes(f))

  const base: Update = {
    id: String(item.id),
    tag: item.tag,
    title: item.title,
    description: item.description,
    time: relativeTime(item.createdAt),
    flags: safeFlags.length ? safeFlags : undefined,
    appliedCount: item.appliedCount,
    registrationCount: item.registrationCount,
    shortlistedCount: item.shortlistedCount,
    totalOpenings: item.totalOpenings,
    metaLabel: item.metaLabel,
  }

  return {
    ...base,
    metaLabel: buildMetaLabel(base),
  }
}
