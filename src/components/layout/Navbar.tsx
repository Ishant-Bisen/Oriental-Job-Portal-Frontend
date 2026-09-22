import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Building2, GraduationCap, LogOut, Menu, Sparkles, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthProvider'
import { BridgeMark } from '@/components/fx/ScreenFX'
import { cn } from '@/lib/utils'

const guestLinks = [
  { label: 'About', to: '/#about' },
  { label: 'Updates', to: '/#updates' },
  { label: 'Jobs', to: '/jobs' },
  { label: 'Events', to: '/#events' },
  { label: 'Recruiters', to: '/#recruiters' },
  { label: 'Placements', to: '/#stats' },
  { label: 'Why us', to: '/#advantage' },
]

const studentLinks = [
  { label: 'Updates', to: '/#updates' },
  { label: 'Jobs', to: '/jobs' },
  { label: 'Events', to: '/#events' },
  { label: 'Profile', to: '/profile' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const { scrollY } = useScroll()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const isCandidate = isAuthenticated && /candidate|student/i.test(user?.role ?? '')
  const links = isCandidate ? studentLinks : guestLinks

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 40))

  const go = (to: string) => {
    setOpen(false)
    if (to.startsWith('/#')) {
      const id = to.slice(2)
      if (pathname !== '/') {
        navigate('/')
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 320)
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate(to)
      window.scrollTo({ top: 0 })
    }
  }

  const onLogout = async () => {
    setLoggingOut(true)
    try {
      await logout()
      navigate('/', { replace: true })
    } finally {
      setLoggingOut(false)
      setOpen(false)
    }
  }

  return (
    <motion.header
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-[80] pt-3"
    >
      <div className="container-x">
        <div
          className={cn(
            'flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-500 sm:px-5',
            scrolled
              ? 'border border-white/10 bg-ink-950/80 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.95)] backdrop-blur-2xl'
              : 'border border-transparent bg-transparent',
          )}
        >
          <Link to="/" onClick={() => window.scrollTo({ top: 0 })} className="group flex items-center gap-2.5">
            <span className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-brand-500/10">
              <BridgeMark className="h-6 w-6" />
              <span className="absolute inset-0 rounded-xl bg-brand-500/20 opacity-0 blur-md transition group-hover:opacity-100" />
            </span>
            <span className="font-display text-[1.05rem] font-bold tracking-tight text-white">
              Talent<span className="text-gradient">Bridge</span>
              <span className="ml-2 hidden align-middle text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500 lg:inline">
                T&P Cell
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <button
                key={l.label}
                onClick={() => go(l.to)}
                className="group relative rounded-full px-3.5 py-2 text-[13px] font-semibold text-slate-300 transition hover:text-white"
              >
                {l.label}
                <span className="absolute inset-x-3 -bottom-0.5 h-[2px] scale-x-0 rounded-full bg-gradient-to-r from-brand-400 to-neon-cyan transition-transform duration-300 group-hover:scale-x-100" />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <>
                <span className="hidden max-w-[12rem] truncate rounded-full border border-white/12 bg-white/[0.03] px-3 py-2 text-[12px] font-semibold text-slate-300 sm:inline">
                  {user.email}
                </span>
                <button
                  onClick={() => void onLogout()}
                  disabled={loggingOut}
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 text-[13px] font-semibold text-slate-200 transition hover:border-neon-pink/40 hover:text-white disabled:opacity-60"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  {loggingOut ? 'Signing out…' : 'Logout'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => go('/login?role=recruiter')}
                  className="hidden items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 text-[13px] font-semibold text-slate-200 transition hover:border-neon-cyan/40 hover:text-white sm:inline-flex"
                >
                  <Building2 className="h-3.5 w-3.5" />
                  Recruiter
                </button>
                <button
                  onClick={() => go('/login')}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-brand-500 to-neon-violet px-4 py-2 text-[13px] font-semibold text-white shadow-glow transition hover:shadow-glow-lg"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  <GraduationCap className="relative h-3.5 w-3.5" />
                  <span className="relative">Student login</span>
                </button>
              </>
            )}
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle navigation"
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-200 lg:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ opacity: 0, y: -14, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -14, height: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-ink-950/95 backdrop-blur-2xl lg:hidden"
            >
              <div className="grid gap-1 p-3">
                {links.map((l, i) => (
                  <motion.button
                    key={l.label}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                    onClick={() => go(l.to)}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
                  >
                    {l.label}
                    <Sparkles className="h-3.5 w-3.5 text-brand-400" />
                  </motion.button>
                ))}
                {isAuthenticated ? (
                  <>
                    {isCandidate && (
                      <button
                        onClick={() => go('/profile')}
                        className="mt-1 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
                      >
                        <UserRound className="h-3.5 w-3.5" />
                        My profile
                      </button>
                    )}
                    <button
                      onClick={() => void onLogout()}
                      className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-neon-pink transition hover:bg-white/5"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => go('/login')}
                      className="mt-1 rounded-xl px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/5"
                    >
                      Student login
                    </button>
                    <button
                      onClick={() => go('/login?role=recruiter')}
                      className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-300 transition hover:bg-white/5"
                    >
                      Recruiter login
                    </button>
                  </>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
