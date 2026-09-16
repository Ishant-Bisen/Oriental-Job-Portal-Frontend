import { AnimatePresence, motion } from 'framer-motion'
import {
  AlarmClock,
  Bell,
  BellRing,
  Briefcase,
  CheckCircle2,
  FileWarning,
  Megaphone,
  PartyPopper,
  Presentation,
  Radio,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { LogoTile, SectionHeading } from '@/components/ui/primitives'
import { Reveal } from '@/components/ui/Reveal'
import { updates, type Update, type UpdateKind } from '@/data/updates'
import { cn } from '@/lib/utils'

const kindMeta: Record<UpdateKind, { icon: typeof Bell; label: string; tone: string; ring: string }> = {
  drive: { icon: Briefcase, label: 'Drive', tone: 'text-neon-amber bg-neon-amber/12 border-neon-amber/25', ring: 'shadow-[0_0_0_1px_rgba(251,191,36,0.25)]' },
  result: { icon: CheckCircle2, label: 'Result', tone: 'text-neon-cyan bg-neon-cyan/12 border-neon-cyan/25', ring: 'shadow-[0_0_0_1px_rgba(34,211,238,0.25)]' },
  deadline: { icon: AlarmClock, label: 'Deadline', tone: 'text-neon-pink bg-neon-pink/12 border-neon-pink/25', ring: 'shadow-[0_0_0_1px_rgba(244,114,182,0.25)]' },
  workshop: { icon: Presentation, label: 'Workshop', tone: 'text-neon-violet bg-neon-violet/12 border-neon-violet/25', ring: 'shadow-[0_0_0_1px_rgba(168,85,247,0.25)]' },
  notice: { icon: FileWarning, label: 'Notice', tone: 'text-slate-200 bg-white/8 border-white/20', ring: '' },
  offer: { icon: PartyPopper, label: 'Offer', tone: 'text-neon-lime bg-neon-lime/12 border-neon-lime/25', ring: 'shadow-[0_0_0_1px_rgba(163,230,53,0.25)]' },
}

const filters: { key: UpdateKind | 'all'; label: string }[] = [
  { key: 'all', label: 'Everything' },
  { key: 'drive', label: 'Drives' },
  { key: 'result', label: 'Results' },
  { key: 'deadline', label: 'Deadlines' },
  { key: 'offer', label: 'Offers' },
  { key: 'workshop', label: 'Workshops' },
  { key: 'notice', label: 'Notices' },
]

function useCountdown(hoursAhead: number) {
  const target = useMemo(() => Date.now() + hoursAhead * 3600_000, [hoursAhead])
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const diff = Math.max(0, target - now)
  return {
    h: String(Math.floor(diff / 3600_000)).padStart(2, '0'),
    m: String(Math.floor((diff % 3600_000) / 60_000)).padStart(2, '0'),
    s: String(Math.floor((diff % 60_000) / 1000)).padStart(2, '0'),
  }
}

function UpdateRow({ update, index }: { update: Update; index: number }) {
  const meta = kindMeta[update.kind]

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: -26, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: Math.min(index * 0.04, 0.3) }}
      className={cn(
        'group relative mb-3 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3.5 transition-all duration-300 hover:border-brand-400/30 hover:bg-white/[0.055] sm:p-4',
        update.urgent && 'border-neon-pink/20',
      )}
    >
      {/* left accent */}
      <span
        className={cn(
          'absolute inset-y-0 left-0 w-[3px] scale-y-0 bg-gradient-to-b from-brand-400 to-neon-cyan transition-transform duration-500 group-hover:scale-y-100',
          update.urgent && 'scale-y-100 from-neon-pink to-neon-amber',
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
            {update.pinned && (
              <span className="chip border-brand-400/30 bg-brand-500/10 text-brand-200">Pinned</span>
            )}
            {update.urgent && (
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-neon-pink">
                <span className="h-1.5 w-1.5 animate-ping rounded-full bg-neon-pink" />
                action needed
              </span>
            )}
            <span className="ml-auto shrink-0 font-mono text-[10.5px] text-slate-500">{update.time}</span>
          </div>

          <h4 className="mt-2 text-[13.5px] font-bold leading-snug text-white">{update.title}</h4>

          <motion.p
            initial={false}
            className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-slate-400 transition-all duration-500 group-hover:line-clamp-none"
          >
            {update.detail}
          </motion.p>

          {update.meta && (
            <p className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-2 py-1 text-[10.5px] font-semibold text-slate-300">
              <Radio className="h-3 w-3 text-brand-300" />
              {update.meta}
            </p>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export function Notifications() {
  const [filter, setFilter] = useState<UpdateKind | 'all'>('all')
  const [feed, setFeed] = useState(updates)
  const [paused, setPaused] = useState(false)
  const [unread, setUnread] = useState(7)
  const [spotlight, setSpotlight] = useState(0)
  const countdown = useCountdown(14)

  /* rotate the feed so the board always feels live */
  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      setFeed((f) => {
        const next = [...f]
        const last = next.pop()
        return last ? [last, ...next] : next
      })
      setUnread((u) => (u >= 99 ? 12 : u + 1))
    }, 5200)
    return () => clearInterval(id)
  }, [paused])

  const pinnedPool = useMemo(() => updates.filter((u) => u.urgent || u.pinned), [])

  useEffect(() => {
    const id = setInterval(() => setSpotlight((s) => (s + 1) % pinnedPool.length), 4600)
    return () => clearInterval(id)
  }, [pinnedPool.length])

  const visible = feed.filter((u) => filter === 'all' || u.kind === filter)
  const hot = pinnedPool[spotlight]
  const hotMeta = kindMeta[hot.kind]

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
          {/* ------------------------------------------------ live feed */}
          <Reveal direction="right">
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-ink-900/50 backdrop-blur-2xl">
              <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />

              {/* header */}
              <div className="relative flex flex-wrap items-center gap-3 border-b border-white/[0.07] px-4 py-4 sm:px-5">
                <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-neon-violet text-white shadow-glow">
                  <motion.span
                    animate={{ rotate: [0, -14, 12, -8, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2.6 }}
                  >
                    <BellRing className="h-5 w-5" />
                  </motion.span>
                  <motion.span
                    key={unread}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-neon-pink px-1 text-[10px] font-bold text-white ring-2 ring-ink-900"
                  >
                    {unread}
                  </motion.span>
                </span>

                <div className="mr-auto min-w-0">
                  <h3 className="text-[15px] font-bold text-white">Campus live feed</h3>
                  <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon-lime" />
                    streaming · {visible.length} updates
                  </p>
                </div>

                <button
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

              {/* filters */}
              <div className="no-scrollbar relative flex gap-2 overflow-x-auto border-b border-white/[0.07] px-4 py-3 sm:px-5">
                {filters.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={cn(
                      'relative shrink-0 rounded-full px-3.5 py-1.5 text-[11.5px] font-semibold transition',
                      filter === f.key ? 'text-white' : 'text-slate-400 hover:text-slate-200',
                    )}
                  >
                    {filter === f.key && (
                      <motion.span
                        layoutId="notif-filter"
                        className="absolute inset-0 rounded-full border border-brand-400/40 bg-brand-500/15"
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                      />
                    )}
                    <span className="relative">{f.label}</span>
                  </button>
                ))}
              </div>

              {/* list */}
              <div
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                className="no-scrollbar relative max-h-[26rem] overflow-y-auto px-3 py-4 sm:max-h-[30rem] sm:px-4"
              >
                <AnimatePresence initial={false} mode="popLayout">
                  {visible.map((u, i) => (
                    <UpdateRow key={u.id} update={u} index={i} />
                  ))}
                </AnimatePresence>
                <div className="pointer-events-none sticky bottom-0 h-12 bg-gradient-to-t from-ink-900 to-transparent" />
              </div>
            </div>
          </Reveal>

          {/* ------------------------------------------------ spotlight + countdown */}
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
                        {hot.companySlug && <LogoTile slug={hot.companySlug} name={hot.title} className="h-10 w-10 shrink-0 p-2" />}
                        <span className={cn('chip border', hotMeta.tone)}>
                          <hotMeta.icon className="h-3 w-3" />
                          {hotMeta.label}
                        </span>
                      </div>
                      <h3 className="mt-3.5 text-[17px] font-bold leading-snug text-white sm:text-lg">{hot.title}</h3>
                      <p className="mt-2 text-[12.5px] leading-relaxed text-slate-300">{hot.detail}</p>
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-5 flex items-center gap-2">
                    {pinnedPool.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSpotlight(i)}
                        aria-label={`Update ${i + 1}`}
                        className={cn(
                          'h-1.5 rounded-full transition-all duration-500',
                          i === spotlight ? 'w-8 bg-white' : 'w-3 bg-white/25 hover:bg-white/50',
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* countdown */}
            <Reveal direction="left" delay={0.1}>
              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-ink-900/60 p-5 backdrop-blur-2xl sm:p-6">
                <div className="flex items-center gap-2 text-slate-400">
                  <AlarmClock className="h-4 w-4 shrink-0 text-neon-amber" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em]">Next drive reporting in</p>
                </div>

                <div className="mt-5 flex items-stretch gap-2 sm:gap-2.5">
                  {[
                    { v: countdown.h, l: 'hrs' },
                    { v: countdown.m, l: 'min' },
                    { v: countdown.s, l: 'sec' },
                  ].map((unit, i) => (
                    <div key={unit.l} className="flex min-w-0 flex-1 items-center gap-2 sm:gap-2.5">
                      <div className="relative min-w-0 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-transparent px-2 py-3 text-center sm:px-3.5">
                        <AnimatePresence mode="popLayout">
                          <motion.span
                            key={unit.v}
                            initial={{ y: '-100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '100%', opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="block font-mono text-2xl font-bold tabular-nums text-white"
                          >
                            {unit.v}
                          </motion.span>
                        </AnimatePresence>
                        <span className="mt-0.5 block text-[9.5px] uppercase tracking-wider text-slate-500">{unit.l}</span>
                      </div>
                      {i < 2 && <span className="shrink-0 font-display text-xl text-slate-600">:</span>}
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3.5">
                  <div className="flex items-center gap-2.5">
                    <LogoTile slug="google" name="Google" className="h-9 w-9 shrink-0 p-1.5" />
                    <div className="min-w-0">
                      <p className="text-[12.5px] font-bold text-white">Google · Core Platform drive</p>
                      <p className="text-[11px] text-slate-400">Main Auditorium · report by 08:30 with 2 resumes</p>
                    </div>
                  </div>
                </div>

                <button className="btn-ghost mt-4 w-full justify-center text-[12.5px]">
                  <Bell className="h-3.5 w-3.5" />
                  Turn on WhatsApp alerts
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
