import { Building2, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

type ComingSoonNoticeProps = {
  title?: string
  description?: string
}

/** Shown when recruiter login/register is selected — feature ships later. */
export function ComingSoonNotice({
  title = 'Recruiter access is coming soon',
  description = 'We are finishing the recruiter workspace. Student accounts are live today — check back shortly for company login and registration.',
}: ComingSoonNoticeProps) {
  return (
    <div className="mt-7 rounded-[24px] border border-brand-400/25 bg-gradient-to-br from-brand-500/15 via-ink-950/40 to-neon-violet/15 px-5 py-8 text-center sm:px-8">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]">
        <Building2 className="h-5 w-5 text-brand-300" />
      </span>
      <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-brand-400/30 bg-brand-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-200">
        <Sparkles className="h-3 w-3" />
        Coming soon
      </p>
      <h3 className="mt-4 text-xl font-bold text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-slate-400">{description}</p>
      <Link to="/login" className="btn-primary mt-6 inline-flex text-[12.5px]">
        Continue as student
      </Link>
    </div>
  )
}
