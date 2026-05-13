import { useState, useEffect } from 'react'
import { SharedPersona, SharingState, CALENDAR_EVENTS } from '../../state/sharedPersonas'
import { Toggle } from './Toggle'

const T = {
  border: 'rgba(255,255,255,0.25)',
  borderMid: 'rgba(255,255,255,0.25)',
  txt: '#FFFFFF',
  txtB: 'rgba(255,255,255,0.85)',
  txtC: 'rgba(255,255,255,0.60)',
  green: '#5BC98A',
}

type CalendarTabProps = {
  people: SharedPersona[]
  sharing: Record<string, SharingState>
}

export function CalendarTab({ people, sharing: _sharing }: CalendarTabProps) {
  const [filter, setFilter] = useState<string[]>(() => people.map((p) => p.id))

  useEffect(() => {
    setFilter((prev) => [...new Set([...prev, ...people.map((p) => p.id)])].filter((id) => people.some((p) => p.id === id)))
  }, [people.map((p) => p.id).join(',')])

  const events = CALENDAR_EVENTS.filter((ev) =>
    ev.ppl.some((pid) => filter.includes(pid) && people.some((p) => p.id === pid))
  )
  const sharedEvents = events.filter((ev) =>
    ev.ppl.filter((pid) => people.some((p) => p.id === pid)).length > 1
  )

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
      {/* Timeline */}
      <div style={{ flex: 1, overflow: 'auto', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 7.5, color: T.txtC, letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 5 }}>
          Mon, Apr 21 — Schoneberg, Berlin
        </span>
        {events.map((ev) => {
          const evPpl = ev.ppl.filter((pid) => people.some((p) => p.id === pid))
          const isShared = evPpl.length > 1
          return (
            <div key={ev.id} style={{
              display: 'flex', alignItems: 'flex-start', gap: 11,
              padding: '9px 11px', borderRadius: 7,
              background: isShared ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${isShared ? T.borderMid : T.border}`,
              animation: 'fade-in-up .3s ease forwards',
            }}>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: T.txtC, width: 34, flexShrink: 0, paddingTop: 1 }}>
                {ev.time}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 11.5, color: isShared ? T.txt : T.txtB, marginBottom: 2, letterSpacing: '-.01em' }}>
                  {ev.title}
                  {isShared && (
                    <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 7, color: T.green, marginLeft: 7, letterSpacing: '.1em' }}>SHARED</span>
                  )}
                </p>
                <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: T.txtC }}>{ev.loc} · {ev.dur}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {evPpl.map((pid, i) => {
                  const p = people.find((p) => p.id === pid)
                  if (!p) return null
                  return (
                    <div key={pid} style={{
                      width: 15, height: 15, borderRadius: '50%',
                      background: `${p.color}1e`, border: `1px solid ${p.color}45`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginLeft: i === 0 ? 0 : -3, zIndex: evPpl.length - i, position: 'relative',
                    }}>
                      <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 5.5, color: p.color }}>{p.name[0]}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Filter panel */}
      <div style={{ width: 188, borderLeft: `1px solid ${T.border}`, padding: '14px 14px', display: 'flex', flexDirection: 'column', gap: 13, flexShrink: 0 }}>
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 7.5, color: T.txtC, letterSpacing: '.16em', textTransform: 'uppercase' }}>
          Show calendars
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {people.map((p) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: p.color, opacity: filter.includes(p.id) ? 1 : 0.3, transition: 'opacity .2s' }} />
                <span style={{ fontSize: 11, color: filter.includes(p.id) ? T.txtB : T.txtC, transition: 'color .2s' }}>
                  {p.name.split(' ')[0]}
                </span>
              </div>
              <Toggle
                on={filter.includes(p.id)}
                onChange={(v) => setFilter((prev) => v ? [...prev, p.id] : prev.filter((id) => id !== p.id))}
                color={p.color}
              />
            </div>
          ))}
        </div>
        <div style={{ height: 1, background: T.border }} />
        {[
          { l: 'Shared events', v: sharedEvents.length, c: T.green },
          { l: 'Total visible',  v: events.length,       c: T.txtB },
        ].map((r) => (
          <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: T.txtC }}>{r.l}</span>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: r.c }}>{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
