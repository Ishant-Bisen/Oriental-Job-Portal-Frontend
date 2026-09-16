import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { LogoTile, Marquee, SectionHeading } from '@/components/ui/primitives'
import { Reveal } from '@/components/ui/Reveal'
import { companies, tierColor, type Company } from '@/data/companies'
import { cn } from '@/lib/utils'

const rows = [companies.slice(0, 9), companies.slice(9, 18), companies.slice(18)]

function CompanyChip({ company }: { company: Company }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="group relative mx-2 flex w-[15.5rem] shrink-0 items-center gap-3.5 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-3.5 backdrop-blur-sm transition-colors duration-300 hover:border-brand-400/35 hover:bg-white/[0.06]"
    >
      <LogoTile slug={company.slug} name={company.name} className="h-11 w-11 shrink-0 p-2" />
      <div className="min-w-0">
        <p className="truncate text-[13px] font-bold text-white">{company.name}</p>
        <p className="truncate text-[10.5px] text-slate-500">{company.sector}</p>
      </div>
      <div className="ml-auto text-right">
        <p className="font-display text-[12px] font-bold text-brand-200">{company.highestCtc}</p>
        <p className="text-[9.5px] uppercase tracking-wide text-slate-500">{company.hires} hired</p>
      </div>
      <span
        className={cn(
          'pointer-events-none absolute -top-2 left-4 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider opacity-0 transition-opacity duration-300 group-hover:opacity-100',
          tierColor[company.tier],
        )}
      >
        {company.tier}
      </span>
    </motion.div>
  )
}

export function Recruiters() {
  return (
    <section id="recruiters" className="section-pad relative">
      <div className="container-x">
        <SectionHeading
          eyebrow="Hiring partners"
          title="312 companies walked in"
          highlight="this season."
          description="From Super Dream product firms to core engineering and consulting — every recruiter below is verified by the placement cell before a single job goes live."
        />

        {/* marquee wall */}
        <div className="mask-fade-x relative mt-14 space-y-3">
          {rows.map((row, i) => (
            <Marquee key={i} reverse={i % 2 === 1} duration={`${44 + i * 9}s`}>
              {row.map((c) => (
                <CompanyChip key={c.slug} company={c} />
              ))}
            </Marquee>
          ))}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(5,7,15,0.7)_100%)]" />
        </div>

        <Reveal className="mt-10">
          <p className="flex items-center justify-center gap-2 text-[11.5px] text-slate-500">
            <Sparkles className="h-3.5 w-3.5 text-brand-300" />
            286 more recruiters onboarded across previous seasons
          </p>
        </Reveal>
      </div>
    </section>
  )
}
