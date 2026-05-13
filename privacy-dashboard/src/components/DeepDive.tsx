import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../state/store'
import { ControlPanel } from './ControlPanel'
import { tween } from '../lib/easing'

export function DeepDive() {
  const open = useStore((s) => s.deepDiveOpen)
  const setOpen = useStore((s) => s.setDeepDiveOpen)

  return (
    <>
      {/* Swipe hint */}
      <motion.div
        className="flex flex-col items-center gap-1 pb-3 cursor-pointer select-none"
        onClick={() => setOpen(true)}
        animate={{ opacity: open ? 0 : 1 }}
        transition={tween(0.3)}
      >
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          className="text-white/15 text-xs"
        >
          &#8963;
        </motion.div>
        <span className="text-white/15 font-mono text-xs tracking-widest">DEEP DIVE</span>
      </motion.div>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={tween(0.45)}
            className="absolute inset-x-0 bottom-0 z-50"
            style={{ height: '72%' }}
          >
            <div className="w-full h-full bg-[#0D1118]/95 backdrop-blur-lg border-t border-white/8 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-4 border-b border-white/5">
                <span className="font-mono text-xs text-white/25 tracking-widest uppercase">Deep Dive</span>
                <button
                  onClick={() => setOpen(false)}
                  className="text-white/25 hover:text-white/50 transition-colors font-mono text-xs tracking-widest"
                >
                  CLOSE
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-8 py-5 scrollbar-none">
                <ControlPanel />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
