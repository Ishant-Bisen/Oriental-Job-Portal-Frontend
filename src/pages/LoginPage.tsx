import { ArrowLeft, ArrowRight, Building2, Eye, EyeOff, GraduationCap, Lock, Mail } from 'lucide-react'
import { FormEvent, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/auth/AuthProvider'
import { ComingSoonNotice } from '@/components/auth/ComingSoonNotice'
import { BridgeMark } from '@/components/fx/ScreenFX'
import { ApiError } from '@/lib/api'
import { cn } from '@/lib/utils'

type Role = 'student' | 'recruiter'

export default function LoginPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { loginAsStudent, isAuthenticated, user } = useAuth()

  const initialRole: Role = params.get('role') === 'recruiter' ? 'recruiter' : 'student'
  const [role, setRole] = useState<Role>(initialRole)
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const copy = useMemo(
    () => ({
      title: 'Student login',
      subtitle: 'Sign in with the campus email or mobile number linked to your candidate account.',
      idLabel: 'Email or mobile',
      idPlaceholder: 'you@university.edu or 9876543210',
    }),
    [],
  )

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (role === 'recruiter') return

    setError(null)
    setSubmitting(true)
    try {
      await loginAsStudent(identifier, password)
      navigate('/jobs', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Sign-in failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="pb-24 pt-28 sm:pt-32">
      <div className="container-x">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-slate-400 transition hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>

        <div className="mx-auto mt-8 grid max-w-5xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <aside className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-brand-600/20 via-ink-900/80 to-neon-violet/20 p-8 sm:p-10">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-neon-cyan/15 blur-3xl" />

            <div className="relative">
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-brand-500/10">
                <BridgeMark className="h-7 w-7" />
              </span>
              <p className="mt-6 chip border-white/15 bg-white/[0.06] text-slate-200">TalentBridge portal</p>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-[2.35rem]">
                Welcome back to the <span className="text-gradient-animated">placement cell.</span>
              </h1>
              <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-slate-300">
                Track drives, apply to live roles, and stay on top of interview slots — all from one verified
                campus account.
              </p>
            </div>
          </aside>

          <section className="rounded-[28px] border border-white/10 bg-ink-900/70 p-6 backdrop-blur-xl sm:p-8">
            {isAuthenticated && user ? (
              <div className="rounded-2xl border border-brand-400/25 bg-brand-500/10 px-4 py-5 text-center">
                <p className="text-[13px] font-semibold text-brand-100">Signed in as {user.email}</p>
                <p className="mt-1 text-[12px] text-slate-400">Role: {user.role}</p>
                <Link to="/jobs" className="btn-primary mt-5 inline-flex">
                  Continue to jobs
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <>
                <div className="inline-flex rounded-full border border-white/10 bg-ink-950/60 p-1">
                  {(
                    [
                      { key: 'student' as const, label: 'Student', icon: GraduationCap },
                      { key: 'recruiter' as const, label: 'Recruiter', icon: Building2 },
                    ] as const
                  ).map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setRole(key)
                        setError(null)
                      }}
                      className={cn(
                        'inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12.5px] font-semibold transition',
                        role === key
                          ? 'bg-gradient-to-r from-brand-500 to-neon-violet text-white shadow-glow'
                          : 'text-slate-400 hover:text-white',
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </button>
                  ))}
                </div>

                {role === 'recruiter' ? (
                  <ComingSoonNotice
                    title="Recruiter login is coming soon"
                    description="Company sign-in is not available yet. We are building the recruiter workspace — student login is ready now."
                  />
                ) : (
                  <>
                    <h2 className="mt-6 text-2xl font-bold text-white">{copy.title}</h2>
                    <p className="mt-2 text-[13px] leading-relaxed text-slate-400">{copy.subtitle}</p>

                    <form onSubmit={onSubmit} className="mt-7 space-y-4">
                      <label className="block">
                        <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          {copy.idLabel}
                        </span>
                        <span className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-ink-950/60 px-4 py-3 focus-within:border-brand-400/40">
                          <Mail className="h-4 w-4 shrink-0 text-slate-500" />
                          <input
                            required
                            type="text"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder={copy.idPlaceholder}
                            className="min-w-0 flex-1 bg-transparent text-[13px] text-white placeholder:text-slate-600 focus:outline-none"
                            autoComplete="username"
                          />
                        </span>
                      </label>

                      <label className="block">
                        <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Password
                        </span>
                        <span className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-ink-950/60 px-4 py-3 focus-within:border-brand-400/40">
                          <Lock className="h-4 w-4 shrink-0 text-slate-500" />
                          <input
                            required
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="min-w-0 flex-1 bg-transparent text-[13px] text-white placeholder:text-slate-600 focus:outline-none"
                            autoComplete="current-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="text-slate-500 transition hover:text-white"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </span>
                      </label>

                      {error && (
                        <p className="rounded-2xl border border-neon-pink/25 bg-neon-pink/[0.08] px-4 py-3 text-center text-[12.5px] text-neon-pink">
                          {error}
                        </p>
                      )}

                      <button type="submit" disabled={submitting} className="btn-primary group mt-2 w-full disabled:opacity-60">
                        {submitting ? 'Signing in…' : 'Sign in'}
                        {!submitting && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                      </button>
                    </form>

                    <p className="mt-6 text-center text-[12.5px] text-slate-400">
                      New to TalentBridge?{' '}
                      <Link to="/register" className="font-semibold text-white transition hover:text-brand-200">
                        Create an account
                      </Link>
                    </p>
                  </>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
