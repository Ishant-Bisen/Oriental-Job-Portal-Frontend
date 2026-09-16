import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Bookmark,
  Calendar,
  CheckCircle2,
  Gift,
  GraduationCap,
  IndianRupee,
  ListChecks,
  MapPin,
  Send,
  Share2,
  Sparkles,
  Target,
  Users2,
} from 'lucide-react'
import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { LogoTile, MeterBar, ScoreRing } from '@/components/ui/primitives'
import type { Job } from '@/data/jobs'
import { cn, scoreTone } from '@/lib/utils'

const breakdown = (job: Job) => [
  { label: 'Skills match', value: Math.min(100, job.matchScore + 4) },
  { label: 'Academics & CGPA', value: Math.min(100, job.matchScore + 8) },
  { label: 'Projects & portfolio', value: Math.max(40, job.matchScore - 6) },
  { label: 'Certifications', value: Math.max(30, job.matchScore - 18) },
]

export function JobModal({ job, open, onClose }: { job: Job | null; open: boolean; onClose: () => void }) {
  const [applied, setApplied] = useState(false)
  const [saved, setSaved] = useState(false)

  if (!job) return null
  const tone = scoreTone(job.matchScore)

  return (
    <Modal open={open} onClose={onClose} labelledBy="job-modal-title" className="max-w-4xl">
      {/* -------------------------------------------------- header */}
      <div className="relative shrink-0 border-b border-white/[0.07] px-6 pb-6 pr-16 pt-8 sm:px-8 sm:pr-16">
        <div className="flex flex-wrap items-start gap-5">
          <LogoTile slug={job.companySlug} name={job.company} className="h-16 w-16 shrink-0 p-3" />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip border-brand-400/30 bg-brand-500/10 text-brand-200">{job.tier}</span>
              <span className="chip border-white/10 bg-white/[0.04] text-slate-300">{job.type}</span>
              <span className="chip border-white/10 bg-white/[0.04] text-slate-300">{job.workMode}</span>
              <span className="font-mono text-[10.5px] text-slate-500">#{job.id.toUpperCase()}</span>
            </div>

            <h2 id="job-modal-title" className="mt-3 text-xl font-bold leading-tight sm:text-2xl">
              {job.title}
            </h2>
            <p className="mt-1.5 text-[13px] text-slate-400">
              {job.company} · Posted {job.postedAgo} · Closes in{' '}
              <span className={job.deadlineInDays <= 4 ? 'font-semibold text-neon-pink' : 'text-slate-300'}>
                {job.deadlineInDays} days
              </span>
            </p>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-500" /> {job.location}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-brand-200">
                <IndianRupee className="h-3.5 w-3.5" /> {job.ctc}
                {job.stipend && <span className="text-slate-400">· {job.stipend}</span>}
              </span>
              <span className="flex items-center gap-1.5">
                <Users2 className="h-3.5 w-3.5 text-slate-500" /> {job.openings} openings ·{' '}
                {job.applicants} applied
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <ScoreRing score={job.matchScore} size={92} stroke={7} />
            <span className={cn('text-[11px] font-semibold', tone.text)}>{tone.label}</span>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------- body */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-7 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* left: the JD */}
          <div className="space-y-7">
            <Block icon={Sparkles} title="About the role">
              <p className="text-[13px] leading-relaxed text-slate-300">{job.about}</p>
            </Block>

            <Block icon={ListChecks} title="What you will do">
              <ul className="space-y-2.5">
                {job.responsibilities.map((r) => (
                  <li key={r} className="flex gap-2.5 text-[13px] leading-relaxed text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                    {r}
                  </li>
                ))}
              </ul>
            </Block>

            <Block icon={Target} title="What we expect">
              <ul className="space-y-2.5">
                {job.requirements.map((r) => (
                  <li key={r} className="flex gap-2.5 text-[13px] leading-relaxed text-slate-300">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neon-cyan" />
                    {r}
                  </li>
                ))}
              </ul>
            </Block>

            <Block icon={Calendar} title="Selection process">
              <ol className="relative space-y-4 border-l border-white/[0.09] pl-6">
                {job.rounds.map((r, i) => (
                  <li key={r.name} className="relative">
                    <span className="absolute -left-[1.93rem] grid h-6 w-6 place-items-center rounded-full border border-brand-400/40 bg-ink-900 font-mono text-[10px] font-bold text-brand-200">
                      {i + 1}
                    </span>
                    <p className="text-[13px] font-bold text-white">{r.name}</p>
                    <p className="mt-0.5 text-[12px] text-slate-400">{r.detail}</p>
                  </li>
                ))}
              </ol>
            </Block>

            <Block icon={Gift} title="Perks & benefits">
              <div className="flex flex-wrap gap-2">
                {job.perks.map((p) => (
                  <span
                    key={p}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11.5px] text-slate-300"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </Block>
          </div>

          {/* right: score + eligibility */}
          <div className="space-y-5">
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5">
              <h4 className="flex items-center gap-2 text-[13px] font-bold text-white">
                <Sparkles className="h-4 w-4 text-brand-300" />
                Your resume score
              </h4>
              <p className="mt-1.5 text-[11.5px] text-slate-500">
                Computed from your verified profile against this JD.
              </p>

              <div className="mt-5 space-y-3.5">
                {breakdown(job).map((b, i) => (
                  <div key={b.label}>
                    <div className="flex items-center justify-between text-[11.5px]">
                      <span className="text-slate-300">{b.label}</span>
                      <span className="font-mono text-slate-400">{b.value}%</span>
                    </div>
                    <MeterBar value={b.value} delay={i * 0.1} className="mt-1.5" />
                  </div>
                ))}
              </div>

              {job.missingSkills.length > 0 && (
                <div className="mt-5 rounded-2xl border border-neon-pink/20 bg-neon-pink/[0.06] p-3.5">
                  <p className="flex items-center gap-1.5 text-[11.5px] font-bold text-neon-pink">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Add these to score higher
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {job.missingSkills.map((s) => (
                      <span
                        key={s}
                        className="rounded-lg border border-neon-pink/25 bg-neon-pink/10 px-2 py-1 text-[10.5px] font-semibold text-neon-pink"
                      >
                        + {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5">
              <h4 className="flex items-center gap-2 text-[13px] font-bold text-white">
                <GraduationCap className="h-4 w-4 text-neon-cyan" />
                Eligibility
              </h4>
              <dl className="mt-4 space-y-3 text-[12px]">
                {[
                  ['Minimum CGPA', job.eligibility.cgpa],
                  ['Batch', job.eligibility.batch],
                  ['Backlogs', job.eligibility.backlogs],
                  ...(job.eligibility.bond ? [['Service bond', job.eligibility.bond]] : []),
                ].map(([k, v]) => (
                  <div key={k} className="flex items-start justify-between gap-3 border-b border-white/[0.05] pb-2.5 last:border-0">
                    <dt className="text-slate-500">{k}</dt>
                    <dd className="text-right font-semibold text-slate-200">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-4 flex items-center gap-2 rounded-2xl border border-neon-lime/20 bg-neon-lime/[0.07] px-3 py-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-neon-lime" />
                <p className="text-[11.5px] font-semibold text-neon-lime">You meet every criterion</p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5">
              <h4 className="text-[13px] font-bold text-white">Open to</h4>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {job.departments.map((d) => (
                  <span key={d} className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-1 text-[10.5px] text-slate-300">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------- footer */}
      <div className="flex shrink-0 flex-wrap items-center gap-3 border-t border-white/[0.07] bg-ink-900/95 px-6 py-4 backdrop-blur-2xl sm:px-8">
        <div className="mr-auto">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">Package</p>
          <p className="font-display text-[15px] font-bold text-white">{job.stipend ?? job.ctc}</p>
        </div>

        <button
          onClick={() => setSaved((s) => !s)}
          className={cn(
            'btn border px-4 py-2.5 text-[12.5px]',
            saved
              ? 'border-neon-amber/40 bg-neon-amber/10 text-neon-amber'
              : 'border-white/12 bg-white/[0.03] text-slate-300 hover:text-white',
          )}
        >
          <Bookmark className={cn('h-3.5 w-3.5', saved && 'fill-current')} />
          {saved ? 'Saved' : 'Save'}
        </button>

        <button className="btn border border-white/12 bg-white/[0.03] px-4 py-2.5 text-[12.5px] text-slate-300 hover:text-white">
          <Share2 className="h-3.5 w-3.5" />
          Share
        </button>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => setApplied(true)}
          disabled={applied}
          className={cn(
            'btn px-6 py-2.5 text-[12.5px]',
            applied
              ? 'bg-neon-lime/15 text-neon-lime ring-1 ring-neon-lime/40'
              : 'bg-gradient-to-r from-brand-500 to-neon-violet text-white shadow-glow hover:shadow-glow-lg',
          )}
        >
          {applied ? (
            <>
              <CheckCircle2 className="h-4 w-4" /> Application submitted
            </>
          ) : (
            <>
              <Send className="h-3.5 w-3.5" /> Apply with campus profile
            </>
          )}
        </motion.button>
      </div>
    </Modal>
  )
}

function Block({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Sparkles
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h4 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-slate-200">
        <Icon className="h-4 w-4 text-brand-300" />
        {title}
      </h4>
      <div className="mt-3.5">{children}</div>
    </section>
  )
}
