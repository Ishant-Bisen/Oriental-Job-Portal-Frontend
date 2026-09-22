import { useCallback, useEffect, useState } from 'react'
import {
  daysUntil,
  fetchJobs,
  fetchPublicJobs,
  postedTime,
  salaryValue,
  type Job,
  type JobsQuery,
} from '@/api/jobs'
import { useAuth } from '@/auth/AuthProvider'
import { ApiError } from '@/lib/api'

export const JOBS_PAGE_SIZE = 12

export type JobsBoardSort = 'recent' | 'deadline' | 'package'

export type JobsBoardFilters = {
  q?: string
  department?: string
  jobType?: string
  sort?: JobsBoardSort
}

function activeOnly(jobs: Job[]) {
  return jobs.filter((job) => !job.status || job.status === 'ACTIVE')
}

function sortParam(sort: JobsBoardSort | undefined) {
  if (sort === 'deadline') return 'applicationDeadline,asc'
  return 'postedDate,desc'
}

function sortJobs(list: Job[], sort: JobsBoardSort) {
  return [...list].sort((a, b) => {
    if (sort === 'package') return salaryValue(b.salary) - salaryValue(a.salary)
    if (sort === 'deadline') {
      const left = daysUntil(a.applicationDeadline) ?? Number.POSITIVE_INFINITY
      const right = daysUntil(b.applicationDeadline) ?? Number.POSITIVE_INFINITY
      return left - right
    }
    return postedTime(b) - postedTime(a)
  })
}

/**
 * Jobs board with pagination.
 * Authenticated → Spring `GET /api/jobs` (page, size, filters).
 * Guest → public preview (~10), filtered and paged on the client.
 */
export function useJobsBoard(filters: JobsBoardFilters = {}) {
  const { isAuthenticated } = useAuth()
  const [page, setPage] = useState(0)
  const [jobs, setJobs] = useState<Job[]>([])
  const [facetJobs, setFacetJobs] = useState<Job[]>([])
  const [totalJobCount, setTotalJobCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loginRequiredToSeeMore, setLoginRequiredToSeeMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const q = filters.q?.trim() || undefined
  const department =
    filters.department && filters.department !== 'All' ? filters.department : undefined
  const jobType = filters.jobType && filters.jobType !== 'All' ? filters.jobType : undefined
  const sort = filters.sort ?? 'recent'

  useEffect(() => {
    setPage(0)
  }, [isAuthenticated, q, department, jobType, sort])

  const load = useCallback(
    async (force = false) => {
      setLoading(true)
      setError(null)
      try {
        if (isAuthenticated) {
          const query: JobsQuery = {
            page,
            size: JOBS_PAGE_SIZE,
            sort: sortParam(sort),
            q,
            department,
            jobType,
          }
          const result = await fetchJobs(query)
          let content = activeOnly(result.content ?? [])
          if (sort === 'package') content = sortJobs(content, 'package')
          setJobs(content)
          setFacetJobs(content)
          setTotalJobCount(result.totalElements ?? content.length)
          setTotalPages(Math.max(result.totalPages ?? 0, content.length ? 1 : 0))
          setLoginRequiredToSeeMore(false)
        } else {
          const preview = await fetchPublicJobs(force)
          const all = activeOnly(preview.jobs ?? [])
          setFacetJobs(all)
          const filtered = sortJobs(
            all.filter((job) => {
              const hay = `${job.title} ${job.companyName} ${job.location ?? ''}`.toLowerCase()
              const matchQ = !q || hay.includes(q.toLowerCase())
              const matchDept = !department || job.department === department
              const matchType = !jobType || job.jobType === jobType
              return matchQ && matchDept && matchType
            }),
            sort,
          )
          const pages = Math.max(1, Math.ceil(filtered.length / JOBS_PAGE_SIZE) || 1)
          const safePage = Math.min(page, pages - 1)
          const start = safePage * JOBS_PAGE_SIZE
          setJobs(filtered.slice(start, start + JOBS_PAGE_SIZE))
          setTotalJobCount(preview.totalJobCount ?? filtered.length)
          setTotalPages(filtered.length === 0 ? 0 : pages)
          setLoginRequiredToSeeMore(Boolean(preview.loginRequiredToSeeMore))
        }
      } catch (err) {
        setJobs([])
        setFacetJobs([])
        setTotalJobCount(0)
        setTotalPages(0)
        setLoginRequiredToSeeMore(false)
        setError(err instanceof ApiError ? err.message : 'Could not load jobs')
      } finally {
        setLoading(false)
      }
    },
    [isAuthenticated, page, q, department, jobType, sort],
  )

  useEffect(() => {
    void load()
  }, [load])

  return {
    jobs,
    facetJobs,
    page,
    setPage,
    pageSize: JOBS_PAGE_SIZE,
    totalJobCount,
    totalPages,
    loginRequiredToSeeMore,
    isAuthenticated,
    loading,
    error,
    reload: () => void load(true),
  }
}
