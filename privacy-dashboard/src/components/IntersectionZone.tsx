import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../state/store'
import { tween } from '../lib/easing'
import { kelvinToHex, kelvinLabel } from '../lib/kelvin'

function BlendRow({
  label,
  leftVal,
  leftColor,
  rightVal,
  rightColor,
  result,
  resultAccent,
  hidden,
  delay,
}: {
  label: string
  leftVal: string
  leftColor: string
  rightVal?: string
  rightColor?: string
  result: string
  resultAccent?: string
  hidden?: boolean
  delay?: number
}) {
  if (hidden) return null
  const hasBoth = !!rightVal

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ ...tween(0.4), delay: delay ?? 0 }}
      className="flex flex-col items-center gap-0.5"
    >
      <span className="font-mono text-white/20" style={{ fontSize: '9px', letterSpacing: '0.1em' }}>
        {label.toUpperCase()}
      </span>
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        <span className="text-xs font-medium" style={{ color: leftColor }}>{leftVal}</span>
        {hasBoth && (
          <>
            <span className="text-white/15 font-mono text-xs">+</span>
            <span className="text-xs font-medium" style={{ color: rightColor }}>{rightVal}</span>
            <span className="text-white/15 font-mono text-xs">=</span>
          </>
        )}
        <span
          className="text-xs font-semibold px-1.5 py-0.5 rounded"
          style={{
            color: resultAccent ?? 'rgba(255,255,255,0.8)',
            background: 'rgba(255,255,255,0.06)',
          }}
        >
          {result}
        </span>
      </div>
    </motion.div>
  )
}

export function IntersectionZone() {
  const occupants = useStore((s) => s.occupants)
  const blend = useStore((s) => s.activeBlend)
  const context = useStore((s) => s.context)
  const conflicts = useStore((s) => s.conflicts)

  const hasMultiple = occupants.filter(o => o.role !== 'present_only').length >= 2
  const isCorporate = context.zone === 'corporate'
  const isPartial = blend.cabinMode === 'partial'

  const dylan = occupants.find((o) => o.id === 'dylan')
  const sarah = occupants.find((o) => o.id === 'sarah')

  if (!hasMultiple) return null

  const blendedLightColor = kelvinToHex(blend.ambientLight.kelvin)
  const blendedLightLabel = `${blend.ambientLight.kelvin}K — ${kelvinLabel(blend.ambientLight.kelvin)}`

  const dylanLightLabel = dylan?.data ? `${dylan.data.ambientLight.kelvin}K` : ''
  const sarahLightLabel = sarah?.data ? `${sarah.data.ambientLight.kelvin}K` : ''

  const dylanTempLabel = dylan?.data ? `${dylan.data.climate.tempPref}°` : ''
  const sarahTempLabel = sarah?.data ? `${sarah.data.climate.tempPref}°` : ''

  const hasConflict = conflicts.length > 0

  return (
    <AnimatePresence>
      <motion.div
        key="intersection"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={tween(0.6)}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
      >
        <div
          className="flex flex-col items-center gap-3 px-5 py-4 rounded-2xl"
          style={{
            background: 'rgba(10,14,20,0.78)',
            backdropFilter: 'blur(16px)',
            border: `1px solid ${hasConflict ? 'rgba(138,155,176,0.25)' : isCorporate ? 'rgba(212,180,71,0.2)' : 'rgba(255,255,255,0.07)'}`,
            minWidth: '200px',
          }}
        >
          <span
            className="font-mono tracking-widest"
            style={{
              fontSize: '9px',
              color: hasConflict ? 'rgba(138,155,176,0.6)' : isCorporate ? 'rgba(212,180,71,0.5)' : 'rgba(255,255,255,0.2)',
              letterSpacing: '0.15em',
            }}
          >
            {hasConflict ? 'PARTIAL BLEND' : isCorporate ? 'CORPORATE MODE' : 'SHARED CABIN'}
          </span>

          <div className="flex flex-col gap-3 w-full">
            {/* Ambient light */}
            <BlendRow
              label="Ambient light"
              leftVal={dylanLightLabel}
              leftColor={dylan?.color ?? '#4A90E2'}
              rightVal={sarahLightLabel}
              rightColor={sarah?.color}
              result={isCorporate ? '5000K — Cool white' : blendedLightLabel}
              resultAccent={blendedLightColor}
              delay={0}
            />

            {/* Climate */}
            <AnimatePresence>
              {dylanTempLabel && sarahTempLabel && (
                <BlendRow
                  key="climate"
                  label="Climate"
                  leftVal={dylanTempLabel}
                  leftColor={dylan?.color ?? '#4A90E2'}
                  rightVal={sarahTempLabel}
                  rightColor={sarah?.color}
                  result={`${blend.climate}°C`}
                  delay={0.05}
                />
              )}
            </AnimatePresence>

            {/* Navigation */}
            <AnimatePresence>
              {blend.navigationConsensus && (
                <motion.div
                  key="nav"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={tween(0.4)}
                  className="flex flex-col items-center gap-0.5"
                >
                  <span className="font-mono text-white/20" style={{ fontSize: '9px', letterSpacing: '0.1em' }}>DESTINATION</span>
                  <span className="text-xs font-medium text-white/65">
                    {blend.navigation}
                    <span className="text-white/25 font-mono ml-1.5" style={{ fontSize: '9px' }}>consensus</span>
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Focus / Schedule */}
            <AnimatePresence>
              {blend.focusMode && !hasConflict && (
                <motion.div
                  key="focus"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ ...tween(0.4), delay: 0.1 }}
                  className="flex flex-col items-center gap-0.5"
                >
                  <span className="font-mono text-white/20" style={{ fontSize: '9px', letterSpacing: '0.1em' }}>FOCUS</span>
                  <span className="text-xs font-medium" style={{ color: isCorporate ? 'rgba(212,180,71,0.7)' : 'rgba(255,255,255,0.5)' }}>
                    {blend.focusReason}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Partial blend notice */}
            <AnimatePresence>
              {isPartial && (
                <motion.div
                  key="partial"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={tween(0.4)}
                  className="flex items-center justify-center gap-1.5 pt-1 border-t border-white/5"
                >
                  <span
                    className="px-2 py-0.5 rounded font-mono"
                    style={{
                      fontSize: '9px',
                      color: 'rgba(138,155,176,0.6)',
                      border: '1px dashed rgba(138,155,176,0.2)',
                    }}
                  >
                    rear seat: no profile — defaults only
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
