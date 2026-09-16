import { ArrowUpRight, Clock, IndianRupee, MapPin } from 'lucide-react'
import { LogoTile } from '@/components/ui/primitives'
import { daysUntil, postedLabel, type Job } from '@/api/jobs'

export function JobCard({ job, onOpen }: { job: Job; onOpen: () => void }) {
  const deadline = daysUntil(job.applicationDeadline)
  const posted = postedLabel(job)

  return (
    <article
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen()}
      className="group relative cursor-pointer overflow-hidden rounded-[26px] border border-white/[0.07] bg-ink-900/45 p-5 backdrop-blur-xl transition-colors duration-300 hover:border-brand-400/35 hover:bg-ink-900/70 sm:p-6"
    >
      <div className="relative flex items-start gap-4">
        <LogoTile name={job.companyName} src={job.displayPicture} className="h-14 w-14 shrink-0 p-2.5" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {job.jobType && (
              <span className="chip border-white/10 bg-white/[0.04] text-slate-300">{job.jobType}</span>
            )}
            {deadline != null && deadline <= 4 && (
              <span className="rounded-full border border-neon-pink/30 bg-neon-pink/10 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-neon-pink">
                {deadline}d left
              </span>
            )}
          </div>

          <h3 className="mt-2.5 text-[15px] font-bold leading-snug text-white transition-colors group-hover:text-brand-100 sm:text-base">
            {job.title}
          </h3>
          <p className="mt-1 text-[12px] text-slate-400">{job.companyName}</p>
        </div>
      </div>

      <div className="relative mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11.5px] text-slate-400">
        {job.location && (
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-slate-500" />
            {job.location}
          </span>
        )}
        {job.salary && (
          <span className="flex items-center gap-1.5 font-semibold text-brand-200">
            <IndianRupee className="h-3.5 w-3.5" />
            {job.salary}
          </span>
        )}
        {posted && (
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            {posted}
          </span>
        )}
      </div>

      <div className="relative mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
        <span className="truncate text-[11px] text-slate-500">{job.department || 'Open role'}</span>
        <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-brand-200 transition group-hover:text-white">
          Read full JD
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </article>
  )
}
