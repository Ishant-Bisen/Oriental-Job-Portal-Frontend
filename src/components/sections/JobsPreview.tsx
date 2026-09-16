import { ArrowRight, Filter } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { uniqueValues, type Job } from '@/api/jobs'
import { JobCard } from '@/components/jobs/JobCard'
import { JobModal } from '@/components/jobs/JobModal'
import { SectionHeading } from '@/components/ui/primitives'
import { usePublicJobs } from '@/hooks/usePublicJobs'
import { cn } from '@/lib/utils'

const PREVIEW_COUNT = 4

export function JobsPreview() {
  const { jobs, totalJobCount, loginRequiredToSeeMore, loading, error, reload } = usePublicJobs()
  const [dept, setDept] = useState('All')
  const [active, setActive] = useState<Job | null>(null)

  const departments = useMemo(() => ['All', ...uniqueValues(jobs.map((job) => job.department))], [jobs])
  const filtered = (dept === 'All' ? jobs : jobs.filter((job) => job.department === dept)).slice(0, PREVIEW_COUNT)
  const remaining = Math.max(0, totalJobCount - filtered.length)

  return (
    <section id="jobs" className="section-pad relative">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            align="left"
            eyebrow="Live openings"
            title="Fresh roles from"
            highlight="the placement cell."
            description="Latest active jobs from the portal. Open a card for the full description."
            className="max-w-2xl"
          />
          <Link to="/jobs" className="btn-primary group shrink-0">
            {totalJobCount > 0 ? `See all ${totalJobCount} openings` : 'See all openings'}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {departments.length > 1 && (
          <div className="no-scrollbar mt-10 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="mr-1 hidden shrink-0 items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 sm:flex">
              <Filter className="h-3.5 w-3.5" />
              Department
            </span>
            {departments.map((d) => (
              <button
                key={d}
                onClick={() => setDept(d)}
                className={cn(
                  'shrink-0 rounded-full border px-4 py-2 text-[12px] font-semibold transition-colors',
                  dept === d
                    ? 'border-brand-400/50 bg-brand-500/15 text-white'
                    : 'border-white/10 bg-white/[0.03] text-slate-400 hover:text-white',
                )}
              >
                {d}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="mt-7 grid gap-4 lg:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-[26px] border border-white/[0.07] bg-white/[0.03]" />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="mt-7 rounded-3xl border border-neon-pink/20 bg-neon-pink/[0.06] p-8 text-center">
            <p className="text-sm font-semibold text-white">Could not load jobs</p>
            <p className="mt-1.5 text-[12.5px] text-slate-400">{error}</p>
            <button onClick={() => void reload()} className="btn-ghost mt-4 text-[12.5px]">
              Try again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="mt-7 grid gap-4 lg:grid-cols-2">
              {filtered.map((job) => (
                <JobCard key={job.id} job={job} onOpen={() => setActive(job)} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="mt-7 rounded-3xl border border-white/10 bg-white/[0.02] p-12 text-center">
                <p className="text-sm text-slate-400">No live openings right now.</p>
              </div>
            )}
          </>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[26px] border border-white/10 bg-ink-900/55 p-5">
          <p className="text-[13px] text-slate-300">
            {loginRequiredToSeeMore
              ? `${remaining} more roles are available after login`
              : remaining > 0
                ? `${remaining} more roles on the jobs board`
                : 'Browse every live role on the jobs board'}
          </p>
          <Link to="/jobs" className="btn-ghost shrink-0 text-[12.5px]">
            Open jobs board
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <JobModal job={active} open={!!active} onClose={() => setActive(null)} />
    </section>
  )
}
