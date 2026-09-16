import { IndianRupee, MapPin, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { daysUntil, postedLabel, type Job } from '@/api/jobs'
import { Modal } from '@/components/ui/Modal'
import { LogoTile } from '@/components/ui/primitives'

export function JobModal({ job, open, onClose }: { job: Job | null; open: boolean; onClose: () => void }) {
  if (!job) return null

  const posted = postedLabel(job)
  const deadline = daysUntil(job.applicationDeadline)

  return (
    <Modal open={open} onClose={onClose} labelledBy="job-modal-title" className="max-w-3xl">
      <div className="relative shrink-0 border-b border-white/[0.07] px-6 pb-6 pr-16 pt-8 sm:px-8 sm:pr-16">
        <div className="flex flex-wrap items-start gap-5">
          <LogoTile name={job.companyName} src={job.displayPicture} className="h-16 w-16 shrink-0 p-3" />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {job.jobType && (
                <span className="chip border-white/10 bg-white/[0.04] text-slate-300">{job.jobType}</span>
              )}
              {job.department && (
                <span className="chip border-white/10 bg-white/[0.04] text-slate-300">{job.department}</span>
              )}
              <span className="font-mono text-[10.5px] text-slate-500">#{job.id}</span>
            </div>

            <h2 id="job-modal-title" className="mt-3 text-xl font-bold leading-tight sm:text-2xl">
              {job.title}
            </h2>
            <p className="mt-1.5 text-[13px] text-slate-400">
              {job.companyName}
              {posted && <> · Posted {posted}</>}
              {deadline != null && (
                <>
                  {' '}
                  · Closes in{' '}
                  <span className={deadline <= 4 ? 'font-semibold text-neon-pink' : 'text-slate-300'}>
                    {deadline} days
                  </span>
                </>
              )}
            </p>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-slate-400">
              {job.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-500" /> {job.location}
                </span>
              )}
              {job.salary && (
                <span className="flex items-center gap-1.5 font-semibold text-brand-200">
                  <IndianRupee className="h-3.5 w-3.5" /> {job.salary}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-7 sm:px-8">
        <section>
          <h4 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-slate-200">
            <Sparkles className="h-4 w-4 text-brand-300" />
            About the role
          </h4>
          <p className="mt-3.5 whitespace-pre-wrap text-[13px] leading-relaxed text-slate-300">
            {job.description?.trim() || 'No description has been published for this role yet.'}
          </p>
        </section>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-3 border-t border-white/[0.07] bg-ink-900/95 px-6 py-4 sm:px-8">
        <div className="mr-auto">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">Package</p>
          <p className="font-display text-[15px] font-bold text-white">{job.salary || 'Not disclosed'}</p>
        </div>
        <Link to="/login" onClick={onClose} className="btn-primary text-[12.5px]">
          Sign in to apply
        </Link>
      </div>
    </Modal>
  )
}
