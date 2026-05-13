import { motion, AnimatePresence } from 'framer-motion'
import { Persona } from '../state/personas'
import { useStore } from '../state/store'
import { tween } from '../lib/easing'
import { kelvinToHex, kelvinLabel } from '../lib/kelvin'

type PersonaCardProps = {
  persona: Persona
  side: 'left' | 'right'
}

function Row({ label, value, sub, accent, hidden }: {
  label: string
  value: string
  sub?: string
  accent?: string
  hidden?: boolean
}) {
  return (
    <AnimatePresence mode="wait">
      {!hidden && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
          animate={{ opacity: 1, height: 'auto', marginBottom: 2 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={tween(0.35)}
          className="overflow-hidden"
        >
          <div className={`flex items-start justify-between gap-2 ${side === 'right' ? 'flex-row-reverse' : ''}`}>
            <span className="text-white/20 font-mono shrink-0" style={{ fontSize: '9px', letterSpacing: '0.1em' }}>
              {label.toUpperCase()}
            </span>
            <div className={`flex flex-col ${side === 'right' ? 'items-end' : 'items-start'}`}>
              <span className="text-xs font-medium leading-tight" style={{ color: accent ?? 'rgba(255,255,255,0.65)' }}>
                {value}
              </span>
              {sub && (
                <span className="text-white/20 font-mono leading-tight" style={{ fontSize: '9px' }}>
                  {sub}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// module-level variable needed for JSX prop
let side: 'left' | 'right' = 'left'

export function PersonaCard({ persona, side: sideProp }: PersonaCardProps) {
  side = sideProp
  const context = useStore((s) => s.context)
  const isCorporate = context.zone === 'corporate'
  const isRight = sideProp === 'right'

  const lightColor = persona.data ? kelvinToHex(persona.data.ambientLight.kelvin) : '#888'
  const lightLabel = persona.data ? `${persona.data.ambientLight.kelvin}K — ${kelvinLabel(persona.data.ambientLight.kelvin)}` : null

  return (
    <motion.div
      initial={{ opacity: 0, x: isRight ? 16 : -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isRight ? 16 : -16 }}
      transition={tween(0.55)}
      className="w-full rounded-xl border px-3.5 py-3"
      style={{
        borderColor: `${persona.color}20`,
        background: `linear-gradient(${isRight ? '225deg' : '135deg'}, ${persona.color}0A 0%, transparent 100%)`,
      }}
    >
      {/* Header */}
      <div className={`flex items-center gap-2 mb-2.5 ${isRight ? 'flex-row-reverse' : ''}`}>
        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: persona.color }} />
        <div className={`flex flex-col ${isRight ? 'items-end' : 'items-start'} flex-1`}>
          <span className="text-xs font-medium tracking-wider" style={{ color: persona.color }}>
            {persona.name}
          </span>
          <span className="text-white/20 font-mono" style={{ fontSize: '9px' }}>
            {persona.linkedVia ?? 'no profile'} · {persona.seat}
          </span>
        </div>
      </div>

      <div className="border-t border-white/5 pt-2 flex flex-col gap-1">

        {/* Ambient light */}
        {lightLabel && (
          <div className={`flex items-center gap-1.5 ${isRight ? 'flex-row-reverse' : ''}`}>
            <span className="text-white/20 font-mono shrink-0" style={{ fontSize: '9px', letterSpacing: '0.1em' }}>
              LIGHT
            </span>
            <div className={`flex items-center gap-1.5 flex-1 ${isRight ? 'flex-row-reverse' : ''}`}>
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: lightColor, boxShadow: `0 0 4px ${lightColor}` }}
              />
              <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {lightLabel}
              </span>
            </div>
          </div>
        )}

        {/* Climate */}
        {persona.data && (
          <Row
            label="Climate"
            value={`${persona.data.climate.tempPref}°C`}
            accent="rgba(255,255,255,0.6)"
          />
        )}

        {/* Calendar — hidden in corporate */}
        {persona.data?.calendar && (
          <Row
            label="Calendar"
            value={persona.data.calendar.event}
            sub={`${persona.data.calendar.time} · ${persona.data.calendar.location}`}
            accent={`${persona.color}cc`}
            hidden={isCorporate}
          />
        )}

        {/* Focus mode */}
        {persona.data?.focus?.active && (
          <Row
            label="Focus"
            value={persona.data.focus.reason}
            accent="rgba(255,255,255,0.45)"
            hidden={isCorporate}
          />
        )}

        {/* Navigation */}
        {persona.data?.navigation && (
          <Row
            label="Route"
            value={persona.data.navigation.destination}
            sub={persona.data.navigation.note}
          />
        )}

        {/* Corporate restriction notice */}
        {isCorporate && persona.data?.calendar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={tween(0.4)}
            className={`flex ${isRight ? 'justify-end' : 'justify-start'} mt-0.5`}
          >
            <span className="text-amber-500/40 font-mono" style={{ fontSize: '9px' }}>
              calendar restricted
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
