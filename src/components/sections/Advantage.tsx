import { motion } from 'framer-motion'
import { Check, Globe2, ShieldCheck, X, Zap } from 'lucide-react'
import { BridgeMark } from '@/components/fx/ScreenFX'
import { SectionHeading } from '@/components/ui/primitives'
import { Reveal } from '@/components/ui/Reveal'
import { advantages } from '@/data/content'

const headlineWins = [
  { icon: ShieldCheck, title: '100% verified recruiters', body: 'MoU-checked companies only — zero ghost jobs.' },
  { icon: Zap, title: '9× better odds', body: 'Campus seats reserved for you, not a national free-for-all.' },
  { icon: Globe2, title: 'Zero cost, forever', body: 'Funded by the university. No premium tier, no paywall.' },
]

export function Advantage() {
  return (
    <section id="advantage" className="section-pad relative">
      <div className="container-x">
        <SectionHeading
          eyebrow="TalentBridge vs job portals"
          title="Why campus hiring here beats"
          highlight="a generic job portal."
          description="Same effort, very different outcome. Here is the honest side-by-side."
        />

        {/* headline wins */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {headlineWins.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.1}>
              <div className="group h-full rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 transition hover:border-brand-400/30 hover:bg-white/[0.05]">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-500/12 text-brand-300 transition group-hover:scale-110">
                  <w.icon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-[14px] font-bold text-white">{w.title}</p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-slate-400">{w.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* comparison */}
        <Reveal className="mt-8">
          <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-ink-900/50 backdrop-blur-2xl">
            <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-brand-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-neon-pink/10 blur-3xl" />

            {/* head */}
            <div className="relative grid grid-cols-[1.1fr_1fr_1fr] gap-3 border-b border-white/[0.08] px-4 py-5 sm:px-7">
              <span className="self-center text-[10.5px] font-bold uppercase tracking-[0.16em] text-slate-500">
                What matters
              </span>
              <div className="flex items-center gap-2 rounded-2xl border border-brand-400/30 bg-brand-500/10 px-3 py-2.5">
                <BridgeMark className="h-5 w-5 shrink-0" />
                <span className="text-[12px] font-bold leading-tight text-white">
                  Talent<span className="text-gradient">Bridge</span>
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-3 py-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-white/10 text-slate-400">
                  <Globe2 className="h-3 w-3" />
                </span>
                <span className="text-[12px] font-bold leading-tight text-slate-400">Traditional job portal</span>
              </div>
            </div>

            {/* rows */}
            <div className="relative divide-y divide-white/[0.05]">
              {advantages.map((row, i) => (
                <motion.div
                  key={row.feature}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.35) }}
                  className="group grid grid-cols-[1.1fr_1fr_1fr] gap-3 px-4 py-4 transition-colors hover:bg-white/[0.025] sm:px-7"
                >
                  <p className="self-center text-[12.5px] font-semibold text-slate-200">{row.feature}</p>

                  <div className="flex gap-2.5 rounded-xl bg-neon-lime/[0.05] px-3 py-2.5 ring-1 ring-inset ring-neon-lime/10">
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-neon-lime/20 text-neon-lime">
                      <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
                    </span>
                    <p className="text-[11.5px] leading-relaxed text-slate-200">{row.talentbridge}</p>
                  </div>

                  <div className="flex gap-2.5 rounded-xl px-3 py-2.5">
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-neon-pink/15 text-neon-pink">
                      <X className="h-2.5 w-2.5" strokeWidth={3.5} />
                    </span>
                    <p className="text-[11.5px] leading-relaxed text-slate-500">{row.traditional}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* footer */}
            <div className="relative flex flex-wrap items-center gap-4 border-t border-white/[0.08] bg-brand-500/[0.06] px-4 py-5 sm:px-7">
              <p className="mr-auto text-[12.5px] text-slate-300">
                <span className="font-bold text-white">1 in 2.4 applications</span> here reaches an interview —
                against 1 in 87 on open portals.
              </p>
              <a href="#portals" className="btn-primary text-[12.5px]">
                Start with your campus profile
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
