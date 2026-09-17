import { apiGet } from '@/lib/api'

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
