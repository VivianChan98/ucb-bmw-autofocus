import { motion } from 'framer-motion'
import { tween } from '../lib/easing'

type DataStreamProps = {
  label: string
  value: string
  accent?: string
  conflicted?: boolean
  delay?: number
}

export function DataStream({ label, value, accent, conflicted, delay = 0 }: DataStreamProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.95 }}
      animate={
        conflicted
          ? { opacity: [1, 0.25, 1, 0.25, 1], scale: 1 }
          : { opacity: 1, y: 0, scale: 1 }
      }
      exit={{ opacity: 0, y: 12, scale: 0.9 }}
      transition={
        conflicted
          ? { duration: 0.7, times: [0, 0.25, 0.5, 0.75, 1] }
          : tween(0.4)
      }
      style={{ transitionDelay: `${delay}s` }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/8 backdrop-blur-sm"
    >
      <span className="text-white/35 text-xs font-mono tracking-widest uppercase">
        {label}
      </span>
      <span
        className="text-xs font-medium tracking-wide"
        style={{ color: accent ?? 'rgba(255,255,255,0.75)' }}
      >
        {value}
      </span>
    </motion.div>
  )
}
