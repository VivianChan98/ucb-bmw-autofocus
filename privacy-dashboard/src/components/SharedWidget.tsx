import { useState } from 'react'
import { SharedPersona, SharingState, SHARE_CATEGORIES } from '../state/sharedPersonas'
import { Avatar } from './SharedExperience/Avatar'

type SharedWidgetProps = {
  activePeople: SharedPersona[]
  sharing: Record<string, SharingState>
  onOpen: () => void
}

const CATEGORY_ICONS: Record<string, string> = {
  location: 'location_on',
  calendar: 'calendar_month',
  music: 'music_note',
  dining: 'restaurant',
  climate: 'thermostat',
}

export function SharedWidget({ activePeople, sharing, onOpen }: SharedWidgetProps) {
  const [hover, setHover] = useState(false)

  // For each share category, check if at least one person has it on
  const categoryActive = (catId: string) =>
    activePeople.some((p) => (sharing[p.id] as SharingState | undefined)?.[catId as keyof SharingState])

  // Dominant color = owner's color for shared tint
  const ownerColor = activePeople[0]?.color ?? '#4A8FD4'

  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'rgba(9,12,19,0.85)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: `1px solid ${hover ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.10)'}`,
        borderRadius: 12,
        padding: '10px 13px',
        minWidth: 190,
        cursor: 'pointer',
        transition: 'border-color .2s, box-shadow .2s',
        boxShadow: hover ? '0 8px 32px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {/* Label row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{
          width: 5, height: 5, borderRadius: '50%',
          background: ownerColor,
          boxShadow: `0 0 6px ${ownerColor}`,
          flexShrink: 0,
        }} />
        <span style={{
          fontFamily: 'IBM Plex Mono',
          fontSize: 7.5,
          color: 'rgba(111,176,200,0.80)',
          letterSpacing: '.16em',
          textTransform: 'uppercase',
        }}>Shared Experience</span>
        <span style={{
          marginLeft: 'auto',
          fontFamily: 'IBM Plex Mono',
          fontSize: 7,
          color: 'rgba(255,255,255,0.18)',
          letterSpacing: '.08em',
        }}>›</span>
      </div>

      {/* Avatars row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {activePeople.slice(0, 4).map((p, i) => (
            <div
              key={p.id}
              style={{ marginLeft: i === 0 ? 0 : -6, zIndex: activePeople.length - i, position: 'relative' }}
            >
              <Avatar name={p.name} size={20} color={p.color} />
            </div>
          ))}
        </div>
        <span style={{
          fontFamily: 'IBM Plex Mono',
          fontSize: 8,
          color: 'rgba(226,232,244,0.35)',
          marginLeft: 4,
        }}>
          {activePeople.length === 1
            ? activePeople[0]!.name.split(' ')[0]
            : `${activePeople.length} connected`}
        </span>
      </div>

      {/* Sharing icons row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {SHARE_CATEGORIES.map((cat) => {
          const on = categoryActive(cat.id)
          return (
            <div
              key={cat.id}
              title={cat.label}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 22, height: 22, borderRadius: 5,
                background: on ? `${ownerColor}14` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${on ? `${ownerColor}30` : 'rgba(255,255,255,0.06)'}`,
                transition: 'all .2s',
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: 13,
                  color: on ? `${ownerColor}cc` : 'rgba(255,255,255,0.18)',
                  fontVariationSettings: "'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 20",
                  lineHeight: 1,
                  transition: 'color .2s',
                }}
              >{CATEGORY_ICONS[cat.id]}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
