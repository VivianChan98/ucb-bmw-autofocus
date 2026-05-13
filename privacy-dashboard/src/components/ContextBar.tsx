import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../state/store'
import { tween } from '../lib/easing'

export function ContextBar() {
  const context = useStore((s) => s.context)
  const isCorporate = context.zone === 'corporate'

  return (
    <div className="flex items-center justify-between px-8 py-3 border-b border-white/5">
      <span className="font-mono text-xs text-white/40 tracking-widest">
        {context.time}
      </span>

      <AnimatePresence mode="wait">
        <motion.span
          key={context.location}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={tween(0.4)}
          className="text-xs text-white/50 tracking-wide"
        >
          {context.location}
        </motion.span>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={context.zone}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={tween(0.4)}
          className={`text-xs font-medium tracking-widest px-3 py-1 rounded-full border ${
            isCorporate
              ? 'text-amber-400 border-amber-400/30 bg-amber-400/8'
              : 'text-white/30 border-white/10'
          }`}
        >
          {isCorporate ? 'Corporate Zone' : 'Personal'}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
