import { motion } from 'framer-motion'
import { useStore } from '../state/store'
import { TIMELINE, LOOP_DURATION } from '../state/scenario'
import { tween } from '../lib/easing'

const SCENE_MARKERS = TIMELINE.filter((t) => t.time > 0 && t.label !== '')

export function TimelineScrubber() {
  const loopTime = useStore((s) => s.loopTime)
  const mode = useStore((s) => s.mode)
  const store = useStore()
  const progress = Math.min(loopTime / LOOP_DURATION, 1)

  const handleMarkerClick = (time: number) => {
    if (mode !== 'manual') return
    const entry = TIMELINE.find((t) => t.time === time)
    if (entry) entry.action(store)
  }

  return (
    <div className="relative px-8 py-2 flex items-center">
      {/* Track */}
      <div className="relative w-full h-px bg-white/8">
        {/* Fill */}
        <motion.div
          className="absolute top-0 left-0 h-full"
          style={{ width: `${progress * 100}%`, background: 'rgba(255,255,255,0.2)' }}
          transition={tween(0.1)}
        />

        {/* Scene markers */}
        {SCENE_MARKERS.map((entry) => {
          const pos = (entry.time / LOOP_DURATION) * 100
          const isPast = loopTime >= entry.time
          const isActive = loopTime >= entry.time && loopTime < (SCENE_MARKERS.find(m => m.time > entry.time)?.time ?? LOOP_DURATION)

          return (
            <div
              key={entry.time}
              className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: `${pos}%`, transform: 'translate(-50%, -50%)' }}
            >
              {/* Label above */}
              <motion.span
                animate={{ opacity: isActive ? 0.7 : isPast ? 0.35 : 0.2 }}
                transition={tween(0.3)}
                className="absolute -top-5 text-xs font-mono tracking-widest whitespace-nowrap"
                style={{ color: isActive ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)', fontSize: '9px', letterSpacing: '0.1em' }}
              >
                {entry.label.toUpperCase()}
              </motion.span>

              {/* Dot */}
              <motion.div
                animate={{
                  scale: isActive ? 1.4 : 1,
                  opacity: isPast ? 1 : 0.3,
                  backgroundColor: isActive ? '#ffffff' : isPast ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)',
                }}
                transition={tween(0.3)}
                className="w-1.5 h-1.5 rounded-full cursor-pointer"
                onClick={() => handleMarkerClick(entry.time)}
                title={mode === 'manual' ? `Jump to: ${entry.label}` : undefined}
              />
            </div>
          )
        })}

        {/* Playhead */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white"
          style={{ left: `${progress * 100}%`, transform: 'translate(-50%, -50%)' }}
          transition={tween(0.1)}
        />
      </div>

      {/* Time display */}
      <span className="ml-4 text-white/20 font-mono text-xs shrink-0" style={{ fontSize: '10px' }}>
        {Math.floor(loopTime)}s
      </span>
    </div>
  )
}
