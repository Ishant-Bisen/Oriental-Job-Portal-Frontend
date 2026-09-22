export type EventKind = 'drive' | 'workshop' | 'seminar' | 'hackathon' | 'deadline'

export type CampusEvent = {
  id: string
  title: string
  kind: EventKind
  /** Days from today — keeps the calendar alive without hard-coded dates. */
  dayOffset: number
  time: string
  venue: string
  seats: number
  registered: number
  summary: string
  tags: string[]
  company?: {
    name: string
    slug: string
    role: string
    ctc: string
    eligibility: string
    jobId?: string
  }
  speaker?: { name: string; title: string }
}

export const campusEvents: CampusEvent[] = [
  {
    id: 'ev-01',
    title: 'Google Campus Placement Drive',
    kind: 'drive',
    dayOffset: 1,
    time: '09:00 — 18:30',
    venue: 'Main Auditorium, Block A',
    seats: 300,
    registered: 268,
    summary:
      'Full-day on-campus drive covering online assessment and all interview rounds. Carry two printed resumes and your college ID.',
    tags: ['Super Dream', 'CSE / IT / DSAI', 'Batch 2026'],
    company: {
      name: 'Google',
      slug: 'google',
      role: 'Software Engineer — Core Platform',
      ctc: '₹54.8 LPA',
      eligibility: 'CGPA ≥ 8.0 · No active backlogs',
      jobId: 'tb-2041',
    },
  },
  {
    id: 'ev-02',
    title: 'System Design Bootcamp — Level 1',
    kind: 'workshop',
    dayOffset: 2,
    time: '14:00 — 17:00',
    venue: 'Innovation Lab, Block C',
    seats: 120,
    registered: 97,
    summary:
      'Hands-on session on scaling reads, caching layers and database sharding. You will design a URL shortener and a news feed from scratch.',
    tags: ['Hands-on', 'Certificate', 'All branches'],
    speaker: { name: 'Nikhil Bansal', title: 'Staff Engineer, Atlassian' },
  },
  {
    id: 'ev-03',
    title: 'Nvidia Pre-Placement Talk',
    kind: 'seminar',
    dayOffset: 3,
    time: '11:00 — 12:30',
    venue: 'Seminar Hall 2',
    seats: 200,
    registered: 154,
    summary:
      'Engineering leadership walks through the Applied AI charter, interview bar and what a first year at Nvidia actually looks like.',
    tags: ['Mandatory for applicants', 'ECE / CSE / DSAI'],
    company: {
      name: 'Nvidia',
      slug: 'nvidia',
      role: 'Machine Learning Engineer — Applied AI',
      ctc: '₹41.0 LPA',
      eligibility: 'CGPA ≥ 7.5 · Batch 2026',
      jobId: 'tb-2038',
    },
  },
  {
    id: 'ev-04',
    title: 'Adobe Internship Application Deadline',
    kind: 'deadline',
    dayOffset: 2,
    time: 'Closes 23:59',
    venue: 'Online — OrientalPortal',
    seats: 0,
    registered: 274,
    summary: 'Last window to submit your portfolio for the 6-month Product Engineering internship with PPO track.',
    tags: ['Closes soon', 'CSE / IT'],
    company: {
      name: 'Adobe',
      slug: 'adobe',
      role: 'Product Engineering Intern (6 months + PPO)',
      ctc: '₹1.1L / month + PPO',
      eligibility: 'CGPA ≥ 7.0 · Batch 2026',
      jobId: 'tb-2035',
    },
  },
  {
    id: 'ev-05',
    title: 'Resume Clinic with Recruiters',
    kind: 'workshop',
    dayOffset: 5,
    time: '10:00 — 13:00',
    venue: 'Placement Cell, Block B',
    seats: 80,
    registered: 71,
    summary:
      'Bring your resume, leave with a 20-point rewrite. Live ATS scoring plus one-on-one feedback from four visiting recruiters.',
    tags: ['1:1 feedback', 'ATS scoring', 'All branches'],
    speaker: { name: 'Priya Menon', title: 'Talent Partner, Freshworks' },
  },
  {
    id: 'ev-06',
    title: 'Razorpay Hiring Hackathon',
    kind: 'hackathon',
    dayOffset: 7,
    time: '24 hours · starts 09:00',
    venue: 'Central Computing Centre',
    seats: 150,
    registered: 132,
    summary:
      'Build a payment reconciliation service in 24 hours. Top 20 teams skip the online round and go straight to machine coding.',
    tags: ['Fast-track interview', 'Team of 3', 'CSE / IT'],
    company: {
      name: 'Razorpay',
      slug: 'razorpay',
      role: 'Backend Engineer — Payments',
      ctc: '₹22.0 LPA',
      eligibility: 'CGPA ≥ 7.0 · Batch 2026',
      jobId: 'tb-2024',
    },
  },
  {
    id: 'ev-07',
    title: 'Aptitude & Verbal Reasoning Sprint',
    kind: 'workshop',
    dayOffset: 9,
    time: '15:00 — 18:00',
    venue: 'Lecture Hall Complex, LH-7',
    seats: 250,
    registered: 188,
    summary:
      'Three-hour drill on quantitative aptitude, logical reasoning and verbal ability modelled on mass-recruiter test patterns.',
    tags: ['Mock test included', 'Mass recruiters', 'All branches'],
    speaker: { name: 'Dr. Alok Nair', title: 'Head, Training & Placement' },
  },
  {
    id: 'ev-08',
    title: 'Bosch Technical Drive — ADAS',
    kind: 'drive',
    dayOffset: 12,
    time: '09:30 — 17:00',
    venue: 'Mechanical Block Seminar Hall',
    seats: 220,
    registered: 141,
    summary:
      'On-campus drive for embedded and core-engineering roles. Practical debugging round conducted on real ECU hardware.',
    tags: ['Core', 'ECE / EEE / MECH', 'Batch 2026'],
    company: {
      name: 'Bosch',
      slug: 'bosch',
      role: 'Embedded Systems Engineer — ADAS',
      ctc: '₹14.2 LPA',
      eligibility: 'CGPA ≥ 6.5 · Max 2 cleared backlogs',
      jobId: 'tb-2028',
    },
  },
  {
    id: 'ev-09',
    title: 'Mock Interview Marathon',
    kind: 'workshop',
    dayOffset: 15,
    time: '09:00 — 19:00',
    venue: 'Interview Pods, Block B',
    seats: 100,
    registered: 64,
    summary:
      'Book a 30-minute slot with an industry mentor. Recorded session plus a written scorecard within 24 hours.',
    tags: ['Slot booking', 'Recorded feedback', 'All branches'],
    speaker: { name: '18 industry mentors', title: 'Alumni panel' },
  },
  {
    id: 'ev-10',
    title: 'Goldman Sachs Quant Case Workshop',
    kind: 'seminar',
    dayOffset: 18,
    time: '13:00 — 16:00',
    venue: 'Management Block Auditorium',
    seats: 180,
    registered: 112,
    summary:
      'Walk through two real risk-analysis cases with the hiring desk, then attempt a timed case under exam conditions.',
    tags: ['MBA / DSAI / CSE', 'Case practice'],
    company: {
      name: 'Goldman Sachs',
      slug: 'goldmansachs',
      role: 'Analyst — Quantitative Risk',
      ctc: '₹33.8 LPA',
      eligibility: 'CGPA ≥ 7.5 · Batch 2026',
      jobId: 'tb-2030',
    },
  },
]


/** Non-drive campus activities kept as mock until the events API ships. */
export const workshopEvents: CampusEvent[] = campusEvents.filter(
  (e) => e.kind === 'workshop' || e.kind === 'seminar' || e.kind === 'hackathon',
)

export const eventKindMeta: Record<
  EventKind,
  { label: string; dot: string; text: string; ring: string; soft: string }
> = {
  drive: {
    label: 'Placement Drive',
    dot: 'bg-neon-amber',
    text: 'text-neon-amber',
    ring: 'ring-neon-amber/40',
    soft: 'bg-neon-amber/10 border-neon-amber/30',
  },
  workshop: {
    label: 'Workshop',
    dot: 'bg-neon-cyan',
    text: 'text-neon-cyan',
    ring: 'ring-neon-cyan/40',
    soft: 'bg-neon-cyan/10 border-neon-cyan/30',
  },
  seminar: {
    label: 'Pre-Placement Talk',
    dot: 'bg-neon-violet',
    text: 'text-neon-violet',
    ring: 'ring-neon-violet/40',
    soft: 'bg-neon-violet/10 border-neon-violet/30',
  },
  hackathon: {
    label: 'Hackathon',
    dot: 'bg-neon-lime',
    text: 'text-neon-lime',
    ring: 'ring-neon-lime/40',
    soft: 'bg-neon-lime/10 border-neon-lime/30',
  },
  deadline: {
    label: 'Deadline',
    dot: 'bg-neon-pink',
    text: 'text-neon-pink',
    ring: 'ring-neon-pink/40',
    soft: 'bg-neon-pink/10 border-neon-pink/30',
  },
}

export const eventDate = (dayOffset: number) => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + dayOffset)
  return d
}
