import { motion } from 'framer-motion'
import { Award, Building2, GraduationCap, Percent } from 'lucide-react'
import { Counter, MeterBar, SectionHeading, SpotlightCard } from '@/components/ui/primitives'
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/Reveal'
import { departmentPlacement, secondaryStats, stats } from '@/data/content'

const icons = [Building2, GraduationCap, Award, Percent]
const accents = [
  'from-brand-500/25 to-transparent',
  'from-neon-cyan/25 to-transparent',
  'from-neon-amber/25 to-transparent',
  'from-neon-lime/25 to-transparent',
]
const iconTone = ['text-brand-300', 'text-neon-cyan', 'text-neon-amber', 'text-neon-lime']

export function Stats() {
  return (
    <section id="stats" className="section-pad relative">
      <div className="container-x">
        <SectionHeading
          eyebrow="Placement record"
          title="Numbers the campus"
          highlight="is proud of."
          description="Season 2024–25, audited by the Training & Placement Cell and published department-wise."
        />

        {/* headline stats */}
        <StaggerGroup className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => {
            const Icon = icons[i]
            return (
              <StaggerItem key={s.label}>
                <SpotlightCard className="h-full">
                  <div className="relative h-full p-6">
                    <div
                      className={`pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b ${accents[i]}`}
                    />
                    <div className="relative flex items-start justify-between">
                      <span className={`grid h-11 w-11 place-items-center rounded-2xl bg-white/[0.06] ${iconTone[i]}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <motion.span
                        animate={{ opacity: [0.35, 1, 0.35] }}
                        transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.4 }}
                        className="h-1.5 w-1.5 rounded-full bg-neon-lime"
                      />
                    </div>

                    <p className="relative mt-6 font-display text-4xl font-extrabold tracking-tight text-white lg:text-[2.6rem]">
                      <Counter
                        value={s.value}
                        decimals={s.decimals ?? 0}
                        prefix={s.prefix ?? ''}
                        suffix={s.suffix}
                      />
                    </p>
                    <p className="relative mt-2 text-[13px] font-semibold text-slate-200">{s.label}</p>
                    <p className="relative mt-1 text-[11px] text-slate-500">{s.hint}</p>
                  </div>
                </SpotlightCard>
              </StaggerItem>
            )
          })}
        </StaggerGroup>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* department table */}
          <Reveal direction="right">
            <div className="relative h-full overflow-hidden rounded-[28px] border border-white/10 bg-ink-900/50 p-6 backdrop-blur-2xl sm:p-7">
              <div className="pointer-events-none absolute -left-16 bottom-0 h-52 w-52 rounded-full bg-brand-500/15 blur-3xl" />
              <h3 className="relative text-[15px] font-bold text-white">Department-wise placement rate</h3>
              <p className="relative mt-1 text-[12px] text-slate-500">
                Percentage of registered, eligible students placed in at least one role.
              </p>

              <div className="relative mt-6 space-y-4">
                {departmentPlacement.map((d, i) => (
                  <div key={d.dept}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[12.5px] font-semibold text-slate-200">{d.dept}</p>
                      <div className="flex items-center gap-3">
                        <span className="hidden text-[10.5px] text-slate-500 sm:inline">{d.placed} placed</span>
                        <span className="font-mono text-[11px] text-slate-500">{d.highest}</span>
                        <span className="w-9 text-right font-display text-[13px] font-bold text-white">{d.rate}%</span>
                      </div>
                    </div>
                    <MeterBar value={d.rate} delay={i * 0.08} className="mt-2" />
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* secondary grid */}
          <Reveal direction="left">
            <div className="grid h-full grid-cols-2 gap-4">
              {secondaryStats.map((s, i) => (
                <motion.div
                  key={s.label}
                  whileHover={{ y: -5 }}
                  className="flex flex-col justify-between rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-sm transition-colors hover:border-brand-400/30 hover:bg-white/[0.05]"
                >
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">{s.label}</p>
                  <p className="mt-4 font-display text-xl font-bold text-white sm:text-2xl">
                    <motion.span
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + i * 0.06, duration: 0.6 }}
                      className="inline-block"
                    >
                      {s.value}
                    </motion.span>
                  </p>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
