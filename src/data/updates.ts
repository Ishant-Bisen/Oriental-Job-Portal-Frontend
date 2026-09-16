export type UpdateKind = 'drive' | 'result' | 'deadline' | 'workshop' | 'notice' | 'offer'

export type Update = {
  id: string
  kind: UpdateKind
  title: string
  detail: string
  time: string
  companySlug?: string
  pinned?: boolean
  urgent?: boolean
  meta?: string
}

export const updates: Update[] = [
  {
    id: 'up-01',
    kind: 'drive',
    title: 'Google drive schedule released',
    detail:
      'Slot allocation for the Core Platform drive is live. Reporting time is 08:30 at the Main Auditorium — check your slot letter on the portal.',
    time: '12 min ago',
    companySlug: 'google',
    pinned: true,
    urgent: true,
    meta: '268 students shortlisted',
  },
  {
    id: 'up-02',
    kind: 'offer',
    title: '14 offer letters rolled out by Microsoft',
    detail:
      'Azure SDE offers dispatched to registered emails. Acceptance window closes in 72 hours; upload the signed copy to your profile.',
    time: '48 min ago',
    companySlug: 'microsoft',
    meta: 'Highest ₹48.2 LPA',
  },
  {
    id: 'up-03',
    kind: 'deadline',
    title: 'Adobe internship applications close tomorrow',
    detail:
      'Portfolio link is mandatory this cycle. Applications without a live project link will not move to the frontend assessment.',
    time: '2 hours ago',
    companySlug: 'adobe',
    urgent: true,
    meta: 'Closes 23:59 tomorrow',
  },
  {
    id: 'up-04',
    kind: 'result',
    title: 'Razorpay machine coding results published',
    detail:
      '41 students cleared the machine coding round and move to system design. Detailed scorecards are attached to your application.',
    time: '5 hours ago',
    companySlug: 'razorpay',
    meta: '41 of 96 cleared',
  },
  {
    id: 'up-05',
    kind: 'workshop',
    title: 'System Design Bootcamp — 23 seats left',
    detail:
      'Level 1 covers caching, sharding and read scaling with two live design exercises. Certificates auto-attach to your TalentBridge profile.',
    time: '7 hours ago',
    meta: '97 / 120 registered',
  },
  {
    id: 'up-06',
    kind: 'notice',
    title: 'Resume freeze for 2026 batch on Friday',
    detail:
      'Update your resume, projects and CGPA before the freeze. Post-freeze edits need placement-cell approval and take 48 hours.',
    time: '11 hours ago',
    urgent: true,
    meta: 'Action required',
  },
  {
    id: 'up-07',
    kind: 'drive',
    title: 'Bosch adds 8 more openings for ADAS',
    detail:
      'Openings increased from 16 to 24 after the pre-placement talk. ECE, EEE and Mechanical students can still register.',
    time: '1 day ago',
    companySlug: 'bosch',
    meta: '24 openings now',
  },
  {
    id: 'up-08',
    kind: 'result',
    title: 'Nvidia ML fundamentals shortlist out',
    detail:
      '62 students advance to the coding round. Round-2 slots open for booking on the calendar from this evening.',
    time: '1 day ago',
    companySlug: 'nvidia',
    meta: '62 shortlisted',
  },
  {
    id: 'up-09',
    kind: 'offer',
    title: 'Diya Sharma accepts Goldman Sachs offer',
    detail:
      'Third analyst offer from the Risk desk this season — the highest MBA package recorded by the department so far.',
    time: '2 days ago',
    companySlug: 'goldmansachs',
    meta: '₹33.8 LPA',
  },
  {
    id: 'up-10',
    kind: 'notice',
    title: 'New: AI resume score v2 is live',
    detail:
      'Scores now weigh projects and certifications separately, and tell you the exact three skills to add for each role.',
    time: '3 days ago',
    meta: 'Product update',
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
