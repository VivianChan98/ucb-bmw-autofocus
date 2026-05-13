import { useRef, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../state/store'
import { DeepDive } from './DeepDive'
import { AutoHMI } from './AutoHMI'
import { SharedExperience } from './SharedExperience'
import { useScenarioLoop } from '../state/useScenarioLoop'
import { audioManager } from '../lib/audio'
import { usePersonDetection } from '../hooks/usePersonDetection'
import { PersonCounterBadge } from './PersonCounterBadge'
import { useSharedSession } from '../state/sharedSession'

export function CID() {
  useScenarioLoop()

  const { count, status, videoRef } = usePersonDetection()

  useEffect(() => {
    useSharedSession.getState().setWebcamCount(count)
  }, [count])

  const setDeepDiveOpen = useStore((s) => s.setDeepDiveOpen)
  const deepDiveOpen = useStore((s) => s.deepDiveOpen)
  const reset = useStore((s) => s.reset)
  const setMode = useStore((s) => s.setMode)

  const [sharedView, setSharedView] = useState(false)

  const touchStartY = useRef<number | null>(null)
  const cursorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [cursorHidden, setCursorHidden] = useState(false)
  const audioStarted = useRef(false)

  useEffect(() => {
    const resetTimer = () => {
      setCursorHidden(false)
      if (cursorTimerRef.current) clearTimeout(cursorTimerRef.current)
      cursorTimerRef.current = setTimeout(() => setCursorHidden(true), 3000)
    }
    document.addEventListener('mousemove', resetTimer)
    document.addEventListener('touchstart', resetTimer)
    resetTimer()
    return () => {
      document.removeEventListener('mousemove', resetTimer)
      document.removeEventListener('touchstart', resetTimer)
      if (cursorTimerRef.current) clearTimeout(cursorTimerRef.current)
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'R') { reset(); setMode('auto') }
      if (e.key === 'Escape') {
        if (sharedView) setSharedView(false)
        else if (deepDiveOpen) setDeepDiveOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [reset, setMode, deepDiveOpen, setDeepDiveOpen, sharedView])

  useEffect(() => {
    let hiddenAt: number | null = null
    const onVisibility = () => {
      if (document.hidden) { hiddenAt = Date.now() }
      else if (hiddenAt && Date.now() - hiddenAt > 5000) { reset(); setMode('auto'); hiddenAt = null }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [reset, setMode])

  const startAudio = () => {
    if (!audioStarted.current) { audioManager.startAmbient(); audioStarted.current = true }
  }

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0]?.clientY ?? null
    startAudio()
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return
    const dy = touchStartY.current - (e.changedTouches[0]?.clientY ?? 0)
    if (dy > 50 && !deepDiveOpen && !sharedView) setDeepDiveOpen(true)
    touchStartY.current = null
  }
  const onMouseDown = (e: React.MouseEvent) => {
    touchStartY.current = e.clientY
    startAudio()
  }
  const onMouseUp = (e: React.MouseEvent) => {
    if (touchStartY.current === null) return
    const dy = touchStartY.current - e.clientY
    if (dy > 40 && !deepDiveOpen && !sharedView) setDeepDiveOpen(true)
    touchStartY.current = null
  }

  return (
    <div
      className="w-full h-full flex flex-col relative overflow-hidden select-none"
      style={{
        background: '#090C13',
        cursor: cursorHidden ? 'none' : 'default',
      }}
      onContextMenu={(e) => e.preventDefault()}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      {/* Hidden webcam feed for person detection */}
      <video ref={videoRef} playsInline muted style={{ display: 'none' }} />

      {/* Person counter badge */}
      <PersonCounterBadge count={count} status={status} />

      {/* Main HMI screen */}
      <AutoHMI onOpenShared={() => setSharedView(true)} />

      {/* Deep Dive overlay (swipe-up) */}
      <DeepDive />

      {/* Shared Experience overlay */}
      <AnimatePresence>
        {sharedView && (
          <motion.div
            key="shared-exp"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', inset: 0, zIndex: 200 }}
          >
            <SharedExperience onClose={() => setSharedView(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
