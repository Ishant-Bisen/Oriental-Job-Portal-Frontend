import { useCallback, useEffect, useState } from 'react'
import { fetchJobs, fetchPublicJobs, type Job, type PublicJobs } from '@/api/jobs'
import { useAuth } from '@/auth/AuthProvider'
import { ApiError } from '@/lib/api'

const empty: PublicJobs = { jobs: [], totalJobCount: 0, loginRequiredToSeeMore: false }

function activeOnly(jobs: Job[]) {
  return jobs.filter((job) => !job.status || job.status === 'ACTIVE')
}

/**
 * Jobs board data: public preview when logged out, full authenticated
 * `GET /api/jobs` page when logged in (per Swagger).
 */
export function useJobsBoard() {
  const { isAuthenticated } = useAuth()
  const [data, setData] = useState<PublicJobs>(empty)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(
    async (force = false) => {
      setLoading(true)
      setError(null)
      try {
        if (isAuthenticated) {
          const page = await fetchJobs({ page: 0, size: 100, sort: 'postedDate,desc' })
          const jobs = activeOnly(page.content ?? [])
          setData({
            jobs,
            totalJobCount: page.totalElements ?? jobs.length,
            loginRequiredToSeeMore: false,
          })
        } else {
          setData(await fetchPublicJobs(force))
        }
      } catch (err) {
        setData(empty)
        setError(err instanceof ApiError ? err.message : 'Could not load jobs')
      } finally {
        setLoading(false)
      }
    },
    [isAuthenticated],
  )

  useEffect(() => {
    void load()
  }, [load])

  return {
    jobs: data.jobs,
    totalJobCount: data.totalJobCount,
    loginRequiredToSeeMore: data.loginRequiredToSeeMore,
    loading,
    error,
    reload: () => void load(true),
  }
}
