import { useEffect, useRef, useState } from 'react'
import '@tensorflow/tfjs'
import * as cocoSsd from '@tensorflow-models/coco-ssd'
import { useStore } from '../state/store'
import { sarah, alex } from '../state/personas'
import type { Persona } from '../state/personas'

export type DetectionStatus = 'idle' | 'loading' | 'ready' | 'error'

const CONFIDENCE = 0.5
const DEBOUNCE_MS = 1500
const INTERVAL_MS = 250

// Order determines which guest is added first, second, etc.
const GUEST_ROSTER: Persona[] = [sarah, alex]

export function usePersonDetection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [count, setCount] = useState(0)
  const [status, setStatus] = useState<DetectionStatus>('idle')

  const committed = useRef(-1)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasSwitched = useRef(false)
  const raf = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const lastRun = useRef(0)
  const pendingN = useRef(-1)

  useEffect(() => {
    let alive = true

    function onDetected(n: number) {
      if (n === pendingN.current) return      // same value — leave timer running
      pendingN.current = n                    // new value — update and reset timer
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
      debounceTimer.current = setTimeout(() => {
        if (!alive) return
        if (n === committed.current) return
        console.log('[PersonDetection] Count committed:', n, '(was', committed.current, ')')
        committed.current = n
        setCount(n)

        const s = useStore.getState()

        // First count change switches the scenario loop to manual
        if (!hasSwitched.current) {
          s.setMode('manual')
          hasSwitched.current = true
          s.logEvent('Webcam active. Scenario paused.')
        }

        syncGuests(n, s)
      }, DEBOUNCE_MS)
    }

    async function run() {
      setStatus('loading')
      try {
        const model = await cocoSsd.load({ modelUrl: '/models/coco-ssd/model.json' })
        console.log('[PersonDetection] Model loaded OK')
        if (!alive) return

        const media = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 320 }, height: { ideal: 240 } },
        })
        if (!alive) { media.getTracks().forEach((t) => t.stop()); return }

        streamRef.current = media
        const video = videoRef.current
        if (!video) { media.getTracks().forEach((t) => t.stop()); return }

        video.srcObject = media
        await video.play()
        if (!alive) return

        setStatus('ready')

        let detecting = false

        function tick(now: number) {
          if (!alive) return
          raf.current = requestAnimationFrame(tick)
          if (now - lastRun.current < INTERVAL_MS) return
          if (detecting) return
          lastRun.current = now
          const v = videoRef.current
          if (!v || v.readyState < 2) return
          detecting = true
          model
            .detect(v)
            .then((results) => {
              detecting = false
              if (!alive) return
              const n = results.filter(
                (r) => r.class === 'person' && r.score > CONFIDENCE
              ).length
              console.log('[PersonDetection] Raw results:', results.map(r => `${r.class} ${(r.score * 100).toFixed(0)}%`), '→ persons above threshold:', n)
              onDetected(n)
            })
            .catch(() => { detecting = false })
        }

        raf.current = requestAnimationFrame(tick)
      } catch {
        if (alive) setStatus('error')
      }
    }

    run()

    return () => {
      alive = false
      if (raf.current) cancelAnimationFrame(raf.current)
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  return { count, status, videoRef }
}

function syncGuests(detected: number, s: ReturnType<typeof useStore.getState>) {
  // Dylan is always the driver; subtract 1 to get guest count
  const guestTarget = Math.min(Math.max(detected - 1, 0), GUEST_ROSTER.length)
  const currentGuests = s.occupants.filter((o) => o.id !== 'dylan')

  if (currentGuests.length < guestTarget) {
    for (let i = currentGuests.length; i < guestTarget; i++) {
      const g = GUEST_ROSTER[i]!
      console.log('[PersonDetection] addOccupant →', g.name)
      s.addOccupant({ ...g, connectedAt: Date.now() })
      s.setMicrocopy(
        i === 0
          ? 'Guest detected. Merging cabin preferences.'
          : 'Second guest detected. Updating cabin blend.'
      )
      s.logEvent(`Webcam: ${g.name} added.`)
    }
  } else if (currentGuests.length > guestTarget) {
    // Remove most recently added guest(s) first
    const byRecent = [...currentGuests].sort((a, b) => b.connectedAt - a.connectedAt)
    byRecent.slice(0, currentGuests.length - guestTarget).forEach((p) => {
      console.log('[PersonDetection] removeOccupant →', p.name)
      s.removeOccupant(p.id)
      s.setMicrocopy(`${p.name} left. Cabin updated.`)
      s.logEvent(`Webcam: ${p.name} removed.`)
    })
  }
}
