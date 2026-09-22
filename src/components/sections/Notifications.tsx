import { AnimatePresence, motion } from 'framer-motion'
import {
  AlarmClock,
  ArrowRight,
  Bell,
  BellRing,
  Briefcase,
  CheckCircle2,
  FileWarning,
  Megaphone,
  PartyPopper,
  Presentation,
  Radio,
  RefreshCw,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchNextSpotlight, type NextSpotlight } from '@/api/calendar'
import { fetchPublicUpdates, toUiUpdate } from '@/api/updates'
import { useAuth } from '@/auth/AuthProvider'
import { LogoTile, SectionHeading } from '@/components/ui/primitives'
import { Reveal } from '@/components/ui/Reveal'
import {
  buildMetaLabel,
  hasFlag,
  type Update,
  type UpdateFlag,
  type UpdateTag,
} from '@/data/updates'
import { cn } from '@/lib/utils'

const tagMeta: Record<UpdateTag, { icon: typeof Bell; label: string; tone: string }> = {
  OFFER: { icon: PartyPopper, label: 'Offer', tone: 'text-neon-lime bg-neon-lime/12 border-neon-lime/25' },
  JOB: { icon: Briefcase, label: 'Job', tone: 'text-neon-amber bg-neon-amber/12 border-neon-amber/25' },
  NOTICE: { icon: FileWarning, label: 'Notice', tone: 'text-slate-200 bg-white/8 border-white/20' },
  DRIVE: { icon: Megaphone, label: 'Drive', tone: 'text-neon-cyan bg-neon-cyan/12 border-neon-cyan/25' },
  RESULT: { icon: CheckCircle2, label: 'Result', tone: 'text-neon-violet bg-neon-violet/12 border-neon-violet/25' },
  UPDATE: { icon: RefreshCw, label: 'Update', tone: 'text-brand-200 bg-brand-500/10 border-brand-400/25' },
  WORKSHOP: { icon: Presentation, label: 'Workshop', tone: 'text-neon-pink bg-neon-pink/12 border-neon-pink/25' },
}

const tagFilters: { key: UpdateTag | 'all'; label: string }[] = [
  { key: 'all', label: 'Everything' },
  { key: 'OFFER', label: 'Offers' },
  { key: 'JOB', label: 'Jobs' },
  { key: 'NOTICE', label: 'Notices' },
  { key: 'DRIVE', label: 'Drives' },
  { key: 'RESULT', label: 'Results' },
  { key: 'UPDATE', label: 'Updates' },
  { key: 'WORKSHOP', label: 'Workshops' },
]

/** One attention filter (covers both DB booleans) + closing soon. */
const flagFilters: { key: 'none' | 'ATTENTION' | 'CLOSING_SOON'; label: string }[] = [
  { key: 'none', label: 'Any status' },
  { key: 'ATTENTION', label: 'Attention needed' },
  { key: 'CLOSING_SOON', label: 'Closing soon' },
]

function needsAttention(update: Update) {
  return hasFlag(update, 'NEED_YOUR_ATTENTION') || hasFlag(update, 'ATTENTION_NEEDED')
}

/** At most one attention chip + optional closing soon. */
function visibleFlags(flags: UpdateFlag[] | undefined): UpdateFlag[] {
  if (!flags?.length) return []
  const out: UpdateFlag[] = []
  if (flags.includes('NEED_YOUR_ATTENTION') || flags.includes('ATTENTION_NEEDED')) {
    out.push('ATTENTION_NEEDED')
  }
  if (flags.includes('CLOSING_SOON')) out.push('CLOSING_SOON')
  return out
}

function useCountdownTo(targetMs: number | null) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (targetMs == null) return
    const id = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(id)
  }, [targetMs])

  if (targetMs == null) {
    return { d: '--', h: '--', m: '--', done: true }
  }

  const diff = Math.max(0, targetMs - now)
  const days = Math.floor(diff / 86_400_000)
  const hours = Math.floor((diff % 86_400_000) / 3600_000)
  const mins = Math.floor((diff % 3600_000) / 60_000)
  return {
    d: String(days).padStart(2, '0'),
    h: String(hours).padStart(2, '0'),
    m: String(mins).padStart(2, '0'),
    done: diff <= 0,
  }
}

function FlagChip({ flag }: { flag: UpdateFlag }) {
  if (flag === 'ATTENTION_NEEDED' || flag === 'NEED_YOUR_ATTENTION') {
    return (
      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-neon-pink">
        <span className="h-1.5 w-1.5 animate-ping rounded-full bg-neon-pink" />
        attention needed
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-neon-amber">
      <AlarmClock className="h-3 w-3" />
      closing soon
    </span>
  )
}

function UpdateRow({ update, index }: { update: Update; index: number }) {
  const meta = tagMeta[update.tag]
  const line = buildMetaLabel(update)
  const urgent = needsAttention(update)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: -26, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: Math.min(index * 0.04, 0.3) }}
      className={cn(
        'group relative mb-3 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3.5 transition-all duration-300 hover:border-brand-400/30 hover:bg-white/[0.055] sm:p-4',
        urgent && 'border-neon-pink/20',
      )}
    >
      <span
        className={cn(
          'absolute inset-y-0 left-0 w-[3px] scale-y-0 bg-gradient-to-b from-brand-400 to-neon-cyan transition-transform duration-500 group-hover:scale-y-100',
          urgent && 'scale-y-100 from-neon-pink to-neon-amber',
        )}
      />

      <div className="flex gap-3 sm:gap-3.5">
        {update.companySlug ? (
          <LogoTile slug={update.companySlug} name={update.title} className="h-10 w-10 shrink-0 p-2 sm:h-11 sm:w-11" />
        ) : (
          <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-2xl border sm:h-11 sm:w-11', meta.tone)}>
            <meta.icon className="h-4 w-4" />
          </span>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn('chip border', meta.tone)}>
              <meta.icon className="h-3 w-3" />
              {meta.label}
            </span>
            {visibleFlags(update.flags).map((flag) => (
              <FlagChip key={flag} flag={flag} />
            ))}
            <span className="ml-auto shrink-0 font-mono text-[10.5px] text-slate-500">{update.time}</span>
          </div>

          <h4 className="mt-2 text-[13.5px] font-bold leading-snug text-white">{update.title}</h4>

          <motion.p
            initial={false}
            className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-slate-400 transition-all duration-500 group-hover:line-clamp-none"
          >
            {update.description}
          </motion.p>

          {line ? (
            <p className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-2 py-1 text-[10.5px] font-semibold text-slate-300">
              <Radio className="h-3 w-3 text-brand-300" />
              {line}
            </p>
          ) : null}
        </div>
      </div>
    </motion.article>
  )
}

export function Notifications() {
  const { isAuthenticated, user } = useAuth()
  const isCandidate = isAuthenticated && /candidate|student/i.test(user?.role ?? '')

  const [tagFilter, setTagFilter] = useState<UpdateTag | 'all'>('all')
  const [flagFilter, setFlagFilter] = useState<'none' | 'ATTENTION' | 'CLOSING_SOON'>('none')
  const [feed, setFeed] = useState<Update[]>([])
  const [loading, setLoading] = useState(true)
  const [paused, setPaused] = useState(false)
  const [spotlight, setSpotlight] = useState(0)
  const [nextUp, setNextUp] = useState<NextSpotlight | null>(null)
  const [nextLoading, setNextLoading] = useState(true)
  const countdown = useCountdownTo(nextUp?.targetMs ?? null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchPublicUpdates()
      .then((items) => {
        if (cancelled) return
        setFeed(items.map(toUiUpdate).filter((u): u is Update => u != null))
      })
      .catch(() => {
        if (!cancelled) setFeed([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    setNextLoading(true)
    fetchNextSpotlight(isCandidate)
      .then((item) => {
        if (!cancelled) setNextUp(item)
      })
      .catch(() => {
        if (!cancelled) setNextUp(null)
      })
      .finally(() => {
        if (!cancelled) setNextLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [isCandidate])

  useEffect(() => {
    if (paused || feed.length < 2) return
    const id = setInterval(() => {
      setFeed((f) => {
        const next = [...f]
        const last = next.pop()
        return last ? [last, ...next] : next
      })
    }, 5200)
    return () => clearInterval(id)
  }, [paused, feed.length])

  const attentionPool = useMemo(() => feed.filter(needsAttention), [feed])
  /** Bell badge = total notifications loaded from the DB (not only attention items). */
  const badgeCount = feed.length
  const badgeLabel = badgeCount > 99 ? '99+' : String(badgeCount)

  useEffect(() => {
    if (!attentionPool.length) return
    const id = setInterval(() => setSpotlight((s) => (s + 1) % attentionPool.length), 4600)
    return () => clearInterval(id)
  }, [attentionPool.length])

  useEffect(() => {
    setSpotlight(0)
  }, [attentionPool.length])

  const visible = feed.filter((u) => {
    const tagOk = tagFilter === 'all' || u.tag === tagFilter
    const flagOk =
      flagFilter === 'none'
        ? true
        : flagFilter === 'ATTENTION'
          ? needsAttention(u)
          : hasFlag(u, 'CLOSING_SOON')
    return tagOk && flagOk
  })

  const hot = attentionPool[spotlight] ?? attentionPool[0]
  const hotMeta = hot ? tagMeta[hot.tag] : null

  return (
    <section id="updates" className="section-pad relative">
      <div className="container-x">
        <SectionHeading
          eyebrow="Notification centre"
          title="Every update, the second"
          highlight="it happens."
          description="Slot letters, shortlists, results and deadlines — pushed here before they reach your inbox. Nothing gets buried."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <Reveal direction="right">
            <div className="relative rounded-[28px] border border-white/10 bg-ink-900/50 backdrop-blur-2xl">
              <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />

              <div className="relative flex flex-wrap items-center gap-3 border-b border-white/[0.07] px-4 py-4 sm:px-5">
                <span className="relative z-10 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-neon-violet text-white shadow-glow">
                  <motion.span
                    animate={{ rotate: [0, -14, 12, -8, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2.6 }}
                  >
                    <BellRing className="h-5 w-5" />
                  </motion.span>
                  {badgeCount > 0 ? (
                    <motion.span
                      key={badgeLabel}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute -right-1 -top-1 z-20 grid h-5 min-w-5 place-items-center rounded-full bg-neon-pink px-1.5 text-[10px] font-bold leading-none text-white ring-2 ring-ink-900"
                    >
                      {badgeLabel}
                    </motion.span>
                  ) : null}
                </span>

                <div className="mr-auto min-w-0">
                  <h3 className="text-[15px] font-bold text-white">Campus live feed</h3>
                  <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon-lime" />
                    {loading ? 'loading…' : `streaming · ${visible.length} updates`}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition',
                    paused
                      ? 'border-neon-lime/30 bg-neon-lime/10 text-neon-lime'
                      : 'border-white/12 bg-white/[0.03] text-slate-300 hover:text-white',
                  )}
                >
                  <span className={cn('h-1.5 w-1.5 rounded-full', paused ? 'bg-neon-lime' : 'animate-pulse bg-neon-pink')} />
                  {paused ? 'Resume' : 'Pause'}
                </button>
              </div>

              <div className="no-scrollbar relative flex gap-2 overflow-x-auto border-b border-white/[0.07] px-4 py-3 sm:px-5">
                {tagFilters.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setTagFilter(f.key)}
                    className={cn(
                      'relative shrink-0 rounded-full px-3.5 py-1.5 text-[11.5px] font-semibold transition',
                      tagFilter === f.key ? 'text-white' : 'text-slate-400 hover:text-slate-200',
                    )}
                  >
                    {tagFilter === f.key && (
                      <motion.span
                        layoutId="notif-tag-filter"
                        className="absolute inset-0 rounded-full border border-brand-400/40 bg-brand-500/15"
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                      />
                    )}
                    <span className="relative">{f.label}</span>
                  </button>
                ))}
              </div>

              <div className="no-scrollbar relative flex gap-2 overflow-x-auto border-b border-white/[0.07] px-4 py-2.5 sm:px-5">
                {flagFilters.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFlagFilter(f.key)}
                    className={cn(
                      'relative shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold transition',
                      flagFilter === f.key ? 'text-white' : 'text-slate-500 hover:text-slate-300',
                    )}
                  >
                    {flagFilter === f.key && (
                      <motion.span
                        layoutId="notif-flag-filter"
                        className="absolute inset-0 rounded-full border border-neon-pink/35 bg-neon-pink/10"
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                      />
                    )}
                    <span className="relative">{f.label}</span>
                  </button>
                ))}
              </div>

              <div
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                className="no-scrollbar relative max-h-[26rem] overflow-y-auto px-3 py-4 sm:max-h-[30rem] sm:px-4"
              >
                {loading ? (
                  <p className="px-2 py-10 text-center text-[12.5px] text-slate-500">Loading notifications…</p>
                ) : (
                  <>
                    <AnimatePresence initial={false} mode="popLayout">
                      {visible.map((u, i) => (
                        <UpdateRow key={u.id} update={u} index={i} />
                      ))}
                    </AnimatePresence>
                    {!visible.length ? (
                      <p className="px-2 py-10 text-center text-[12.5px] text-slate-500">
                        {feed.length
                          ? 'No updates match these filters.'
                          : 'No notifications in the database yet.'}
                      </p>
                    ) : null}
                  </>
                )}
                <div className="pointer-events-none sticky bottom-0 h-12 bg-gradient-to-t from-ink-900 to-transparent" />
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col gap-6">
            <Reveal direction="left">
              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-brand-600/20 via-ink-900/70 to-neon-violet/15 p-5 backdrop-blur-2xl sm:p-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
                  className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full border border-dashed border-white/10"
                />
                <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-neon-cyan/15 blur-3xl" />

                <div className="relative">
                  <span className="chip border-neon-pink/30 bg-neon-pink/10 text-neon-pink">
                    <Megaphone className="h-3 w-3" /> Needs your attention
                  </span>

                  {hot && hotMeta ? (
                    <>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={hot.id}
                          initial={{ opacity: 0, y: 26, filter: 'blur(10px)' }}
                          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, y: -22, filter: 'blur(10px)' }}
                          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          className="mt-4"
                        >
                          <div className="flex flex-wrap items-center gap-3">
                            {hot.companySlug ? (
                              <LogoTile slug={hot.companySlug} name={hot.title} className="h-10 w-10 shrink-0 p-2" />
                            ) : null}
                            <span className={cn('chip border', hotMeta.tone)}>
                              <hotMeta.icon className="h-3 w-3" />
                              {hotMeta.label}
                            </span>
                            {buildMetaLabel(hot) ? (
                              <span className="text-[11px] font-semibold text-slate-400">{buildMetaLabel(hot)}</span>
                            ) : null}
                          </div>
                          <h3 className="mt-3.5 text-[17px] font-bold leading-snug text-white sm:text-lg">{hot.title}</h3>
                          <p className="mt-2 text-[12.5px] leading-relaxed text-slate-300">{hot.description}</p>
                        </motion.div>
                      </AnimatePresence>

                      <div className="mt-5 flex items-center gap-2">
                        {attentionPool.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setSpotlight(i)}
                            aria-label={`Update ${i + 1}`}
                            className={cn(
                              'h-1.5 rounded-full transition-all duration-500',
                              i === spotlight ? 'w-8 bg-white' : 'w-3 bg-white/25 hover:bg-white/50',
                            )}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="mt-4 text-[13px] text-slate-400">
                      {loading ? 'Loading…' : 'Nothing needs your attention right now.'}
                    </p>
                  )}
                </div>
              </div>
            </Reveal>

            <Reveal direction="left" delay={0.1}>
              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-ink-900/60 p-5 backdrop-blur-2xl sm:p-6">
                <div className="flex items-center gap-2 text-slate-400">
                  <AlarmClock className="h-4 w-4 shrink-0 text-neon-amber" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em]">
                    {nextUp?.label ?? (nextLoading ? 'Finding what’s next…' : 'Nothing imminent')}
                  </p>
                </div>

                {nextUp ? (
                  <>
                    <div className="mt-5 flex items-stretch gap-2 sm:gap-2.5">
                      {[
                        { v: countdown.d, l: 'days' },
                        { v: countdown.h, l: 'hrs' },
                        { v: countdown.m, l: 'min' },
                      ].map((unit, i) => (
                        <div key={unit.l} className="flex min-w-0 flex-1 items-center gap-2 sm:gap-2.5">
                          <div className="relative min-w-0 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-transparent px-2 py-3 text-center sm:px-3.5">
                            <AnimatePresence mode="popLayout">
                              <motion.span
                                key={`${nextUp.id}-${unit.v}`}
                                initial={{ y: '-100%', opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: '100%', opacity: 0 }}
                                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                className="block font-mono text-2xl font-bold tabular-nums text-white"
                              >
                                {unit.v}
                              </motion.span>
                            </AnimatePresence>
                            <span className="mt-0.5 block text-[9.5px] uppercase tracking-wider text-slate-500">
                              {unit.l}
                            </span>
                          </div>
                          {i < 2 && <span className="shrink-0 font-display text-xl text-slate-600">:</span>}
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3.5">
                      <div className="flex items-center gap-2.5">
                        {nextUp.companySlug || nextUp.companyName ? (
                          <LogoTile
                            slug={nextUp.companySlug}
                            name={nextUp.companyName ?? nextUp.title}
                            className="h-9 w-9 shrink-0 p-1.5"
                          />
                        ) : (
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl border border-neon-cyan/25 bg-neon-cyan/12 text-neon-cyan">
                            {nextUp.kind === 'event' ? (
                              <Presentation className="h-4 w-4" />
                            ) : (
                              <Megaphone className="h-4 w-4" />
                            )}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-[12.5px] font-bold text-white">{nextUp.title}</p>
                          <p className="truncate text-[11px] text-slate-400">{nextUp.subtitle}</p>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={nextUp.href}
                      className="btn-ghost mt-4 w-full justify-center text-[12.5px]"
                    >
                      {nextUp.kind === 'event' ? 'Open campus calendar' : 'Open jobs board'}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="mt-5 text-[13px] leading-relaxed text-slate-400">
                      {nextLoading
                        ? 'Checking live jobs and campus events…'
                        : isCandidate
                          ? 'No upcoming deadline on your applications yet. Browse jobs or check the campus calendar.'
                          : 'No job or campus event is closing in the next few hours. Check back soon.'}
                    </p>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <Link to="/jobs" className="btn-ghost flex-1 justify-center text-[12.5px]">
                        <Briefcase className="h-3.5 w-3.5" />
                        Jobs board
                      </Link>
                      <Link to="/#events" className="btn-ghost flex-1 justify-center text-[12.5px]">
                        <Bell className="h-3.5 w-3.5" />
                        Campus calendar
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
