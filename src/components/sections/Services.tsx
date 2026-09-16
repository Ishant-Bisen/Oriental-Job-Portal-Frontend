import { motion } from 'framer-motion'
import {
  BarChart3,
  Briefcase,
  GraduationCap,
  Handshake,
  Presentation,
  Sparkles,
  Users,
  Video,
  type LucideIcon,
} from 'lucide-react'
import { SectionHeading, SpotlightCard } from '@/components/ui/primitives'
import { Reveal, StaggerGroup, StaggerItem } from '@/components/ui/Reveal'
import { journeySteps, services } from '@/data/content'

const iconMap: Record<string, LucideIcon> = {
  Briefcase,
  GraduationCap,
  Sparkles,
  Presentation,
  Video,
  Users,
  Handshake,
  BarChart3,
}

export function Services() {
  return (
    <section id="services" className="section-pad relative">
      <div className="container-x">
        <SectionHeading
          eyebrow="What we offer"
          title="Everything the placement cell runs,"
          highlight="in one platform."
          description="Eight services that cover a student's journey from first resume to signed offer letter."
        />

        <StaggerGroup className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => {
            const Icon = iconMap[s.icon] ?? Sparkles
            return (
              <StaggerItem key={s.title}>
                <SpotlightCard className="h-full" glow="rgba(168,85,247,0.14)">
                  <div className="relative h-full p-5">
                    <span className="absolute right-4 top-4 font-mono text-[10px] text-slate-700">
                      0{i + 1}
                    </span>
                    <motion.span
                      whileHover={{ rotate: 8, scale: 1.08 }}
                      className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-500/25 to-neon-violet/20 text-brand-200 ring-1 ring-white/10"
                    >
                      <Icon className="h-5 w-5" />
                    </motion.span>
                    <h3 className="mt-4 text-[14px] font-bold leading-snug text-white">{s.title}</h3>
                    <p className="mt-2 text-[12px] leading-relaxed text-slate-400">{s.body}</p>
                  </div>
                </SpotlightCard>
              </StaggerItem>
            )
          })}
        </StaggerGroup>

        {/* journey */}
        <Reveal className="mt-16">
          <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-ink-900/45 p-6 backdrop-blur-2xl sm:p-9">
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brand-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-neon-cyan/12 blur-3xl" />

            <div className="relative text-center">
              <span className="chip border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan">How it works</span>
              <h3 className="mt-4 text-2xl font-bold sm:text-[1.9rem]">
                Four steps from profile to <span className="text-gradient">offer letter</span>
              </h3>
            </div>

            <div className="relative mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* connecting line */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-0 right-0 top-6 hidden h-px origin-left bg-gradient-to-r from-brand-500/60 via-neon-violet/50 to-neon-cyan/40 lg:block"
              />

              {journeySteps.map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.14 }}
                  className="relative"
                >
                  <span className="relative z-10 grid h-12 w-12 place-items-center rounded-2xl border border-brand-400/30 bg-ink-950 font-display text-[13px] font-bold text-brand-200">
                    {s.step}
                    <span className="absolute inset-0 rounded-2xl bg-brand-500/20 blur-md" />
                  </span>
                  <h4 className="mt-4 text-[14px] font-bold text-white">{s.title}</h4>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-slate-400">{s.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
