import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote, Trophy } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { LogoTile, SectionHeading } from '@/components/ui/primitives'
import { staggerChild, staggerParent } from '@/components/ui/Reveal'
import { placedStudents } from '@/data/students'
import { cn } from '@/lib/utils'

export function Achievers() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const scrollTo = useCallback((i: number) => {
    const track = trackRef.current
    if (!track) return
    const card = track.children[i] as HTMLElement | undefined
    if (!card) return
    track.scrollTo({ left: card.offsetLeft - 8, behavior: 'smooth' })
    setIndex(i)
  }, [])

  const move = useCallback(
    (dir: 1 | -1) => {
      const next = (index + dir + placedStudents.length) % placedStudents.length
      scrollTo(next)
    },
    [index, scrollTo],
  )

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => move(1), 4200)
    return () => clearInterval(id)
  }, [paused, move])

  return (
    <section id="achievers" className="section-pad relative">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            align="left"
            eyebrow="Class of 2025"
            title="The students who"
            highlight="made it count."
            description="Real profiles, real packages, real advice. Every card below is a student from this campus who converted through TalentBridge."
            className="max-w-2xl"
          />

          <div className="flex items-center gap-2">
            <button
              onClick={() => move(-1)}
              aria-label="Previous student"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/12 bg-white/[0.03] text-slate-300 transition hover:border-brand-400/50 hover:text-white hover:shadow-glow"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => move(1)}
              aria-label="Next student"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/12 bg-white/[0.03] text-slate-300 transition hover:border-brand-400/50 hover:text-white hover:shadow-glow"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="relative mt-12"
        >
          {/* the reveal is driven by the track, not the cards — a card scrolled out
              horizontally would otherwise never enter view and stay invisible */}
          <motion.div
            ref={trackRef}
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4"
          >
            {placedStudents.map((s, i) => (
              <motion.article
                key={s.name}
                variants={staggerChild}
                onClick={() => scrollTo(i)}
                className={cn(
                  'group relative w-[19rem] shrink-0 cursor-pointer snap-start overflow-hidden rounded-[26px] border bg-ink-900/50 backdrop-blur-xl transition-all duration-500',
                  i === index
                    ? 'border-brand-400/40 shadow-glow'
                    : 'border-white/[0.07] hover:border-white/20',
                )}
              >
                {/* photo */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={s.photo}
                    alt={s.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/25 to-transparent" />

                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    <span className="chip border-white/15 bg-ink-950/70 text-slate-200 backdrop-blur-md">
                      {s.branchShort}
                    </span>
                    {s.offers > 2 && (
                      <span className="chip border-neon-amber/30 bg-neon-amber/15 text-neon-amber backdrop-blur-md">
                        <Trophy className="h-3 w-3" /> {s.offers} offers
                      </span>
                    )}
                  </div>

                  <div className="absolute inset-x-4 bottom-3.5">
                    <p className="font-display text-[17px] font-bold leading-tight text-white">{s.name}</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">{s.department}</p>
                  </div>
                </div>

                {/* body */}
                <div className="px-5 pb-5 pt-4">
                  <div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3">
                    <LogoTile slug={s.companySlug} name={s.company} className="h-10 w-10 shrink-0 p-1.5" />
                    <div className="min-w-0">
                      <p className="truncate text-[12.5px] font-bold text-white">{s.company}</p>
                      <p className="truncate text-[10.5px] text-slate-500">{s.role}</p>
                    </div>
                    <span className="ml-auto shrink-0 font-display text-[13px] font-bold text-gradient">
                      {s.package}
                    </span>
                  </div>

                  <div className="relative mt-4">
                    <Quote className="absolute -left-1 -top-1 h-6 w-6 text-brand-500/25" />
                    <p className="relative pl-5 text-[12px] italic leading-relaxed text-slate-400">{s.quote}</p>
                  </div>
                </div>

                <motion.div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] origin-left bg-gradient-to-r from-brand-400 via-neon-violet to-neon-cyan"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: i === index ? 1 : 0 }}
                  transition={{ duration: 0.6 }}
                />
              </motion.article>
            ))}
          </motion.div>

          {/* dots */}
          <div className="mt-6 flex items-center justify-center gap-1.5">
            {placedStudents.map((s, i) => (
              <button
                key={s.name}
                onClick={() => scrollTo(i)}
                aria-label={`Go to ${s.name}`}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-500',
                  i === index ? 'w-9 bg-gradient-to-r from-brand-400 to-neon-cyan' : 'w-3 bg-white/15 hover:bg-white/35',
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
