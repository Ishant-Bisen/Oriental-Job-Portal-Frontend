export type Company = {
  name: string
  slug: string
  sector: string
  hires: number
  highestCtc: string
  tier: 'Dream' | 'Super Dream' | 'Core' | 'Mass'
}

/** Logos are pulled from the Simple Icons CDN; `LogoTile` falls back to initials if a slug is missing. */
export const logoUrl = (slug: string) => `https://cdn.simpleicons.org/${slug}`

export const companies: Company[] = [
  { name: 'Google', slug: 'google', sector: 'Product', hires: 14, highestCtc: '₹54.8 LPA', tier: 'Super Dream' },
  { name: 'Microsoft', slug: 'microsoft', sector: 'Product', hires: 19, highestCtc: '₹48.2 LPA', tier: 'Super Dream' },
  { name: 'Amazon', slug: 'amazon', sector: 'Product', hires: 27, highestCtc: '₹44.5 LPA', tier: 'Super Dream' },
  { name: 'Nvidia', slug: 'nvidia', sector: 'Semiconductor', hires: 8, highestCtc: '₹41.0 LPA', tier: 'Dream' },
  { name: 'Adobe', slug: 'adobe', sector: 'Product', hires: 11, highestCtc: '₹38.6 LPA', tier: 'Dream' },
  { name: 'Salesforce', slug: 'salesforce', sector: 'SaaS', hires: 9, highestCtc: '₹36.4 LPA', tier: 'Dream' },
  { name: 'Atlassian', slug: 'atlassian', sector: 'SaaS', hires: 6, highestCtc: '₹34.2 LPA', tier: 'Dream' },
  { name: 'Goldman Sachs', slug: 'goldmansachs', sector: 'FinTech', hires: 12, highestCtc: '₹33.8 LPA', tier: 'Dream' },
  { name: 'Oracle', slug: 'oracle', sector: 'Enterprise', hires: 16, highestCtc: '₹28.5 LPA', tier: 'Dream' },
  { name: 'Qualcomm', slug: 'qualcomm', sector: 'Semiconductor', hires: 13, highestCtc: '₹27.9 LPA', tier: 'Dream' },
  { name: 'Cisco', slug: 'cisco', sector: 'Networking', hires: 15, highestCtc: '₹26.4 LPA', tier: 'Core' },
  { name: 'Intel', slug: 'intel', sector: 'Semiconductor', hires: 10, highestCtc: '₹25.8 LPA', tier: 'Core' },
  { name: 'MongoDB', slug: 'mongodb', sector: 'Database', hires: 5, highestCtc: '₹24.5 LPA', tier: 'Core' },
  { name: 'Razorpay', slug: 'razorpay', sector: 'FinTech', hires: 18, highestCtc: '₹22.0 LPA', tier: 'Core' },
  { name: 'Swiggy', slug: 'swiggy', sector: 'Consumer Tech', hires: 21, highestCtc: '₹21.6 LPA', tier: 'Core' },
  { name: 'Zomato', slug: 'zomato', sector: 'Consumer Tech', hires: 17, highestCtc: '₹20.4 LPA', tier: 'Core' },
  { name: 'Flipkart', slug: 'flipkart', sector: 'E-commerce', hires: 23, highestCtc: '₹19.8 LPA', tier: 'Core' },
  { name: 'Freshworks', slug: 'freshworks', sector: 'SaaS', hires: 14, highestCtc: '₹18.2 LPA', tier: 'Core' },
  { name: 'Zoho', slug: 'zoho', sector: 'SaaS', hires: 26, highestCtc: '₹16.5 LPA', tier: 'Core' },
  { name: 'Siemens', slug: 'siemens', sector: 'Core Engineering', hires: 22, highestCtc: '₹15.4 LPA', tier: 'Core' },
  { name: 'Bosch', slug: 'bosch', sector: 'Core Engineering', hires: 29, highestCtc: '₹14.2 LPA', tier: 'Core' },
  { name: 'Samsung', slug: 'samsung', sector: 'R&D', hires: 24, highestCtc: '₹13.8 LPA', tier: 'Core' },
  { name: 'Accenture', slug: 'accenture', sector: 'Consulting', hires: 96, highestCtc: '₹11.5 LPA', tier: 'Mass' },
  { name: 'Infosys', slug: 'infosys', sector: 'IT Services', hires: 142, highestCtc: '₹9.5 LPA', tier: 'Mass' },
  { name: 'Capgemini', slug: 'capgemini', sector: 'IT Services', hires: 88, highestCtc: '₹8.5 LPA', tier: 'Mass' },
  { name: 'Deloitte', slug: 'deloitte', sector: 'Consulting', hires: 64, highestCtc: '₹12.4 LPA', tier: 'Mass' },
]

export const tierColor: Record<Company['tier'], string> = {
  'Super Dream': 'text-neon-amber border-neon-amber/30 bg-neon-amber/10',
  Dream: 'text-neon-violet border-neon-violet/30 bg-neon-violet/10',
  Core: 'text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10',
  Mass: 'text-slate-300 border-white/15 bg-white/5',
}
