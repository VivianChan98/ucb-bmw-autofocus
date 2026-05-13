import { useState } from 'react'
import { useSharedSession } from '../../state/sharedSession'
import { ALL_SHARED_PEOPLE } from '../../state/sharedPersonas'
import { type SharedPersonaId } from '../../state/sharedPersonas'
import { OrbitViz } from './OrbitViz'
import { PersonInspector } from './PersonInspector'
import { CabinSummary } from './CabinSummary'
import { CalendarTab } from './CalendarTab'
import { MusicTab } from './MusicTab'
import { DiningTab } from './DiningTab'
import { InvitationModal } from './InvitationModal'
import { AddPersonDropdown } from './AddPersonDropdown'
import { Avatar } from './Avatar'
import { Toggle } from './Toggle'

const T = {
  bg:        '#090C13',
  border:    'rgba(255,255,255,0.25)',
  borderMid: 'rgba(255,255,255,0.25)',
  txt:       '#FFFFFF',
  txtB:      'rgba(255,255,255,0.85)',
  txtC:      'rgba(255,255,255,0.60)',
  blend:     '#6FB0C8',
}

const TABS = [
  { id: 'experience' as const, label: 'Experience' },
  { id: 'calendar'   as const, label: 'Calendar' },
  { id: 'music'      as const, label: 'Music' },
  { id: 'dining'     as const, label: 'Dining' },
]

const NAV_ICONS = [
  { icon: '◎', label: 'Experience' },
  { icon: '⌤', label: 'Map' },
  { icon: '♫', label: 'Media' },
  { icon: '⚙', label: 'Settings' },
]

type SharedExperienceProps = {
  onClose?: () => void
}

export function SharedExperience({ onClose }: SharedExperienceProps) {
  const {
    activePeople, sharing, pendingInviteId, selectedPersonId, activeTab,
    pastPeople, futurePeople, blend,
    cameraMode, setCameraMode,
    setActiveTab, setSelectedPerson, invitePerson, acceptInvite, declineInvite,
    removePerson, toggleSharing, cameraMode, setCameraMode,
  } = useSharedSession()

  const [addDropdownOpen, setAddDropdownOpen] = useState(false)

  const owner        = activePeople[0] ?? ALL_SHARED_PEOPLE[0]!
  const available    = ALL_SHARED_PEOPLE.filter((p) => !activePeople.some((a) => a.id === p.id))
  const selectedPerson = activePeople.find((p) => p.id === selectedPersonId) ?? null
  const pendingPerson  = ALL_SHARED_PEOPLE.find((p) => p.id === pendingInviteId) ?? null

  const now     = new Date()
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

  // Biometric mode label for bottom bar
  const modeLabel =
    blend.biometricMode === 'focus' ? 'Focus' :
    blend.biometricMode === 'relax' ? 'Relax' : null

  return (
    <div style={{
      width: '100%', height: '100%',
      background: T.bg,
      display: 'flex', flexDirection: 'column',
      fontFamily: 'Inter, system-ui, sans-serif',
      position: 'relative', overflow: 'hidden',
    }}>

      {/* ── Status bar ──────────────────────────────────────────────── */}
      <div style={{
        height: 33, flexShrink: 0,
        borderBottom: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center',
        padding: '0 14px', gap: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: T.txtC }}>22°C</span>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 7, color: T.txtC, letterSpacing: '.1em' }}>BERLIN</span>
        </div>

        <div style={{ display: 'flex', gap: 6, marginLeft: 4 }}>
          {['BT', 'WiFi'].map((ico) => (
            <div key={ico} style={{
              padding: '1px 5px', borderRadius: 3,
              background: 'rgba(255,255,255,0.04)', border: `1px solid ${T.border}`,
            }}>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 6.5, color: T.txtC, letterSpacing: '.06em' }}>{ico}</span>
            </div>
          ))}
        </div>

        {/* Camera mode indicator */}
        {cameraMode && (
          <div style={{
            padding: '1px 7px', borderRadius: 3,
            background: 'rgba(91,201,138,0.10)', border: '1px solid rgba(91,201,138,0.35)',
          }}>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 6.5, color: '#5BC98A', letterSpacing: '.08em' }}>CAM ACTIVE</span>
          </div>
        )}

        <div style={{ flex: 1 }} />

        {/* Stacked avatars */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {activePeople.map((p, i) => (
            <div key={p.id} style={{ marginLeft: i === 0 ? 0 : -7, zIndex: activePeople.length - i, position: 'relative' }}>
              <Avatar name={p.name} size={18} color={p.color} />
            </div>
          ))}
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8, color: T.txtC, marginLeft: 7 }}>
            {activePeople.length} connected
          </span>
        </div>

        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: T.txtB, marginLeft: 10 }}>{timeStr}</span>

        {onClose && (
          <button onClick={onClose} style={{
            marginLeft: 10, background: 'transparent',
            border: `1px solid ${T.border}`, borderRadius: 4,
            padding: '2px 7px', cursor: 'pointer',
            fontFamily: 'IBM Plex Mono', fontSize: 7.5, color: T.txtC,
          }}>✕</button>
        )}
      </div>

      {/* ── Tab bar ─────────────────────────────────────────────────── */}
      <div style={{
        height: 36, flexShrink: 0,
        borderBottom: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center',
        padding: '0 10px', gap: 2,
      }}>
        {TABS.map((tab) => {
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                height: 26, padding: '0 12px',
                background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                border: `1px solid ${active ? T.borderMid : 'transparent'}`,
                borderRadius: 5, cursor: 'pointer',
                fontFamily: 'IBM Plex Mono', fontSize: 8.5,
                color: active ? T.txt : T.txtC,
                letterSpacing: '.08em', transition: 'all .2s',
              }}
            >{tab.label}</button>
          )
        })}

        <div style={{ flex: 1 }} />

        {/* Camera / Manual toggle — from GitHub */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginRight: 10 }}>
          <span style={{
            fontFamily: 'IBM Plex Mono', fontSize: 8,
            color: cameraMode ? T.txtB : T.txtC,
            letterSpacing: '.08em', transition: 'color .25s',
          }}>
            {cameraMode ? 'Camera' : 'Manual'}
          </span>
          <Toggle on={cameraMode} onChange={setCameraMode} color={T.blend} />
        </div>

        {/* Add person — hidden in camera mode */}
        {!cameraMode && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setAddDropdownOpen((v) => !v)}
              style={{
                height: 26, padding: '0 11px',
                background: addDropdownOpen ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${T.borderMid}`,
                borderRadius: 5, cursor: 'pointer',
                fontFamily: 'IBM Plex Mono', fontSize: 8.5,
                color: T.txtB, letterSpacing: '.08em', transition: 'all .2s',
                display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              <span style={{ fontSize: 9, lineHeight: 1 }}>+</span>
              <span>Add person</span>
            </button>
            {addDropdownOpen && (
              <AddPersonDropdown
                available={available}
                onInvite={(p) => { invitePerson(p.id); setAddDropdownOpen(false) }}
                onClose={() => setAddDropdownOpen(false)}
              />
            )}
          </div>
        )}
      </div>

      {/* ── Body ────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Sidebar */}
        <div style={{
          width: 40, flexShrink: 0,
          borderRight: `1px solid ${T.border}`,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', paddingTop: 10, gap: 6,
        }}>
          {NAV_ICONS.map((n, i) => (
            <div key={n.label} title={n.label} style={{
              width: 28, height: 28, borderRadius: 6,
              background: i === 0 ? 'rgba(255,255,255,0.07)' : 'transparent',
              border: `1px solid ${i === 0 ? T.borderMid : 'transparent'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all .2s',
            }}>
              <span style={{ fontSize: 11, color: i === 0 ? T.txtB : T.txtC }}>{n.icon}</span>
            </div>
          ))}
        </div>

        {/* Content area */}
        <div style={{ flex: 1, display: 'flex', minWidth: 0, overflow: 'hidden' }}>
          {activeTab === 'experience' && (
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              {/* Orbit viz — receives temporal zones */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <OrbitViz
                  people={activePeople}
                  pastPeople={pastPeople}
                  futurePeople={futurePeople}
                  selectedId={selectedPersonId}
                  onSelect={(id) => setSelectedPerson(id as SharedPersonaId | null)}
                />
              </div>

              {/* Right panel */}
              <div style={{
                width: 200, flexShrink: 0,
                borderLeft: `1px solid ${T.border}`,
                overflow: 'hidden',
              }}>
                {selectedPerson ? (
                  <PersonInspector
                    person={selectedPerson}
                    sharing={sharing[selectedPerson.id] ?? { location: true, calendar: true, music: true, dining: true, climate: true }}
                    onToggle={(cat, v) => toggleSharing(selectedPerson.id as SharedPersonaId, cat, v)}
                    onRemove={(id) => { removePerson(id as SharedPersonaId); setSelectedPerson(null) }}
                    onClose={() => setSelectedPerson(null)}
                  />
                ) : (
                  <CabinSummary
                    people={activePeople}
                    sharing={sharing}
                    onToggle={(id, cat, v) => toggleSharing(id as SharedPersonaId, cat, v)}
                  />
                )}
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <CalendarTab people={activePeople} sharing={sharing} />
          )}
          {activeTab === 'music' && (
            <MusicTab people={activePeople} sharing={sharing} />
          )}
          {activeTab === 'dining' && (
            <DiningTab people={activePeople} sharing={sharing} />
          )}
        </div>
      </div>

      {/* ── Bottom bar — driven by real blend data ───────────────────── */}
      <div style={{
        height: 37, flexShrink: 0,
        borderTop: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center',
        padding: '0 14px', gap: 14,
      }}>
        {/* Weighted cabin climate */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: T.txtC }}>Cabin</span>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: T.txtB }}>{blend.climate}°C</span>
          {blend.climateContributors.length > 1 && (
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 7.5, color: T.txtC }}>blended</span>
          )}
        </div>
        <div style={{ width: 1, height: 16, background: T.border }} />

        {/* Weighted ambient light */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: T.txtC }}>Ambient</span>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: T.txtB }}>{blend.ambientLight}K</span>
        </div>

        {/* Biometric mode — owner's HR signal */}
        {modeLabel && blend.biometricHR !== undefined && (
          <>
            <div style={{ width: 1, height: 16, background: T.border }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: T.txtC }}>{blend.biometricHR} bpm</span>
              <span style={{
                fontFamily: 'IBM Plex Mono', fontSize: 7.5,
                color: blend.biometricMode === 'focus' ? '#4A8FD4' : '#5BC98A',
                letterSpacing: '.06em',
              }}>{modeLabel.toUpperCase()}</span>
            </div>
          </>
        )}

        <div style={{ flex: 1 }} />

        {/* Media controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 10, color: T.txtC, cursor: 'pointer' }}>⏮</span>
          <div style={{
            width: 24, height: 24, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)', border: `1px solid ${T.borderMid}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <span style={{ fontSize: 8, color: T.txtB, marginLeft: 1 }}>▶</span>
          </div>
          <span style={{ fontSize: 10, color: T.txtC, cursor: 'pointer' }}>⏭</span>
        </div>

        {/* Music queue — colored dots for ring 0-1 contributors only */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 6 }}>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8, color: T.txtC }}>Blended queue</span>
          <div style={{ display: 'flex', gap: 2 }}>
            {activePeople
              .filter((p) => blend.musicPersonIds.includes(p.id))
              .slice(0, 3)
              .map((p) => (
                <div key={p.id} style={{ width: 4, height: 4, borderRadius: '50%', background: p.color }} />
              ))}
          </div>
        </div>
      </div>

      {/* ── Invitation modal ─────────────────────────────────────────── */}
      {/*
        The phone app reference shows guests choosing their sharing level on their own
        device before entering the orbit. In this prototype the InvitationModal on the
        CID represents that consent moment — the guest is choosing from their phone
        and the CID confirms. In a future build this modal would be dismissed
        automatically once the guest confirms on their phone.
      */}
      {pendingPerson && (
        <InvitationModal
          owner={owner}
          requester={pendingPerson}
          onAccept={acceptInvite}
          onDecline={declineInvite}
        />
      )}
    </div>
  )
}
