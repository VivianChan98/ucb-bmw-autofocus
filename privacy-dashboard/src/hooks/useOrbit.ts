import { useEffect, useRef, useState } from 'react'
import { SharedPersona } from '../state/sharedPersonas'

const PERSON_RING: Record<string, number> = { dylan: 0, sarah: 1, alex: 2, marcus: 3 }
const RING_FRACS = [0.20, 0.42, 0.62, 0.80]
const ORBIT_SPD: Record<string, number>  = { dylan: 0.50, sarah: 0.35, alex: 0.42, marcus: 0.28 }
const ORBIT_BASE: Record<string, number> = { dylan: 0, sarah: Math.PI * 0.8, alex: Math.PI * 1.5, marcus: Math.PI * 0.3 }

export const AVT_R    = 22
export const EDGE_PAD = 18

export type OrbitPositions = Record<string, { x: number; y: number }>

export function useOrbit(people: SharedPersona[], W: number, H: number, speed = 28): OrbitPositions {
  const tRef = useRef(0)
  const [pos, setPos] = useState<OrbitPositions>({})
  const key = people.map((p) => p.id).join(',')

  useEffect(() => {
    if (!W || !H) return
    const maxRx = W / 2 - AVT_R - EDGE_PAD
    const maxRy = H / 2 - AVT_R - EDGE_PAD
    let raf: number

    const tick = () => {
      tRef.current += 0.005 * (speed / 28)
      const n: OrbitPositions = {}
      people.forEach((p) => {
        const ring = PERSON_RING[p.id] ?? 1
        const frac = RING_FRACS[ring] ?? 0.5
        const a = (ORBIT_BASE[p.id] ?? 0) + tRef.current * (ORBIT_SPD[p.id] ?? 0.4)
        n[p.id] = { x: Math.cos(a) * maxRx * frac, y: Math.sin(a) * maxRy * frac }
      })
      setPos({ ...n })
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, W, H, speed])

  return pos
}

export { RING_FRACS, PERSON_RING }
