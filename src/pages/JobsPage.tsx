import { ArrowLeft, ChevronLeft, ChevronRight, Filter, Search, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { daysUntil, uniqueValues, type Job } from '@/api/jobs'
import { useAuth } from '@/auth/AuthProvider'
import { ApplicationStatusUpdates } from '@/components/sections/ApplicationStatusUpdates'
import { JobCard } from '@/components/jobs/JobCard'
import { JobModal } from '@/components/jobs/JobModal'
import { useJobsBoard, type JobsBoardSort } from '@/hooks/useJobsBoard'
import { cn } from '@/lib/utils'

const sorts: { key: JobsBoardSort; label: string }[] = [
  { key: 'recent', label: 'Most recent' },
  { key: 'deadline', label: 'Closing soon' },
  { key: 'package', label: 'Highest package' },
]

function pageWindow(current: number, total: number) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i)
  const pages = new Set<number>([0, total - 1, current, current - 1, current + 1])
  return [...pages].filter((p) => p >= 0 && p < total).sort((a, b) => a - b)
}

export default function JobsPage() {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()
  const isCandidate = isAuthenticated && /candidate|student/i.test(user?.role ?? '')

  const [query, setQuery] = useState('')
  const [dept, setDept] = useState('All')
  const [type, setType] = useState('All')
  const [sort, setSort] = useState<JobsBoardSort>('recent')
  const [active, setActive] = useState<Job | null>(null)

  const {
    jobs,
    facetJobs,
    page,
    setPage,
    pageSize,
    totalJobCount,
    totalPages,
    loginRequiredToSeeMore,
    loading,
    error,
    reload,
  } = useJobsBoard({
    q: query,
    department: dept,
    jobType: type,
    sort,
  })

  useEffect(() => {
    if (location.hash !== '#application-status') return
    const t = window.setTimeout(() => {
      document.getElementById('application-status')?.scrollIntoView({ behavior: 'smooth' })
    }, 80)
    return () => window.clearTimeout(t)
  }, [location.hash, isCandidate])

  const departments = useMemo(
    () => ['All', ...uniqueValues(facetJobs.map((job) => job.department))],
    [facetJobs],
  )
  const types = useMemo(
    () => ['All', ...uniqueValues(facetJobs.map((job) => job.jobType))],
    [facetJobs],
  )

  const closingThisWeek = useMemo(
    () =>
      facetJobs
        .map((job) => ({ job, days: daysUntil(job.applicationDeadline) }))
        .filter((item) => item.days != null && item.days >= 0 && item.days <= 7)
        .sort((a, b) => (a.days ?? 0) - (b.days ?? 0)),
    [facetJobs],
  )

  const hasFilters = Boolean(query) || dept !== 'All' || type !== 'All'
  const from = totalJobCount === 0 ? 0 : page * pageSize + 1
  const to = Math.min(totalJobCount, page * pageSize + jobs.length)
  const pages = pageWindow(page, totalPages)

  return (
    <div className="pb-24">
      {isCandidate ? <ApplicationStatusUpdates /> : null}

      <div
        id="jobs-board"
        className={cn('container-x', isCandidate ? 'pt-4 sm:pt-6' : 'pt-28 sm:pt-32')}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-slate-400 transition hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-[2.6rem]">
              Jobs board <span className="text-gradient-animated">for batch 2026</span>
            </h1>
            <p className="mt-3 max-w-2xl text-[13.5px] leading-relaxed text-slate-400">
              Active openings from the placement portal. Search by role, company or location.
            </p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
            <p className="font-display text-xl font-bold text-white">{totalJobCount || jobs.length}</p>
            <p className="mt-0.5 text-[10.5px] uppercase tracking-wide text-slate-500">Live roles</p>
          </div>
        </div>

        <div className="mt-9 rounded-[26px] border border-white/10 bg-ink-900/55 p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-full border border-white/10 bg-ink-950/60 px-4 py-2.5">
              <Search className="h-4 w-4 shrink-0 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search role, company or location"
                className="min-w-0 flex-1 bg-transparent text-[13px] text-white placeholder:text-slate-600 focus:outline-none"
              />
              {query ? (
                <button type="button" onClick={() => setQuery('')} aria-label="Clear search">
                  <X className="h-3.5 w-3.5 text-slate-500 hover:text-white" />
                </button>
              ) : null}
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-ink-950/60 px-3.5 py-2.5">
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as JobsBoardSort)}
                className="bg-transparent text-[12.5px] font-semibold text-slate-200 focus:outline-none [&>option]:bg-ink-900"
              >
                {sorts.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {departments.length > 1 ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="mr-1 hidden items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-slate-500 sm:flex">
                <Filter className="h-3 w-3" />
                Department
              </span>
              {departments.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDept(d)}
                  className={cn(
                    'rounded-full border px-3.5 py-1.5 text-[11.5px] font-semibold transition',
                    dept === d
                      ? 'border-brand-400/50 bg-brand-500/15 text-white'
                      : 'border-white/10 bg-white/[0.03] text-slate-400 hover:text-white',
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          ) : null}

          {types.length > 1 ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {types.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={cn(
                    'rounded-full border px-3.5 py-1.5 text-[11.5px] font-semibold transition',
                    type === t
                      ? 'border-neon-cyan/50 bg-neon-cyan/12 text-white'
                      : 'border-white/10 bg-white/[0.03] text-slate-400 hover:text-white',
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          ) : null}

          {hasFilters ? (
            <div className="mt-4 flex items-center gap-3 border-t border-white/[0.06] pt-3.5">
              <p className="text-[11.5px] text-slate-400">
                Showing <span className="font-bold text-white">{jobs.length}</span>
                {totalJobCount ? <> of {totalJobCount}</> : null} roles
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setDept('All')
                  setType('All')
                }}
                className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-semibold text-slate-300 transition hover:text-white"
              >
                <X className="h-3 w-3" />
                Clear filters
              </button>
            </div>
          ) : null}
        </div>

        {loading ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-[26px] border border-white/[0.07] bg-white/[0.03]"
              />
            ))}
          </div>
        ) : null}

        {error && !loading ? (
          <div className="mt-6 rounded-3xl border border-neon-pink/20 bg-neon-pink/[0.06] p-10 text-center">
            <p className="font-display text-base font-bold text-white">Could not load jobs</p>
            <p className="mx-auto mt-2 max-w-md text-[12.5px] text-slate-400">{error}</p>
            <button type="button" onClick={() => void reload()} className="btn-ghost mt-5 text-[12.5px]">
              Try again
            </button>
          </div>
        ) : null}

        {!loading && !error ? (
          <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_16rem]">
            <div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} onOpen={() => setActive(job)} />
                ))}
                {jobs.length === 0 ? (
                  <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-14 text-center sm:col-span-2">
                    <p className="font-display text-base font-bold text-white">
                      {totalJobCount === 0 ? 'No live jobs yet' : 'No roles match those filters'}
                    </p>
                    <p className="mx-auto mt-2 max-w-sm text-[12.5px] text-slate-500">
                      {totalJobCount === 0
                        ? 'New openings will show up here as soon as they are posted.'
                        : 'Clear filters or try a different search.'}
                    </p>
                  </div>
                ) : null}
              </div>

              {totalPages > 1 ? (
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-ink-900/50 px-4 py-3.5">
                  <p className="text-[12px] text-slate-400">
                    Showing <span className="font-semibold text-white">{from}–{to}</span> of{' '}
                    <span className="font-semibold text-white">{totalJobCount}</span>
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={page <= 0}
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition hover:border-brand-400/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    {pages.map((p, i) => {
                      const prev = pages[i - 1]
                      const gap = prev != null && p - prev > 1
                      return (
                        <span key={p} className="flex items-center gap-1.5">
                          {gap ? <span className="px-1 text-[12px] text-slate-600">…</span> : null}
                          <button
                            type="button"
                            onClick={() => setPage(p)}
                            className={cn(
                              'grid h-9 min-w-9 place-items-center rounded-xl border px-2.5 text-[12.5px] font-semibold transition',
                              p === page
                                ? 'border-brand-400/50 bg-brand-500/20 text-white'
                                : 'border-white/10 bg-white/[0.03] text-slate-400 hover:text-white',
                            )}
                            aria-label={`Page ${p + 1}`}
                            aria-current={p === page ? 'page' : undefined}
                          >
                            {p + 1}
                          </button>
                        </span>
                      )
                    })}
                    <button
                      type="button"
                      disabled={page >= totalPages - 1}
                      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                      className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition hover:border-brand-400/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                      aria-label="Next page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-4">
                <div className="rounded-3xl border border-white/10 bg-ink-900/55 p-5">
                  <h3 className="text-[13px] font-bold text-white">Closing this week</h3>
                  <div className="mt-3.5 space-y-2.5">
                    {closingThisWeek.length === 0 ? (
                      <p className="text-[12px] leading-relaxed text-slate-500">
                        No roles close in the next 7 days.
                      </p>
                    ) : null}
                    {closingThisWeek.map(({ job, days }) => (
                      <button
                        key={job.id}
                        type="button"
                        onClick={() => setActive(job)}
                        className="flex w-full items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2.5 text-left transition hover:border-neon-pink/30"
                      >
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-neon-pink/12 font-display text-[11px] font-bold text-neon-pink">
                          {days}d
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[11.5px] font-bold text-white">
                            {job.companyName}
                          </span>
                          <span className="block truncate text-[10.5px] text-slate-500">{job.title}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                {loginRequiredToSeeMore ? (
                  <p className="px-1 text-[11.5px] leading-relaxed text-slate-500">
                    Public preview only.{' '}
                    <Link to="/login" className="font-semibold text-brand-300 hover:text-brand-200">
                      Sign in
                    </Link>{' '}
                    to browse every opening with pagination and apply.
                  </p>
                ) : null}
              </div>
            </aside>
          </div>
        ) : null}
      </div>

      <JobModal job={active} open={!!active} onClose={() => setActive(null)} />
    </div>
  )
}
