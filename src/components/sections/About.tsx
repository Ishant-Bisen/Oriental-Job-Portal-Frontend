import { AnimatePresence, motion } from 'framer-motion'
import { Compass, HeartHandshake, Rocket, ShieldCheck, Users2 } from 'lucide-react'
import { useState } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading, TiltCard } from '@/components/ui/primitives'
import { cn } from '@/lib/utils'

const tabs = [
  {
    key: 'who',
    label: 'Who we are',
    icon: Users2,
    heading: 'The university’s own placement cell — digitised.',
    body:
      'TalentBridge is built and run by the Training & Placement Cell together with student coordinators from all eight departments. Every recruiter, drive and result you see here is verified in-house.',
    image: '/images/about-students.png',
    caption: 'Student coordinators run the platform alongside the T&P Cell',
    accent: 'from-brand-500/30',
    stats: [
      { k: '8', v: 'departments' },
      { k: '42', v: 'student coordinators' },
      { k: '2011', v: 'cell established' },
    ],
  },
  {
    key: 'what',
    label: 'What we do',
    icon: Rocket,
    heading: 'One place for every step from resume to offer letter.',
    body:
      'We invite and verify recruiters, run drives end-to-end, score resumes against each JD, publish every result and keep the whole campus on one live timeline — so information never arrives late.',
    image: '/images/recruiter-interview.png',
    caption: '312 verified recruiters interviewed on campus this season',
    accent: 'from-neon-cyan/30',
    stats: [
      { k: '312', v: 'verified recruiters' },
      { k: '128', v: 'training workshops' },
      { k: '24/7', v: 'live status tracking' },
    ],
  },
  {
    key: 'mission',
    label: 'Our mission',
    icon: Compass,
    heading: 'No deserving student left behind by late information.',
    body:
      'Equal access for every branch and every batch. Core engineering gets the same spotlight as software, and a student in the last row hears about a drive at the same second as the topper.',
    image: '/images/placement-celebration.png',
    caption: '96.4% of registered students placed — across all eight departments',
    accent: 'from-neon-violet/30',
    stats: [
      { k: '96.4%', v: 'placement rate' },
      { k: '0', v: 'paid features' },
      { k: '100%', v: 'branch coverage' },
    ],
  },
]

const pillars = [
  { icon: ShieldCheck, title: 'Verified only', body: 'Recruiter MoU checked before a job goes live.' },
  { icon: HeartHandshake, title: 'Free forever', body: 'Zero cost to students — funded by the university.' },
  { icon: Users2, title: 'Student-built', body: 'Shipped by campus developers, reviewed by the cell.' },
]

export function About() {
  const [active, setActive] = useState(0)
  const tab = tabs[active]

  return (
    <section id="about" className="section-pad relative">
      <div className="container-x">
        <SectionHeading
          eyebrow="About TalentBridge"
          title="Built inside the campus,"
          highlight="for the campus."
          description="Three things worth knowing before you scroll further — tap any of them to see it."
        />

        <div className="mt-14 grid grid-cols-1 items-center gap-10 lg:mt-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14">
          {/* ---------------------------------------------- interactive copy */}
          <div>
            <div className="flex flex-wrap gap-2">
              {tabs.map((t, i) => (
                <button
                  key={t.key}
                  onClick={() => setActive(i)}
                  className={cn(
                    'group relative inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[13px] font-semibold transition-all duration-300',
                    i === active
                      ? 'border-brand-400/50 bg-brand-500/15 text-white shadow-glow'
                      : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white',
                  )}
                >
                  <t.icon className={cn('h-3.5 w-3.5', i === active ? 'text-brand-300' : 'text-slate-500')} />
                  {t.label}
                  {i === active && (
                    <motion.span
                      layoutId="about-tab-glow"
                      className="absolute inset-0 -z-10 rounded-full bg-brand-500/10"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="relative mt-8 min-h-[15rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab.key}
                  initial={{ opacity: 0, y: 22, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -18, filter: 'blur(10px)' }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h3 className="text-2xl font-bold leading-snug sm:text-[1.75rem]">{tab.heading}</h3>
                  <p className="mt-4 text-[1.02rem] leading-relaxed text-slate-400">{tab.body}</p>

                  <div className="mt-7 grid grid-cols-3 gap-3">
                    {tab.stats.map((s, i) => (
                      <motion.div
                        key={s.v}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 + i * 0.08 }}
                        className="rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-3"
                      >
                        <p className="font-display text-lg font-bold text-white">{s.k}</p>
                        <p className="mt-0.5 text-[10.5px] uppercase tracking-wide text-slate-500">{s.v}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-9 grid gap-3 sm:grid-cols-3">
              {pillars.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.1}>
                  <div className="group flex h-full items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 transition hover:border-brand-400/30 hover:bg-white/[0.05]">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-500/12 text-brand-300 transition group-hover:scale-110">
                      <p.icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-[13px] font-bold text-white">{p.title}</p>
                      <p className="mt-1 text-[11.5px] leading-relaxed text-slate-500">{p.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* ---------------------------------------------- interactive image */}
          <Reveal direction="left">
            <TiltCard intensity={8}>
              <div className="relative">
                <div className="absolute -inset-6 rounded-[2.6rem] bg-brand-500/10 blur-3xl" />
                <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-ink-900/60 p-2 shadow-[0_50px_120px_-45px_rgba(0,0,0,0.95)] backdrop-blur-xl">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem]">
                    <AnimatePresence mode="popLayout">
                      <motion.img
                        key={tab.image}
                        src={tab.image}
                        alt={tab.caption}
                        initial={{ opacity: 0, scale: 1.12 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.04 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </AnimatePresence>

                    <div className={cn('absolute inset-0 bg-gradient-to-tr to-transparent mix-blend-color-dodge', tab.accent)} />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/25 to-transparent" />

                    {/* corner brackets */}
                    {['left-4 top-4 border-l-2 border-t-2', 'right-4 top-4 border-r-2 border-t-2', 'left-4 bottom-4 border-b-2 border-l-2', 'right-4 bottom-4 border-b-2 border-r-2'].map(
                      (pos) => (
                        <span key={pos} className={cn('absolute h-7 w-7 rounded-sm border-brand-300/50', pos)} />
                      ),
                    )}

                    <motion.div
                      animate={{ x: ['-130%', '230%'] }}
                      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2.5 }}
                      className="absolute inset-y-0 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    />

                    <div className="absolute inset-x-4 bottom-4">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={tab.caption}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -12 }}
                          transition={{ duration: 0.45 }}
                          className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-ink-950/75 px-3.5 py-2.5 backdrop-blur-xl"
                        >
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-500/20 text-brand-200">
                            <tab.icon className="h-3.5 w-3.5" />
                          </span>
                          <p className="text-[11.5px] font-medium leading-snug text-slate-200">{tab.caption}</p>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* progress dots */}
                <div className="mt-5 flex items-center justify-center gap-2">
                  {tabs.map((t, i) => (
                    <button
                      key={t.key}
                      onClick={() => setActive(i)}
                      aria-label={t.label}
                      className={cn(
                        'h-1.5 rounded-full transition-all duration-500',
                        i === active ? 'w-10 bg-gradient-to-r from-brand-400 to-neon-cyan' : 'w-4 bg-white/15 hover:bg-white/30',
                      )}
                    />
                  ))}
                </div>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
