export type PlacedStudent = {
  name: string
  photo: string
  department: string
  branchShort: string
  company: string
  companySlug: string
  role: string
  package: string
  batch: string
  quote: string
  offers: number
}

const portrait = (gender: 'men' | 'women', id: number) =>
  `https://randomuser.me/api/portraits/${gender}/${id}.jpg`

export const placedStudents: PlacedStudent[] = [
  {
    name: 'Aarav Mehta',
    photo: portrait('men', 32),
    department: 'Computer Science & Engineering',
    branchShort: 'CSE',
    company: 'Google',
    companySlug: 'google',
    role: 'Software Engineer',
    package: '₹54.8 LPA',
    batch: '2025',
    quote:
      'The resume score told me exactly which DSA gaps to close. Eight weeks later I had the Google offer letter.',
    offers: 4,
  },
  {
    name: 'Ishita Raghavan',
    photo: portrait('women', 44),
    department: 'Computer Science & Engineering',
    branchShort: 'CSE',
    company: 'Microsoft',
    companySlug: 'microsoft',
    role: 'SDE — Azure',
    package: '₹48.2 LPA',
    batch: '2025',
    quote:
      'Every drive, every deadline, every interview round in one timeline. I never missed a single update.',
    offers: 3,
  },
  {
    name: 'Rohan Deshpande',
    photo: portrait('men', 75),
    department: 'Information Technology',
    branchShort: 'IT',
    company: 'Amazon',
    companySlug: 'amazon',
    role: 'SDE-1',
    package: '₹44.5 LPA',
    batch: '2025',
    quote: 'Mock interviews booked from the calendar were brutally honest — and that is exactly why they worked.',
    offers: 2,
  },
  {
    name: 'Ananya Iyer',
    photo: portrait('women', 68),
    department: 'Electronics & Communication',
    branchShort: 'ECE',
    company: 'Nvidia',
    companySlug: 'nvidia',
    role: 'Hardware Design Engineer',
    package: '₹41.0 LPA',
    batch: '2025',
    quote: 'Core engineering roles finally got the same spotlight as software ones. That changed everything for ECE.',
    offers: 2,
  },
  {
    name: 'Kabir Singh Ahluwalia',
    photo: portrait('men', 51),
    department: 'Computer Science & Engineering',
    branchShort: 'CSE',
    company: 'Adobe',
    companySlug: 'adobe',
    role: 'Product Engineer',
    package: '₹38.6 LPA',
    batch: '2025',
    quote: 'One profile, twenty-two applications, zero paperwork. The placement cell knew my status before I asked.',
    offers: 3,
  },
  {
    name: 'Meera Nambiar',
    photo: portrait('women', 26),
    department: 'Mechanical Engineering',
    branchShort: 'MECH',
    company: 'Bosch',
    companySlug: 'bosch',
    role: 'Design Engineer — Powertrain',
    package: '₹14.2 LPA',
    batch: '2025',
    quote: 'The department filter surfaced drives I would have scrolled past on a generic job portal.',
    offers: 2,
  },
  {
    name: 'Aditya Varma',
    photo: portrait('men', 9),
    department: 'Data Science & AI',
    branchShort: 'DSAI',
    company: 'Salesforce',
    companySlug: 'salesforce',
    role: 'ML Engineer',
    package: '₹36.4 LPA',
    batch: '2025',
    quote: 'My portfolio, papers and Kaggle rank sat right next to my resume. Recruiters actually read them.',
    offers: 5,
  },
  {
    name: 'Sanya Kapoor',
    photo: portrait('women', 90),
    department: 'Electrical Engineering',
    branchShort: 'EEE',
    company: 'Siemens',
    companySlug: 'siemens',
    role: 'Automation Engineer',
    package: '₹15.4 LPA',
    batch: '2025',
    quote: 'Workshop certificates from campus events auto-attached to my profile. Recruiters noticed.',
    offers: 2,
  },
  {
    name: 'Vivaan Chatterjee',
    photo: portrait('men', 60),
    department: 'Civil Engineering',
    branchShort: 'CIVIL',
    company: 'Deloitte',
    companySlug: 'deloitte',
    role: 'Infrastructure Analyst',
    package: '₹12.4 LPA',
    batch: '2025',
    quote: 'Consulting felt out of reach for Civil until TalentBridge showed me the exact eligibility path.',
    offers: 1,
  },
  {
    name: 'Diya Sharma',
    photo: portrait('women', 12),
    department: 'Business Administration',
    branchShort: 'MBA',
    company: 'Goldman Sachs',
    companySlug: 'goldmansachs',
    role: 'Analyst — Risk',
    package: '₹33.8 LPA',
    batch: '2025',
    quote: 'Case-study prep groups formed straight out of the event page. We cracked finals together.',
    offers: 3,
  },
]
