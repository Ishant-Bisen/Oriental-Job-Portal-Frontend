import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

type Direction = 'up' | 'down' | 'left' | 'right' | 'scale' | 'blur'

const offset: Record<Direction, { x?: number; y?: number; scale?: number; filter?: string }> = {
  up: { y: 44 },
  down: { y: -44 },
  left: { x: 56 },
  right: { x: -56 },
  scale: { scale: 0.88 },
  blur: { y: 24, filter: 'blur(14px)' },
}

export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.75,
  once = true,
  className,
}: {
  children: ReactNode
  direction?: Direction
  delay?: number
  duration?: number
  once?: boolean
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 34, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

export function StaggerGroup({
  children,
  className,
  amount = 0.15,
}: {
  children: ReactNode
  className?: string
  amount?: number
}) {
  return (
    <motion.div
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={staggerChild} className={className}>
      {children}
    </motion.div>
  )
}

/**
 * Word-by-word entrance used for large display headings.
 * `wordClassName` exists because gradient text must be painted on each word span —
 * a background on the parent has nothing to clip against once the words go transparent.
 */
export function AnimatedHeadline({
  text,
  className,
  wordClassName,
  delay = 0,
}: {
  text: string
  className?: string
  wordClassName?: string
  delay?: number
}) {
  const words = text.split(' ')
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={{ show: { transition: { staggerChildren: 0.055, delayChildren: delay } } }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className={['inline-block whitespace-pre', wordClassName].filter(Boolean).join(' ')}
          variants={{
            hidden: { opacity: 0, y: '0.6em', rotateX: -55, filter: 'blur(6px)' },
            show: {
              opacity: 1,
              y: 0,
              rotateX: 0,
              filter: 'blur(0px)',
              transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          {word}{' '}
        </motion.span>
      ))}
    </motion.span>
  )
}
