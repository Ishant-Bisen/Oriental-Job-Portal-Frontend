import { apiGet, apiPost } from '@/lib/api'

/** Matches Swagger `JobResponse.status`. */
export type JobStatus = 'ACTIVE' | 'INACTIVE'

/** Matches Swagger `JobResponse`. */
export type Job = {
  id: number
  title: string
  description?: string
  companyName: string
  location?: string
  salary?: string
  jobType?: string
  department?: string
  status?: JobStatus
  postedDate?: string
  applicationDeadline?: string
  displayPicture?: string
  createdAt?: string
  updatedAt?: string
}

/** Matches Swagger `PublicJobListResponse`. */
export type PublicJobs = {
  jobs: Job[]
  totalJobCount: number
  loginRequiredToSeeMore: boolean
}

/** Matches Swagger `PageJobResponse` (authenticated `GET /api/jobs`). */
export type JobsPage = {
  content: Job[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
  empty: boolean
}

export type JobsQuery = {
  q?: string
  location?: string
  companyName?: string
  jobType?: string
  department?: string
  page?: number
  size?: number
  sort?: string
}

const PUBLIC_PATH = '/api/public/jobs'
const AUTH_PATH = '/api/jobs'
const TTL_MS = 30_000

let cached: { at: number; data: PublicJobs } | null = null
let inflight: Promise<PublicJobs> | null = null

export function fetchPublicJobs(force = false) {
  if (!force && cached && Date.now() - cached.at < TTL_MS) {
    return Promise.resolve(cached.data)
  }

  if (!force && inflight) return inflight

  inflight = apiGet<PublicJobs>(PUBLIC_PATH)
    .then((data) => {
      const next: PublicJobs = {
        jobs: data.jobs ?? [],
        totalJobCount: data.totalJobCount ?? data.jobs?.length ?? 0,
        loginRequiredToSeeMore: Boolean(data.loginRequiredToSeeMore),
      }
      cached = { at: Date.now(), data: next }
      return next
    })
    .finally(() => {
      inflight = null
    })

  return inflight
}

/** Authenticated full job list — Spring `Pageable` query params. */
export function fetchJobs(query: JobsQuery = {}) {
  const params = new URLSearchParams()
  if (query.q) params.set('q', query.q)
  if (query.location) params.set('location', query.location)
  if (query.companyName) params.set('companyName', query.companyName)
  if (query.jobType) params.set('jobType', query.jobType)
  if (query.department) params.set('department', query.department)
  params.set('page', String(query.page ?? 0))
  params.set('size', String(query.size ?? 50))
  if (query.sort) params.set('sort', query.sort)

  return apiGet<JobsPage>(`${AUTH_PATH}?${params.toString()}`)
}

/** Matches Swagger `CandidateApplicationResponse`. */
export type JobApplication = {
  applicationId: number
  jobId: number
  jobTitle: string
  companyName?: string
  department?: string
  jobType?: string
  profilePicture?: string
  appliedAt: string
  /** Present after the placement cell (or withdraw) moves the status past APPLIED. */
  statusUpdatedAt?: string | null
  updatedAt?: string | null
  status: string
  canWithdraw: boolean
}

/** Candidate apply — `POST /api/jobs/{id}/apply` (no body). */
export function applyToJob(jobId: number) {
  return apiPost<JobApplication>(`${AUTH_PATH}/${jobId}/apply`)
}

/** Candidate’s applications — `GET /api/candidate/applications`. */
export function fetchMyApplications(filters?: { department?: string; jobType?: string }) {
  const params = new URLSearchParams()
  if (filters?.department) params.set('department', filters.department)
  if (filters?.jobType) params.set('jobType', filters.jobType)
  const qs = params.toString()
  return apiGet<JobApplication[]>(`/api/candidate/applications${qs ? `?${qs}` : ''}`)
}

/** True when the candidate already has a non-withdrawn application for this job. */
export function hasActiveApplication(apps: JobApplication[], jobId: number) {
  return apps.some(
    (app) => app.jobId === jobId && !/withdrawn/i.test(app.status ?? ''),
  )
}

/** Withdraw — `POST /api/candidate/applications/{id}/withdraw`. */
export function withdrawApplication(applicationId: number) {
  return apiPost<JobApplication>(`/api/candidate/applications/${applicationId}/withdraw`)
}

export type ApplicationStatusKey =
  | 'APPLIED'
  | 'REVIEWED'
  | 'SHORTLISTED'
  | 'REJECTED'
  | 'WITHDRAWN'
  | 'ACCEPTED'

export function normalizeApplicationStatus(status?: string): ApplicationStatusKey {
  const key = (status ?? 'APPLIED').toUpperCase() as ApplicationStatusKey
  const known: ApplicationStatusKey[] = [
    'APPLIED',
    'REVIEWED',
    'SHORTLISTED',
    'REJECTED',
    'WITHDRAWN',
    'ACCEPTED',
  ]
  return known.includes(key) ? key : 'APPLIED'
}

export function countApplicationsByStatus(apps: JobApplication[]) {
  const counts: Record<ApplicationStatusKey, number> = {
    APPLIED: 0,
    REVIEWED: 0,
    SHORTLISTED: 0,
    REJECTED: 0,
    WITHDRAWN: 0,
    ACCEPTED: 0,
  }
  for (const app of apps) {
    counts[normalizeApplicationStatus(app.status)] += 1
  }
  return counts
}

export type ApplicationStatusMeta = {
  label: string
  tone: string
  blurb: string
}

export const applicationStatusMeta: Record<ApplicationStatusKey, ApplicationStatusMeta> = {
  APPLIED: {
    label: 'Applied',
    tone: 'border-brand-400/30 bg-brand-500/10 text-brand-200',
    blurb: 'Waiting with the placement cell',
  },
  REVIEWED: {
    label: 'Under review',
    tone: 'border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan',
    blurb: 'Your profile is being screened',
  },
  SHORTLISTED: {
    label: 'Shortlisted',
    tone: 'border-neon-violet/30 bg-neon-violet/10 text-neon-violet',
    blurb: 'You moved ahead — watch for next steps',
  },
  ACCEPTED: {
    label: 'Offer / accepted',
    tone: 'border-neon-lime/30 bg-neon-lime/10 text-neon-lime',
    blurb: 'Great news from this drive',
  },
  REJECTED: {
    label: 'Not selected',
    tone: 'border-neon-pink/30 bg-neon-pink/10 text-neon-pink',
    blurb: 'This drive is closed for your application',
  },
  WITHDRAWN: {
    label: 'Withdrawn',
    tone: 'border-white/10 bg-white/[0.04] text-slate-400',
    blurb: 'You withdrew this application',
  },
}

/** Timestamp used to order / highlight status transitions. */
export function applicationStatusTime(app: JobApplication) {
  const raw = app.statusUpdatedAt || app.updatedAt || app.appliedAt
  const time = new Date(raw).getTime()
  return Number.isNaN(time) ? 0 : time
}

/**
 * Applications whose status has moved past the initial APPLIED state —
 * used for the post-login “status changes” board.
 */
export function recentStatusChanges(apps: JobApplication[], limit = 8) {
  return apps
    .filter((app) => normalizeApplicationStatus(app.status) !== 'APPLIED')
    .sort((a, b) => applicationStatusTime(b) - applicationStatusTime(a))
    .slice(0, limit)
}

export function formatApplicationWhen(iso?: string | null) {
  if (!iso) return '—'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  const diff = Date.now() - date.getTime()
  const mins = Math.round(diff / 60_000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

const DAY = 86_400_000

export function daysUntil(iso?: string) {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)
  return Math.round((date.getTime() - today.getTime()) / DAY)
}

export function postedLabel(job: Job) {
  const raw = job.postedDate || job.createdAt
  if (!raw) return null
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return null
  const days = Math.round((Date.now() - date.getTime()) / DAY)
  if (days <= 0) return 'Today'
  if (days === 1) return '1 day ago'
  if (days < 7) return `${days} days ago`
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export function postedTime(job: Job) {
  const raw = job.postedDate || job.createdAt
  if (!raw) return 0
  const time = new Date(raw).getTime()
  return Number.isNaN(time) ? 0 : time
}

export function salaryValue(salary?: string) {
  return Number((salary ?? '').replace(/[^\d.]/g, '')) || 0
}

export function uniqueValues(values: Array<string | undefined>) {
  return [...new Set(values.map((value) => value?.trim()).filter(Boolean) as string[])].sort()
}
