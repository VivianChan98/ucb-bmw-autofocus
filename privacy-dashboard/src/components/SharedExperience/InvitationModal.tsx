import { useState } from 'react'
import { SharedPersona } from '../../state/sharedPersonas'
import { Avatar } from './Avatar'

const T = {
  bg: '#090C13', card: '#1A2336',
  borderMid: 'rgba(255,255,255,0.25)', borderHi: 'rgba(255,255,255,0.35)',
  txt: '#FFFFFF', txtB: 'rgba(255,255,255,0.8)', txtC: 'rgba(255,255,255,0.6)',
  border: 'rgba(255,255,255,0.25)',
  blend: '#6FB0C8',
}

type InvitationModalProps = {
  owner: SharedPersona
  requester: SharedPersona
  onAccept: () => void
  onDecline: () => void
}

export function InvitationModal({ owner, requester, onAccept, onDecline }: InvitationModalProps) {
  const [hover, setHover] = useState(false)

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(9,12,19,0.82)', backdropFilter: 'blur(14px)' }} onClick={onDecline} />
      <div style={{
        position: 'relative', zIndex: 1,
        background: T.card, border: `1px solid ${T.borderMid}`,
        borderRadius: 14, padding: '24px 28px 20px', minWidth: 310, maxWidth: 350,
        boxShadow: '0 24px 80px rgba(0,0,0,0.75)',
        animation: 'fade-in-up .35s ease forwards',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8, color: T.txtC, letterSpacing: '.18em', textTransform: 'uppercase' }}>Connections</span>
          <button onClick={onDecline} style={{
            width: 18, height: 18, borderRadius: '50%', border: `1px solid ${T.border}`,
            background: 'transparent', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 8, color: T.txtC }}>✕</span>
          </button>
        </div>

        <p style={{ fontSize: 14.5, color: T.txt, marginBottom: 20, letterSpacing: '-.01em', lineHeight: 1.4 }}>
          Share experience with {requester.name.split(' ')[0]}?
        </p>

        {/* Avatar row with connector */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <Avatar name={owner.name} size={46} color={owner.color} />
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8, color: T.txtC }}>{owner.name.split(' ')[0]}</span>
          </div>
          <div style={{ flex: 1, height: 26, position: 'relative', margin: '0 10px', marginBottom: 16 }}>
            <svg width="100%" height="26">
              <line x1="0" y1="13" x2="100%" y2="13" stroke="rgba(255,255,255,0.09)" strokeWidth="1" strokeDasharray="3 5" />
              <line x1="0" y1="13" x2="100%" y2="13" stroke={T.blend} strokeWidth="1" strokeDasharray="6 60"
                style={{ animation: 'connecting-line 2s linear infinite' }} />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <Avatar name={requester.name} size={46} color={requester.color} />
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8, color: T.txtC }}>{requester.name.split(' ')[0]}</span>
          </div>
        </div>

        <p style={{ fontSize: 10.5, color: T.txtC, textAlign: 'center', marginBottom: 18, lineHeight: 1.65 }}>
          Merges cabin preferences — ambient, climate, navigation & more.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={onDecline} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: T.txtC, letterSpacing: '.1em', padding: '6px 4px',
          }}>Not now</button>
          <button
            onClick={onAccept}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
              background: hover ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${hover ? T.borderHi : T.borderMid}`,
              borderRadius: 7, padding: '8px 24px',
              fontFamily: 'IBM Plex Mono', fontSize: 9.5,
              color: hover ? T.txt : T.txtB, letterSpacing: '.12em',
              cursor: 'pointer', transition: 'all .2s',
            }}
          >Share</button>
        </div>
      </div>
    </div>
  )
}
