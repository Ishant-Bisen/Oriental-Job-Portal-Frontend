import {
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn, gradientFor, initials, scoreTone } from '@/lib/utils'
import { logoUrl } from '@/data/companies'

/* ------------------------------------------------------------------ heading */

export function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  align = 'center',
  className,
}: {
  eyebrow?: string
  title: string
  highlight?: string
  description?: string
  align?: 'center' | 'left'
  className?: string
}) {
  return (
    <div
      className={cn(
        'max-w-3xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className,
      )}
    >
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={cn('mb-5 flex', align === 'center' ? 'justify-center' : 'justify-start')}
        >
          <span className="chip border-brand-400/30 bg-brand-500/10 text-brand-200">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-300 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-300" />
            </span>
            {eyebrow}
          </span>
        </motion.div>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 26, filter: 'blur(10px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl lg:text-[2.9rem]"
      >
        {title} {highlight && <span className="text-gradient-animated">{highlight}</span>}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className={cn(
            'mt-5 text-base leading-relaxed text-slate-400 sm:text-[1.05rem]',
            align === 'center' && 'mx-auto max-w-2xl',
          )}
        >
          {description}
        </motion.p>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ counter */

export function Counter({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 2.2,
  className,
}: {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    })
    return () => controls.stop()
  }, [inView, value, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  )
}

/* ------------------------------------------------------------------ spotlight */

export function SpotlightCard({
  children,
  className,
  glow = 'rgba(99,102,241,0.16)',
}: {
  children: ReactNode
  className?: string
  glow?: string
}) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const background = useMotionTemplate`radial-gradient(340px circle at ${mx}px ${my}px, ${glow}, transparent 72%)`

  return (
    <div
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        mx.set(e.clientX - r.left)
        my.set(e.clientY - r.top)
      }}
      className={cn('group relative overflow-hidden rounded-3xl glass', className)}
    >
      <motion.div
        style={{ background }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="relative">{children}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ tilt */

export function TiltCard({
  children,
  className,
  intensity = 12,
}: {
  children: ReactNode
  className?: string
  intensity?: number
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), {
    stiffness: 150,
    damping: 18,
  })
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), {
    stiffness: 150,
    damping: 18,
  })

  return (
    <motion.div
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - r.left) / r.width - 0.5)
        y.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
      style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
      className={cn('perspective', className)}
    >
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ marquee */

export function Marquee({
  children,
  reverse = false,
  duration = '38s',
  vertical = false,
  className,
  pauseOnHover = true,
}: {
  children: ReactNode
  reverse?: boolean
  duration?: string
  vertical?: boolean
  className?: string
  pauseOnHover?: boolean
}) {
  return (
    <div
      className={cn('group flex overflow-hidden', vertical ? 'flex-col' : 'flex-row', className)}
      style={{ ['--marquee-duration' as string]: duration }}
    >
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden={i === 1}
          className={cn(
            'flex shrink-0 items-center',
            vertical ? 'animate-marquee-vertical flex-col' : 'animate-marquee flex-row',
            reverse && '[animation-direction:reverse]',
            pauseOnHover && 'group-hover:[animation-play-state:paused]',
          )}
        >
          {children}
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ logo */

export function LogoTile({
  slug,
  name,
  src,
  className,
  imgClassName,
}: {
  slug?: string
  name: string
  src?: string
  className?: string
  imgClassName?: string
}) {
  const imageSrc = src || (slug ? logoUrl(slug) : undefined)
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const failed = !imageSrc || failedSrc === imageSrc

  if (failed) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-2xl bg-gradient-to-br font-display text-sm font-bold text-white',
          gradientFor(name),
          className,
        )}
        title={name}
      >
        {initials(name)}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-2xl bg-white/90 p-2.5 ring-1 ring-white/20',
        className,
      )}
      title={name}
    >
      <img
        src={imageSrc}
        alt={`${name} logo`}
        loading="lazy"
        onError={() => setFailedSrc(imageSrc)}
        className={cn('h-full w-full object-contain', imgClassName)}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ score ring */

export function ScoreRing({
  score,
  size = 76,
  stroke = 6,
  showLabel = true,
}: {
  score: number
  size?: number
  stroke?: number
  showLabel?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const tone = scoreTone(score)
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r

  return (
    <div ref={ref} className="relative inline-flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          className="fill-none stroke-white/10"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          className={cn('fill-none', tone.ring)}
          style={{ filter: 'drop-shadow(0 0 6px currentColor)' }}
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={
            inView
              ? { strokeDashoffset: circumference - (score / 100) * circumference }
              : undefined
          }
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('font-display text-base font-bold leading-none', tone.text)}>
          {inView ? <Counter value={score} duration={1.6} suffix="%" /> : '0%'}
        </span>
        {showLabel && <span className="mt-0.5 text-[9px] uppercase tracking-wider text-slate-500">match</span>}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ magnetic */

export function MagneticButton({
  children,
  className,
  as = 'button',
  href,
  onClick,
}: {
  children: ReactNode
  className?: string
  as?: 'button' | 'a'
  href?: string
  onClick?: () => void
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 240, damping: 16 })
  const sy = useSpring(y, { stiffness: 240, damping: 16 })

  const handlers = {
    onMouseMove: (e: React.MouseEvent<HTMLElement>) => {
      const r = e.currentTarget.getBoundingClientRect()
      x.set((e.clientX - (r.left + r.width / 2)) * 0.25)
      y.set((e.clientY - (r.top + r.height / 2)) * 0.35)
    },
    onMouseLeave: () => {
      x.set(0)
      y.set(0)
    },
  }

  const Comp = as === 'a' ? motion.a : motion.button

  return (
    <Comp
      href={href}
      onClick={onClick}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.96 }}
      {...handlers}
      className={className}
    >
      {children}
    </Comp>
  )
}

/* ------------------------------------------------------------------ progress bar */

export function MeterBar({
  value,
  className,
  barClassName,
  delay = 0,
}: {
  value: number
  className?: string
  barClassName?: string
  delay?: number
}) {
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-white/10', className)}>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'h-full rounded-full bg-gradient-to-r from-brand-400 via-neon-violet to-neon-cyan',
          barClassName,
        )}
      />
    </div>
  )
}
