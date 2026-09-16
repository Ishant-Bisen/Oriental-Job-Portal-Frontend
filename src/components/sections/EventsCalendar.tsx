import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  CalendarCheck2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Mic2,
  Send,
  Ticket,
  Users2,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Modal } from '@/components/ui/Modal'
import { LogoTile, MeterBar, SectionHeading } from '@/components/ui/primitives'
import { Reveal } from '@/components/ui/Reveal'
import { campusEvents, eventDate, eventKindMeta, type CampusEvent } from '@/data/events'
import { cn, relativeDayLabel } from '@/lib/utils'

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function EventsCalendar() {
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [selected, setSelected] = useState<string>(dayKey(today))
  const [active, setActive] = useState<CampusEvent | null>(null)
  const [registered, setRegistered] = useState<string[]>([])

  const byDay = useMemo(() => {
    const map = new Map<string, CampusEvent[]>()
    campusEvents.forEach((e) => {
      const key = dayKey(eventDate(e.dayOffset))
      map.set(key, [...(map.get(key) ?? []), e])
    })
    return map
  }, [])

  const cells = useMemo(() => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1)
    const shift = (first.getDay() + 6) % 7 // make Monday the first column
    const total = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()
    const out: (Date | null)[] = Array.from({ length: shift }, () => null)
    for (let d = 1; d <= total; d++) out.push(new Date(view.getFullYear(), view.getMonth(), d))
    while (out.length % 7 !== 0) out.push(null)
    return out
  }, [view])

  const selectedEvents = byDay.get(selected) ?? []
  const upcoming = campusEvents.slice().sort((a, b) => a.dayOffset - b.dayOffset)

  return (
    <section id="events" className="section-pad relative">
      <div className="container-x">
        <SectionHeading
          eyebrow="Campus calendar"
          title="Drives, workshops and deadlines"
          highlight="on one timeline."
          description="Pick a date to see what is happening. Workshops open a seat for you instantly; placement drives show the company, package and eligibility before you apply."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          {/* ------------------------------------------------ calendar */}
          <Reveal direction="right">
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-ink-900/50 p-5 backdrop-blur-2xl sm:p-6">
              <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-brand-500/15 blur-3xl" />

              <div className="relative flex items-center justify-between">
                <div>
                  <h3 className="flex items-center gap-2 font-display text-[17px] font-bold text-white">
                    <CalendarDays className="h-4 w-4 text-brand-300" />
                    {view.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                  </h3>
                  <p className="mt-1 text-[11.5px] text-slate-500">
                    {campusEvents.length} events scheduled this cycle
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
                    aria-label="Previous month"
                    className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition hover:border-brand-400/40 hover:text-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
                    aria-label="Next month"
                    className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition hover:border-brand-400/40 hover:text-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="relative mt-5 grid grid-cols-7 gap-1 text-center">
                {weekdays.map((w) => (
                  <span key={w} className="pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    {w}
                  </span>
                ))}

                {cells.map((date, i) => {
                  if (!date) return <span key={`empty-${i}`} />
                  const key = dayKey(date)
                  const events = byDay.get(key) ?? []
                  const isToday = key === dayKey(today)
                  const isSelected = key === selected

                  return (
                    <button
                      key={key}
                      onClick={() => setSelected(key)}
                      className={cn(
                        'group relative aspect-square rounded-xl border text-[12.5px] font-semibold transition-all duration-300',
                        isSelected
                          ? 'border-brand-400/60 bg-brand-500/20 text-white shadow-glow'
                          : events.length
                            ? 'border-white/[0.09] bg-white/[0.045] text-slate-200 hover:border-brand-400/40'
                            : 'border-transparent text-slate-500 hover:bg-white/[0.03]',
                      )}
                    >
                      <span className={cn('relative', isToday && 'text-neon-cyan')}>{date.getDate()}</span>
                      {isToday && (
                        <span className="absolute inset-x-0 bottom-1.5 mx-auto h-1 w-1 rounded-full bg-neon-cyan" />
                      )}
                      {events.length > 0 && (
                        <span className="absolute inset-x-0 bottom-1.5 mx-auto flex justify-center gap-0.5">
                          {events.slice(0, 3).map((e) => (
                            <span
                              key={e.id}
                              className={cn('h-1.5 w-1.5 rounded-full', eventKindMeta[e.kind].dot)}
                            />
                          ))}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* legend */}
              <div className="relative mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/[0.06] pt-4">
                {Object.entries(eventKindMeta).map(([k, m]) => (
                  <span key={k} className="flex items-center gap-1.5 text-[10.5px] text-slate-400">
                    <span className={cn('h-2 w-2 rounded-full', m.dot)} />
                    {m.label}
                  </span>
                ))}
              </div>

              {/* selected day list */}
              <div className="relative mt-5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {new Date(
                    Number(selected.split('-')[0]),
                    Number(selected.split('-')[1]),
                    Number(selected.split('-')[2]),
                  ).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={selected}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.32 }}
                    className="mt-3 space-y-2"
                  >
                    {selectedEvents.length === 0 && (
                      <p className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-5 text-center text-[12px] text-slate-500">
                        Nothing scheduled — a good day to prepare.
                      </p>
                    )}
                    {selectedEvents.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => setActive(e)}
                        className="flex w-full items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-3.5 py-3 text-left transition hover:border-brand-400/35 hover:bg-white/[0.06]"
                      >
                        <span className={cn('h-8 w-1 shrink-0 rounded-full', eventKindMeta[e.kind].dot)} />
                        <div className="min-w-0">
                          <p className="truncate text-[12.5px] font-bold text-white">{e.title}</p>
                          <p className="mt-0.5 text-[11px] text-slate-500">
                            {e.time} · {e.venue}
                          </p>
                        </div>
                        <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 text-slate-500" />
                      </button>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Reveal>

          {/* ------------------------------------------------ upcoming rail */}
          <Reveal direction="left">
            <div className="relative h-full overflow-hidden rounded-[28px] border border-white/10 bg-ink-900/40 backdrop-blur-2xl">
              <div className="flex items-center gap-3 border-b border-white/[0.07] px-5 py-4">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-neon-violet/15 text-neon-violet">
                  <Ticket className="h-4 w-4" />
                </span>
                <div className="mr-auto">
                  <h3 className="text-[14.5px] font-bold text-white">Upcoming & open for registration</h3>
                  <p className="text-[11px] text-slate-500">{registered.length} registered by you</p>
                </div>
              </div>

              <div className="no-scrollbar max-h-[34rem] space-y-3 overflow-y-auto p-4">
                {upcoming.map((e, i) => {
                  const meta = eventKindMeta[e.kind]
                  const date = eventDate(e.dayOffset)
                  const isRegistered = registered.includes(e.id)
                  const fill = e.seats ? Math.round((e.registered / e.seats) * 100) : 100

                  return (
                    <motion.article
                      key={e.id}
                      initial={{ opacity: 0, x: 26 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.35) }}
                      className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition hover:border-brand-400/30 hover:bg-white/[0.05]"
                    >
                      <div className="flex gap-3.5">
                        {/* date block */}
                        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl border border-white/[0.09] bg-ink-950/60">
                          <span className="font-display text-lg font-bold leading-none text-white">
                            {date.getDate()}
                          </span>
                          <span className="mt-0.5 text-[9.5px] uppercase tracking-wider text-slate-500">
                            {date.toLocaleDateString('en-IN', { month: 'short' })}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={cn('chip border', meta.soft, meta.text)}>{meta.label}</span>
                            <span className="text-[10.5px] font-semibold text-slate-500">
                              {relativeDayLabel(date)}
                            </span>
                          </div>

                          <h4 className="mt-2 text-[13.5px] font-bold leading-snug text-white">{e.title}</h4>

                          <div className="mt-2 flex flex-wrap gap-x-3.5 gap-y-1 text-[11px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-slate-500" />
                              {e.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-slate-500" />
                              {e.venue}
                            </span>
                          </div>

                          {e.company && (
                            <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-ink-950/40 p-2.5">
                              <LogoTile slug={e.company.slug} name={e.company.name} className="h-8 w-8 shrink-0 p-1.5" />
                              <div className="min-w-0">
                                <p className="truncate text-[11.5px] font-bold text-white">{e.company.role}</p>
                                <p className="truncate text-[10.5px] text-slate-500">
                                  {e.company.ctc} · {e.company.eligibility}
                                </p>
                              </div>
                            </div>
                          )}

                          {e.seats > 0 && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-[10.5px] text-slate-500">
                                <span className="flex items-center gap-1">
                                  <Users2 className="h-3 w-3" />
                                  {e.registered} / {e.seats} seats
                                </span>
                                <span className={fill > 85 ? 'font-semibold text-neon-pink' : ''}>
                                  {e.seats - e.registered} left
                                </span>
                              </div>
                              <MeterBar
                                value={fill}
                                className="mt-1.5 h-1"
                                barClassName={fill > 85 ? 'from-neon-pink to-neon-amber' : undefined}
                              />
                            </div>
                          )}

                          <div className="mt-3.5 flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => setActive(e)}
                              className="btn border border-white/12 bg-white/[0.03] px-3.5 py-2 text-[11.5px] text-slate-200 hover:text-white"
                            >
                              Details
                            </button>

                            {e.kind === 'drive' || e.kind === 'deadline' ? (
                              <button
                                onClick={() => setActive(e)}
                                className="btn bg-gradient-to-r from-brand-500 to-neon-violet px-3.5 py-2 text-[11.5px] text-white shadow-glow"
                              >
                                <Send className="h-3 w-3" />
                                Apply now
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  setRegistered((r) => (r.includes(e.id) ? r.filter((x) => x !== e.id) : [...r, e.id]))
                                }
                                className={cn(
                                  'btn px-3.5 py-2 text-[11.5px]',
                                  isRegistered
                                    ? 'bg-neon-lime/15 text-neon-lime ring-1 ring-neon-lime/40'
                                    : 'bg-gradient-to-r from-neon-cyan/80 to-brand-500 text-white shadow-glow',
                                )}
                              >
                                {isRegistered ? (
                                  <>
                                    <CalendarCheck2 className="h-3 w-3" /> Registered
                                  </>
                                ) : (
                                  <>
                                    <Ticket className="h-3 w-3" /> Register
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  )
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <EventModal
        event={active}
        open={!!active}
        onClose={() => setActive(null)}
        registered={active ? registered.includes(active.id) : false}
        onRegister={(id) =>
          setRegistered((r) => (r.includes(id) ? r.filter((x) => x !== id) : [...r, id]))
        }
      />
    </section>
  )
}

/* ------------------------------------------------------------ event modal */

function EventModal({
  event,
  open,
  onClose,
  registered,
  onRegister,
}: {
  event: CampusEvent | null
  open: boolean
  onClose: () => void
  registered: boolean
  onRegister: (id: string) => void
}) {
  if (!event) return null
  const meta = eventKindMeta[event.kind]
  const date = eventDate(event.dayOffset)
  const isDrive = event.kind === 'drive' || event.kind === 'deadline'

  return (
    <Modal open={open} onClose={onClose} className="max-w-2xl" labelledBy="event-modal-title">
      <div className="relative shrink-0 border-b border-white/[0.07] px-6 pb-6 pr-16 pt-8 sm:px-8 sm:pr-16">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn('chip border', meta.soft, meta.text)}>{meta.label}</span>
          <span className="chip border-white/10 bg-white/[0.04] text-slate-300">
            {relativeDayLabel(date)}
          </span>
        </div>

        <h2 id="event-modal-title" className="mt-3.5 text-xl font-bold leading-snug sm:text-2xl">
          {event.title}
        </h2>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-slate-500" />
            {date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            {event.time}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-slate-500" />
            {event.venue}
          </span>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
        <p className="text-[13px] leading-relaxed text-slate-300">{event.summary}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {event.tags.map((t) => (
            <span key={t} className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-1 text-[10.5px] text-slate-300">
              {t}
            </span>
          ))}
        </div>

        {/* company block for drives */}
        {event.company && (
          <div className="mt-6 rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Recruiting company</p>
            <div className="mt-3.5 flex items-center gap-3.5">
              <LogoTile slug={event.company.slug} name={event.company.name} className="h-14 w-14 shrink-0 p-2.5" />
              <div className="min-w-0">
                <p className="text-[15px] font-bold text-white">{event.company.name}</p>
                <p className="mt-0.5 text-[12px] text-slate-400">{event.company.role}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/[0.07] bg-ink-950/40 p-3.5">
                <p className="text-[10.5px] uppercase tracking-wide text-slate-500">Package</p>
                <p className="mt-1 font-display text-[15px] font-bold text-gradient">{event.company.ctc}</p>
              </div>
              <div className="rounded-2xl border border-white/[0.07] bg-ink-950/40 p-3.5">
                <p className="text-[10.5px] uppercase tracking-wide text-slate-500">Eligibility</p>
                <p className="mt-1 text-[12px] font-semibold text-slate-200">{event.company.eligibility}</p>
              </div>
            </div>
          </div>
        )}

        {/* speaker block for workshops */}
        {event.speaker && (
          <div className="mt-6 flex items-center gap-3.5 rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-neon-cyan/15 text-neon-cyan">
              <Mic2 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10.5px] uppercase tracking-wide text-slate-500">Led by</p>
              <p className="mt-0.5 text-[13.5px] font-bold text-white">{event.speaker.name}</p>
              <p className="text-[11.5px] text-slate-400">{event.speaker.title}</p>
            </div>
          </div>
        )}

        {event.seats > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between text-[11.5px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Users2 className="h-3.5 w-3.5" />
                {event.registered} of {event.seats} seats filled
              </span>
              <span className="font-semibold text-slate-300">{event.seats - event.registered} remaining</span>
            </div>
            <MeterBar value={Math.round((event.registered / event.seats) * 100)} className="mt-2" />
          </div>
        )}
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-3 border-t border-white/[0.07] bg-ink-900/95 px-6 py-4 sm:px-8">
        <p className="mr-auto text-[11.5px] text-slate-500">
          {isDrive ? 'Registration is mandatory to attend this drive.' : 'Certificate issued on completion.'}
        </p>

        {isDrive ? (
          <>
            {event.company?.jobId && (
              <Link to="/jobs" className="btn-ghost text-[12.5px]">
                View full JD
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
            <button className="btn bg-gradient-to-r from-brand-500 to-neon-violet px-5 py-2.5 text-[12.5px] text-white shadow-glow">
              <Send className="h-3.5 w-3.5" />
              Apply for this drive
            </button>
          </>
        ) : (
          <button
            onClick={() => onRegister(event.id)}
            className={cn(
              'btn px-5 py-2.5 text-[12.5px]',
              registered
                ? 'bg-neon-lime/15 text-neon-lime ring-1 ring-neon-lime/40'
                : 'bg-gradient-to-r from-neon-cyan/80 to-brand-500 text-white shadow-glow',
            )}
          >
            {registered ? (
              <>
                <CalendarCheck2 className="h-3.5 w-3.5" /> Seat reserved
              </>
            ) : (
              <>
                <Ticket className="h-3.5 w-3.5" /> Register for free
              </>
            )}
          </button>
        )}
      </div>
    </Modal>
  )
}
