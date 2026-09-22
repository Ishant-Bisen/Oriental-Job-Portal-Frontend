import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  Phone,
  UserRound,
} from 'lucide-react'
import { FormEvent, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/auth/AuthProvider'
import { ComingSoonNotice } from '@/components/auth/ComingSoonNotice'
import { BridgeMark } from '@/components/fx/ScreenFX'
import { ApiError } from '@/lib/api'
import { cn } from '@/lib/utils'

type Role = 'student' | 'recruiter'

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,72}$/

export default function RegisterPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { registerAsStudent, isAuthenticated, user } = useAuth()

  const [role, setRole] = useState<Role>(params.get('role') === 'recruiter' ? 'recruiter' : 'student')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (role === 'recruiter') return

    setError(null)

    if (!PASSWORD_RULE.test(password)) {
      setError('Password must be 8–72 characters and include uppercase, lowercase, number, and a special character.')
      return
    }

    const cleanedMobile = mobile.trim()
    if (cleanedMobile && !/^\+?[0-9]{10,15}$/.test(cleanedMobile)) {
      setError('Mobile must be 10–15 digits (optional + prefix).')
      return
    }

    setSubmitting(true)
    try {
      await registerAsStudent({
        email: email.trim(),
        mobile: cleanedMobile,
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      })
      navigate('/profile', { replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        const fieldMsg = err.fieldErrors ? Object.values(err.fieldErrors)[0] : null
        setError(fieldMsg || err.message)
      } else {
        setError('Registration failed. Please try again.')
      }
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

        <div className="mx-auto mt-8 grid max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
          <aside className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-neon-violet/20 via-ink-900/80 to-brand-600/20 p-8 sm:p-10">
            <div className="pointer-events-none absolute -left-10 -top-16 h-56 w-56 rounded-full bg-neon-pink/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -right-10 h-48 w-48 rounded-full bg-brand-500/20 blur-3xl" />

            <div className="relative">
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-brand-500/10">
                <BridgeMark className="h-7 w-7" />
              </span>
              <p className="mt-6 chip border-white/15 bg-white/[0.06] text-slate-200">Placement portal</p>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-[2.35rem]">
                Create your <span className="text-gradient-animated">OrientalPortal</span> account.
              </h1>
              <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-slate-300">
                Student registration is open now. Recruiter accounts will unlock in a later release.
              </p>
            </div>
          </aside>

          <section className="rounded-[28px] border border-white/10 bg-ink-900/70 p-6 backdrop-blur-xl sm:p-8">
            {isAuthenticated && user ? (
              <div className="rounded-2xl border border-brand-400/25 bg-brand-500/10 px-4 py-5 text-center">
                <p className="text-[13px] font-semibold text-brand-100">Already signed in as {user.email}</p>
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
                    title="Recruiter registration is coming soon"
                    description="Company onboarding is not open yet. Create a student account today, or check back soon for recruiter access."
                  />
                ) : (
                  <>
                    <h2 className="mt-6 text-2xl font-bold text-white">Student registration</h2>
                    <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
                      Fields match <code className="text-slate-300">/api/auth/user/register</code>.
                    </p>

                    <form onSubmit={onSubmit} className="mt-7 grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          First name
                        </span>
                        <span className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-ink-950/60 px-4 py-3 focus-within:border-brand-400/40">
                          <UserRound className="h-4 w-4 shrink-0 text-slate-500" />
                          <input
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="First name"
                            className="min-w-0 flex-1 bg-transparent text-[13px] text-white placeholder:text-slate-600 focus:outline-none"
                            autoComplete="given-name"
                          />
                        </span>
                      </label>

                      <label className="block">
                        <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Last name
                        </span>
                        <span className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-ink-950/60 px-4 py-3 focus-within:border-brand-400/40">
                          <UserRound className="h-4 w-4 shrink-0 text-slate-500" />
                          <input
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Last name"
                            className="min-w-0 flex-1 bg-transparent text-[13px] text-white placeholder:text-slate-600 focus:outline-none"
                            autoComplete="family-name"
                          />
                        </span>
                      </label>

                      <label className="block sm:col-span-2">
                        <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Email
                        </span>
                        <span className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-ink-950/60 px-4 py-3 focus-within:border-brand-400/40">
                          <Mail className="h-4 w-4 shrink-0 text-slate-500" />
                          <input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@university.edu"
                            className="min-w-0 flex-1 bg-transparent text-[13px] text-white placeholder:text-slate-600 focus:outline-none"
                            autoComplete="email"
                          />
                        </span>
                      </label>

                      <label className="block sm:col-span-2">
                        <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Mobile <span className="normal-case tracking-normal text-slate-600">(optional)</span>
                        </span>
                        <span className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-ink-950/60 px-4 py-3 focus-within:border-brand-400/40">
                          <Phone className="h-4 w-4 shrink-0 text-slate-500" />
                          <input
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            placeholder="9876543210"
                            className="min-w-0 flex-1 bg-transparent text-[13px] text-white placeholder:text-slate-600 focus:outline-none"
                            autoComplete="tel"
                          />
                        </span>
                      </label>

                      <label className="block sm:col-span-2">
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
                            placeholder="e.g. Passw0rd!"
                            className="min-w-0 flex-1 bg-transparent text-[13px] text-white placeholder:text-slate-600 focus:outline-none"
                            autoComplete="new-password"
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
                        <span className="mt-1.5 block text-[11px] leading-relaxed text-slate-500">
                          Min 8 chars with uppercase, lowercase, number, and special character.
                        </span>
                      </label>

                      {error && (
                        <p className="sm:col-span-2 rounded-2xl border border-neon-pink/25 bg-neon-pink/[0.08] px-4 py-3 text-center text-[12.5px] text-neon-pink">
                          {error}
                        </p>
                      )}

                      <div className="sm:col-span-2">
                        <button type="submit" disabled={submitting} className="btn-primary group mt-1 w-full disabled:opacity-60">
                          {submitting ? 'Creating account…' : 'Create account'}
                          {!submitting && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                        </button>
                      </div>
                    </form>

                    <p className="mt-6 text-center text-[12.5px] text-slate-400">
                      Already registered?{' '}
                      <Link to="/login" className="font-semibold text-white transition hover:text-brand-200">
                        Sign in
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
