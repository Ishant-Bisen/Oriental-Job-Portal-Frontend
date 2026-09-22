import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowDown,
  BellRing,
  CalendarDays,
  Megaphone,
  Presentation,
  Sparkles,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { displayName, fetchCandidateProfile, type CandidateProfile } from '@/api/candidate'
import { useAuth } from '@/auth/AuthProvider'
import { ParticleField } from '@/components/fx/ScreenFX'
import { MagneticButton, TiltCard } from '@/components/ui/primitives'
import { AnimatedHeadline } from '@/components/ui/Reveal'
import { initials } from '@/lib/utils'

/**
 * Pure visual welcome for students.
 * Notices, jobs, workshops and calendar live in the sections below — not tracked here.
 */
export function StudentHero() {
  const { user } = useAuth()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yText = useTransform(scrollYProgress, [0, 1], [0, 90])
  const yImage = useTransform(scrollYProgress, [0, 1], [0, -55])
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0])

  const [profile, setProfile] = useState<CandidateProfile | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchCandidateProfile()
      .then((next) => {
        if (!cancelled) setProfile(next)
      })
      .catch(() => {
        /* session email fallback */
      })
    return () => {
      cancelled = true
    }
  }, [])

  const name = profile ? displayName(profile) : user?.email?.split('@')[0] ?? 'Student'
  const firstName = name.split(' ')[0]
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section ref={ref} className="relative overflow-hidden pb-14 pt-28 sm:pb-16 sm:pt-32 lg:pb-20 lg:pt-36">
      <ParticleField count={20} />
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-brand-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-36 h-96 w-96 rounded-full bg-neon-violet/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-neon-cyan/10 blur-3xl" />

      <div className="container-x relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
          <motion.div style={{ y: yText, opacity: fade }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.04] py-1.5 pl-1.5 pr-4 backdrop-blur-xl"
            >
              <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full border border-white/15 bg-ink-950 text-[10px] font-bold text-white">
                {profile?.profilePicture ? (
                  <img src={profile.profilePicture} alt="" className="h-full w-full object-cover" />
                ) : (
                  initials(name).slice(0, 2)
                )}
              </span>
              <span className="text-[12px] font-semibold text-slate-200">
                {greeting}, {firstName}
              </span>
            </motion.div>

            <h1 className="font-display text-[2.4rem] font-extrabold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
              <AnimatedHeadline text="Campus life," />
              <br />
              <span className="relative inline-block">
                <AnimatedHeadline text="beautifully clear." wordClassName="text-gradient-animated" delay={0.22} />
                <motion.span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-brand-400 via-neon-violet to-neon-cyan"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.05, duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: 'left' }}
                />
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.75 }}
              className="mt-6 max-w-md text-[14.5px] leading-relaxed text-slate-400 sm:text-[15.5px]"
            >
              Notices, drives, workshops and openings live just below — scroll when you’re ready. This space is
              simply yours to breathe in.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.7 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <MagneticButton as="button" onClick={() => scrollTo('updates')} className="btn-primary group">
                <Megaphone className="h-4 w-4" />
                See notices
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </MagneticButton>
              <button type="button" onClick={() => scrollTo('events')} className="btn-ghost">
                <CalendarDays className="h-4 w-4" />
                Campus calendar
              </button>
            </motion.div>
          </motion.div>

          {/* ------------------------------------------------ interactive visual (mirrors landing Hero) */}
          <motion.div
            style={{ y: yImage }}
            initial={{ opacity: 0, scale: 0.9, rotateY: 14 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <TiltCard intensity={9} className="relative">
              <div className="preserve-3d relative">
                <div className="absolute -inset-8 rounded-[3rem] bg-brand-500/15 blur-3xl" />

                <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-ink-900/60 p-2 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.95)] backdrop-blur-xl">
                  <div className="relative overflow-hidden rounded-[1.6rem]">
                    <motion.img
                      src="/images/hero-campus.png"
                      alt="Campus atmosphere with notices, workshops and drives"
                      className="h-full min-h-[280px] w-full object-cover sm:min-h-[340px]"
                      initial={{ scale: 1.08 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/25 to-transparent" />

                    <motion.div
                      animate={{ x: ['-120%', '220%'] }}
                      transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
                      className="absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/12 to-transparent"
                    />

                    {[
                      {
                        top: '26%',
                        left: '18%',
                        label: 'Notices · live board',
                        tone: 'bg-neon-amber',
                        target: 'updates',
                      },
                      {
                        top: '48%',
                        left: '56%',
                        label: 'Workshop · Design systems',
                        tone: 'bg-neon-cyan',
                        target: 'events',
                      },
                      {
                        top: '36%',
                        left: '38%',
                        label: 'Drive open · today',
                        tone: 'bg-brand-400',
                        target: 'events',
                      },
                    ].map((h, i) => (
                      <motion.button
                        key={h.label}
                        type="button"
                        onClick={() => scrollTo(h.target)}
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.1 + i * 0.15, type: 'spring', stiffness: 220 }}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                        className="group absolute z-10"
                        style={{ top: h.top, left: h.left }}
                        aria-label={h.label}
                      >
                        <span className="relative flex h-3.5 w-3.5">
                          <span
                            className={`absolute inline-flex h-full w-full animate-pulse-ring rounded-full ${h.tone}`}
                            style={{ animationDelay: `${i * 0.7}s` }}
                          />
                          <span
                            className={`relative inline-flex h-3.5 w-3.5 rounded-full ${h.tone} shadow-[0_0_14px_4px_rgba(255,255,255,0.4)] ring-2 ring-white/30 transition group-hover:ring-white/70`}
                          />
                        </span>
                        <motion.span
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.35 + i * 0.2 }}
                          className="pointer-events-none absolute left-6 top-[-7px] whitespace-nowrap rounded-lg border border-white/10 bg-ink-950/90 px-2.5 py-1 text-[10px] font-semibold text-slate-200 opacity-90 shadow-lg backdrop-blur-md transition group-hover:border-white/25 group-hover:opacity-100"
                        >
                          {h.label}
                        </motion.span>
                      </motion.button>
                    ))}

                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-200">
                        <Sparkles className="h-3.5 w-3.5" />
                        Oriental T&P
                      </div>
                      <p className="mt-2 max-w-sm text-[14px] font-semibold leading-snug text-white">
                        One calm place for every notice, event and opportunity on campus.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 px-3 py-3.5">
                    {[
                      { k: 'Notices', v: 'Board' },
                      { k: 'Workshops', v: 'Open' },
                      { k: 'Calendar', v: 'Live' },
                    ].map((s) => (
                      <div key={s.k} className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2">
                        <p className="font-display text-base font-bold text-white">{s.v}</p>
                        <p className="text-[10px] uppercase tracking-wide text-slate-500">{s.k}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <motion.button
                  type="button"
                  onClick={() => scrollTo('updates')}
                  animate={{ y: [0, -14, 0] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                  whileHover={{ scale: 1.04 }}
                  style={{ transform: 'translateZ(70px)' }}
                  className="absolute -left-5 top-14 hidden w-[12.5rem] rounded-2xl border border-white/12 bg-ink-900/85 p-3.5 text-left shadow-card backdrop-blur-2xl transition hover:border-neon-amber/40 sm:-left-9 sm:block"
                >
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-neon-amber/15 text-neon-amber">
                      <BellRing className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-[11px] font-bold text-white">Fresh notice</p>
                      <p className="text-[10px] text-slate-400">T&P cell · just posted</p>
                    </div>
                  </div>
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '78%' }}
                      transition={{ duration: 1.6, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-neon-amber to-neon-cyan"
                    />
                  </div>
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => scrollTo('events')}
                  animate={{ y: [0, 16, 0] }}
                  transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                  whileHover={{ scale: 1.04 }}
                  style={{ transform: 'translateZ(90px)' }}
                  className="absolute -right-4 bottom-28 hidden w-[12.5rem] rounded-2xl border border-white/12 bg-ink-900/85 p-3.5 text-left shadow-card backdrop-blur-2xl transition hover:border-neon-cyan/40 sm:-right-8 sm:block"
                >
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-neon-cyan/15 text-neon-cyan">
                      <Presentation className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-[11px] font-bold text-white">Workshop today</p>
                      <p className="text-[10px] text-slate-400">14:00 · Innovation Lab</p>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => scrollTo('events')}
                  animate={{ y: [0, -11, 0], x: [0, 6, 0] }}
                  transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                  whileHover={{ scale: 1.04 }}
                  style={{ transform: 'translateZ(60px)' }}
                  className="absolute -bottom-5 left-5 flex items-center gap-2.5 rounded-2xl border border-white/12 bg-ink-900/85 px-3.5 py-2.5 text-left shadow-card backdrop-blur-2xl transition hover:border-neon-violet/40"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-neon-violet/15 text-neon-violet">
                    <CalendarDays className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold text-white">Campus calendar</p>
                    <p className="text-[10px] text-slate-400">Drives · talks · deadlines</p>
                  </div>
                </motion.button>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
