import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  PlayCircle,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ParticleField } from '@/components/fx/ScreenFX'
import { Counter, MagneticButton, TiltCard } from '@/components/ui/primitives'
import { AnimatedHeadline } from '@/components/ui/Reveal'
import { placedStudents } from '@/data/students'
import { tickerItems } from '@/data/updates'

const trustRow = [
  { icon: Building2, value: 312, suffix: '+', label: 'recruiters on campus' },
  { icon: TrendingUp, value: 96.4, suffix: '%', decimals: 1, label: 'placement rate' },
  { icon: BadgeCheck, value: 2847, suffix: '', label: 'offers this season' },
]

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yText = useTransform(scrollYProgress, [0, 1], [0, 120])
  const yImage = useTransform(scrollYProgress, [0, 1], [0, -70])
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0])

  return (
    <section ref={ref} className="relative overflow-hidden pb-20 pt-32 sm:pt-36 lg:pb-28 lg:pt-44">
      <ParticleField count={22} />

      <div className="container-x relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
          {/* ------------------------------------------------ copy */}
          <motion.div style={{ y: yText, opacity: fade }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-brand-400/25 bg-brand-500/[0.08] py-1.5 pl-1.5 pr-4 backdrop-blur-xl"
            >
              <span className="rounded-full bg-gradient-to-r from-brand-500 to-neon-violet px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                Live
              </span>
              <span className="text-xs font-semibold text-brand-100">
                Batch 2026 · 18 drives open this week
              </span>
            </motion.div>

            <h1 className="font-display text-[2.6rem] font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[4.1rem]">
              <AnimatedHeadline text="Where campus" />
              <br className="hidden sm:block" />
              <span className="relative inline-block">
                <AnimatedHeadline text="meets career." wordClassName="text-gradient-animated" delay={0.25} />
                <motion.svg
                  viewBox="0 0 300 14"
                  className="absolute -bottom-2 left-0 h-3 w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  <motion.path
                    d="M2 9C60 3 150 2 298 7"
                    fill="none"
                    stroke="url(#hero-underline)"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.3, delay: 1.1, ease: 'easeInOut' }}
                  />
                  <defs>
                    <linearGradient id="hero-underline" x1="0" x2="300">
                      <stop stopColor="#6366F1" />
                      <stop offset="0.5" stopColor="#A855F7" />
                      <stop offset="1" stopColor="#22D3EE" />
                    </linearGradient>
                  </defs>
                </motion.svg>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-8 max-w-xl text-[1.02rem] leading-relaxed text-slate-400 sm:text-lg"
            >
              TalentBridge is the university's official placement platform — verified recruiters,
              AI-scored resumes, department-wise drives and every deadline on one live timeline.
              <span className="text-slate-200"> No ghost jobs. No missed updates.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.85 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <MagneticButton as="a" href="#portals" className="btn-primary group">
                Get started free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </MagneticButton>
              <Link to="/jobs" className="btn-ghost group">
                <PlayCircle className="h-4 w-4 text-brand-300" />
                Explore live jobs
                <span className="rounded-full bg-brand-500/20 px-2 py-0.5 text-[10px] font-bold text-brand-200">
                  18 new
                </span>
              </Link>
            </motion.div>

            {/* trust row */}
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-white/[0.07] pt-7"
            >
              {trustRow.map((t) => (
                <div key={t.label}>
                  <div className="flex items-center gap-1.5 text-brand-300">
                    <t.icon className="h-3.5 w-3.5" />
                    <span className="font-display text-xl font-bold text-white sm:text-2xl">
                      <Counter value={t.value} suffix={t.suffix} decimals={t.decimals ?? 0} />
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-500">{t.label}</p>
                </div>
              ))}
            </motion.div>

            {/* student cluster */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 1.15 }}
              className="mt-8 flex items-center gap-3"
            >
              <div className="flex -space-x-3">
                {placedStudents.slice(0, 5).map((s, i) => (
                  <motion.img
                    key={s.name}
                    src={s.photo}
                    alt={s.name}
                    loading="lazy"
                    initial={{ opacity: 0, scale: 0.5, x: -12 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ delay: 1.2 + i * 0.08, type: 'spring', stiffness: 220 }}
                    whileHover={{ y: -6, scale: 1.12, zIndex: 10 }}
                    className="h-10 w-10 rounded-full border-2 border-ink-950 object-cover ring-1 ring-white/20"
                  />
                ))}
              </div>
              <p className="text-xs leading-snug text-slate-400">
                <span className="font-semibold text-white">2,847 students</span> placed last season
                <br />
                across 8 departments and 312 companies
              </p>
            </motion.div>
          </motion.div>

          {/* ------------------------------------------------ interactive visual */}
          <motion.div
            style={{ y: yImage }}
            initial={{ opacity: 0, scale: 0.9, rotateY: 14 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <TiltCard intensity={9} className="relative">
              <div className="preserve-3d relative">
                {/* halo */}
                <div className="absolute -inset-8 rounded-[3rem] bg-brand-500/15 blur-3xl" />

                {/* frame */}
                <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-ink-900/60 p-2 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.95)] backdrop-blur-xl">
                  <div className="relative overflow-hidden rounded-[1.6rem]">
                    <img
                      src="/images/hero-campus.png"
                      alt="Illustration of the university campus with live placement activity"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent" />

                    {/* sweeping light */}
                    <motion.div
                      animate={{ x: ['-120%', '220%'] }}
                      transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
                      className="absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/12 to-transparent"
                    />

                    {/* pulsing campus hotspots */}
                    {[
                      { top: '28%', left: '22%', label: 'Drive today · Google' },
                      { top: '58%', left: '68%', label: 'Workshop · System Design' },
                      { top: '42%', left: '48%', label: '12 interviews live' },
                    ].map((h, i) => (
                      <div key={h.label} className="absolute" style={{ top: h.top, left: h.left }}>
                        <span className="relative flex h-3 w-3">
                          <span
                            className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-neon-cyan"
                            style={{ animationDelay: `${i * 0.7}s` }}
                          />
                          <span className="relative inline-flex h-3 w-3 rounded-full bg-neon-cyan shadow-[0_0_12px_3px_rgba(34,211,238,0.6)]" />
                        </span>
                        <motion.span
                          initial={{ opacity: 0, y: 6 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.4 + i * 0.2 }}
                          className="pointer-events-none absolute left-5 top-[-6px] whitespace-nowrap rounded-lg border border-white/10 bg-ink-950/85 px-2 py-1 text-[10px] font-semibold text-slate-200 backdrop-blur-md"
                        >
                          {h.label}
                        </motion.span>
                      </div>
                    ))}
                  </div>

                  {/* inline stat strip */}
                  <div className="grid grid-cols-3 gap-2 px-3 py-3.5">
                    {[
                      { k: 'Live drives', v: '18' },
                      { k: 'Interviews today', v: '124' },
                      { k: 'Offers this week', v: '63' },
                    ].map((s) => (
                      <div key={s.k} className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2">
                        <p className="font-display text-base font-bold text-white">{s.v}</p>
                        <p className="text-[10px] uppercase tracking-wide text-slate-500">{s.k}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* floating card — resume score */}
                <motion.div
                  animate={{ y: [0, -14, 0] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ transform: 'translateZ(70px)' }}
                  className="absolute -left-6 top-16 w-[13.5rem] rounded-2xl border border-white/12 bg-ink-900/85 p-3.5 shadow-card backdrop-blur-2xl sm:-left-10"
                >
                  <div className="flex items-center justify-between">
                    <span className="chip border-neon-lime/30 bg-neon-lime/10 text-neon-lime">
                      <Sparkles className="h-3 w-3" /> AI score
                    </span>
                    <span className="font-display text-lg font-bold text-neon-lime">96%</span>
                  </div>
                  <p className="mt-2.5 text-[11px] font-semibold text-white">Adobe · Product Engineer</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '96%' }}
                      transition={{ duration: 1.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-neon-lime to-neon-cyan"
                    />
                  </div>
                  <p className="mt-2 text-[10px] text-slate-400">Add WebGL to reach 99%</p>
                </motion.div>

                {/* floating card — offer */}
                <motion.div
                  animate={{ y: [0, 16, 0] }}
                  transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                  style={{ transform: 'translateZ(90px)' }}
                  className="absolute -right-4 bottom-24 w-[13rem] rounded-2xl border border-white/12 bg-ink-900/85 p-3.5 shadow-card backdrop-blur-2xl sm:-right-8"
                >
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-neon-amber/15 text-neon-amber">
                      <BadgeCheck className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-[11px] font-bold text-white">Offer released</p>
                      <p className="text-[10px] text-slate-400">Google · ₹54.8 LPA</p>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center gap-1.5">
                    {placedStudents.slice(0, 3).map((s) => (
                      <img
                        key={s.name}
                        src={s.photo}
                        alt=""
                        className="h-6 w-6 rounded-full border border-ink-900 object-cover"
                      />
                    ))}
                    <span className="text-[10px] text-slate-400">+11 more today</span>
                  </div>
                </motion.div>

                {/* floating card — next event */}
                <motion.div
                  animate={{ y: [0, -11, 0], x: [0, 6, 0] }}
                  transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                  style={{ transform: 'translateZ(60px)' }}
                  className="absolute -bottom-6 left-6 flex items-center gap-2.5 rounded-2xl border border-white/12 bg-ink-900/85 px-3.5 py-2.5 shadow-card backdrop-blur-2xl"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-neon-violet/15 text-neon-violet">
                    <CalendarDays className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold text-white">Next: Google drive</p>
                    <p className="text-[10px] text-slate-400">Tomorrow · 09:00 · Main Auditorium</p>
                  </div>
                </motion.div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </div>

      {/* ------------------------------------------------ live ticker */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.3 }}
        className="relative mt-20 border-y border-white/[0.07] bg-ink-900/40 py-3.5 backdrop-blur-xl"
      >
        <div className="flex items-center gap-4">
          <span className="ml-4 hidden shrink-0 items-center gap-2 rounded-full bg-neon-pink/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-neon-pink sm:flex">
            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-neon-pink" />
            Live wire
          </span>
          <div className="mask-fade-x flex-1 overflow-hidden">
            <div className="flex w-max animate-marquee items-center" style={{ ['--marquee-duration' as string]: '42s' }}>
              {[...tickerItems, ...tickerItems].map((t, i) => (
                <span key={i} className="flex items-center whitespace-nowrap px-5 text-xs font-medium text-slate-400">
                  <span className="mr-3 h-1 w-1 rounded-full bg-brand-400" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
