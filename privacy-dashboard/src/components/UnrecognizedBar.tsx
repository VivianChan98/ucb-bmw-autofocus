import { motion } from 'framer-motion'
import { tween } from '../lib/easing'
import { useStore } from '../state/store'

export function UnrecognizedBar() {
  const blend = useStore((s) => s.activeBlend)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={tween(0.5)}
      className="mx-6 mb-2 rounded-xl border px-4 py-2.5 flex items-center justify-between"
      style={{
        borderColor: 'rgba(138,155,176,0.2)',
        background: 'rgba(138,155,176,0.04)',
        borderStyle: 'dashed',
      }}
    >
      <div className="flex items-center gap-3">
        {/* Pulse dot */}
        <div className="relative w-2 h-2 shrink-0">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: '#8A9BB0' }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-white/40">
            Rear seat — occupant detected
          </span>
          <span className="font-mono text-white/20" style={{ fontSize: '9px' }}>
            No profile linked. Presence via seat sensor.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="flex flex-col items-end">
          <span className="font-mono text-white/20" style={{ fontSize: '9px' }}>LIGHT</span>
          <span className="text-xs text-white/35">cabin default</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-mono text-white/20" style={{ fontSize: '9px' }}>CLIMATE</span>
          <span className="text-xs text-white/35">{blend.climate}°C (cabin avg)</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-mono text-white/20" style={{ fontSize: '9px' }}>PREFERENCES</span>
          <span className="text-xs text-white/25 font-mono">none available</span>
        </div>
      </div>
    </motion.div>
  )
}
