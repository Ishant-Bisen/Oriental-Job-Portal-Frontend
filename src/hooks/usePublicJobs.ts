import { useCallback, useEffect, useState } from 'react'
import { fetchPublicJobs, type PublicJobs } from '@/api/jobs'
import { ApiError } from '@/lib/api'

const empty: PublicJobs = { jobs: [], totalJobCount: 0, loginRequiredToSeeMore: false }

export function usePublicJobs() {
  const [data, setData] = useState<PublicJobs>(empty)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (force = false) => {
    setLoading(true)
    setError(null)
    try {
      setData(await fetchPublicJobs(force))
    } catch (err) {
      setData(empty)
      setError(err instanceof ApiError ? err.message : 'Could not load jobs')
    } finally {
      setLoading(false)
    }
  }, [])

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
