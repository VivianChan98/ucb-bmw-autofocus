import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../state/store'
import { tween } from '../lib/easing'
import { kelvinToHex, kelvinLabel } from '../lib/kelvin'

function Tile({
  label,
  value,
  sub,
  accent,
  swatch,
}: {
  label: string
  value: string
  sub?: string
  accent?: string
  swatch?: string   // a CSS color to show as a small dot
}) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/6 bg-white/2 flex-1 min-w-0">
      {swatch && (
        <motion.div
          className="w-3 h-3 rounded-full shrink-0"
          animate={{ backgroundColor: swatch, boxShadow: `0 0 6px ${swatch}` }}
          transition={tween(0.8)}
        />
      )}
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-white/20 font-mono tracking-widest" style={{ fontSize: '9px' }}>
          {label.toUpperCase()}
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={value}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={tween(0.35)}
            className="text-xs font-medium truncate"
            style={{ color: accent ?? 'rgba(255,255,255,0.65)' }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
        {sub && (
          <AnimatePresence mode="wait">
            <motion.span
              key={sub}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={tween(0.4)}
              className="text-white/20 font-mono truncate leading-tight"
              style={{ fontSize: '9px' }}
            >
              {sub}
            </motion.span>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

export function OutputStrip() {
  const blend = useStore((s) => s.activeBlend)
  const context = useStore((s) => s.context)
  const occupants = useStore((s) => s.occupants)

  const isCorporate = context.zone === 'corporate'
  const hasMultiple = occupants.filter(o => o.role !== 'present_only').length >= 2

  const lightColor = kelvinToHex(blend.ambientLight.kelvin)
  const lightLabel = `${blend.ambientLight.kelvin}K — ${kelvinLabel(blend.ambientLight.kelvin)}`
  const lightSub = blend.ambientLight.sources.length > 1
    ? `${blend.ambientLight.sources.join(' + ')}`
    : blend.ambientLight.sources[0] ?? ''

  const climateSub = blend.climateSources.length > 1
    ? blend.climateSources.map(t => `${t}°`).join(' + ') + ` avg`
    : undefined

  const modeValue = blend.cabinMode === 'corporate'
    ? 'Corporate'
    : blend.cabinMode === 'shared'
      ? 'Shared personal'
      : blend.cabinMode === 'partial'
        ? 'Shared + unrecognized'
        : 'Personal'

  const modeAccent = isCorporate
    ? 'rgba(212,180,71,0.7)'
    : blend.cabinMode === 'partial'
      ? 'rgba(138,155,176,0.6)'
      : hasMultiple
        ? 'rgba(255,255,255,0.6)'
        : 'rgba(255,255,255,0.4)'

  const focusSub = blend.focusMode ? blend.focusReason : undefined

  return (
    <div className="px-6 pb-2 flex gap-2">
      <Tile
        label="Ambient"
        value={lightLabel}
        sub={`via ${lightSub}`}
        accent={lightColor}
        swatch={lightColor}
      />
      <Tile
        label="Climate"
        value={isCorporate ? 'Auto' : `${blend.climate}°C`}
        sub={isCorporate ? undefined : climateSub}
      />
      <Tile
        label="Navigation"
        value={blend.navigation}
        sub={blend.navigationConsensus ? 'shared destination' : undefined}
        accent={blend.navigationConsensus ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.4)'}
      />
      <Tile
        label="Cabin mode"
        value={modeValue}
        sub={focusSub}
        accent={modeAccent}
      />
    </div>
  )
}
