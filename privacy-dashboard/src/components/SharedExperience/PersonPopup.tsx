import { SharedPersona, SHARE_CATEGORIES, SharingState } from '../../state/sharedPersonas'
import { Toggle } from './Toggle'

const T = {
  card: '#1A2336',
  borderMid: 'rgba(255,255,255,0.25)',
  txtB: 'rgba(255,255,255,0.8)',
  txtC: 'rgba(255,255,255,0.6)',
}

type PersonPopupProps = {
  person: SharedPersona
  sharing: SharingState
  onToggle: (cat: keyof SharingState, val: boolean) => void
  onClose: () => void
}

export function PersonPopup({ person, sharing, onToggle, onClose }: PersonPopupProps) {
  return (
    <div style={{
      position: 'absolute', right: 'calc(100% + 8px)', top: 0, zIndex: 200,
      background: T.card, border: `1px solid ${T.borderMid}`, borderRadius: 10,
      padding: '12px 14px', width: 210,
      boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
      animation: 'fade-in-up .2s ease forwards',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8, color: person.color, letterSpacing: '.12em', textTransform: 'uppercase' }}>
          {person.name.split(' ')[0]}
        </span>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 10, color: T.txtC, lineHeight: 1 }}>✕</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {SHARE_CATEGORIES.map((cat) => (
          <div key={cat.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10.5, color: sharing[cat.id] ? T.txtB : T.txtC, transition: 'color .2s' }}>
              {cat.label}
            </span>
            <Toggle on={sharing[cat.id]} onChange={(v) => onToggle(cat.id, v)} color={person.color} />
          </div>
        ))}
      </div>
    </div>
  )
}
