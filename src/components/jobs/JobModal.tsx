import { CheckCircle2, FileWarning, IndianRupee, Loader2, MapPin, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchCandidateProfile, hasResume } from '@/api/candidate'
import {
  applyToJob,
  daysUntil,
  fetchMyApplications,
  hasActiveApplication,
  postedLabel,
  type Job,
} from '@/api/jobs'
import { useAuth } from '@/auth/AuthProvider'
import { Modal } from '@/components/ui/Modal'
import { LogoTile } from '@/components/ui/primitives'
import { ApiError } from '@/lib/api'

export function JobModal({ job, open, onClose }: { job: Job | null; open: boolean; onClose: () => void }) {
  const { isAuthenticated, user } = useAuth()
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [checking, setChecking] = useState(false)
  const [hasResumeOnFile, setHasResumeOnFile] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isCandidate = isAuthenticated && /candidate|student/i.test(user?.role ?? '')
  const isRecruiter = isAuthenticated && /admin|recruiter|placement/i.test(user?.role ?? '')

  useEffect(() => {
    setApplying(false)
    setApplied(false)
    setError(null)
    setChecking(false)
    setHasResumeOnFile(true)

    if (!open || !job || !isCandidate) return

    let cancelled = false
    setChecking(true)

    Promise.all([fetchMyApplications(), fetchCandidateProfile()])
      .then(([apps, profile]) => {
        if (cancelled) return
        if (hasActiveApplication(apps, job.id)) setApplied(true)
        setHasResumeOnFile(hasResume(profile))
      })
      .catch(() => {
        /* Ignore — apply still attempts; backend also enforces resume. */
      })
      .finally(() => {
        if (!cancelled) setChecking(false)
      })

    return () => {
      cancelled = true
    }
  }, [job?.id, open, isCandidate])

  if (!job) return null

  const posted = postedLabel(job)
  const deadline = daysUntil(job.applicationDeadline)
  const deadlinePassed = deadline != null && deadline < 0

  async function handleApply() {
    if (!job || applying || applied) return
    if (!hasResumeOnFile) {
      setError('Add your resume on your profile before applying.')
      return
    }
    setApplying(true)
    setError(null)
    try {
      await applyToJob(job.id)
      setApplied(true)
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Could not submit application'
      if (/already applied/i.test(message)) {
        setApplied(true)
      } else {
        setError(message)
      }
    } finally {
      setApplying(false)
    }
  }

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
                  ·{' '}
                  {deadlinePassed ? (
                    <span className="font-semibold text-neon-pink">Closed</span>
                  ) : (
                    <>
                      Closes in{' '}
                      <span className={deadline <= 4 ? 'font-semibold text-neon-pink' : 'text-slate-300'}>
                        {deadline} days
                      </span>
                    </>
                  )}
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

      <div className="flex shrink-0 flex-col gap-3 border-t border-white/[0.07] bg-ink-900/95 px-6 py-4 sm:px-8">
        {error ? <p className="text-[12px] font-medium text-neon-pink">{error}</p> : null}
        {isCandidate && !checking && !applied && !deadlinePassed && !hasResumeOnFile ? (
          <p className="flex items-start gap-2 text-[12px] text-amber-200/90">
            <FileWarning className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            A resume is required before you can apply. Add it on your profile, then come back.
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <div className="mr-auto">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Package</p>
            <p className="font-display text-[15px] font-bold text-white">{job.salary || 'Not disclosed'}</p>
          </div>

          {!isAuthenticated ? (
            <Link to="/login" onClick={onClose} className="btn-primary text-[12.5px]">
              Sign in to apply
            </Link>
          ) : isRecruiter ? (
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[12px] text-slate-400">
              Recruiters can’t apply to jobs
            </span>
          ) : deadlinePassed ? (
            <span className="rounded-full border border-neon-pink/30 bg-neon-pink/10 px-4 py-2 text-[12px] font-semibold text-neon-pink">
              Applications closed
            </span>
          ) : applied ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-neon-lime/30 bg-neon-lime/10 px-4 py-2 text-[12.5px] font-semibold text-neon-lime">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Applied
            </span>
          ) : isCandidate && !hasResumeOnFile && !checking ? (
            <Link to="/profile" onClick={onClose} className="btn-primary text-[12.5px]">
              Add resume to apply
            </Link>
          ) : isCandidate ? (
            <button
              type="button"
              onClick={handleApply}
              disabled={applying || checking || !hasResumeOnFile}
              className="btn-primary text-[12.5px] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {applying || checking ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {applying ? 'Applying…' : 'Checking…'}
                </>
              ) : (
                'Apply now'
              )}
            </button>
          ) : (
            <Link to="/login" onClick={onClose} className="btn-primary text-[12.5px]">
              Sign in as student to apply
            </Link>
          )}
        </div>
      </div>
    </Modal>
  )
}
