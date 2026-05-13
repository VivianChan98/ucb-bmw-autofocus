import { useStore } from '../state/store'
import { sarah, alex } from '../state/personas'
import { audioManager } from '../lib/audio'
import { TIMELINE } from '../state/scenario'
import { kelvinLabel } from '../lib/kelvin'

function Btn({ label, onClick, active, variant }: {
  label: string; onClick: () => void; active?: boolean; variant?: 'amber'
}) {
  const amber = variant === 'amber'
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded text-xs font-mono tracking-wide border transition-colors ${
        active
          ? amber ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-white/10 border-white/20 text-white/80'
          : amber ? 'bg-transparent border-amber-500/15 text-amber-500/40 hover:border-amber-500/30 hover:text-amber-400/60'
                  : 'bg-transparent border-white/8 text-white/40 hover:border-white/20 hover:text-white/60'
      }`}
    >
      {label}
    </button>
  )
}

export function ControlPanel() {
  const store = useStore()
  const occupants = useStore((s) => s.occupants)
  const context = useStore((s) => s.context)
  const mode = useStore((s) => s.mode)
  const audioEnabled = useStore((s) => s.audioEnabled)
  const loopTime = useStore((s) => s.loopTime)
  const eventLog = useStore((s) => s.eventLog)

  const hasSarah = occupants.some((o) => o.id === 'sarah')
  const hasAlex = occupants.some((o) => o.id === 'alex')

  const presenceState = hasAlex ? 'S2' : hasSarah ? 'S1' : 'S0'
  const presenceLabel = { S0: 'Owner only', S1: 'Owner + paired guest', S2: '+ unrecognized occupant' }[presenceState]

  const blend = store.activeBlend

  return (
    <div className="flex flex-col gap-6 text-white/60 text-xs">

      {/* Event log */}
      <div>
        <div className="text-white/25 font-mono uppercase tracking-widest text-xs mb-2">Event Log</div>
        <div className="flex flex-col gap-1 max-h-36 overflow-y-auto">
          {eventLog.map((e) => (
            <div key={e.id} className="flex items-baseline gap-2">
              <span className="font-mono text-white/20 shrink-0" style={{ fontSize: '9px' }}>{e.loopTime.toFixed(1)}s</span>
              <span className="text-white/40 text-xs leading-tight">{e.event}</span>
            </div>
          ))}
        </div>
      </div>

      {/* State */}
      <div>
        <div className="text-white/25 font-mono uppercase tracking-widest text-xs mb-1">Presence</div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-white/70 text-sm">{presenceState}</span>
          <span className="text-white/35">{presenceLabel}</span>
        </div>
        <div className="mt-1 text-white/20 font-mono" style={{ fontSize: '10px' }}>
          t = {loopTime.toFixed(1)}s · {context.zone} · {context.location}
        </div>
      </div>

      {/* Occupants */}
      <div>
        <div className="text-white/25 font-mono uppercase tracking-widest text-xs mb-2">Occupants</div>
        {occupants.map((o) => (
          <div key={o.id} className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: o.color }} />
            <span className="text-white/60">{o.name}</span>
            <span className="text-white/25 font-mono text-xs">{o.seat}</span>
            <span className="text-white/20 font-mono text-xs">
              {o.linkedVia ?? 'no profile'}
            </span>
          </div>
        ))}
      </div>

      {/* Scene triggers */}
      <div>
        <div className="text-white/25 font-mono uppercase tracking-widest text-xs mb-2">
          Triggers {mode === 'auto' && <span className="text-white/15 normal-case">(pause to enable)</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          <Btn label="Dylan only" active={!hasSarah && !hasAlex} onClick={() => {
            store.removeOccupant('sarah'); store.removeOccupant('alex')
            store.setMicrocopy('Dylan connected. Personal profile active.')
            store.setContext({ zone: 'personal', location: 'Schoneberg, Berlin' })
            store.setConflicts([])
            store.setActiveBlend({ ambientLight: { kelvin: 3200, brightness: 70, sources: ['Dylan'] }, climate: '21.0', climateSources: [21], navigationConsensus: false, focusMode: true, focusReason: 'Design Review at 9:00', cabinMode: 'personal' })
            store.logEvent('Manual: reset to Dylan only.')
          }} />
          <Btn label="+ Sarah" active={hasSarah} onClick={() => {
            store.addOccupant(sarah)
            store.setMicrocopy('Sarah paired. Merging cabin preferences.')
            store.setActiveBlend({ ambientLight: { kelvin: 3850, brightness: 63, sources: ['Dylan', 'Sarah'] }, climate: '21.5', climateSources: [21, 22], navigationConsensus: true, cabinMode: 'shared' })
            store.logEvent('Manual: Sarah added.')
          }} />
          <Btn label="+ Unrecognized" active={hasAlex} onClick={() => {
            store.addOccupant(alex)
            store.setMicrocopy('Rear seat occupied. No profile linked.')
            store.setActiveBlend({ cabinMode: 'partial' })
            store.logEvent('Manual: unrecognized occupant detected.')
          }} />
          <Btn label="Clear rear seat" active={false} onClick={() => {
            store.removeOccupant('alex')
            store.setMicrocopy('Rear seat cleared.')
            store.setActiveBlend({ cabinMode: hasSarah ? 'shared' : 'personal' })
            store.logEvent('Manual: rear seat cleared.')
          }} />
          <Btn label="Corporate" active={context.zone === 'corporate'} variant="amber" onClick={() => {
            store.setContext({ zone: 'corporate', location: 'Approaching BMW HQ' })
            store.setMicrocopy('Corporate zone. Calendar and health data restricted.')
            store.setActiveBlend({ ambientLight: { kelvin: 5000, brightness: 80, sources: ['Zone policy'] }, cabinMode: 'corporate', focusMode: true, focusReason: 'Corporate zone — Design Review at 9:00' })
            store.logEvent('Manual: corporate zone.')
          }} />
          <Btn label="Exit corporate" active={false} variant="amber" onClick={() => {
            store.setContext({ zone: 'personal', location: 'Schoneberg, Berlin' })
            store.setMicrocopy('Cabin returned to personal profile.')
            store.setActiveBlend({ ambientLight: { kelvin: hasSarah ? 3850 : 3200, brightness: 63, sources: hasSarah ? ['Dylan', 'Sarah'] : ['Dylan'] }, cabinMode: hasSarah ? 'shared' : 'personal' })
            store.logEvent('Manual: exited corporate zone.')
          }} />
        </div>
      </div>

      {/* Active blend */}
      <div>
        <div className="text-white/25 font-mono uppercase tracking-widest text-xs mb-2">Active Blend</div>
        <div className="font-mono text-xs space-y-1">
          <div className="text-white/40">light: <span className="text-white/60">{blend.ambientLight.kelvin}K — {kelvinLabel(blend.ambientLight.kelvin)}</span></div>
          <div className="text-white/40">climate: <span className="text-white/60">{blend.climate}°C</span>{blend.climateSources.length > 1 && <span className="text-white/20"> ({blend.climateSources.map(t => `${t}°`).join(' + ')} avg)</span>}</div>
          <div className="text-white/40">nav: <span className="text-white/60">{blend.navigation}</span>{blend.navigationConsensus && <span className="text-white/20"> (consensus)</span>}</div>
          <div className="text-white/40">focus: <span className={blend.focusMode ? 'text-white/60' : 'text-white/25'}>{blend.focusMode ? blend.focusReason : 'off'}</span></div>
          <div className="text-white/40">mode: <span className={context.zone === 'corporate' ? 'text-amber-400/70' : 'text-white/60'}>{blend.cabinMode}</span></div>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <div className="text-white/25 font-mono uppercase tracking-widest text-xs mb-2">Timeline</div>
        {TIMELINE.filter(t => t.label).map((t) => (
          <div key={t.time} className={`flex items-center gap-2 text-xs mb-0.5 ${loopTime >= t.time ? 'text-white/50' : 'text-white/20'}`}>
            <span className="font-mono w-7">{t.time}s</span>
            <span>{t.label}</span>
            {loopTime >= t.time && <span className="text-white/15">&#10003;</span>}
          </div>
        ))}
      </div>

      {/* Loop */}
      <div>
        <div className="text-white/25 font-mono uppercase tracking-widest text-xs mb-2">Loop</div>
        <div className="flex gap-2">
          <Btn label={mode === 'auto' ? 'Pause' : 'Resume'} active={mode === 'manual'} onClick={() => store.setMode(mode === 'auto' ? 'manual' : 'auto')} />
          <Btn label="Reset" active={false} onClick={() => { store.reset(); store.setMode('auto') }} />
        </div>
      </div>

      {/* Audio */}
      <div>
        <div className="text-white/25 font-mono uppercase tracking-widest text-xs mb-2">Audio</div>
        <Btn label={audioEnabled ? 'Mute' : 'Unmute'} active={audioEnabled} onClick={() => {
          const next = !audioEnabled
          store.setAudioEnabled(next)
          audioManager.setEnabled(next)
        }} />
      </div>
    </div>
  )
}
