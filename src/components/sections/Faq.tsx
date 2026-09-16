import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { SectionHeading } from '@/components/ui/primitives'
import { Reveal } from '@/components/ui/Reveal'
import { faqs } from '@/data/content'
import { cn } from '@/lib/utils'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="section-pad relative">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading
            align="left"
            eyebrow="FAQ"
            title="Questions students"
            highlight="ask us most."
            description="Anything else — walk into the placement cell in Block B or drop us a mail."
          />

          <div className="space-y-3">
            {faqs.map((f, i) => {
              const isOpen = open === i
              return (
                <Reveal key={f.q} delay={i * 0.06}>
                  <div
                    className={cn(
                      'overflow-hidden rounded-3xl border transition-colors duration-300',
                      isOpen
                        ? 'border-brand-400/35 bg-brand-500/[0.06]'
                        : 'border-white/[0.07] bg-white/[0.02] hover:border-white/15',
                    )}
                  >
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center gap-4 px-5 py-4 text-left"
                    >
                      <span className="text-[13.5px] font-bold leading-snug text-white">{f.q}</span>
                      <span
                        className={cn(
                          'ml-auto grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-300',
                          isOpen
                            ? 'rotate-180 border-brand-400/40 bg-brand-500/20 text-brand-100'
                            : 'border-white/10 bg-white/[0.03] text-slate-400',
                        )}
                      >
                        {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <p className="px-5 pb-5 text-[12.5px] leading-relaxed text-slate-400">{f.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
