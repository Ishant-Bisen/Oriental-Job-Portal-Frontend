export type JobType = 'Full-time' | 'Internship' | 'Intern + PPO' | 'Part-time'

export type Job = {
  id: string
  title: string
  company: string
  companySlug: string
  location: string
  workMode: 'On-site' | 'Hybrid' | 'Remote'
  type: JobType
  ctc: string
  stipend?: string
  departments: string[]
  skills: string[]
  matchScore: number
  applicants: number
  openings: number
  postedAgo: string
  deadlineInDays: number
  tier: 'Dream' | 'Super Dream' | 'Core' | 'Mass'
  eligibility: {
    cgpa: string
    batch: string
    backlogs: string
    bond?: string
  }
  about: string
  responsibilities: string[]
  requirements: string[]
  perks: string[]
  rounds: { name: string; detail: string }[]
  missingSkills: string[]
}

export const departments = [
  'All Departments',
  'Computer Science',
  'Information Technology',
  'Electronics & Comm.',
  'Electrical',
  'Mechanical',
  'Civil',
  'Data Science & AI',
  'Business Administration',
] as const

export const jobs: Job[] = [
  {
    id: 'tb-2041',
    title: 'Software Engineer — Core Platform',
    company: 'Google',
    companySlug: 'google',
    location: 'Bengaluru, IN',
    workMode: 'Hybrid',
    type: 'Full-time',
    ctc: '₹54.8 LPA',
    departments: ['Computer Science', 'Information Technology', 'Data Science & AI'],
    skills: ['Data Structures', 'System Design', 'Go', 'Distributed Systems', 'Kubernetes'],
    matchScore: 92,
    applicants: 486,
    openings: 12,
    postedAgo: '2 hours ago',
    deadlineInDays: 4,
    tier: 'Super Dream',
    eligibility: { cgpa: '8.0 / 10', batch: '2026', backlogs: 'No active backlogs', bond: 'None' },
    about:
      'Core Platform builds the storage and scheduling substrate that every Google product runs on. As a new-grad engineer you will own a service from design doc to production rollout, with a senior mentor attached for your first two quarters.',
    responsibilities: [
      'Design, build and ship backend services handling millions of QPS with strict latency budgets.',
      'Write design documents and drive them through peer review with staff engineers.',
      'Instrument services with SLOs, dashboards and alerting; participate in a humane on-call rotation.',
      'Collaborate with SRE to run capacity planning and progressive rollouts across regions.',
    ],
    requirements: [
      'B.Tech / M.Tech in CS, IT or allied branch, batch of 2026.',
      'Strong grasp of data structures, algorithms and complexity analysis.',
      'Proficiency in at least one of Go, C++, Java or Python.',
      'Exposure to distributed systems concepts — consensus, replication, sharding.',
      'Prior internship or substantial open-source contribution is a strong plus.',
    ],
    perks: [
      'Relocation support and joining bonus',
      'Health cover for student and parents',
      '₹1.2L annual learning wallet',
      'Sponsored conference travel',
    ],
    rounds: [
      { name: 'Online Assessment', detail: '90 min · 2 coding + 10 MCQ on CS fundamentals' },
      { name: 'Technical Interview I', detail: '45 min · DSA and problem solving' },
      { name: 'Technical Interview II', detail: '45 min · Low-level design and code review' },
      { name: 'Googliness & Leadership', detail: '30 min · Behavioural and collaboration signals' },
    ],
    missingSkills: ['Kubernetes'],
  },
  {
    id: 'tb-2038',
    title: 'Machine Learning Engineer — Applied AI',
    company: 'Nvidia',
    companySlug: 'nvidia',
    location: 'Pune, IN',
    workMode: 'On-site',
    type: 'Full-time',
    ctc: '₹41.0 LPA',
    departments: ['Data Science & AI', 'Computer Science', 'Electronics & Comm.'],
    skills: ['PyTorch', 'CUDA', 'Transformers', 'C++', 'Model Optimisation'],
    matchScore: 84,
    applicants: 312,
    openings: 8,
    postedAgo: '6 hours ago',
    deadlineInDays: 6,
    tier: 'Dream',
    eligibility: { cgpa: '7.5 / 10', batch: '2026', backlogs: 'No active backlogs' },
    about:
      'The Applied AI group turns research papers into kernels that run on millions of GPUs. You will sit between researchers and the compiler team, squeezing every last teraflop out of new architectures.',
    responsibilities: [
      'Profile and optimise training and inference pipelines for transformer workloads.',
      'Write custom CUDA kernels and benchmark them against cuBLAS/cuDNN baselines.',
      'Reproduce state-of-the-art papers and harden them into production-ready libraries.',
      'Publish internal benchmarks and contribute upstream to open-source frameworks.',
    ],
    requirements: [
      'Strong linear algebra, probability and numerical methods.',
      'Hands-on PyTorch or JAX, with at least one end-to-end trained model.',
      'C++ proficiency; CUDA exposure preferred but trainable.',
      'Comfort reading and implementing research papers independently.',
    ],
    perks: ['GPU workstation allowance', 'Paper publication bonus', 'Stock units at joining', 'On-site gym & cafeteria'],
    rounds: [
      { name: 'ML Fundamentals Test', detail: '60 min · math, statistics and ML theory' },
      { name: 'Coding Round', detail: '60 min · C++/Python implementation heavy' },
      { name: 'Deep Dive', detail: '60 min · your projects, papers and trade-offs' },
      { name: 'Hiring Manager', detail: '30 min · team fit and roadmap discussion' },
    ],
    missingSkills: ['CUDA', 'Model Optimisation'],
  },
  {
    id: 'tb-2035',
    title: 'Product Engineering Intern (6 months + PPO)',
    company: 'Adobe',
    companySlug: 'adobe',
    location: 'Noida, IN',
    workMode: 'Hybrid',
    type: 'Intern + PPO',
    ctc: '₹38.6 LPA (post PPO)',
    stipend: '₹1,10,000 / month',
    departments: ['Computer Science', 'Information Technology'],
    skills: ['React', 'TypeScript', 'Node.js', 'Design Systems', 'WebGL'],
    matchScore: 96,
    applicants: 274,
    openings: 15,
    postedAgo: '1 day ago',
    deadlineInDays: 2,
    tier: 'Dream',
    eligibility: { cgpa: '7.0 / 10', batch: '2026', backlogs: 'Max 1 cleared backlog' },
    about:
      'Join the Creative Cloud web team building the canvas that millions of designers open every morning. Interns own a shippable feature end-to-end and present it at the quarterly demo day — strong performers convert to full-time via PPO.',
    responsibilities: [
      'Build accessible, performant UI in React and TypeScript against a mature design system.',
      'Prototype canvas interactions using WebGL and Canvas APIs.',
      'Partner with designers in weekly critique sessions and turn Figma specs into production components.',
      'Write unit and visual regression tests; keep bundle budgets green.',
    ],
    requirements: [
      'Solid JavaScript fundamentals and comfort with modern React patterns.',
      'An eye for interaction detail — motion, spacing, states.',
      'Git-based collaboration experience.',
      'Portfolio or GitHub showcasing at least one non-trivial UI project.',
    ],
    perks: [
      'PPO for top performers',
      'Adobe Creative Cloud licence',
      'Mentor + buddy programme',
      'Demo day with leadership',
    ],
    rounds: [
      { name: 'Portfolio Screen', detail: 'Resume + GitHub / portfolio review' },
      { name: 'Frontend Assessment', detail: '75 min · build a component live' },
      { name: 'Technical + Design Interview', detail: '45 min · pairing session' },
      { name: 'Culture Round', detail: '30 min · with engineering manager' },
    ],
    missingSkills: ['WebGL'],
  },
  {
    id: 'tb-2030',
    title: 'Analyst — Quantitative Risk',
    company: 'Goldman Sachs',
    companySlug: 'goldmansachs',
    location: 'Bengaluru, IN',
    workMode: 'On-site',
    type: 'Full-time',
    ctc: '₹33.8 LPA',
    departments: ['Business Administration', 'Data Science & AI', 'Computer Science'],
    skills: ['Python', 'SQL', 'Statistics', 'Financial Modelling', 'Excel'],
    matchScore: 71,
    applicants: 398,
    openings: 10,
    postedAgo: '1 day ago',
    deadlineInDays: 8,
    tier: 'Dream',
    eligibility: { cgpa: '7.5 / 10', batch: '2026', backlogs: 'No active backlogs', bond: '1 year' },
    about:
      'Risk Engineering quantifies the exposure of every trade the firm makes. Analysts build the models and pipelines that leadership uses to decide how much risk the balance sheet can carry today.',
    responsibilities: [
      'Build and validate pricing and risk models across asset classes.',
      'Automate daily risk reporting with Python and SQL pipelines.',
      'Stress-test portfolios against historical and hypothetical scenarios.',
      'Present findings to desk heads in concise written memos.',
    ],
    requirements: [
      'Strong probability, statistics and linear algebra.',
      'Python and SQL fluency; VBA or R is a bonus.',
      'Clear written communication — memos matter as much as models.',
      'Genuine interest in markets, demonstrated through projects or certifications.',
    ],
    perks: ['Sponsored CFA/FRM attempts', 'Wellness stipend', 'Global mobility after 2 years', 'Parental health cover'],
    rounds: [
      { name: 'HackerRank Test', detail: '90 min · quant aptitude + Python' },
      { name: 'Case Study', detail: '60 min · portfolio risk scenario' },
      { name: 'Technical Interview', detail: '45 min · statistics and modelling' },
      { name: 'Super Day', detail: '2 × 30 min · with desk leadership' },
    ],
    missingSkills: ['Financial Modelling', 'Statistics'],
  },
  {
    id: 'tb-2028',
    title: 'Embedded Systems Engineer — ADAS',
    company: 'Bosch',
    companySlug: 'bosch',
    location: 'Coimbatore, IN',
    workMode: 'On-site',
    type: 'Full-time',
    ctc: '₹14.2 LPA',
    departments: ['Electronics & Comm.', 'Electrical', 'Mechanical'],
    skills: ['Embedded C', 'RTOS', 'CAN Bus', 'MATLAB', 'AUTOSAR'],
    matchScore: 78,
    applicants: 221,
    openings: 24,
    postedAgo: '2 days ago',
    deadlineInDays: 11,
    tier: 'Core',
    eligibility: { cgpa: '6.5 / 10', batch: '2026', backlogs: 'Max 2 cleared backlogs', bond: '18 months' },
    about:
      'Advanced Driver Assistance Systems keep millions of vehicles between the lanes. You will write firmware that has to be correct the first time, on hardware that ships to eleven countries.',
    responsibilities: [
      'Develop and unit-test firmware modules in Embedded C against AUTOSAR interfaces.',
      'Debug on target using oscilloscopes, CAN analysers and JTAG.',
      'Contribute to ISO 26262 functional-safety documentation.',
      'Support hardware-in-the-loop validation cycles before release gates.',
    ],
    requirements: [
      'Embedded C and microcontroller architecture fundamentals.',
      'Understanding of RTOS scheduling, interrupts and memory constraints.',
      'Exposure to automotive protocols — CAN, LIN or FlexRay.',
      'MATLAB/Simulink modelling experience preferred.',
    ],
    perks: ['Company transport & canteen', 'On-the-job AUTOSAR certification', 'Relocation assistance', 'Shift allowance'],
    rounds: [
      { name: 'Aptitude + Technical MCQ', detail: '60 min · core electronics and C' },
      { name: 'Technical Interview', detail: '45 min · embedded scenarios' },
      { name: 'Practical Round', detail: '60 min · debug a faulty firmware module' },
      { name: 'HR Discussion', detail: '20 min · role, location and bond' },
    ],
    missingSkills: ['AUTOSAR'],
  },
  {
    id: 'tb-2024',
    title: 'Backend Engineer — Payments',
    company: 'Razorpay',
    companySlug: 'razorpay',
    location: 'Bengaluru, IN',
    workMode: 'Hybrid',
    type: 'Full-time',
    ctc: '₹22.0 LPA',
    departments: ['Computer Science', 'Information Technology'],
    skills: ['Java', 'Spring Boot', 'MySQL', 'Kafka', 'AWS'],
    matchScore: 88,
    applicants: 356,
    openings: 18,
    postedAgo: '3 days ago',
    deadlineInDays: 9,
    tier: 'Core',
    eligibility: { cgpa: '7.0 / 10', batch: '2026', backlogs: 'No active backlogs' },
    about:
      'Payments is the beating heart of Razorpay — every millisecond and every paisa is accounted for. You will work on idempotent, auditable systems where correctness is non-negotiable.',
    responsibilities: [
      'Build and maintain payment APIs with strict idempotency and reconciliation guarantees.',
      'Design event-driven flows on Kafka for settlement and refunds.',
      'Own database schema evolution and query performance at scale.',
      'Write runbooks and participate in incident reviews.',
    ],
    requirements: [
      'Java or Kotlin with Spring Boot experience.',
      'Relational database modelling and indexing know-how.',
      'Understanding of concurrency, transactions and isolation levels.',
      'Bonus: exposure to UPI, cards or wallet integrations.',
    ],
    perks: ['ESOPs from day one', 'Unlimited sick leave', 'Home-office setup budget', 'Quarterly hack weeks'],
    rounds: [
      { name: 'Online Coding', detail: '90 min · 2 problems on DSA' },
      { name: 'Machine Coding', detail: '120 min · build a small service' },
      { name: 'System Design', detail: '45 min · design a payment gateway' },
      { name: 'Founder / Bar Raiser', detail: '30 min · ownership and judgement' },
    ],
    missingSkills: ['Kafka'],
  },
  {
    id: 'tb-2019',
    title: 'Structural Design Engineer — Metro Projects',
    company: 'Deloitte',
    companySlug: 'deloitte',
    location: 'Hyderabad, IN',
    workMode: 'On-site',
    type: 'Full-time',
    ctc: '₹12.4 LPA',
    departments: ['Civil', 'Mechanical'],
    skills: ['STAAD Pro', 'AutoCAD', 'Revit', 'Project Estimation', 'IS Codes'],
    matchScore: 74,
    applicants: 164,
    openings: 14,
    postedAgo: '4 days ago',
    deadlineInDays: 13,
    tier: 'Mass',
    eligibility: { cgpa: '6.5 / 10', batch: '2026', backlogs: 'Max 2 cleared backlogs' },
    about:
      'Deloitte Infrastructure advises on metro corridors across three states. Graduate engineers rotate through design, estimation and site-supervision pods within the first year.',
    responsibilities: [
      'Prepare structural models and load calculations for viaducts and stations.',
      'Draft GFC drawings and coordinate revisions with the site team.',
      'Support bill-of-quantities and cost estimation exercises.',
      'Audit contractor submissions against IS codes and project specs.',
    ],
    requirements: [
      'B.Tech Civil with strong structural analysis grounding.',
      'STAAD Pro or ETABS modelling exposure.',
      'AutoCAD drafting; Revit/BIM is a differentiator.',
      'Willingness to travel to project sites up to 30% of the time.',
    ],
    perks: ['Site travel allowance', 'PMP sponsorship after year 2', 'Group insurance', 'Structured rotation programme'],
    rounds: [
      { name: 'Technical Screening', detail: '45 min · structural fundamentals' },
      { name: 'Software Test', detail: '60 min · STAAD / AutoCAD task' },
      { name: 'Panel Interview', detail: '45 min · with project directors' },
      { name: 'HR Round', detail: '20 min · travel and location fit' },
    ],
    missingSkills: ['Revit', 'IS Codes'],
  },
  {
    id: 'tb-2015',
    title: 'Data Analyst Intern',
    company: 'Swiggy',
    companySlug: 'swiggy',
    location: 'Remote, IN',
    workMode: 'Remote',
    type: 'Internship',
    ctc: '—',
    stipend: '₹55,000 / month',
    departments: ['Data Science & AI', 'Business Administration', 'Computer Science'],
    skills: ['SQL', 'Python', 'Tableau', 'A/B Testing', 'Statistics'],
    matchScore: 90,
    applicants: 512,
    openings: 20,
    postedAgo: '5 days ago',
    deadlineInDays: 5,
    tier: 'Core',
    eligibility: { cgpa: '6.0 / 10', batch: '2026 / 2027', backlogs: 'Backlogs allowed' },
    about:
      'Sit inside the growth pod and answer questions that change what forty million users see on the home screen. Interns get their own metric to own and a weekly slot with the analytics lead.',
    responsibilities: [
      'Write SQL to answer product questions and build self-serve dashboards.',
      'Design and read A/B experiments with statistical rigour.',
      'Automate recurring reports and data-quality checks.',
      'Present weekly insight decks to product managers.',
    ],
    requirements: [
      'Strong SQL and working Python (pandas).',
      'Comfort with hypothesis testing and confidence intervals.',
      'Any BI tool experience — Tableau, Power BI or Looker.',
      'Curiosity about consumer behaviour.',
    ],
    perks: ['Fully remote', 'Swiggy One membership', 'Certificate + LOR', 'Conversion to PPO track'],
    rounds: [
      { name: 'SQL Test', detail: '45 min · 6 query problems' },
      { name: 'Case Interview', detail: '45 min · metric deep dive' },
      { name: 'Hiring Manager', detail: '30 min · communication and ownership' },
    ],
    missingSkills: ['A/B Testing'],
  },
]

export const recentJobs = jobs.slice(0, 5)
