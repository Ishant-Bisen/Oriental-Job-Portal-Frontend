import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  Bell,
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogIn,
  Search,
  Settings2,
  Sparkles,
  Users2,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LogoTile, MeterBar, SectionHeading } from '@/components/ui/primitives'
import { Reveal } from '@/components/ui/Reveal'
import { recruiterFeatures, studentFeatures } from '@/data/content'
import { placedStudents } from '@/data/students'
import { cn } from '@/lib/utils'

type Role = 'student' | 'recruiter'

const roleMeta = {
  student: {
    label: 'Student portal',
    icon: GraduationCap,
    heading: 'Everything a student sees after logging in',
    body: 'One dashboard for your profile, matches, applications, interview slots and offers — with reminders so a deadline never surprises you.',
    features: studentFeatures,
    cta: 'Login with roll number',
    accent: 'from-brand-500 to-neon-cyan',
  },
  recruiter: {
    label: 'Recruiter portal',
    icon: Building2,
    heading: 'Everything a recruiter sees after logging in',
    body: 'Post a drive, filter a verified talent pool, shortlist in bulk, publish interview slots and roll out offers — without a single spreadsheet.',
    features: recruiterFeatures,
    cta: 'Recruiter access — coming soon',
    accent: 'from-neon-violet to-neon-pink',
  },
} as const

export function Portals() {
  const [role, setRole] = useState<Role>('student')
  const meta = roleMeta[role]

  return (
    <section id="portals" className="section-pad relative">
      <div className="container-x">
        <SectionHeading
          eyebrow="Dedicated workspaces"
          title="Two portals, one"
          highlight="source of truth."
          description="Students and recruiters get purpose-built dashboards that stay in sync with the placement cell in real time."
        />

        {/* role switch */}
        <div className="mt-10 flex justify-center">
          <div className="relative inline-flex rounded-full border border-white/10 bg-ink-900/60 p-1.5 backdrop-blur-xl">
            {(['student', 'recruiter'] as Role[]).map((r) => {
              const Icon = roleMeta[r].icon
              return (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={cn(
                    'relative z-10 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-bold transition-colors duration-300 sm:px-7',
                    role === r ? 'text-white' : 'text-slate-400 hover:text-slate-200',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {roleMeta[r].label}
                </button>
              )
            })}
            <motion.span
              layout
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className={cn(
                'absolute inset-y-1.5 z-0 rounded-full bg-gradient-to-r shadow-glow',
                meta.accent,
                role === 'student' ? 'left-1.5 right-1/2' : 'left-1/2 right-1.5',
              )}
            />
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-10">
          {/* ---------------------------------------------- feature list */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={role}
                initial={{ opacity: 0, x: -26, filter: 'blur(8px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: 22, filter: 'blur(8px)' }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="text-2xl font-bold leading-snug">{meta.heading}</h3>
                <p className="mt-3.5 text-[13.5px] leading-relaxed text-slate-400">{meta.body}</p>

                <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
                  {meta.features.map((f, i) => (
                    <motion.div
                      key={f.title}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + i * 0.05, duration: 0.45 }}
                      className="group flex gap-2.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 transition hover:border-brand-400/30 hover:bg-white/[0.05]"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-400 transition group-hover:scale-110" />
                      <div>
                        <p className="text-[12.5px] font-bold text-white">{f.title}</p>
                        <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{f.body}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Link
                  to={role === 'student' ? '/login' : '/login?role=recruiter'}
                  className="btn-primary group mt-7"
                >
                  <LogIn className="h-4 w-4" />
                  {meta.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ---------------------------------------------- dashboard mock */}
          <Reveal direction="left">
            <div className="relative">
              <div className="absolute -inset-6 rounded-[2.8rem] bg-brand-500/10 blur-3xl" />
              <div className="relative overflow-hidden rounded-[26px] border border-white/12 bg-ink-950/85 shadow-[0_50px_120px_-45px_rgba(0,0,0,0.95)] backdrop-blur-2xl">
                {/* window chrome */}
                <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-3">
                  <span className="flex gap-1.5">
                    {['bg-neon-pink/70', 'bg-neon-amber/70', 'bg-neon-lime/70'].map((c) => (
                      <span key={c} className={cn('h-2.5 w-2.5 rounded-full', c)} />
                    ))}
                  </span>
                  <div className="ml-2 flex flex-1 items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1">
                    <Search className="h-3 w-3 text-slate-600" />
                    <span className="font-mono text-[10px] text-slate-600">
                      talentbridge.university.edu/{role}
                    </span>
                  </div>
                  <Bell className="h-3.5 w-3.5 text-slate-500" />
                  <Settings2 className="h-3.5 w-3.5 text-slate-500" />
                </div>

                <AnimatePresence mode="wait">
                  {role === 'student' ? (
                    <StudentDash key="student" />
                  ) : (
                    <RecruiterDash key="recruiter" />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ student mock */

const pipeline = [
  { company: 'Google', slug: 'google', role: 'SWE — Core Platform', stage: 'Interview II', tone: 'text-neon-cyan', pct: 75 },
  { company: 'Adobe', slug: 'adobe', role: 'Product Engineer Intern', stage: 'Shortlisted', tone: 'text-neon-violet', pct: 50 },
  { company: 'Razorpay', slug: 'razorpay', role: 'Backend Engineer', stage: 'Offer released', tone: 'text-neon-lime', pct: 100 },
  { company: 'Swiggy', slug: 'swiggy', role: 'Data Analyst Intern', stage: 'Applied', tone: 'text-slate-300', pct: 25 },
]

function StudentDash() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.45 }}
      className="grid grid-cols-[auto_1fr]"
    >
      {/* rail */}
      <div className="flex flex-col gap-3 border-r border-white/[0.07] px-3 py-4">
        {[LayoutDashboard, Briefcase, FileText, CalendarDays, Sparkles].map((Icon, i) => (
          <span
            key={i}
            className={cn(
              'grid h-9 w-9 place-items-center rounded-xl transition',
              i === 0 ? 'bg-brand-500/20 text-brand-200' : 'text-slate-600 hover:bg-white/[0.04]',
            )}
          >
            <Icon className="h-4 w-4" />
          </span>
        ))}
      </div>

      <div className="p-4 sm:p-5">
        {/* profile row */}
        <div className="flex items-center gap-3">
          <img src={placedStudents[0].photo} alt="" className="h-11 w-11 rounded-2xl object-cover ring-1 ring-white/15" />
          <div className="mr-auto">
            <p className="text-[13px] font-bold text-white">Aarav Mehta · CSE 2026</p>
            <p className="text-[10.5px] text-slate-500">Roll 21CS1042 · CGPA 8.7 · Verified profile</p>
          </div>
          <span className="chip border-neon-lime/30 bg-neon-lime/10 text-neon-lime">Eligible · 34 drives</span>
        </div>

        {/* stat tiles */}
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          {[
            { k: 'Applications', v: '22', s: '+4 this week' },
            { k: 'Interviews', v: '7', s: '2 upcoming' },
            { k: 'Offers', v: '1', s: '₹22.0 LPA' },
          ].map((t, i) => (
            <motion.div
              key={t.k}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3"
            >
              <p className="text-[9.5px] uppercase tracking-wide text-slate-500">{t.k}</p>
              <p className="mt-1 font-display text-lg font-bold text-white">{t.v}</p>
              <p className="text-[9.5px] text-brand-300">{t.s}</p>
            </motion.div>
          ))}
        </div>

        {/* resume strength */}
        <div className="mt-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3.5">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-[11.5px] font-bold text-white">
              <Sparkles className="h-3.5 w-3.5 text-brand-300" />
              Resume strength
            </p>
            <span className="font-display text-[13px] font-bold text-neon-lime">88%</span>
          </div>
          <MeterBar value={88} className="mt-2" />
          <p className="mt-2 text-[10px] text-slate-500">
            Add <span className="text-neon-pink">Kubernetes</span> and one system-design project to reach 95%.
          </p>
        </div>

        {/* pipeline */}
        <p className="mt-4 text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
          Application tracker
        </p>
        <div className="mt-2 space-y-2">
          {pipeline.map((p, i) => (
            <motion.div
              key={p.company}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.18 + i * 0.07 }}
              className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.025] px-2.5 py-2"
            >
              <LogoTile slug={p.slug} name={p.company} className="h-7 w-7 shrink-0 p-1" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-bold text-white">{p.role}</p>
                <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${p.pct}%` }}
                    transition={{ duration: 1.1, delay: 0.3 + i * 0.08 }}
                    className="h-full rounded-full bg-gradient-to-r from-brand-400 to-neon-cyan"
                  />
                </div>
              </div>
              <span className={cn('shrink-0 text-[10px] font-bold', p.tone)}>{p.stage}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ---------------------------------------------------------- recruiter mock */

const candidates = [
  { name: 'Ishita Raghavan', dept: 'CSE · 9.1 CGPA', score: 96, stage: 'Shortlist' },
  { name: 'Aditya Varma', dept: 'DSAI · 8.8 CGPA', score: 92, stage: 'Shortlist' },
  { name: 'Rohan Deshpande', dept: 'IT · 8.4 CGPA', score: 87, stage: 'Review' },
  { name: 'Ananya Iyer', dept: 'ECE · 8.2 CGPA', score: 81, stage: 'Review' },
]

const funnel = [
  { k: 'Applied', v: 486, pct: 100 },
  { k: 'Screened', v: 214, pct: 44 },
  { k: 'Interviewed', v: 78, pct: 16 },
  { k: 'Offered', v: 14, pct: 3 },
]

function RecruiterDash() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.45 }}
      className="grid grid-cols-[auto_1fr]"
    >
      <div className="flex flex-col gap-3 border-r border-white/[0.07] px-3 py-4">
        {[LayoutDashboard, Users2, Briefcase, BarChart3, CalendarDays].map((Icon, i) => (
          <span
            key={i}
            className={cn(
              'grid h-9 w-9 place-items-center rounded-xl transition',
              i === 1 ? 'bg-neon-violet/20 text-neon-violet' : 'text-slate-600 hover:bg-white/[0.04]',
            )}
          >
            <Icon className="h-4 w-4" />
          </span>
        ))}
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <LogoTile slug="nvidia" name="Nvidia" className="h-11 w-11 p-2" />
          <div className="mr-auto">
            <p className="text-[13px] font-bold text-white">Nvidia · Applied AI hiring</p>
            <p className="text-[10.5px] text-slate-500">Drive live · closes in 6 days · 8 openings</p>
          </div>
          <span className="chip border-neon-violet/30 bg-neon-violet/10 text-neon-violet">Verified</span>
        </div>

        {/* funnel */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          {funnel.map((f, i) => (
            <motion.div
              key={f.k}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-2.5"
            >
              <p className="text-[9px] uppercase tracking-wide text-slate-500">{f.k}</p>
              <p className="mt-1 font-display text-base font-bold text-white">{f.v}</p>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${f.pct}%` }}
                  transition={{ duration: 1.2, delay: 0.25 + i * 0.07 }}
                  className="h-full rounded-full bg-gradient-to-r from-neon-violet to-neon-pink"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* filters */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {['CSE', 'DSAI', 'CGPA ≥ 7.5', 'PyTorch', 'No backlogs'].map((f) => (
            <span
              key={f}
              className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-1 text-[10px] font-semibold text-slate-300"
            >
              {f}
            </span>
          ))}
          <span className="rounded-lg border border-neon-violet/25 bg-neon-violet/10 px-2 py-1 text-[10px] font-bold text-neon-violet">
            214 matches
          </span>
        </div>

        {/* candidate table */}
        <p className="mt-4 text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
          Ranked candidates
        </p>
        <div className="mt-2 space-y-2">
          {candidates.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.18 + i * 0.07 }}
              className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.025] px-2.5 py-2"
            >
              <img
                src={placedStudents[i + 1].photo}
                alt=""
                className="h-7 w-7 shrink-0 rounded-full object-cover ring-1 ring-white/15"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-bold text-white">{c.name}</p>
                <p className="truncate text-[9.5px] text-slate-500">{c.dept}</p>
              </div>
              <span className="shrink-0 font-mono text-[10.5px] font-bold text-neon-lime">{c.score}%</span>
              <span
                className={cn(
                  'shrink-0 rounded-md px-2 py-0.5 text-[9.5px] font-bold',
                  c.stage === 'Shortlist'
                    ? 'bg-neon-lime/15 text-neon-lime'
                    : 'bg-white/[0.06] text-slate-400',
                )}
              >
                {c.stage}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
