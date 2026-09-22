import { motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  ClipboardList,
  Loader2,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  applicationStatusMeta,
  applicationStatusTime,
  countApplicationsByStatus,
  fetchMyApplications,
  formatApplicationWhen,
  normalizeApplicationStatus,
  recentStatusChanges,
  type JobApplication,
} from '@/api/jobs'
import { LogoTile, SectionHeading } from '@/components/ui/primitives'
import { Reveal } from '@/components/ui/Reveal'
import { ApiError } from '@/lib/api'
import { cn } from '@/lib/utils'

function ApplicationRow({
  app,
  delay = 0,
  emphasize,
}: {
  app: JobApplication
  delay?: number
  emphasize?: boolean
}) {
  const status = normalizeApplicationStatus(app.status)
  const meta = applicationStatusMeta[status]
  const when = formatApplicationWhen(app.statusUpdatedAt || app.updatedAt || app.appliedAt)
  const moved = status !== 'APPLIED'

  return (
    <Reveal delay={delay}>
      <motion.article
        layout
        className={cn(
          'group relative overflow-hidden rounded-2xl border p-4 transition',
          emphasize
            ? 'border-brand-400/25 bg-brand-500/[0.06] hover:border-brand-400/40'
            : 'border-white/[0.07] bg-white/[0.025] hover:border-brand-400/30 hover:bg-white/[0.05]',
        )}
      >
        <div className="flex gap-3.5">
          {app.companyName || app.profilePicture ? (
            <LogoTile
              slug={app.companyName
                ?.toLowerCase()
                .replace(/[^a-z0-9]+/g, '')
                .slice(0, 32)}
              name={app.companyName || app.jobTitle}
              src={app.profilePicture}
              className="h-11 w-11 shrink-0 p-2"
            />
          ) : (
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300">
              <Briefcase className="h-4 w-4" />
            </span>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn('chip border', meta.tone)}>
                {status === 'ACCEPTED' ? (
                  <BadgeCheck className="h-3 w-3" />
                ) : moved ? (
                  <Sparkles className="h-3 w-3" />
                ) : null}
                {meta.label}
              </span>
              <span className="text-[10.5px] font-semibold text-slate-500">
                {moved ? `Updated ${when}` : `Applied ${when}`}
              </span>
            </div>

            <h4 className="mt-2 text-[13.5px] font-bold leading-snug text-white">{app.jobTitle}</h4>
            <p className="mt-1 text-[12px] text-slate-400">
              {[app.companyName, app.department, app.jobType].filter(Boolean).join(' · ') || meta.blurb}
            </p>
            {moved ? <p className="mt-2 text-[11.5px] text-slate-500">{meta.blurb}</p> : null}
          </div>
        </div>
      </motion.article>
    </Reveal>
  )
}

/**
 * Personal application status board for logged-in candidates.
 * Highlights recent status moves, then lists every application with its status.
 * Intended for the Jobs page (not the home landing).
 */
export function ApplicationStatusUpdates() {
  const [apps, setApps] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchMyApplications()
      .then((items) => {
        if (!cancelled) setApps(items ?? [])
      })
      .catch((err) => {
        if (!cancelled) {
          setApps([])
          setError(err instanceof ApiError ? err.message : 'Could not load application status')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const changes = useMemo(() => recentStatusChanges(apps, 8), [apps])
  const allSorted = useMemo(
    () => [...apps].sort((a, b) => applicationStatusTime(b) - applicationStatusTime(a)),
    [apps],
  )
  const counts = useMemo(() => countApplicationsByStatus(apps), [apps])
  const activeCount = apps.filter((app) => !/withdrawn|rejected/i.test(app.status ?? '')).length

  return (
    <section id="application-status" className="relative pb-10 pt-28 sm:pb-12 sm:pt-32">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-neon-violet/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-brand-500/15 blur-3xl" />

      <div className="container-x relative">
        <SectionHeading
          eyebrow="Your applications"
          title="Status changes,"
          highlight="as they happen."
          description="Whenever the placement cell moves your application — review, shortlist, offer or close — it lands here the next time you sign in. Every application you have submitted is listed with its current status."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Active', value: activeCount, tone: 'text-brand-200' },
            { label: 'Under review', value: counts.REVIEWED, tone: 'text-neon-cyan' },
            { label: 'Shortlisted', value: counts.SHORTLISTED, tone: 'text-neon-violet' },
            { label: 'Offers', value: counts.ACCEPTED, tone: 'text-neon-lime' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-ink-900/50 px-4 py-3.5 backdrop-blur-xl"
            >
              <p className={cn('font-display text-2xl font-bold', stat.tone)}>{stat.value}</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* —— Recent status moves —— */}
        <div className="mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-ink-900/55 backdrop-blur-2xl">
          <div className="flex flex-wrap items-center gap-3 border-b border-white/[0.07] px-5 py-4">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-neon-violet/15 text-neon-violet">
              <RefreshCw className="h-4 w-4" />
            </span>
            <div className="mr-auto min-w-0">
              <h3 className="text-[14.5px] font-bold text-white">Recent status updates</h3>
              <p className="text-[11px] text-slate-500">
                {loading
                  ? 'Loading your applications…'
                  : changes.length
                    ? `${changes.length} update${changes.length === 1 ? '' : 's'} past Applied`
                    : 'No status moves yet — apply to a drive to get started'}
              </p>
            </div>
            <Link to="/profile" className="btn-ghost text-[12px]">
              All applications
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3 p-4 sm:p-5">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-12 text-[13px] text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Fetching status…
              </div>
            ) : null}

            {error && !loading ? (
              <div className="rounded-2xl border border-neon-pink/20 bg-neon-pink/[0.06] px-4 py-8 text-center">
                <p className="text-[13px] font-semibold text-white">Could not load status</p>
                <p className="mt-1 text-[12px] text-slate-400">{error}</p>
              </div>
            ) : null}

            {!loading && !error && changes.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-10 text-center">
                <ClipboardList className="mx-auto h-8 w-8 text-slate-600" />
                <p className="mt-3 text-[14px] font-semibold text-white">No status changes yet</p>
                <p className="mx-auto mt-1.5 max-w-sm text-[12.5px] leading-relaxed text-slate-500">
                  When a recruiter or the T&P cell updates one of your applications, the new status will show up
                  here automatically.
                </p>
              </div>
            ) : null}

            {!loading &&
              !error &&
              changes.map((app, i) => (
                <ApplicationRow
                  key={`change-${app.applicationId}`}
                  app={app}
                  delay={Math.min(i * 0.05, 0.3)}
                  emphasize
                />
              ))}
          </div>
        </div>

        {/* —— Every application with current status —— */}
        {!loading && !error && allSorted.length > 0 ? (
          <div className="mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-ink-900/40 backdrop-blur-2xl">
            <div className="flex flex-wrap items-center gap-3 border-b border-white/[0.07] px-5 py-4">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-500/15 text-brand-200">
                <Briefcase className="h-4 w-4" />
              </span>
              <div className="mr-auto min-w-0">
                <h3 className="text-[14.5px] font-bold text-white">All your applications</h3>
                <p className="text-[11px] text-slate-500">
                  {allSorted.length} application{allSorted.length === 1 ? '' : 's'} · current status on each
                </p>
              </div>
              <Link
                to="#jobs-board"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('jobs-board')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="btn-ghost text-[12px]"
              >
                Browse jobs
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-3 p-4 sm:p-5">
              {allSorted.map((app, i) => (
                <ApplicationRow
                  key={`all-${app.applicationId}`}
                  app={app}
                  delay={Math.min(i * 0.04, 0.28)}
                />
              ))}
            </div>
          </div>
        ) : null}

        {!loading && !error && allSorted.length === 0 ? (
          <div className="mt-6 rounded-[28px] border border-dashed border-white/10 bg-ink-900/30 px-4 py-12 text-center">
            <ClipboardList className="mx-auto h-8 w-8 text-slate-600" />
            <p className="mt-3 text-[14px] font-semibold text-white">No applications yet</p>
            <p className="mx-auto mt-1.5 max-w-sm text-[12.5px] leading-relaxed text-slate-500">
              Apply to an open drive and your status will track here after you sign in.
            </p>
            <button
              type="button"
              onClick={() =>
                document.getElementById('jobs-board')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="btn-primary mt-5 inline-flex text-[12.5px]"
            >
              <Briefcase className="h-3.5 w-3.5" />
              Browse jobs
            </button>
          </div>
        ) : null}
      </div>
    </section>
  )
}
