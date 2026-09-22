import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  FileText,
  GraduationCap,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  UserRound,
  Undo2,
} from 'lucide-react'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import {
  displayName,
  fetchCandidateProfile,
  updateCandidateProfile,
  type CandidateProfile,
} from '@/api/candidate'
import {
  countApplicationsByStatus,
  fetchMyApplications,
  formatApplicationWhen,
  normalizeApplicationStatus,
  withdrawApplication,
  type ApplicationStatusKey,
  type JobApplication,
} from '@/api/jobs'
import { useAuth } from '@/auth/AuthProvider'
import { patchSession } from '@/auth/session'
import { LogoTile } from '@/components/ui/primitives'
import { ApiError } from '@/lib/api'
import { cn, initials } from '@/lib/utils'

type ProfileForm = {
  firstName: string
  lastName: string
  email: string
  mobile: string
  address: string
  major: string
  highestQualification: string
  profilePicture: string
  resumePdf: string
}

const emptyForm: ProfileForm = {
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  address: '',
  major: '',
  highestQualification: '',
  profilePicture: '',
  resumePdf: '',
}

const statusMeta: Record<
  ApplicationStatusKey,
  { label: string; className: string }
> = {
  APPLIED: {
    label: 'Applied',
    className: 'border-brand-400/30 bg-brand-500/10 text-brand-200',
  },
  REVIEWED: {
    label: 'Under review',
    className: 'border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan',
  },
  SHORTLISTED: {
    label: 'Shortlisted',
    className: 'border-neon-violet/30 bg-neon-violet/10 text-neon-violet',
  },
  ACCEPTED: {
    label: 'Accepted',
    className: 'border-neon-lime/30 bg-neon-lime/10 text-neon-lime',
  },
  REJECTED: {
    label: 'Rejected',
    className: 'border-neon-pink/30 bg-neon-pink/10 text-neon-pink',
  },
  WITHDRAWN: {
    label: 'Withdrawn',
    className: 'border-white/10 bg-white/[0.04] text-slate-400',
  },
}

function toForm(profile: CandidateProfile): ProfileForm {
  return {
    firstName: profile.firstName ?? '',
    lastName: profile.lastName ?? '',
    email: profile.email ?? '',
    mobile: profile.mobile ?? '',
    address: profile.address ?? '',
    major: profile.major ?? '',
    highestQualification: profile.highestQualification ?? '',
    profilePicture: profile.profilePicture ?? '',
    resumePdf: profile.resumePdf ?? '',
  }
}

function formatAppliedAt(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function ProfilePage() {
  const { isAuthenticated, user } = useAuth()
  const isCandidate = isAuthenticated && /candidate|student/i.test(user?.role ?? '')
  const isRecruiter = isAuthenticated && /admin|recruiter|placement|manager/i.test(user?.role ?? '')

  const [profile, setProfile] = useState<CandidateProfile | null>(null)
  const [form, setForm] = useState<ProfileForm>(emptyForm)
  const [apps, setApps] = useState<JobApplication[]>([])
  const [statusFilter, setStatusFilter] = useState<'ALL' | ApplicationStatusKey>('ALL')

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveOk, setSaveOk] = useState(false)
  const [withdrawingId, setWithdrawingId] = useState<number | null>(null)
  const [withdrawError, setWithdrawError] = useState<string | null>(null)

  useEffect(() => {
    if (!isCandidate) {
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setLoadError(null)

    Promise.all([fetchCandidateProfile(), fetchMyApplications()])
      .then(([nextProfile, nextApps]) => {
        if (cancelled) return
        setProfile(nextProfile)
        setForm(toForm(nextProfile))
        setApps(nextApps ?? [])
      })
      .catch((err) => {
        if (cancelled) return
        setLoadError(
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : 'Could not load your profile',
        )
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [isCandidate])

  const counts = useMemo(() => countApplicationsByStatus(apps), [apps])
  const activeCount = apps.filter((app) => !/withdrawn|rejected/i.test(app.status)).length

  const filteredApps = useMemo(() => {
    if (statusFilter === 'ALL') return apps
    return apps.filter((app) => normalizeApplicationStatus(app.status) === statusFilter)
  }, [apps, statusFilter])

  const dirty = useMemo(() => {
    if (!profile) return false
    const baseline = toForm(profile)
    return (Object.keys(baseline) as (keyof ProfileForm)[]).some((key) => form[key] !== baseline[key])
  }, [form, profile])

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (isRecruiter && !isCandidate) {
    return (
      <div className="pb-24 pt-28 sm:pt-32">
        <div className="container-x max-w-xl">
          <div className="rounded-[28px] border border-white/10 bg-ink-900/70 p-8 text-center">
            <h1 className="text-2xl font-bold">Student profile only</h1>
            <p className="mt-3 text-[13.5px] text-slate-400">
              This workspace is for candidates. Use the jobs board to manage openings.
            </p>
            <Link to="/jobs" className="btn-primary mt-6 inline-flex">
              Open jobs board
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const setField = (key: keyof ProfileForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setSaveOk(false)
    setSaveError(null)
  }

  const onSave = async (e: FormEvent) => {
    e.preventDefault()
    if (!dirty || saving) return
    setSaving(true)
    setSaveError(null)
    setSaveOk(false)
    try {
      const updated = await updateCandidateProfile({
        firstName: form.firstName.trim() || null,
        lastName: form.lastName.trim() || null,
        email: form.email.trim() || null,
        mobile: form.mobile.trim() || null,
        address: form.address.trim() || null,
        major: form.major.trim() || null,
        highestQualification: form.highestQualification.trim() || null,
        profilePicture: form.profilePicture.trim() || null,
        resumePdf: form.resumePdf.trim() || null,
      })
      setProfile(updated)
      setForm(toForm(updated))
      if (updated.email) patchSession({ email: updated.email })
      setSaveOk(true)
    } catch (err) {
      setSaveError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Could not save profile',
      )
    } finally {
      setSaving(false)
    }
  }

  const onWithdraw = async (applicationId: number) => {
    if (withdrawingId != null) return
    setWithdrawingId(applicationId)
    setWithdrawError(null)
    try {
      const updated = await withdrawApplication(applicationId)
      setApps((prev) => prev.map((app) => (app.applicationId === applicationId ? updated : app)))
    } catch (err) {
      setWithdrawError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Could not withdraw application',
      )
    } finally {
      setWithdrawingId(null)
    }
  }

  const name = profile ? displayName(profile) : user?.email ?? 'Student'
  const avatarInitials = initials(name)

  return (
    <div className="pb-24 pt-28 sm:pt-32">
      <div className="container-x">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-slate-400 transition hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to jobs
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="chip border-brand-400/30 bg-brand-500/10 text-brand-200">Student workspace</p>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-[2.6rem]">
              Your <span className="text-gradient-animated">profile</span>
            </h1>
            <p className="mt-3 max-w-2xl text-[13.5px] leading-relaxed text-slate-400">
              Keep placement details current and track every application from applied through offer.
            </p>
          </div>
          <Link to="/jobs" className="btn-ghost text-[12.5px]">
            <Briefcase className="h-3.5 w-3.5" />
            Browse jobs
          </Link>
        </div>

        {loading ? (
          <div className="mt-10 flex items-center justify-center gap-3 rounded-[28px] border border-white/10 bg-ink-900/60 px-6 py-16 text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin text-brand-300" />
            Loading your profile…
          </div>
        ) : loadError ? (
          <div className="mt-10 rounded-[28px] border border-neon-pink/25 bg-neon-pink/[0.06] px-6 py-10 text-center">
            <p className="text-[14px] font-semibold text-neon-pink">{loadError}</p>
            <button
              type="button"
              className="btn-primary mt-5"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            {/* Identity header */}
            <section className="mt-10 overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-brand-600/15 via-ink-900/80 to-neon-violet/15 p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-5">
                <div className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-3xl border border-white/15 bg-ink-950/50 text-lg font-bold text-white">
                  {form.profilePicture || profile?.profilePicture ? (
                    <img
                      src={form.profilePicture || profile?.profilePicture}
                      alt=""
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  ) : (
                    avatarInitials
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-xl font-bold sm:text-2xl">{name}</h2>
                    <span className="chip border-white/10 bg-white/[0.04] text-slate-300">Candidate</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[12.5px] text-slate-400">
                    {(form.email || profile?.email) && (
                      <span className="inline-flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-slate-500" />
                        {form.email || profile?.email}
                      </span>
                    )}
                    {(form.mobile || profile?.mobile) && (
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-slate-500" />
                        {form.mobile || profile?.mobile}
                      </span>
                    )}
                    {(form.major || profile?.major) && (
                      <span className="inline-flex items-center gap-1.5">
                        <GraduationCap className="h-3.5 w-3.5 text-slate-500" />
                        {form.major || profile?.major}
                      </span>
                    )}
                    {(form.address || profile?.address) && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-500" />
                        {form.address || profile?.address}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: 'Total applied', value: apps.length },
                  { label: 'In progress', value: activeCount },
                  { label: 'Shortlisted', value: counts.SHORTLISTED },
                  { label: 'Offers', value: counts.ACCEPTED },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/[0.08] bg-ink-950/40 px-4 py-3.5"
                  >
                    <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                      {stat.label}
                    </p>
                    <p className="mt-1 font-display text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              {/* Edit profile */}
              <section className="rounded-[28px] border border-white/10 bg-ink-900/70 p-6 backdrop-blur-xl sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-brand-500/10 text-brand-200">
                    <UserRound className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold">Edit profile</h3>
                    <p className="text-[12px] text-slate-500">
                      Email and mobile update your linked login account (one profile ↔ one login).
                    </p>
                  </div>
                </div>

                <form onSubmit={onSave} className="mt-7 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="First name"
                      value={form.firstName}
                      onChange={setField('firstName')}
                      placeholder="Aisha"
                    />
                    <Field
                      label="Last name"
                      value={form.lastName}
                      onChange={setField('lastName')}
                      placeholder="Khan"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Email"
                      value={form.email}
                      onChange={setField('email')}
                      placeholder="you@university.edu"
                      type="email"
                      required
                    />
                    <Field
                      label="Mobile"
                      value={form.mobile}
                      onChange={setField('mobile')}
                      placeholder="10-digit mobile"
                      inputMode="numeric"
                    />
                  </div>
                  <Field
                    label="Major / branch"
                    value={form.major}
                    onChange={setField('major')}
                    placeholder="Computer Science"
                  />
                  <Field
                    label="Highest qualification"
                    value={form.highestQualification}
                    onChange={setField('highestQualification')}
                    placeholder="B.Tech"
                  />
                  <Field
                    label="Address"
                    value={form.address}
                    onChange={setField('address')}
                    placeholder="City, state"
                  />
                  <Field
                    label="Profile picture URL"
                    value={form.profilePicture}
                    onChange={setField('profilePicture')}
                    placeholder="https://…"
                  />
                  <Field
                    label="Resume PDF URL"
                    value={form.resumePdf}
                    onChange={setField('resumePdf')}
                    placeholder="https://…/resume.pdf"
                  />

                  {(form.resumePdf || profile?.resumePdf) && (
                    <a
                      href={form.resumePdf || profile?.resumePdf}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-brand-200 transition hover:text-white"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Open current resume
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}

                  {saveError && (
                    <p className="rounded-2xl border border-neon-pink/25 bg-neon-pink/[0.08] px-4 py-3 text-[12.5px] text-neon-pink">
                      {saveError}
                    </p>
                  )}
                  {saveOk && (
                    <p className="inline-flex items-center gap-2 rounded-2xl border border-neon-lime/25 bg-neon-lime/[0.08] px-4 py-3 text-[12.5px] text-neon-lime">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Profile saved
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={!dirty || saving}
                      className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving…
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save changes
                        </>
                      )}
                    </button>
                    {dirty && (
                      <button
                        type="button"
                        className="btn-ghost"
                        onClick={() => {
                          if (profile) setForm(toForm(profile))
                          setSaveError(null)
                          setSaveOk(false)
                        }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </form>
              </section>

              {/* Applications */}
              <section className="rounded-[28px] border border-white/10 bg-ink-900/70 p-6 backdrop-blur-xl sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-neon-cyan/10 text-neon-cyan">
                      <Briefcase className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold">Applications</h3>
                      <p className="text-[12px] text-slate-500">
                        {apps.length === 0
                          ? 'You haven’t applied to any roles yet.'
                          : `${apps.length} total · filter by status below`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {(
                    [
                      ['ALL', 'All'],
                      ['APPLIED', 'Applied'],
                      ['REVIEWED', 'Review'],
                      ['SHORTLISTED', 'Shortlisted'],
                      ['ACCEPTED', 'Accepted'],
                      ['REJECTED', 'Rejected'],
                      ['WITHDRAWN', 'Withdrawn'],
                    ] as const
                  ).map(([key, label]) => {
                    const count = key === 'ALL' ? apps.length : counts[key]
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setStatusFilter(key)}
                        className={cn(
                          'rounded-full border px-3 py-1.5 text-[11.5px] font-semibold transition',
                          statusFilter === key
                            ? 'border-brand-400/40 bg-brand-500/15 text-brand-100'
                            : 'border-white/10 bg-white/[0.03] text-slate-400 hover:text-white',
                        )}
                      >
                        {label}
                        <span className="ml-1.5 tabular-nums opacity-70">{count}</span>
                      </button>
                    )
                  })}
                </div>

                {withdrawError && (
                  <p className="mt-4 rounded-2xl border border-neon-pink/25 bg-neon-pink/[0.08] px-4 py-3 text-[12.5px] text-neon-pink">
                    {withdrawError}
                  </p>
                )}

                <div className="mt-5 space-y-3">
                  {filteredApps.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-ink-950/40 px-5 py-10 text-center">
                      <p className="text-[13px] text-slate-400">
                        {apps.length === 0
                          ? 'No applications yet. Browse the jobs board to get started.'
                          : 'No applications in this status.'}
                      </p>
                      {apps.length === 0 && (
                        <Link to="/jobs" className="btn-primary mt-5 inline-flex text-[12.5px]">
                          Find roles
                        </Link>
                      )}
                    </div>
                  ) : (
                    filteredApps.map((app) => {
                      const status = normalizeApplicationStatus(app.status)
                      const meta = statusMeta[status]
                      return (
                        <article
                          key={app.applicationId}
                          className="rounded-2xl border border-white/[0.08] bg-ink-950/45 p-4 sm:p-5"
                        >
                          <div className="flex flex-wrap items-start gap-3.5">
                            <LogoTile
                              name={app.jobTitle}
                              src={app.profilePicture}
                              className="h-12 w-12 shrink-0 p-2"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="text-[14px] font-bold text-white">{app.jobTitle}</h4>
                                <span className={cn('chip border text-[10.5px]', meta.className)}>
                                  {meta.label}
                                </span>
                              </div>
                              <p className="mt-1 text-[12px] text-slate-400">
                                {[app.companyName, app.department, app.jobType].filter(Boolean).join(' · ') ||
                                  'Campus drive'}
                                {' · '}
                                Applied {formatAppliedAt(app.appliedAt)}
                              </p>
                              {app.statusUpdatedAt &&
                              normalizeApplicationStatus(app.status) !== 'APPLIED' ? (
                                <p className="mt-1 text-[11.5px] font-medium text-slate-500">
                                  Status updated {formatApplicationWhen(app.statusUpdatedAt)}
                                </p>
                              ) : null}
                              <p className="mt-1 font-mono text-[10.5px] text-slate-600">
                                App #{app.applicationId} · Job #{app.jobId}
                              </p>
                            </div>
                            <div className="flex shrink-0 flex-wrap gap-2">
                              <Link
                                to="/jobs"
                                className="btn-ghost px-3 py-2 text-[11.5px]"
                              >
                                View board
                              </Link>
                              {app.canWithdraw && (
                                <button
                                  type="button"
                                  disabled={withdrawingId === app.applicationId}
                                  onClick={() => void onWithdraw(app.applicationId)}
                                  className="inline-flex items-center gap-1.5 rounded-full border border-neon-pink/25 bg-neon-pink/[0.08] px-3 py-2 text-[11.5px] font-semibold text-neon-pink transition hover:bg-neon-pink/15 disabled:opacity-60"
                                >
                                  {withdrawingId === app.applicationId ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <Undo2 className="h-3.5 w-3.5" />
                                  )}
                                  Withdraw
                                </button>
                              )}
                            </div>
                          </div>
                        </article>
                      )
                    })
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
  inputMode,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  required?: boolean
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <span className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-ink-950/60 px-4 py-3 focus-within:border-brand-400/40">
        <input
          type={type}
          required={required}
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-[13px] text-white placeholder:text-slate-600 focus:outline-none"
        />
      </span>
    </label>
  )
}
