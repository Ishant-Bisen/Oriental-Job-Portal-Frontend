/** Content tags — must match backend `UpdateTag` enum. */
export const UPDATE_TAGS = [
  'OFFER',
  'JOB',
  'NOTICE',
  'DRIVE',
  'RESULT',
  'UPDATE',
  'WORKSHOP',
] as const

export type UpdateTag = (typeof UPDATE_TAGS)[number]

/**
 * Situational filter flags — shown as chips and used to filter the feed /
 * power the “Needs your attention” spotlight.
 */
export const UPDATE_FLAGS = [
  'ATTENTION_NEEDED',
  'CLOSING_SOON',
  'NEED_YOUR_ATTENTION',
] as const

export type UpdateFlag = (typeof UPDATE_FLAGS)[number]

export type Update = {
  id: string
  tag: UpdateTag
  title: string
  description: string
  time: string
  companySlug?: string
  flags?: UpdateFlag[]
  appliedCount?: number | null
  registrationCount?: number | null
  shortlistedCount?: number | null
  totalOpenings?: number | null
  /** Prefer server `metaLabel` when present; otherwise computed via {@link buildMetaLabel}. */
  metaLabel?: string
}

/**
 * One-line live status for the UI.
 * Priority: shortlisted → applied → registered / registration open → openings/seats → flags.
 */
export function buildMetaLabel(update: Pick<
  Update,
  | 'metaLabel'
  | 'shortlistedCount'
  | 'appliedCount'
  | 'registrationCount'
  | 'totalOpenings'
  | 'flags'
>): string {
  if (update.metaLabel?.trim()) return update.metaLabel.trim()

  if (update.shortlistedCount != null && update.shortlistedCount > 0) {
    return `${update.shortlistedCount} shortlisted`
  }
  if (update.appliedCount != null && update.appliedCount > 0) {
    return `${update.appliedCount} applied`
  }
  if (update.registrationCount != null) {
    if (update.registrationCount > 0) return `${update.registrationCount} registered`
    return 'Registration open'
  }
  if (update.totalOpenings != null && update.totalOpenings > 0) {
    return `${update.totalOpenings} openings`
  }

  const flags = update.flags ?? []
  if (flags.includes('CLOSING_SOON')) return 'Closing soon'
  if (flags.includes('ATTENTION_NEEDED') || flags.includes('NEED_YOUR_ATTENTION')) {
    return 'Attention needed'
  }
  return ''
}

export function hasFlag(update: Update, flag: UpdateFlag) {
  return update.flags?.includes(flag) ?? false
}

export const updates: Update[] = [
  {
    id: 'up-01',
    tag: 'DRIVE',
    title: 'Google drive schedule released',
    description:
      'Slot allocation for the Core Platform drive is live. Reporting time is 08:30 at the Main Auditorium — check your slot letter on the portal.',
    time: '12 min ago',
    companySlug: 'google',
    flags: ['NEED_YOUR_ATTENTION'],
    shortlistedCount: 268,
  },
  {
    id: 'up-02',
    tag: 'OFFER',
    title: '14 offer letters rolled out by Microsoft',
    description:
      'Azure SDE offers dispatched to registered emails. Acceptance window closes in 72 hours; upload the signed copy to your profile.',
    time: '48 min ago',
    companySlug: 'microsoft',
    flags: ['CLOSING_SOON'],
    appliedCount: 14,
  },
  {
    id: 'up-03',
    tag: 'JOB',
    title: 'Adobe internship applications close tomorrow',
    description:
      'Portfolio link is mandatory this cycle. Applications without a live project link will not move to the frontend assessment.',
    time: '2 hours ago',
    companySlug: 'adobe',
    flags: ['CLOSING_SOON', 'NEED_YOUR_ATTENTION'],
    totalOpenings: 12,
  },
  {
    id: 'up-04',
    tag: 'RESULT',
    title: 'Razorpay machine coding results published',
    description:
      '41 students cleared the machine coding round and move to system design. Detailed scorecards are attached to your application.',
    time: '5 hours ago',
    companySlug: 'razorpay',
    shortlistedCount: 41,
  },
  {
    id: 'up-05',
    tag: 'WORKSHOP',
    title: 'System Design Bootcamp — seats filling fast',
    description:
      'Level 1 covers caching, sharding and read scaling with two live design exercises. Certificates auto-attach to your TalentBridge profile.',
    time: '7 hours ago',
    flags: ['CLOSING_SOON'],
    registrationCount: 97,
  },
  {
    id: 'up-06',
    tag: 'NOTICE',
    title: 'Resume freeze for 2026 batch on Friday',
    description:
      'Update your resume, projects and CGPA before the freeze. Post-freeze edits need placement-cell approval and take 48 hours.',
    time: '11 hours ago',
    flags: ['NEED_YOUR_ATTENTION'],
  },
  {
    id: 'up-07',
    tag: 'JOB',
    title: 'Bosch adds 8 more openings for ADAS',
    description:
      'Openings increased from 16 to 24 after the pre-placement talk. ECE, EEE and Mechanical students can still register.',
    time: '1 day ago',
    companySlug: 'bosch',
    totalOpenings: 24,
  },
  {
    id: 'up-08',
    tag: 'RESULT',
    title: 'Nvidia ML fundamentals shortlist out',
    description:
      '62 students advance to the coding round. Round-2 slots open for booking on the calendar from this evening.',
    time: '1 day ago',
    companySlug: 'nvidia',
    flags: ['ATTENTION_NEEDED'],
    shortlistedCount: 62,
  },
  {
    id: 'up-09',
    tag: 'OFFER',
    title: 'Diya Sharma accepts Goldman Sachs offer',
    description:
      'Third analyst offer from the Risk desk this season — the highest MBA package recorded by the department so far.',
    time: '2 days ago',
    companySlug: 'goldmansachs',
    appliedCount: 3,
  },
  {
    id: 'up-10',
    tag: 'UPDATE',
    title: 'AI resume score v2 is live',
    description:
      'Scores now weigh projects and certifications separately, and tell you the exact three skills to add for each role.',
    time: '3 days ago',
  },
  {
    id: 'up-11',
    tag: 'DRIVE',
    title: 'Hospital Pharmacist campus drive open',
    description:
      'Apollo Pharmacy Network is hiring B.Pharm / D.Pharm graduates. Register before the portal closes.',
    time: '4 hours ago',
    registrationCount: 0,
    flags: ['CLOSING_SOON'],
  },
]

export const tickerItems = [
  'Google drive · slots released · reporting 08:30',
  'Adobe internship closes in 1 day',
  '14 Microsoft offers rolled out',
  'Resume freeze for 2026 batch on Friday',
  'Razorpay hackathon · 18 seats left',
  'Nvidia round-2 slot booking opens tonight',
  'Bosch ADAS openings raised to 24',
  'Mock interview marathon · book your slot',
]
