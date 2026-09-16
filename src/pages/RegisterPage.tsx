import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  UserRound,
} from 'lucide-react'
import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { BridgeMark } from '@/components/fx/ScreenFX'
import { cn } from '@/lib/utils'

const departments = ['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 'AI & DS', 'Other']

export default function RegisterPage() {
  const [role, setRole] = useState<'student' | 'recruiter'>('student')
  const [fullName, setFullName] = useState('')
  const [rollOrCompany, setRollOrCompany] = useState('')
  const [email, setEmail] = useState('')
  const [department, setDepartment] = useState('CSE')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitted(false)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setSubmitted(true)
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
              <p className="mt-6 chip border-white/15 bg-white/[0.06] text-slate-200">Batch 2026 open</p>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-[2.35rem]">
                Create your{' '}
                <span className="text-gradient-animated">TalentBridge</span> account.
              </h1>
              <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-slate-300">
                Register once with campus-verified details. Apply to live roles, get drive alerts, and keep
                every offer in one place.
              </p>

              <div className="mt-8 space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-[12.5px] text-slate-300">
                <p className="font-semibold text-white">What you get</p>
                <p>· Personalized job matches against your profile</p>
                <p>· Deadline reminders before drives close</p>
                <p>· Resume scoring against active openings</p>
              </div>
            </div>
          </aside>

          <section className="rounded-[28px] border border-white/10 bg-ink-900/70 p-6 backdrop-blur-xl sm:p-8">
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
                    setSubmitted(false)
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

            <h2 className="mt-6 text-2xl font-bold text-white">
              {role === 'student' ? 'Student registration' : 'Recruiter registration'}
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
              {role === 'student'
                ? 'Use your official roll number and university email. Accounts are verified by the T&P cell.'
                : 'Request access with your company email. The placement cell will activate recruiter privileges.'}
            </p>

            <form onSubmit={onSubmit} className="mt-7 grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Full name
                </span>
                <span className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-ink-950/60 px-4 py-3 focus-within:border-brand-400/40">
                  <UserRound className="h-4 w-4 shrink-0 text-slate-500" />
                  <input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="min-w-0 flex-1 bg-transparent text-[13px] text-white placeholder:text-slate-600 focus:outline-none"
                    autoComplete="name"
                  />
                </span>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {role === 'student' ? 'Roll number' : 'Company name'}
                </span>
                <span className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-ink-950/60 px-4 py-3 focus-within:border-brand-400/40">
                  <GraduationCap className="h-4 w-4 shrink-0 text-slate-500" />
                  <input
                    required
                    value={rollOrCompany}
                    onChange={(e) => setRollOrCompany(e.target.value)}
                    placeholder={role === 'student' ? '22CSE001' : 'Acme Corp'}
                    className="min-w-0 flex-1 bg-transparent text-[13px] text-white placeholder:text-slate-600 focus:outline-none"
                  />
                </span>
              </label>

              <label className="block">
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
                    placeholder={role === 'student' ? 'you@university.edu' : 'hiring@company.com'}
                    className="min-w-0 flex-1 bg-transparent text-[13px] text-white placeholder:text-slate-600 focus:outline-none"
                    autoComplete="email"
                  />
                </span>
              </label>

              {role === 'student' && (
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Department
                  </span>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-ink-950/60 px-4 py-3 text-[13px] text-white focus:border-brand-400/40 focus:outline-none [&>option]:bg-ink-900"
                  >
                    {departments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </label>
              )}

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
                    placeholder="Min. 8 characters"
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
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Confirm password
                </span>
                <span className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-ink-950/60 px-4 py-3 focus-within:border-brand-400/40">
                  <Lock className="h-4 w-4 shrink-0 text-slate-500" />
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Re-enter password"
                    className="min-w-0 flex-1 bg-transparent text-[13px] text-white placeholder:text-slate-600 focus:outline-none"
                    autoComplete="new-password"
                  />
                </span>
              </label>

              <div className="sm:col-span-2">
                <button type="submit" className="btn-primary group mt-1 w-full">
                  Create account
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              {error && (
                <p className="sm:col-span-2 rounded-2xl border border-neon-pink/25 bg-neon-pink/[0.08] px-4 py-3 text-center text-[12.5px] text-neon-pink">
                  {error}
                </p>
              )}

              {submitted && !error && (
                <p className="sm:col-span-2 rounded-2xl border border-brand-400/25 bg-brand-500/10 px-4 py-3 text-center text-[12.5px] text-brand-100">
                  UI ready — connect your register API to create the account.
                </p>
              )}
            </form>

            <p className="mt-6 text-center text-[12.5px] text-slate-400">
              Already registered?{' '}
              <Link
                to={role === 'recruiter' ? '/login?role=recruiter' : '/login'}
                className="font-semibold text-white transition hover:text-brand-200"
              >
                Sign in
              </Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
