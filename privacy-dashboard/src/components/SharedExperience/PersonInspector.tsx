import { SharedPersona, SHARE_CATEGORIES, SharingState, PERSONA_ORBIT_RING, RING_DATA_ACCESS, RING_INFLUENCE_WEIGHT } from '../../state/sharedPersonas'
import { Avatar } from './Avatar'
import { Toggle } from './Toggle'

const RING_LABEL = ['Full access', 'Preferences', 'Nav only', 'Presence only']

const T = {
  border: 'rgba(255,255,255,0.25)',
  txt: '#FFFFFF',
  txtB: 'rgba(255,255,255,0.85)',
  txtC: 'rgba(255,255,255,0.60)',
}

type PersonInspectorProps = {
  person: SharedPersona
  sharing: SharingState
  onToggle: (cat: keyof SharingState, val: boolean) => void
  onRemove: (id: string) => void
  onClose: () => void
}

export function PersonInspector({ person, sharing, onToggle, onRemove, onClose }: PersonInspectorProps) {
  const ring = PERSONA_ORBIT_RING[person.id] ?? 3
  const ringAccess = RING_DATA_ACCESS[ring] ?? []
  const influence = RING_INFLUENCE_WEIGHT[ring] ?? 0

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      padding: '14px 16px', gap: 12,
      animation: 'slide-in-right .3s ease forwards', overflow: 'auto',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <Avatar name={person.name} size={38} color={person.color} />
          <div>
            <p style={{ fontSize: 12, color: T.txt, letterSpacing: '-.01em', marginBottom: 1 }}>{person.name}</p>
            <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: T.txtC, letterSpacing: '.06em' }}>{person.device}</p>
          </div>
        </div>
        <button onClick={onClose} style={{
          width: 20, height: 20, borderRadius: '50%', border: `1px solid ${T.border}`,
          background: 'transparent', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2,
        }}>
          <span style={{ fontSize: 10, color: T.txtC }}>✕</span>
        </button>
      </div>

      {/* Role + ring badges */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        <div style={{
          display: 'inline-flex', padding: '2px 8px', borderRadius: 3,
          border: `1px solid ${person.color}28`, background: `${person.color}0e`,
        }}>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: person.color, letterSpacing: '.12em', textTransform: 'uppercase' }}>
            {person.role === 'owner' ? 'Vehicle Owner' : 'Guest'}
          </span>
        </div>
        <div style={{
          display: 'inline-flex', padding: '2px 8px', borderRadius: 3,
          border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
        }}>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: T.txtC, letterSpacing: '.08em' }}>
            Ring {ring} · {RING_LABEL[ring]}
          </span>
        </div>
      </div>

      {/* Data access + influence */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${T.border}`, borderRadius: 6, padding: '8px 10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: T.txtC, letterSpacing: '.1em', textTransform: 'uppercase' }}>Data access</span>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: influence > 0 ? person.color : T.txtC }}>
            {influence > 0 ? `${(influence * 100).toFixed(0)}% blend influence` : 'No blend influence'}
          </span>
        </div>
        {ringAccess.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {ringAccess.map((cat) => (
              <span key={cat} style={{
                padding: '1px 6px', borderRadius: 3,
                background: `${person.color}0d`, border: `1px solid ${person.color}22`,
                fontFamily: 'IBM Plex Mono', fontSize: 7.5, color: `${person.color}bb`, letterSpacing: '.04em',
              }}>{cat}</span>
            ))}
          </div>
        ) : (
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: T.txtC }}>Session presence only</span>
        )}
        {person.biometrics && ringAccess.includes('biometrics') && (
          <div style={{ marginTop: 6, paddingTop: 6, borderTop: `1px solid ${T.border}` }}>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: T.txtC }}>
              {person.biometrics.device} · {person.biometrics.hr} bpm
            </span>
          </div>
        )}
      </div>

      <div style={{ height: 1, background: T.border }} />

      {/* Sharing toggles */}
      <div>
        <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: T.txtC, letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 9 }}>
          Sharing with cabin
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {SHARE_CATEGORIES.map((cat) => (
            <div key={cat.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: sharing[cat.id] ? T.txtB : T.txtC, transition: 'color .2s' }}>
                {cat.label}
              </span>
              <Toggle on={sharing[cat.id]} onChange={(v) => onToggle(cat.id, v)} color={person.color} />
            </div>
          ))}
        </div>
      </div>

      {/* Profile data */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${T.border}`, borderRadius: 7, padding: '9px 11px' }}>
        <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: T.txtC, letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 7 }}>
          Profile data
        </p>
        {[
          { l: 'Ambient',   v: `${person.light}K`, c: person.color },
          { l: 'Temp pref', v: `${person.temp}°C`,  c: T.txtB },
          { l: 'Genres',    v: person.music.genres.slice(0, 2).join(', '), c: T.txtB },
          { l: 'Budget',    v: person.dining.budget, c: T.txtB },
        ].map((row) => (
          <div key={row.l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: T.txtC }}>{row.l}</span>
            <span style={{
              fontFamily: 'IBM Plex Mono', fontSize: 10, color: row.c,
              maxWidth: '58%', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{row.v}</span>
          </div>
        ))}
      </div>

      {/* Remove button — guests only */}
      {person.role !== 'owner' && (
        <button
          onClick={() => onRemove(person.id)}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,80,80,0.38)'
            e.currentTarget.style.color = 'rgba(255,130,130,0.75)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,80,80,0.18)'
            e.currentTarget.style.color = 'rgba(255,100,100,0.45)'
          }}
          style={{
            marginTop: 'auto', background: 'transparent',
            border: '1px solid rgba(255,80,80,0.18)', borderRadius: 6,
            padding: '7px', cursor: 'pointer',
            fontFamily: 'IBM Plex Mono', fontSize: 8.5,
            color: 'rgba(255,100,100,0.45)', letterSpacing: '.1em', textTransform: 'uppercase',
            transition: 'all .2s', width: '100%',
          }}
        >
          Remove from session
        </button>
      )}
    </div>
  )
}
