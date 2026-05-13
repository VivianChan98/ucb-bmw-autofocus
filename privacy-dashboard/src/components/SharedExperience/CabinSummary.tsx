import { useState } from 'react'
import { SharedPersona, SharingState } from '../../state/sharedPersonas'
import { useSharedSession } from '../../state/sharedSession'
import { Avatar } from './Avatar'
import { PersonPopup } from './PersonPopup'

const T = {
  border: 'rgba(255,255,255,0.15)',
  borderMid: 'rgba(255,255,255,0.25)',
  txtB: 'rgba(255,255,255,0.85)',
  txtC: 'rgba(255,255,255,0.60)',
  green: '#5BC98A',
  blue: '#4A8FD4',
  amber: '#D4A547',
}

const MODE_LABEL: Record<string, string> = {
  focus: 'Focus mode',
  relax: 'Relax mode',
  neutral: 'Neutral',
}

type CabinSummaryProps = {
  people: SharedPersona[]
  sharing: Record<string, SharingState>
  onToggle: (personId: string, cat: keyof SharingState, val: boolean) => void
}

export function CabinSummary({ people, sharing, onToggle }: CabinSummaryProps) {
  const [popupId, setPopupId] = useState<string | null>(null)
  const blend = useSharedSession((s) => s.blend)

  return (
    <div style={{ padding: '14px 15px', display: 'flex', flexDirection: 'column', gap: 11 }}>
      <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: T.txtC, letterSpacing: '.16em', textTransform: 'uppercase' }}>
        Cabin session
      </span>

      {people.map((p) => (
        <div key={p.id} style={{ position: 'relative' }}>
          <div
            onClick={() => setPopupId((id) => id === p.id ? null : p.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 9px', borderRadius: 7, cursor: 'pointer',
              background: popupId === p.id ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${popupId === p.id ? T.borderMid : T.border}`,
              transition: 'all .2s',
            }}
          >
            <Avatar name={p.name} size={26} color={p.color} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 11, color: T.txtB, marginBottom: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
              <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: T.txtC, letterSpacing: '.05em' }}>{p.role}</p>
            </div>
            <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
              {Object.entries(sharing[p.id] ?? {}).map(([k, v]) => (
                <div key={k} style={{
                  width: 4, height: 4, borderRadius: '50%',
                  background: v ? p.color : 'rgba(255,255,255,0.09)',
                  transition: 'background .2s',
                }} title={k} />
              ))}
            </div>
          </div>

          {popupId === p.id && (
            <PersonPopup
              person={p}
              sharing={sharing[p.id] ?? { location: true, calendar: true, music: true, dining: true, climate: true }}
              onToggle={(cat, v) => onToggle(p.id, cat, v)}
              onClose={() => setPopupId(null)}
            />
          )}
        </div>
      ))}

      <div style={{ height: 1, background: T.border }} />

      {/* Climate blend */}
      <div>
        <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: T.txtC, letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 8 }}>
          Active blend
        </p>

        {/* Climate row with contributor breakdown */}
        <div style={{ marginBottom: 7 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: T.txtC }}>Climate</span>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: T.txtB }}>{blend.climate}°C</span>
          </div>
          {blend.climateContributors.length > 1 && (
            <div style={{ paddingLeft: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {blend.climateContributors.map((c) => (
                <div key={c.personId} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: T.txtC }}>{c.name}</span>
                  <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: T.txtC }}>
                    {c.temp}°C × {c.weight.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ambient light */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: T.txtC }}>Ambient</span>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: T.txtB }}>{blend.ambientLight}K</span>
        </div>

        {/* Mode */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: T.txtC }}>Mode</span>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: people.length > 1 ? T.green : T.txtB }}>
            {people.length > 1 ? 'Shared cabin' : 'Personal'}
          </span>
        </div>
      </div>

      {/* Biometric mode */}
      {blend.biometricHR !== undefined && (
        <>
          <div style={{ height: 1, background: T.border }} />
          <div>
            <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: T.txtC, letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 7 }}>
              Biometric signal
            </p>
            <div style={{ padding: '7px 9px', borderRadius: 6, background: 'rgba(74,143,212,0.06)', border: '1px solid rgba(74,143,212,0.18)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: T.txtC }}>HR (owner)</span>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: T.blue }}>{blend.biometricHR} bpm</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: T.txtC }}>Mode</span>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: blend.biometricMode === 'focus' ? T.blue : blend.biometricMode === 'relax' ? T.green : T.txtB }}>
                  {MODE_LABEL[blend.biometricMode]}
                </span>
              </div>
              {blend.biometricDevice && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: T.txtC }}>Via</span>
                  <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: T.txtC }}>{blend.biometricDevice}</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Navigation suggestions from ring-2 guests */}
      {blend.navigationSuggestions.length > 0 && (
        <>
          <div style={{ height: 1, background: T.border }} />
          <div>
            <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: T.txtC, letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 7 }}>
              Route suggestions
            </p>
            {blend.navigationSuggestions.map((s) => (
              <div key={s.personId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, padding: '5px 9px', borderRadius: 5, background: 'rgba(255,255,255,0.02)', border: `1px solid ${T.border}` }}>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: T.txtC }}>{s.personName}</span>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: T.amber }}>{s.destination}</span>
              </div>
            ))}
            <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: T.txtC, marginTop: 3 }}>
              Not influencing route · ring 2 access
            </p>
          </div>
        </>
      )}
    </div>
  )
}
