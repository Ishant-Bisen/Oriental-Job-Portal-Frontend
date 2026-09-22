import { motion } from 'framer-motion'
import { ArrowRight, Mail, MapPin, Phone, Send } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthProvider'
import { BridgeMark, ParticleField } from '@/components/fx/ScreenFX'
import { BrandIcon } from '@/components/ui/BrandIcons'
import { MagneticButton } from '@/components/ui/primitives'
import { Reveal } from '@/components/ui/Reveal'
import { services, socials } from '@/data/content'
import { cn } from '@/lib/utils'

const guestQuickLinks = [
  { label: 'About the cell', href: '#about' },
  { label: 'Live openings', href: '/jobs', route: true },
  { label: 'Campus calendar', href: '#events' },
  { label: 'Placement record', href: '#stats' },
  { label: 'Our recruiters', href: '#recruiters' },
  { label: 'Why TalentBridge', href: '#advantage' },
]

const studentQuickLinks = [
  { label: 'Jobs board', href: '/jobs', route: true },
  { label: 'My profile', href: '/profile', route: true },
  { label: 'Campus calendar', href: '#events' },
  { label: 'T&P updates', href: '#updates' },
]

const forStudentsGuest = [
  { label: 'Student login', to: '/login' },
  { label: 'Create account', to: '/register' },
  { label: 'Build your resume', to: '/#portals' },
  { label: 'Resume score check', to: '/#portals' },
  { label: 'Prep hub & past questions', to: '/#portals' },
  { label: 'Offer vault', to: '/#portals' },
]

const forStudentsLoggedIn = [
  { label: 'Edit profile', to: '/profile' },
  { label: 'My applications', to: '/profile' },
  { label: 'Browse jobs', to: '/jobs' },
  { label: 'Campus calendar', to: '/#events' },
  { label: 'Latest updates', to: '/#updates' },
]

const forRecruiters = [
  { label: 'Recruiter login', to: '/login?role=recruiter' },
  { label: 'Post a drive', to: '/#portals' },
  { label: 'Book campus dates', to: '/#portals' },
  { label: 'Talent pool access', to: '/#portals' },
  { label: 'Hiring analytics', to: '/#portals' },
  { label: 'MoU & policies', to: '/#portals' },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const isStudent = isAuthenticated && /candidate|student/i.test(user?.role ?? '')

  const quickLinks = isStudent ? studentQuickLinks : guestQuickLinks
  const studentLinks = isStudent ? forStudentsLoggedIn : forStudentsGuest

  return (
    <footer className="relative mt-10">
      {!isStudent && (
        <div className="container-x">
          <Reveal>
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-brand-600/25 via-ink-900/80 to-neon-violet/20 px-6 py-12 text-center backdrop-blur-2xl sm:px-12 sm:py-16">
              <ParticleField count={16} />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full border border-dashed border-white/10"
              />
              <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-neon-cyan/15 blur-3xl" />

              <div className="relative">
                <span className="chip border-white/15 bg-white/[0.06] text-slate-200">
                  Batch 2026 registrations are open
                </span>
                <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold leading-tight sm:text-[2.6rem]">
                  Your next offer letter starts with a{' '}
                  <span className="text-gradient-animated">two-minute profile.</span>
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-[13.5px] leading-relaxed text-slate-300">
                  Register with your roll number, let the AI score your resume against 42 live roles, and never
                  miss a campus deadline again.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <MagneticButton
                    onClick={() => navigate('/register')}
                    className="btn bg-white px-7 py-3.5 text-[13px] font-bold text-ink-950 hover:bg-slate-100"
                  >
                    Create student account
                    <ArrowRight className="h-4 w-4" />
                  </MagneticButton>
                  <MagneticButton
                    onClick={() => navigate('/login?role=recruiter')}
                    className="btn border border-white/25 bg-white/[0.06] px-7 py-3.5 text-[13px] font-bold text-white hover:bg-white/[0.12]"
                  >
                    I am a recruiter
                  </MagneticButton>
                </div>

                <p className="mt-6 text-[11.5px] text-slate-400">
                  Free for every student · No credit card · Verified by the university registrar
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      )}

      <div
        className={cn(
          'relative border-t border-white/[0.07] bg-ink-950/60 pb-8 pt-16 backdrop-blur-xl',
          isStudent ? 'mt-6' : 'mt-20',
        )}
      >
        <div className="container-x">
          <div
            className={cn(
              'grid gap-10 lg:gap-8',
              isStudent ? 'lg:grid-cols-[1.4fr_1fr_1fr]' : 'lg:grid-cols-[1.4fr_1fr_1fr_1fr]',
            )}
          >
            <div>
              <Link to="/" className="flex items-center gap-2.5">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-brand-500/10">
                  <BridgeMark className="h-6 w-6" />
                </span>
                <span className="font-display text-lg font-bold text-white">
                  Talent<span className="text-gradient">Bridge</span>
                </span>
              </Link>

              <p className="mt-5 max-w-sm text-[12.5px] leading-relaxed text-slate-400">
                {isStudent
                  ? 'Your T&P workspace — jobs, applications, drives and cell updates in one place.'
                  : 'The official Training & Placement platform of the university. Verified recruiters, AI-scored resumes and every campus opportunity on one live timeline.'}
              </p>

              <div className="mt-6 space-y-2.5 text-[12px]">
                <a
                  href="mailto:placements@university.edu"
                  className="flex items-center gap-2.5 text-slate-400 transition hover:text-white"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/[0.05] text-brand-300">
                    <Mail className="h-3.5 w-3.5" />
                  </span>
                  placements@university.edu
                </a>
                <a
                  href="tel:+919000000000"
                  className="flex items-center gap-2.5 text-slate-400 transition hover:text-white"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/[0.05] text-brand-300">
                    <Phone className="h-3.5 w-3.5" />
                  </span>
                  +91 90000 00000
                </a>
                <p className="flex items-start gap-2.5 text-slate-400">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/[0.05] text-brand-300">
                    <MapPin className="h-3.5 w-3.5" />
                  </span>
                  Training & Placement Cell, Block B,
                  <br />
                  University Campus, India
                </p>
              </div>

              <div className="mt-7">
                <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Follow the cell
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {socials.map((s, i) => (
                    <motion.a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.name}
                      title={s.name}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                      whileHover={{ y: -4, scale: 1.08 }}
                      className={cn(
                        'grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition-colors duration-300 hover:text-white',
                        s.hover,
                      )}
                    >
                      <BrandIcon name={s.icon} className="h-4 w-4" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>

            <FooterColumn title={isStudent ? 'Quick links' : 'Explore'}>
              {quickLinks.map((l) =>
                l.route ? (
                  <Link key={l.label} to={l.href} className="footer-link">
                    {l.label}
                  </Link>
                ) : (
                  <a key={l.label} href={l.href} className="footer-link">
                    {l.label}
                  </a>
                ),
              )}
            </FooterColumn>

            <FooterColumn title={isStudent ? 'Your tools' : 'For students'}>
              {studentLinks.map((l) =>
                l.to.startsWith('/#') ? (
                  <a key={l.label} href={l.to.slice(1)} className="footer-link">
                    {l.label}
                  </a>
                ) : (
                  <Link key={l.label} to={l.to} className="footer-link">
                    {l.label}
                  </Link>
                ),
              )}
            </FooterColumn>

            {!isStudent && (
              <FooterColumn title="For recruiters">
                {forRecruiters.map((l) =>
                  l.to.startsWith('/#') ? (
                    <a key={l.label} href={l.to.slice(1)} className="footer-link">
                      {l.label}
                    </a>
                  ) : (
                    <Link key={l.label} to={l.to} className="footer-link">
                      {l.label}
                    </Link>
                  ),
                )}
              </FooterColumn>
            )}
          </div>

          {!isStudent && (
            <>
              <div className="mt-12 border-t border-white/[0.06] pt-8">
                <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Services we run
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {services.map((s) => (
                    <span
                      key={s.title}
                      className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] text-slate-400 transition hover:border-brand-400/30 hover:text-slate-200"
                    >
                      {s.title}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-4 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-5">
                <div className="mr-auto">
                  <p className="text-[13px] font-bold text-white">Weekly placement digest</p>
                  <p className="mt-1 text-[11.5px] text-slate-500">
                    Every Monday — new drives, closing deadlines and results, in one mail.
                  </p>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (email.trim()) setSent(true)
                  }}
                  className="flex w-full max-w-sm items-center gap-2 rounded-full border border-white/10 bg-ink-900/60 p-1.5"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@university.edu"
                    className="min-w-0 flex-1 bg-transparent px-3 text-[12.5px] text-white placeholder:text-slate-600 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className={cn(
                      'btn shrink-0 px-4 py-2 text-[12px]',
                      sent
                        ? 'bg-neon-lime/15 text-neon-lime'
                        : 'bg-gradient-to-r from-brand-500 to-neon-violet text-white',
                    )}
                  >
                    {sent ? 'Subscribed' : <Send className="h-3.5 w-3.5" />}
                  </button>
                </form>
              </div>
            </>
          )}

          <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-white/[0.06] pt-6">
            <p className="text-[11.5px] text-slate-500">
              © {new Date().getFullYear()} TalentBridge · Training & Placement Cell, University Campus.
            </p>
            <div className="ml-auto flex flex-wrap gap-x-5 gap-y-2 text-[11.5px] text-slate-500">
              {!isStudent && (
                <a href="#faq" className="transition hover:text-slate-300">
                  FAQ
                </a>
              )}
              <a href="#" className="transition hover:text-slate-300">
                Privacy policy
              </a>
              <a href="#" className="transition hover:text-slate-300">
                Placement policy
              </a>
              <a href="#" className="transition hover:text-slate-300">
                Grievance redressal
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-slate-500">{title}</p>
      <nav className="mt-4 flex flex-col gap-2.5">{children}</nav>
    </div>
  )
}
