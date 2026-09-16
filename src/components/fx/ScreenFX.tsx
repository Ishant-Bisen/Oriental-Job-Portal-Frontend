import { AnimatePresence, motion, useMotionValue, useScroll, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

/* ------------------------------------------------ ambient animated backdrop */

export function BackgroundFX() {
  const { scrollYProgress } = useScroll()
  const hue = useSpring(scrollYProgress, { stiffness: 40, damping: 20 })

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-ink-950" />

      {/* aurora blobs */}
      <motion.div
        style={{ scale: useSpring(hue, { stiffness: 30, damping: 20 }) }}
        className="absolute -left-40 -top-40 h-[36rem] w-[36rem] animate-drift rounded-full bg-brand-600/25 blur-[130px]"
      />
      <div className="absolute -right-32 top-24 h-[30rem] w-[30rem] animate-drift rounded-full bg-neon-cyan/18 blur-[130px] [animation-delay:-7s]" />
      <div className="absolute bottom-[-12rem] left-1/3 h-[34rem] w-[34rem] animate-drift rounded-full bg-neon-violet/20 blur-[140px] [animation-delay:-14s]" />
      <div className="absolute right-1/4 top-1/2 h-[22rem] w-[22rem] animate-drift rounded-full bg-neon-pink/12 blur-[120px] [animation-delay:-4s]" />

      {/* grid */}
      <div className="absolute inset-0 bg-grid-fade bg-grid opacity-[0.55] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_78%)]" />

      {/* scanning beam */}
      <motion.div
        aria-hidden
        initial={{ y: '-30%' }}
        animate={{ y: '130%' }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-x-0 h-40 bg-gradient-to-b from-transparent via-brand-400/[0.07] to-transparent"
      />

      {/* film grain */}
      <div
        className="absolute inset-0 opacity-[0.045] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.72)_100%)]" />
    </div>
  )
}

/* ------------------------------------------------ floating particle field */

export function ParticleField({ count = 26 }: { count?: number }) {
  const [seeds] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 1 + Math.random() * 2.6,
      delay: Math.random() * 10,
      duration: 14 + Math.random() * 18,
      drift: (Math.random() - 0.5) * 90,
      opacity: 0.18 + Math.random() * 0.5,
    })),
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {seeds.map((s) => (
        <motion.span
          key={s.id}
          initial={{ y: '105%', x: 0, opacity: 0 }}
          animate={{ y: '-10%', x: s.drift, opacity: [0, s.opacity, s.opacity, 0] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'linear' }}
          style={{ left: `${s.left}%`, width: s.size, height: s.size }}
          className="absolute rounded-full bg-brand-200 shadow-[0_0_10px_2px_rgba(165,180,252,0.55)]"
        />
      ))}
    </div>
  )
}

/* ------------------------------------------------ cursor spotlight */

export function CursorGlow() {
  const x = useMotionValue(-500)
  const y = useMotionValue(-500)
  const sx = useSpring(x, { stiffness: 120, damping: 22, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 120, damping: 22, mass: 0.4 })
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(pointer: fine)').matches) setEnabled(true)
    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [x, y])

  if (!enabled) return null

  return (
    <>
      <motion.div
        style={{ left: sx, top: sy }}
        className="pointer-events-none fixed z-[60] -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
      >
        <div className="h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.13),transparent_62%)]" />
      </motion.div>
      <motion.div
        style={{ left: x, top: y }}
        className="pointer-events-none fixed z-[61] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-200/80 shadow-[0_0_12px_3px_rgba(165,180,252,0.5)]"
      />
    </>
  )
}

/* ------------------------------------------------ scroll progress rail */

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const width = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 })

  return (
    <motion.div
      style={{ scaleX: width }}
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-brand-400 via-neon-cyan to-neon-violet shadow-[0_0_14px_rgba(99,102,241,0.85)]"
    />
  )
}

/* ------------------------------------------------ back to top */

export function ScrollToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-7 right-7 z-50 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-ink-900/80 text-brand-200 backdrop-blur-xl transition hover:border-brand-400/50 hover:text-white hover:shadow-glow"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------------------------ preloader */

export function Preloader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0
    const tick = () => {
      frame += 1
      setProgress((p) => {
        const next = p + Math.max(0.6, (100 - p) * 0.045)
        return next > 100 ? 100 : next
      })
      if (frame < 400) raf = requestAnimationFrame(tick)
    }
    let raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (progress > 99.2) {
      const t = setTimeout(onDone, 420)
      return () => clearTimeout(t)
    }
  }, [progress, onDone])

  return (
    <motion.div
      exit={{ opacity: 0, filter: 'blur(18px)', scale: 1.06 }}
      transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
      className="fixed inset-0 z-[100] grid place-items-center bg-ink-950"
    >
      <div className="absolute inset-0 bg-aurora opacity-70" />
      <ParticleField count={18} />
      <div className="relative flex flex-col items-center gap-7 px-6">
        <div className="relative grid h-24 w-24 place-items-center">
          <span className="absolute inset-0 animate-pulse-ring rounded-full border border-brand-400/50" />
          <span className="absolute inset-0 animate-pulse-ring rounded-full border border-neon-cyan/40 [animation-delay:0.8s]" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-400 border-r-neon-violet"
          />
          <BridgeMark className="h-11 w-11" />
        </div>

        <div className="text-center">
          <p className="font-display text-lg font-bold tracking-tight text-white">
            Talent<span className="text-gradient">Bridge</span>
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.32em] text-slate-500">
            university placement suite
          </p>
        </div>

        <div className="h-[3px] w-56 overflow-hidden rounded-full bg-white/10">
          <motion.div
            style={{ width: `${progress}%` }}
            className="h-full rounded-full bg-gradient-to-r from-brand-400 via-neon-cyan to-neon-violet"
          />
        </div>
        <span className="font-mono text-xs text-slate-500">{Math.round(progress)}%</span>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------ logo mark */

export function BridgeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <defs>
        <linearGradient id="tb-grad" x1="0" y1="0" x2="48" y2="48">
          <stop stopColor="#818CF8" />
          <stop offset="0.5" stopColor="#A855F7" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <motion.path
        d="M5 33c6-14 13-21 19-21s13 7 19 21"
        stroke="url(#tb-grad)"
        strokeWidth="3.4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, ease: 'easeInOut' }}
      />
      <path d="M5 33h38" stroke="url(#tb-grad)" strokeWidth="3.4" strokeLinecap="round" opacity="0.45" />
      <path d="M15 33V22M24 33V17.5M33 33V22" stroke="url(#tb-grad)" strokeWidth="2.4" strokeLinecap="round" opacity="0.8" />
      <circle cx="24" cy="12" r="3.6" fill="url(#tb-grad)" />
    </svg>
  )
}
