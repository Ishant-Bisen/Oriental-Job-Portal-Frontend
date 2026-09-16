import { motion } from 'framer-motion'
import { ArrowRight, Filter, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { JobCard } from '@/components/jobs/JobCard'
import { JobModal } from '@/components/jobs/JobModal'
import { SectionHeading } from '@/components/ui/primitives'
import { Reveal } from '@/components/ui/Reveal'
import { departments, jobs, type Job } from '@/data/jobs'
import { cn } from '@/lib/utils'

export function JobsPreview() {
  const [dept, setDept] = useState<string>('All Departments')
  const [active, setActive] = useState<Job | null>(null)

  const filtered = (
    dept === 'All Departments' ? jobs : jobs.filter((j) => j.departments.includes(dept))
  ).slice(0, 4)

  return (
    <section id="jobs" className="section-pad relative">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            align="left"
            eyebrow="Live openings"
            title="Fresh roles, scored"
            highlight="against your resume."
            description="Filter by department, open a card to read the complete job description, eligibility and selection process."
            className="max-w-2xl"
          />
          <Link to="/jobs" className="btn-primary group shrink-0">
            See all 42 openings
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* department filter */}
        <Reveal className="mt-10">
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible">
            <span className="mr-1 hidden shrink-0 items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 sm:flex">
              <Filter className="h-3.5 w-3.5" />
              Department
            </span>
            {departments.map((d) => (
              <button
                key={d}
                onClick={() => setDept(d)}
                className={cn(
                  'relative shrink-0 rounded-full border px-4 py-2 text-[12px] font-semibold transition-colors duration-300',
                  dept === d
                    ? 'border-brand-400/50 text-white'
                    : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white',
                )}
              >
                {dept === d && (
                  <motion.span
                    layoutId="dept-pill"
                    className="absolute inset-0 rounded-full bg-brand-500/15"
                    transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                  />
                )}
                <span className="relative">{d}</span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* cards */}
        <motion.div layout className="mt-7 grid gap-4 lg:grid-cols-2">
          {filtered.map((job, i) => (
            <JobCard key={job.id} job={job} index={i} onOpen={() => setActive(job)} />
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="mt-7 rounded-3xl border border-white/10 bg-white/[0.02] p-12 text-center">
            <p className="text-sm text-slate-400">
              No live openings for this department right now — new drives are added every week.
            </p>
          </div>
        )}

        {/* footer strip */}
        <Reveal className="mt-8">
          <div className="relative flex flex-wrap items-center gap-4 overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-r from-brand-600/15 via-ink-900/50 to-neon-cyan/10 p-5 backdrop-blur-2xl sm:p-6">
            <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-neon-violet/20 blur-3xl" />
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-500/15 text-brand-200">
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="mr-auto min-w-0">
              <p className="text-[13.5px] font-bold text-white">
                38 more openings match your branch and CGPA band
              </p>
              <p className="mt-0.5 text-[12px] text-slate-400">
                Sort by resume score, package, deadline or company tier on the jobs board.
              </p>
            </div>
            <Link to="/jobs" className="btn-ghost shrink-0 text-[12.5px]">
              Open jobs board
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>
      </div>

      <JobModal job={active} open={!!active} onClose={() => setActive(null)} />
    </section>
  )
}
