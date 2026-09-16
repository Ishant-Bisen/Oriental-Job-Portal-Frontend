import { motion } from 'framer-motion'
import { ArrowLeft, Filter, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { JobCard } from '@/components/jobs/JobCard'
import { JobModal } from '@/components/jobs/JobModal'
import { Counter, MeterBar } from '@/components/ui/primitives'
import { departments, jobs, type Job, type JobType } from '@/data/jobs'
import { cn } from '@/lib/utils'

type SortKey = 'match' | 'package' | 'deadline' | 'recent'

const sorts: { key: SortKey; label: string }[] = [
  { key: 'match', label: 'Best match' },
  { key: 'package', label: 'Highest package' },
  { key: 'deadline', label: 'Closing soon' },
  { key: 'recent', label: 'Most recent' },
]

const types: JobType[] = ['Full-time', 'Internship', 'Intern + PPO', 'Part-time']

const ctcValue = (job: Job) => Number(job.ctc.replace(/[^\d.]/g, '')) || 0

export default function JobsPage() {
  const [query, setQuery] = useState('')
  const [dept, setDept] = useState<string>('All Departments')
  const [type, setType] = useState<JobType | 'All'>('All')
  const [sort, setSort] = useState<SortKey>('match')
  const [minScore, setMinScore] = useState(0)
  const [active, setActive] = useState<Job | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = jobs.filter((j) => {
      const matchesQuery =
        !q ||
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.skills.some((s) => s.toLowerCase().includes(q))
      const matchesDept = dept === 'All Departments' || j.departments.includes(dept)
      const matchesType = type === 'All' || j.type === type
      return matchesQuery && matchesDept && matchesType && j.matchScore >= minScore
    })

    return list.sort((a, b) => {
      if (sort === 'match') return b.matchScore - a.matchScore
      if (sort === 'package') return ctcValue(b) - ctcValue(a)
      if (sort === 'deadline') return a.deadlineInDays - b.deadlineInDays
      return a.postedAgo.localeCompare(b.postedAgo)
    })
  }, [query, dept, type, sort, minScore])

  const avgScore = Math.round(jobs.reduce((s, j) => s + j.matchScore, 0) / jobs.length)
  const hasFilters = query || dept !== 'All Departments' || type !== 'All' || minScore > 0

  return (
    <div className="pb-24 pt-28 sm:pt-32">
      <div className="container-x">
        {/* ------------------------------------------------ header */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-slate-400 transition hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-3xl font-extrabold tracking-tight sm:text-[2.6rem]"
            >
              Jobs board <span className="text-gradient-animated">for batch 2026</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-3 max-w-2xl text-[13.5px] leading-relaxed text-slate-400"
            >
              Every live opening, scored against your verified profile. Open any card to read the complete job
              description, eligibility rules and selection process.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex gap-3"
          >
            {[
              { k: 'Live roles', v: jobs.length },
              { k: 'Avg. match', v: avgScore, suffix: '%' },
              { k: 'Closing this week', v: jobs.filter((j) => j.deadlineInDays <= 7).length },
            ].map((s) => (
              <div key={s.k} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                <p className="font-display text-xl font-bold text-white">
                  <Counter value={s.v} suffix={s.suffix ?? ''} />
                </p>
                <p className="mt-0.5 text-[10.5px] uppercase tracking-wide text-slate-500">{s.k}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ------------------------------------------------ toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-9 rounded-[26px] border border-white/10 bg-ink-900/55 p-4 backdrop-blur-2xl sm:p-5"
        >
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-full border border-white/10 bg-ink-950/60 px-4 py-2.5">
              <Search className="h-4 w-4 shrink-0 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search role, company or skill — try “Adobe”, “PyTorch”, “backend”"
                className="min-w-0 flex-1 bg-transparent text-[13px] text-white placeholder:text-slate-600 focus:outline-none"
              />
              {query && (
                <button onClick={() => setQuery('')} aria-label="Clear search">
                  <X className="h-3.5 w-3.5 text-slate-500 hover:text-white" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-ink-950/60 px-3.5 py-2.5">
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
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

          {/* filter rows */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 hidden items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-slate-500 sm:flex">
              <Filter className="h-3 w-3" />
              Branch
            </span>
            {departments.map((d) => (
              <button
                key={d}
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

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 hidden text-[10.5px] font-bold uppercase tracking-wider text-slate-500 sm:inline">
                Type
              </span>
              {(['All', ...types] as (JobType | 'All')[]).map((t) => (
                <button
                  key={t}
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

            <div className="ml-auto flex min-w-[15rem] items-center gap-3">
              <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                <Sparkles className="h-3.5 w-3.5 text-brand-300" />
                Min. match
              </span>
              <input
                type="range"
                min={0}
                max={95}
                step={5}
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-brand-500"
              />
              <span className="w-9 shrink-0 text-right font-mono text-[11.5px] text-slate-300">{minScore}%</span>
            </div>
          </div>

          {hasFilters && (
            <div className="mt-4 flex items-center gap-3 border-t border-white/[0.06] pt-3.5">
              <p className="text-[11.5px] text-slate-400">
                <span className="font-bold text-white">{filtered.length}</span> of {jobs.length} roles match
                your filters
              </p>
              <button
                onClick={() => {
                  setQuery('')
                  setDept('All Departments')
                  setType('All')
                  setMinScore(0)
                }}
                className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-semibold text-slate-300 transition hover:text-white"
              >
                <X className="h-3 w-3" />
                Clear filters
              </button>
            </div>
          )}
        </motion.div>

        {/* ------------------------------------------------ results */}
        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_18rem]">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {filtered.map((job, i) => (
              <JobCard key={job.id} job={job} index={i} onOpen={() => setActive(job)} />
            ))}

            {filtered.length === 0 && (
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-14 text-center sm:col-span-2">
                <p className="font-display text-base font-bold text-white">No roles match those filters</p>
                <p className="mx-auto mt-2 max-w-sm text-[12.5px] text-slate-500">
                  Try lowering the minimum match score or switching to “All Departments”.
                </p>
              </div>
            )}
          </div>

          {/* sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-4">
              <div className="rounded-3xl border border-white/10 bg-ink-900/55 p-5 backdrop-blur-2xl">
                <h3 className="text-[13px] font-bold text-white">Your profile snapshot</h3>
                <div className="mt-4 space-y-3.5">
                  {[
                    { k: 'Profile completeness', v: 92 },
                    { k: 'Resume strength', v: 88 },
                    { k: 'Eligibility coverage', v: 81 },
                  ].map((m, i) => (
                    <div key={m.k}>
                      <div className="flex items-center justify-between text-[11.5px]">
                        <span className="text-slate-300">{m.k}</span>
                        <span className="font-mono text-slate-400">{m.v}%</span>
                      </div>
                      <MeterBar value={m.v} delay={i * 0.1} className="mt-1.5" />
                    </div>
                  ))}
                </div>
                <p className="mt-4 rounded-2xl border border-brand-400/20 bg-brand-500/[0.07] p-3 text-[11px] leading-relaxed text-slate-300">
                  Adding <span className="font-semibold text-brand-200">Kubernetes</span> and{' '}
                  <span className="font-semibold text-brand-200">Kafka</span> would raise your average match by
                  6 points across 11 roles.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-ink-900/55 p-5 backdrop-blur-2xl">
                <h3 className="text-[13px] font-bold text-white">Closing this week</h3>
                <div className="mt-3.5 space-y-2.5">
                  {jobs
                    .filter((j) => j.deadlineInDays <= 7)
                    .sort((a, b) => a.deadlineInDays - b.deadlineInDays)
                    .map((j) => (
                      <button
                        key={j.id}
                        onClick={() => setActive(j)}
                        className="flex w-full items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2.5 text-left transition hover:border-neon-pink/30"
                      >
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-neon-pink/12 font-display text-[11px] font-bold text-neon-pink">
                          {j.deadlineInDays}d
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[11.5px] font-bold text-white">{j.company}</span>
                          <span className="block truncate text-[10.5px] text-slate-500">{j.title}</span>
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <JobModal job={active} open={!!active} onClose={() => setActive(null)} />
    </div>
  )
}
