import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../state/store'
import { tween } from '../lib/easing'
import { GooFilter } from '../lib/metaballs.tsx'
import { PersonaId } from '../state/personas'
import { kelvinToHex } from '../lib/kelvin'

type CirclePosition = { cx: number; cy: number }

function getPositions(pairedCount: number, width: number, height: number): Record<PersonaId, CirclePosition> {
  const cx = width / 2
  const cy = height / 2
  const spread = Math.min(width * 0.2, 140)

  return {
    dylan: {
      cx: pairedCount === 1 ? cx : cx - spread,
      cy,
    },
    sarah: {
      cx: cx + spread,
      cy,
    },
    alex: {
      // Alex (present_only) sits slightly separate, to the side — not merged
      cx: cx + spread * 0.3,
      cy: cy + spread * 0.7,
    },
  }
}

const RADII: Record<string, number> = {
  owner: 115,
  paired_guest: 105,
  present_only: 60,  // smaller — less data presence
}

export function TrustCircles({ width, height }: { width: number; height: number }) {
  const occupants = useStore((s) => s.occupants)
  const context = useStore((s) => s.context)
  const blend = useStore((s) => s.activeBlend)

  const pairedCount = occupants.filter(o => o.role !== 'present_only').length
  const positions = getPositions(pairedCount, width, height)
  const isCorporate = context.zone === 'corporate'

  // Ambient glow color from blended Kelvin
  const glowColor = kelvinToHex(blend.ambientLight.kelvin)

  // Ordered: owner first, then guests
  const orderedOccupants = [
    ...occupants.filter((o) => o.role === 'owner'),
    ...occupants.filter((o) => o.role === 'paired_guest'),
    ...occupants.filter((o) => o.role === 'present_only'),
  ]

  return (
    <svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }}>
      <GooFilter />

      {/* Ambient glow behind circles — shifts with Kelvin temperature */}
      <motion.ellipse
        cx={width / 2}
        cy={height / 2}
        rx={Math.min(width * 0.35, 280)}
        ry={Math.min(height * 0.4, 200)}
        fill={glowColor}
        animate={{ fill: glowColor, opacity: pairedCount >= 2 ? 0.04 : 0.025 }}
        transition={tween(1.2)}
        style={{ filter: 'blur(40px)' }}
      />

      {/* Metaball group — only paired personas */}
      <g filter="url(#goo)">
        <AnimatePresence>
          {orderedOccupants
            .filter(o => o.role !== 'present_only')
            .map((persona) => {
              const pos = positions[persona.id]
              const radius = RADII[persona.role] ?? 100
              const opacity = isCorporate ? 0.13 : 0.22

              return (
                <motion.circle
                  key={persona.id}
                  cx={pos.cx}
                  cy={pos.cy}
                  r={radius}
                  fill={persona.color}
                  fillOpacity={opacity}
                  stroke={persona.color}
                  strokeWidth={1.5}
                  strokeOpacity={isCorporate ? 0.25 : 0.6}
                  initial={{ r: 0, fillOpacity: 0, strokeOpacity: 0 }}
                  animate={{ cx: pos.cx, cy: pos.cy, r: radius, fillOpacity: opacity, strokeOpacity: isCorporate ? 0.25 : 0.6 }}
                  exit={{ r: 0, fillOpacity: 0, strokeOpacity: 0 }}
                  transition={tween(persona.role === 'owner' ? 0.3 : 0.7)}
                />
              )
            })}
        </AnimatePresence>
      </g>

      {/* Alex (present_only) — outside goo filter, dashed, clearly separate */}
      <AnimatePresence>
        {orderedOccupants
          .filter(o => o.role === 'present_only')
          .map((persona) => {
            const pos = positions[persona.id]
            const radius = RADII.present_only

            return (
              <g key={persona.id}>
                {/* Dashed ring */}
                <motion.circle
                  cx={pos.cx}
                  cy={pos.cy}
                  r={radius}
                  fill="rgba(138,155,176,0.04)"
                  stroke="rgba(138,155,176,0.3)"
                  strokeWidth={1}
                  strokeDasharray="4 5"
                  initial={{ r: 0, opacity: 0 }}
                  animate={{ r: radius, opacity: 1 }}
                  exit={{ r: 0, opacity: 0 }}
                  transition={tween(0.7)}
                />
                {/* Question mark / scan glyph */}
                <motion.text
                  x={pos.cx}
                  y={pos.cy + 4}
                  textAnchor="middle"
                  fill="rgba(138,155,176,0.4)"
                  fontSize="14"
                  fontFamily="IBM Plex Mono, monospace"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={tween(0.5)}
                >
                  ?
                </motion.text>
              </g>
            )
          })}
      </AnimatePresence>

      {/* Labels for paired personas */}
      <AnimatePresence>
        {orderedOccupants
          .filter(o => o.role !== 'present_only')
          .map((persona) => {
            const pos = positions[persona.id]
            const radius = RADII[persona.role] ?? 100
            const labelY = pos.cy + radius + 22

            return (
              <motion.g
                key={`label-${persona.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: isCorporate ? 0.3 : 0.55 }}
                exit={{ opacity: 0 }}
                transition={tween(0.5)}
              >
                <text
                  x={pos.cx}
                  y={labelY}
                  textAnchor="middle"
                  fill={persona.color}
                  fontSize="10"
                  fontFamily="Inter, sans-serif"
                  fontWeight="400"
                  letterSpacing="2.5"
                >
                  {persona.name.toUpperCase()}
                </text>
                <text
                  x={pos.cx}
                  y={labelY + 13}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.2)"
                  fontSize="8"
                  fontFamily="IBM Plex Mono, monospace"
                  letterSpacing="1"
                >
                  {persona.linkedVia ?? ''}
                </text>
              </motion.g>
            )
          })}
      </AnimatePresence>

      {/* Label for present_only */}
      <AnimatePresence>
        {orderedOccupants
          .filter(o => o.role === 'present_only')
          .map((persona) => {
            const pos = positions[persona.id]
            const radius = RADII.present_only

            return (
              <motion.g
                key={`label-present-${persona.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={tween(0.5)}
              >
                <text
                  x={pos.cx}
                  y={pos.cy + radius + 16}
                  textAnchor="middle"
                  fill="rgba(138,155,176,0.45)"
                  fontSize="9"
                  fontFamily="IBM Plex Mono, monospace"
                  letterSpacing="1.5"
                >
                  REAR SEAT
                </text>
                <text
                  x={pos.cx}
                  y={pos.cy + radius + 28}
                  textAnchor="middle"
                  fill="rgba(138,155,176,0.25)"
                  fontSize="8"
                  fontFamily="IBM Plex Mono, monospace"
                  letterSpacing="0.5"
                >
                  no profile linked
                </text>
              </motion.g>
            )
          })}
      </AnimatePresence>
    </svg>
  )
}
