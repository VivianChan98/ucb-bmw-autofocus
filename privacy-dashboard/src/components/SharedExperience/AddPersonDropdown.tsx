import { useState } from 'react'
import { SharedPersona } from '../../state/sharedPersonas'
import { Avatar } from './Avatar'

const T = {
  card: '#1A2336',
  borderMid: 'rgba(255,255,255,0.25)',
  txtB: 'rgba(255,255,255,0.8)',
  txtC: 'rgba(255,255,255,0.6)',
}

type AddPersonDropdownProps = {
  available: SharedPersona[]
  onInvite: (person: SharedPersona) => void
  onClose: () => void
}

export function AddPersonDropdown({ available, onInvite, onClose }: AddPersonDropdownProps) {
  return (
    <div style={{
      position: 'absolute', top: '100%', right: 16, zIndex: 300,
      background: T.card, border: `1px solid ${T.borderMid}`,
      borderRadius: 10, padding: '13px 15px', width: 226,
      boxShadow: '0 16px 48px rgba(0,0,0,0.65)',
      animation: 'fade-in-up .22s ease forwards',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 11 }}>
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8, color: T.txtC, letterSpacing: '.16em', textTransform: 'uppercase' }}>Nearby</span>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 10, color: T.txtC }}>✕</button>
      </div>

      {available.length === 0 ? (
        <p style={{ fontSize: 11, color: T.txtC, textAlign: 'center', padding: '5px 0' }}>All 4 people connected</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {available.map((p) => (
            <PersonRow key={p.id} person={p} onInvite={onInvite} />
          ))}
        </div>
      )}
    </div>
  )
}

function PersonRow({ person, onInvite }: { person: SharedPersona; onInvite: (p: SharedPersona) => void }) {
  const [hover, setHover] = useState(false)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <Avatar name={person.name} size={27} color={person.color} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 11, color: T.txtB, marginBottom: 1 }}>{person.name.split(' ')[0]}</p>
        <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 7.5, color: T.txtC, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {person.device}
        </p>
      </div>
      <button
        onClick={() => onInvite(person)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: hover ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${T.borderMid}`,
          borderRadius: 5, padding: '4px 9px', cursor: 'pointer',
          fontFamily: 'IBM Plex Mono', fontSize: 8, color: T.txtB, letterSpacing: '.08em',
          whiteSpace: 'nowrap', transition: 'all .2s',
        }}
      >Invite →</button>
    </div>
  )
}
