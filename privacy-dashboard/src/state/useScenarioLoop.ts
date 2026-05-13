import { useEffect, useRef } from 'react'
import { useStore } from './store'
import { TIMELINE, LOOP_DURATION } from './scenario'

export function useScenarioLoop() {
  const mode = useStore((s) => s.mode)
  const loopTime = useStore((s) => s.loopTime)
  const setLoopTime = useStore((s) => s.setLoopTime)
  const store = useStore()

  const lastRealTime = useRef<number | null>(null)
  const firedRef = useRef<Set<number>>(new Set())
  const rafRef = useRef<number>(0)
  const loopTimeRef = useRef(loopTime)

  loopTimeRef.current = loopTime

  useEffect(() => {
    if (mode !== 'auto') {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      lastRealTime.current = null
      return
    }

    firedRef.current = new Set()

    const tick = (now: number) => {
      if (lastRealTime.current === null) {
        lastRealTime.current = now
      }

      const delta = (now - lastRealTime.current) / 1000
      lastRealTime.current = now

      const prev = loopTimeRef.current
      let next = prev + delta

      if (next >= LOOP_DURATION) {
        next = 0
        firedRef.current = new Set()
        store.reset()
      }

      setLoopTime(next)

      for (const entry of TIMELINE) {
        if (entry.time > 0 && prev < entry.time && next >= entry.time && !firedRef.current.has(entry.time)) {
          firedRef.current.add(entry.time)
          entry.action(store)
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      lastRealTime.current = null
    }
  }, [mode, setLoopTime, store])
}
