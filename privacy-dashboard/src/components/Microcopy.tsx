import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../state/store'
import { tween } from '../lib/easing'

export function Microcopy() {
  const microcopy = useStore((s) => s.microcopy)

  return (
    <div className="flex items-center justify-center px-8 py-4 min-h-[48px]">
      <AnimatePresence mode="wait">
        <motion.p
          key={microcopy}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={tween(0.4)}
          className="text-sm font-medium text-white/55 tracking-wide text-center"
        >
          {microcopy}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
