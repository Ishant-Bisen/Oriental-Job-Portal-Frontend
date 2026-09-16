import { motion } from 'framer-motion'
import { ArrowUpRight, Clock, IndianRupee, MapPin, Users2 } from 'lucide-react'
import { LogoTile, ScoreRing } from '@/components/ui/primitives'
import type { Job } from '@/data/jobs'
import { cn } from '@/lib/utils'

const tierTone: Record<Job['tier'], string> = {
  'Super Dream': 'border-neon-amber/30 bg-neon-amber/10 text-neon-amber',
  Dream: 'border-neon-violet/30 bg-neon-violet/10 text-neon-violet',
  Core: 'border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan',
  Mass: 'border-white/15 bg-white/5 text-slate-300',
}

export function JobCard({ job, onOpen, index = 0 }: { job: Job; onOpen: () => void; index?: number }) {
  const closingSoon = job.deadlineInDays <= 4

  return (
    <motion.article
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.07, 0.4) }}
      whileHover={{ y: -6 }}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen()}
      className="group relative cursor-pointer overflow-hidden rounded-[26px] border border-white/[0.07] bg-ink-900/45 p-5 backdrop-blur-xl transition-colors duration-500 hover:border-brand-400/35 hover:bg-ink-900/70 hover:shadow-glow sm:p-6"
    >
      {/* hover sheen */}
      <div className="pointer-events-none absolute -inset-x-10 -top-24 h-40 bg-brand-500/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex items-start gap-4">
        <LogoTile slug={job.companySlug} name={job.company} className="h-14 w-14 shrink-0 p-2.5" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn('rounded-full border px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider', tierTone[job.tier])}>
              {job.tier}
            </span>
            <span className="chip border-white/10 bg-white/[0.04] text-slate-300">{job.type}</span>
            {closingSoon && (
              <span className="flex items-center gap-1 rounded-full border border-neon-pink/30 bg-neon-pink/10 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-neon-pink">
                <span className="h-1 w-1 animate-ping rounded-full bg-neon-pink" />
                {job.deadlineInDays}d left
              </span>
            )}
          </div>

          <h3 className="mt-2.5 text-[15px] font-bold leading-snug text-white transition-colors group-hover:text-brand-100 sm:text-base">
            {job.title}
          </h3>
          <p className="mt-1 text-[12px] text-slate-400">
            {job.company} · <span className="text-slate-500">{job.workMode}</span>
          </p>
        </div>

        <div className="hidden shrink-0 sm:block">
          <ScoreRing score={job.matchScore} size={68} />
        </div>
      </div>

      {/* meta row */}
      <div className="relative mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11.5px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-slate-500" />
          {job.location}
        </span>
        <span className="flex items-center gap-1.5 font-semibold text-brand-200">
          <IndianRupee className="h-3.5 w-3.5" />
          {job.stipend ?? job.ctc}
        </span>
        <span className="flex items-center gap-1.5">
          <Users2 className="h-3.5 w-3.5 text-slate-500" />
          {job.openings} openings
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-slate-500" />
          {job.postedAgo}
        </span>
      </div>

      {/* skills */}
      <div className="relative mt-4 flex flex-wrap gap-1.5">
        {job.skills.slice(0, 4).map((s) => (
          <span
            key={s}
            className={cn(
              'rounded-lg border px-2 py-1 text-[10.5px] font-medium transition',
              job.missingSkills.includes(s)
                ? 'border-neon-pink/25 bg-neon-pink/[0.07] text-neon-pink/90'
                : 'border-white/[0.08] bg-white/[0.04] text-slate-300',
            )}
          >
            {s}
          </span>
        ))}
        {job.skills.length > 4 && (
          <span className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-1 text-[10.5px] text-slate-400">
            +{job.skills.length - 4}
          </span>
        )}
      </div>

      {/* footer */}
      <div className="relative mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
        <span className="flex items-center gap-2 text-[11px] text-slate-500">
          <span className="flex -space-x-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-4 w-4 rounded-full border border-ink-900 bg-gradient-to-br from-brand-400 to-neon-violet" />
            ))}
          </span>
          {job.applicants} applied from campus
        </span>
        <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-brand-200 transition group-hover:text-white">
          Read full JD
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </motion.article>
  )
}
