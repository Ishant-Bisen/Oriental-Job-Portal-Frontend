import {
  daysUntil,
  fetchJobs,
  fetchMyApplications,
  fetchPublicJobs,
  type Job,
  type JobApplication,
} from '@/api/jobs'
import { eventDate, type CampusEvent, workshopEvents } from '@/data/events'

/** Slug for logo CDN; LogoTile falls back to initials on miss. */
export function companySlug(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 32)
}

/** Prefer items starting / closing within this window (hours-scale urgency). */
const NEAR_HORIZON_MS = 72 * 3600_000

export type NextSpotlight = {
  id: string
  /** Section eyebrow above the timer. */
  label: string
  title: string
  subtitle: string
  companySlug?: string
  companyName?: string
  targetMs: number
  kind: 'drive' | 'deadline' | 'event'
  href: string
}

function firstClockMatch(time: string): { h: number; m: number } | null {
  const match = time.match(/(\d{1,2}):(\d{2})/)
  if (!match) return null
  return { h: Number(match[1]), m: Number(match[2]) }
}

/** Absolute start (or close) time for a campus calendar card. */
export function eventTargetMs(event: CampusEvent): number | null {
  const base = eventDate(event.dayOffset)
  const clock = firstClockMatch(event.time)
  if (clock) {
    base.setHours(clock.h, clock.m, 0, 0)
  } else if (/closes/i.test(event.time)) {
    base.setHours(23, 59, 0, 0)
  } else {
    base.setHours(9, 0, 0, 0)
  }
  const ms = base.getTime()
  return Number.isNaN(ms) ? null : ms
}

export function jobDeadlineMs(job: Job): number | null {
  if (!job.applicationDeadline) return null
  const ms = new Date(job.applicationDeadline).getTime()
  return Number.isNaN(ms) ? null : ms
}

function pickSoonest(items: NextSpotlight[]): NextSpotlight | null {
  const now = Date.now()
  const future = items
    .filter((item) => item.targetMs > now)
    .sort((a, b) => a.targetMs - b.targetMs)
  if (!future.length) return null
  const near = future.filter((item) => item.targetMs - now <= NEAR_HORIZON_MS)
  return near[0] ?? future[0]
}

function spotlightFromJob(job: Job, personal: boolean): NextSpotlight | null {
  const targetMs = jobDeadlineMs(job)
  if (targetMs == null) return null
  const venue = job.location?.trim() || 'Campus / Online'
  return {
    id: `job-${job.id}`,
    label: personal ? 'Your drive reporting in' : 'Next application closes in',
    title: `${job.companyName} · ${job.title}`,
    subtitle: `${venue} · apply by ${new Date(targetMs).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })}`,
    companySlug: companySlug(job.companyName),
    companyName: job.companyName,
    targetMs,
    kind: 'deadline',
    href: '/jobs',
  }
}

function spotlightFromEvent(event: CampusEvent, personal: boolean): NextSpotlight | null {
  const targetMs = eventTargetMs(event)
  if (targetMs == null) return null
  const isDrive = event.kind === 'drive' || event.kind === 'deadline'
  const label = personal
    ? isDrive
      ? 'Your drive reporting in'
      : 'Your next event starts in'
    : isDrive
      ? 'Next drive reporting in'
      : 'Next event starts in'
  return {
    id: event.id,
    label,
    title: event.title,
    subtitle: `${event.venue} · ${event.time}`,
    companySlug: event.company?.slug,
    companyName: event.company?.name,
    targetMs,
    kind: isDrive ? (event.kind === 'deadline' ? 'deadline' : 'drive') : 'event',
    href: '/#events',
  }
}

function activeApplicationJobIds(apps: JobApplication[]) {
  return new Set(
    apps
      .filter((app) => !/withdrawn|rejected/i.test(app.status ?? ''))
      .map((app) => app.jobId),
  )
}

/**
 * Candidate spotlight — only jobs the student has applied to.
 * Returns null when there are no active applications with an upcoming deadline.
 */
export async function fetchCandidateSpotlight(): Promise<NextSpotlight | null> {
  const [apps, publicJobs] = await Promise.all([fetchMyApplications(), fetchPublicJobs()])
  const appliedIds = activeApplicationJobIds(apps)
  if (!appliedIds.size) return null

  const byId = new Map<number, Job>()
  for (const job of publicJobs.jobs) {
    if (appliedIds.has(job.id)) byId.set(job.id, job)
  }

  // Public list may be truncated — fill gaps from the authenticated jobs board.
  const missing = [...appliedIds].filter((id) => !byId.has(id))
  if (missing.length) {
    try {
      const page = await fetchJobs({ size: 100 })
      for (const job of page.content ?? []) {
        if (appliedIds.has(job.id)) byId.set(job.id, job)
      }
    } catch {
      /* keep whatever we have from public jobs */
    }
  }

  const spots = [...byId.values()]
    .map((job) => spotlightFromJob(job, true))
    .filter((s): s is NextSpotlight => s != null)

  return pickSoonest(spots)
}

/**
 * Landing / guest spotlight — soonest public job deadline or campus event
 * within the next few hours (falls back to the nearest upcoming overall).
 */
export async function fetchLandingSpotlight(): Promise<NextSpotlight | null> {
  const [{ jobs }, workshops] = await Promise.all([fetchPublicJobs(), fetchCalendarWorkshops()])
  const fromJobs = jobs
    .map((job) => spotlightFromJob(job, false))
    .filter((s): s is NextSpotlight => s != null)
  const fromEvents = workshops
    .map((event) => spotlightFromEvent(event, false))
    .filter((s): s is NextSpotlight => s != null)
  return pickSoonest([...fromJobs, ...fromEvents])
}

/**
 * Resolve the countdown card for the current viewer.
 * Candidates with applications get a personal drive deadline; everyone else gets campus-wide soonest.
 */
export async function fetchNextSpotlight(isCandidate: boolean): Promise<NextSpotlight | null> {
  if (isCandidate) {
    try {
      const personal = await fetchCandidateSpotlight()
      if (personal) return personal
    } catch {
      /* fall through to public spotlight */
    }
  }
  return fetchLandingSpotlight()
}

/**
 * Map a portal job → calendar drive / deadline card.
 * Placed on application deadline (or posted date when deadline is missing).
 */
export function jobToDriveEvent(job: Job): CampusEvent | null {
  const deadlineOffset = daysUntil(job.applicationDeadline)
  const postedOffset = daysUntil(job.postedDate || job.createdAt)

  let dayOffset: number
  let kind: CampusEvent['kind'] = 'drive'

  if (deadlineOffset != null) {
    // Skip jobs whose deadline has already passed.
    if (deadlineOffset < -1) return null
    dayOffset = deadlineOffset
    if (deadlineOffset >= 0 && deadlineOffset <= 3) kind = 'deadline'
  } else if (postedOffset != null) {
    dayOffset = Math.max(0, postedOffset)
  } else {
    dayOffset = 0
  }

  const deadlineLabel = job.applicationDeadline
    ? new Date(job.applicationDeadline).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
      })
    : null

  const tags = [job.department, job.jobType, job.location].filter(Boolean) as string[]

  return {
    id: `job-${job.id}`,
    title: `${job.companyName} — ${job.title}`,
    kind,
    dayOffset,
    time: deadlineLabel ? `Apply by ${deadlineLabel}` : 'Open for applications',
    venue: job.location?.trim() || 'Campus / Online',
    seats: 0,
    registered: 0,
    summary:
      job.description?.trim() ||
      `${job.title} at ${job.companyName}. Open the full JD for eligibility and package details.`,
    tags: tags.length ? tags : ['Campus hiring'],
    company: {
      name: job.companyName,
      slug: companySlug(job.companyName),
      role: job.title,
      ctc: job.salary?.trim() || 'As per company norms',
      eligibility: job.department
        ? `${job.department} · see JD for full criteria`
        : 'See job description for eligibility',
      jobId: String(job.id),
    },
  }
}

/**
 * Drives source — live jobs from `GET /api/public/jobs`.
 * Replace with a dedicated drives endpoint later if needed.
 */
export async function fetchCalendarDrives(): Promise<CampusEvent[]> {
  const { jobs } = await fetchPublicJobs()
  return jobs.map(jobToDriveEvent).filter((e): e is CampusEvent => e != null)
}

/**
 * Workshops / seminars / hackathons — mock until the events API exists.
 * Kept async so the calendar already uses two parallel source calls.
 */
export async function fetchCalendarWorkshops(): Promise<CampusEvent[]> {
  await Promise.resolve()
  return workshopEvents
}

/** Load drives (API) + workshops (mock) in parallel. */
export async function fetchCampusCalendar(): Promise<CampusEvent[]> {
  const [drives, workshops] = await Promise.all([
    fetchCalendarDrives(),
    fetchCalendarWorkshops(),
  ])
  return [...drives, ...workshops].sort((a, b) => a.dayOffset - b.dayOffset)
}

export { eventDate }
