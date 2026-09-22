import { About } from '@/components/sections/About'
import { Achievers } from '@/components/sections/Achievers'
import { Advantage } from '@/components/sections/Advantage'
import { EventsCalendar } from '@/components/sections/EventsCalendar'
import { Faq } from '@/components/sections/Faq'
import { Hero } from '@/components/sections/Hero'
import { JobsPreview } from '@/components/sections/JobsPreview'
import { Notifications } from '@/components/sections/Notifications'
import { Portals } from '@/components/sections/Portals'
import { Recruiters } from '@/components/sections/Recruiters'
import { Services } from '@/components/sections/Services'
import { Stats } from '@/components/sections/Stats'
import { StudentHero } from '@/components/sections/StudentHero'
import { useAuth } from '@/auth/AuthProvider'

export default function Landing() {
  const { isAuthenticated, user } = useAuth()
  const isStudent = isAuthenticated && /candidate|student/i.test(user?.role ?? '')

  if (isStudent) {
    return (
      <>
        <StudentHero />
        <Notifications />
        <JobsPreview />
        <EventsCalendar />
      </>
    )
  }

  return (
    <>
      <Hero />
      <About />
      <Notifications />
      <JobsPreview />
      <EventsCalendar />
      <Recruiters />
      <Achievers />
      <Stats />
      <Advantage />
      <Portals />
      <Services />
      <Faq />
    </>
  )
}
