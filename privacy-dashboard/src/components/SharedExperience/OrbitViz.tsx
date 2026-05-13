import { useRef, useState, useEffect } from 'react'
import { SharedPersona, TemporalPersona } from '../../state/sharedPersonas'
import { useOrbit, AVT_R, EDGE_PAD, RING_FRACS, PERSON_RING } from '../../hooks/useOrbit'
import { useSharedSession } from '../../state/sharedSession'

// ─── Data depth model ────────────────────────────────────────────────────────
// Ring 0 = innermost = owner = full data access
// Ring 3 = outermost = peripheral = session only
// The closer to CABIN (center), the more data is shared.

const RING_TIER_LABELS = [
  'IDENTITY · BIOMETRICS',   // ring 0 — closest, full access
  'MUSIC · CLIMATE · CALENDAR',  // ring 1
  'NAVIGATION',              // ring 2
  'SESSION ONLY',            // ring 3 — furthest, minimal
]

// Filled data dots shown below each persona name
// More dots = more data shared = closer to cabin
const RING_DOT_COUNT  = [5, 4, 2, 1]
const DOT_TOTAL       = 5
const DOT_STEP        = 7

// Ring stroke colors: inner rings glow blue (data-rich), outer fade to neutral
const RING_STROKES = [
  { color: 'rgba(111,176,200,0.55)', width: 1.2, dash: undefined },
  { color: 'rgba(111,176,200,0.30)', width: 0.8, dash: undefined },
  { color: 'rgba(255,255,255,0.22)', width: 0.6, dash: '2 8' },
  { color: 'rgba(255,255,255,0.14)', width: 0.5, dash: '2 8' },
]

// ─── Layout constants ────────────────────────────────────────────────────────
const TEMPORAL_BOUNDARY_FRAC = 0.845
const TEMPORAL_NODE_SPACING  = 72
const POPUP_W                = 192

type OrbitVizProps = {
  people: SharedPersona[]
  pastPeople?: TemporalPersona[]
  futurePeople?: TemporalPersona[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  speed?: number
}

// ─── Temporal popup ───────────────────────────────────────────────────────────
function TemporalPopup({
  person, side, anchorLeft, anchorTop,
}: {
  person: TemporalPersona
  side: 'left' | 'right'
  anchorLeft: number
  anchorTop: number
}) {
  const isPast = person.connectionState === 'past'
  const timeLabel = isPast
    ? (person.minutesOffset === 0 ? 'just now' : `${person.minutesOffset}m ago`)
    : `ETA ${person.minutesOffset}m`

  return (
    <div style={{
      position: 'absolute',
      top: anchorTop,
      left: side === 'left' ? anchorLeft : undefined,
      right: side === 'right' ? anchorLeft : undefined,
      transform: 'translateY(-50%)',
      width: POPUP_W,
      background: 'rgba(10,14,22,0.97)',
      border: '1px solid rgba(255,255,255,0.09)',
      borderLeft: `2px solid ${person.color}60`,
      borderRadius: 7,
      padding: '12px 14px',
      zIndex: 50,
      pointerEvents: 'none',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 9 }}>
        <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#E2E8F4', fontWeight: 500 }}>
          {person.name}
        </span>
        <span style={{
          fontFamily: 'IBM Plex Mono', fontSize: 8.5,
          color: `${person.color}CC`,
          background: `${person.color}18`, borderRadius: 3, padding: '2px 6px',
        }}>
          {timeLabel}
        </span>
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 9 }} />

      <div style={{ marginBottom: 9 }}>
        <p style={{
          fontFamily: 'IBM Plex Mono', fontSize: 8.5,
          color: 'rgba(226,232,244,0.55)', letterSpacing: '.10em',
          textTransform: 'uppercase', marginBottom: 4,
        }}>
          {isPast ? 'Why left' : 'Why incoming'}
        </p>
        <p style={{ fontFamily: 'Inter', fontSize: 11, color: 'rgba(226,232,244,0.90)' }}>
          {person.reason}
        </p>
        {person.reasonDetail && (
          <p style={{
            fontFamily: 'IBM Plex Mono', fontSize: 9,
            color: 'rgba(226,232,244,0.60)', marginTop: 3,
          }}>
            {person.reasonDetail}
          </p>
        )}
      </div>

      <div>
        <p style={{
          fontFamily: 'IBM Plex Mono', fontSize: 8.5,
          color: 'rgba(226,232,244,0.55)', letterSpacing: '.10em',
          textTransform: 'uppercase', marginBottom: 6,
        }}>
          {isPast ? 'Data echo' : 'Pre-loading'}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {person.echoData.filter(Boolean).map((tag) => (
            <span key={tag} style={{
              fontFamily: 'IBM Plex Mono', fontSize: 9,
              color: 'rgba(226,232,244,0.72)',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 3, padding: '3px 7px',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export function OrbitViz({
  people,
  pastPeople = [],
  futurePeople = [],
  selectedId,
  onSelect,
  speed = 54,
}: OrbitVizProps) {
  const ref   = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ W: 0, H: 0 })
  const [selectedTempId, setSelectedTempId] = useState<string | null>(null)
  const blend = useSharedSession((s) => s.blend)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new ResizeObserver((entries) => {
      const r = entries[0]?.contentRect
      if (r) setDims({ W: Math.floor(r.width), H: Math.floor(r.height) })
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const close = () => setSelectedTempId(null)
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [])

  const { W, H } = dims
  const pos    = useOrbit(people, W, H, speed)
  const cx     = W / 2
  const cy     = H / 2
  const maxRx  = cx - AVT_R - EDGE_PAD
  const maxRy  = cy - AVT_R - EDGE_PAD

  const effectivePast = pastPeople.filter((p) => !people.some((a) => a.id === p.id))

  // Static temporal zone x positions (center-relative)
  const ZONE_X = maxRx * 0.97
  const nodeY  = (i: number, total: number) =>
    (i - (total - 1) / 2) * TEMPORAL_NODE_SPACING

  // Find where a horizontal line at y meets the temporal boundary ellipse
  const boundaryX = (y: number, sign: -1 | 1) => {
    const ry = maxRy * TEMPORAL_BOUNDARY_FRAC
    const rx = maxRx * TEMPORAL_BOUNDARY_FRAC
    const t  = 1 - (y / ry) ** 2
    return sign * Math.sqrt(Math.max(0, t)) * rx
  }

  const popupAnchor = (svgX: number, svgY: number, side: 'left' | 'right') => {
    if (side === 'left') {
      return { anchorLeft: cx + svgX + AVT_R + 10, anchorTop: cy + svgY }
    } else {
      return { anchorLeft: W - (cx + svgX - AVT_R - 10), anchorTop: cy + svgY }
    }
  }

  const selectedTempPerson =
    [...effectivePast, ...futurePeople].find((p) => p.id === selectedTempId) ?? null

  // Data depth dots for a given persona
  const renderDataDots = (p: SharedPersona, ring: number) => {
    const active    = RING_DOT_COUNT[ring] ?? 1
    const offsetX   = -((DOT_TOTAL - 1) * DOT_STEP) / 2
    return (
      <g transform={`translate(0, ${AVT_R + 30})`}>
        {Array.from({ length: DOT_TOTAL }, (_, di) => (
          <circle key={di}
            cx={offsetX + di * DOT_STEP} cy={0} r={2.2}
            fill={di < active ? p.color : 'rgba(255,255,255,0.15)'}
            opacity={di < active ? 0.78 : 1} />
        ))}
      </g>
    )
  }

  return (
    <div ref={ref} style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {W > 0 && H > 0 && (
        <>
          <svg width={W} height={H} style={{ position: 'absolute', top: 0, left: 0, overflow: 'hidden' }}>
            <defs>
              {/* Data depth radial gradient: center is data-rich (bright), edge fades out */}
              <radialGradient id="data-depth-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="rgba(111,176,200,0.16)" />
                <stop offset="42%"  stopColor="rgba(111,176,200,0.07)" />
                <stop offset="100%" stopColor="rgba(111,176,200,0)" />
              </radialGradient>
            </defs>

            {/* ── Legend (top-left) ────────────────────────────────────── */}
            <g transform="translate(13, 14)">
              {[
                { color: 'rgba(212,180,71,0.55)',  text: 'ECHO' },
                { color: 'rgba(111,176,200,0.80)', text: 'PRESENT' },
                { color: 'rgba(126,200,164,0.60)', text: 'INCOMING' },
              ].map((row, i) => (
                <g key={row.text} transform={`translate(0,${i * 16})`}>
                  <circle cx={5} cy={4} r={3.5} fill={row.color} />
                  <text x={13} y={8}
                    fontFamily="IBM Plex Mono" fontSize="9"
                    fill="rgba(226,232,244,0.65)" letterSpacing=".10em">
                    {row.text}
                  </text>
                </g>
              ))}
            </g>

            {/* ── Data depth key (bottom-left) ─────────────────────────── */}
            <g transform={`translate(13, ${H - 48})`}>
              <text x={0} y={0} fontFamily="IBM Plex Mono" fontSize="8.5"
                fill="rgba(226,232,244,0.55)" letterSpacing=".08em">
                DATA DEPTH
              </text>
              <text x={0} y={13} fontFamily="IBM Plex Mono" fontSize="8"
                fill="rgba(226,232,244,0.40)" letterSpacing=".05em">
                closer to cabin = more sharing
              </text>
              <g transform="translate(0, 22)">
                {Array.from({ length: DOT_TOTAL }, (_, di) => (
                  <circle key={di} cx={di * DOT_STEP + 3} cy={4} r={2.2}
                    fill={di < 3 ? 'rgba(111,176,200,0.70)' : 'rgba(255,255,255,0.20)'} />
                ))}
                <text x={DOT_TOTAL * DOT_STEP + 8} y={8}
                  fontFamily="IBM Plex Mono" fontSize="7.5"
                  fill="rgba(226,232,244,0.40)">
                  = full · · · minimal
                </text>
              </g>
            </g>

            {/* ── Zone column headers ───────────────────────────────────── */}
            <text x={cx - ZONE_X} y={20} textAnchor="middle"
              fontFamily="IBM Plex Mono" fontSize="8.5"
              fill="rgba(212,180,71,0.55)" letterSpacing="1.6">
              PAST ECHO
            </text>
            <text x={cx + ZONE_X} y={20} textAnchor="middle"
              fontFamily="IBM Plex Mono" fontSize="8.5"
              fill="rgba(126,200,164,0.60)" letterSpacing="1.6">
              INCOMING
            </text>

            {/* ── Vertical zone separators ─────────────────────────────── */}
            {([-1, 1] as const).map((sign) => (
              <line key={sign}
                x1={cx + sign * maxRx * (TEMPORAL_BOUNDARY_FRAC + 0.03)}
                y1={28} x2={cx + sign * maxRx * (TEMPORAL_BOUNDARY_FRAC + 0.03)} y2={H - 14}
                stroke="rgba(255,255,255,0.07)"
                strokeWidth={0.6}
                strokeDasharray="3 12" />
            ))}

            {/* ── Center glow ───────────────────────────────────────────── */}
            <ellipse cx={cx} cy={cy} rx={maxRx * 0.22} ry={maxRy * 0.22}
              fill="rgba(111,176,200,0.08)" style={{ filter: 'blur(20px)' }} />

            <g transform={`translate(${cx},${cy})`}>

              {/* Data depth radial fill — visually shows data richness at center */}
              <ellipse cx={0} cy={0} rx={maxRx * RING_FRACS[3]!} ry={maxRy * RING_FRACS[3]!}
                fill="url(#data-depth-glow)" />

              {/* ── Temporal boundary ring ───────────────────────────────── */}
              <ellipse cx={0} cy={0}
                rx={maxRx * TEMPORAL_BOUNDARY_FRAC} ry={maxRy * TEMPORAL_BOUNDARY_FRAC}
                fill="none" stroke="rgba(255,255,255,0.11)"
                strokeWidth={0.7} strokeDasharray="4 8" />

              {/* ── Orbit rings with data tier labels ───────────────────── */}
              {RING_FRACS.map((frac, i) => {
                const rs = RING_STROKES[i]!
                return (
                  <g key={i}>
                    <ellipse cx={0} cy={0}
                      rx={maxRx * frac} ry={maxRy * frac}
                      fill="none"
                      stroke={rs.color}
                      strokeWidth={rs.width}
                      strokeDasharray={rs.dash} />
                    {/* Data tier label at top of ring */}
                    <text x={0} y={-(maxRy * frac + 9)} textAnchor="middle"
                      fontFamily="IBM Plex Mono" fontSize="7.5"
                      fill={`rgba(111,176,200,${0.38 - i * 0.06})`}
                      letterSpacing="1.0">
                      {RING_TIER_LABELS[i]}
                    </text>
                  </g>
                )
              })}

              {/* Connection lines between present people */}
              {people.length > 1 && people.map((p, i) => {
                const a = pos[p.id]
                const b = pos[people[(i + 1) % people.length]!.id]
                if (!a || !b) return null
                return (
                  <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    stroke="rgba(255,255,255,0.18)" strokeWidth=".5" strokeDasharray="2 9" />
                )
              })}

              {/* ── Center core + CABIN label ────────────────────────────── */}
              <circle cx={0} cy={0} r={28} fill="rgba(111,176,200,0.04)" stroke="rgba(111,176,200,0.14)" strokeWidth={0.7} />
              <circle cx={0} cy={0} r={18} fill="rgba(111,176,200,0.06)" stroke="rgba(111,176,200,0.20)" strokeWidth={0.7} />
              <circle cx={0} cy={0} r={9}  fill="rgba(111,176,200,0.12)" />
              <circle cx={0} cy={0} r={4}  fill="rgba(111,176,200,0.90)" />
              <text x={0} y={38} textAnchor="middle"
                fontFamily="IBM Plex Mono" fontSize="8"
                fill="rgba(111,176,200,0.55)" letterSpacing="2.5">
                CABIN
              </text>

              {/* ── ECHO zone — static nodes, left column ───────────────── */}
              {effectivePast.map((p, i) => {
                const px  = -ZONE_X
                const py  = nodeY(i, effectivePast.length)
                const bx  = boundaryX(py, -1)
                const ini = p.name.split(' ').map((w) => w[0]).join('')
                const sel = selectedTempId === p.id
                const timeLabel = p.minutesOffset === 0 ? 'just now' : `${p.minutesOffset}m ago`
                return (
                  <g key={`echo-${p.id}`}
                    onClick={(e) => { e.stopPropagation(); setSelectedTempId(sel ? null : p.id) }}
                    style={{ cursor: 'pointer' }}>
                    {/* Data residue flow line */}
                    <line
                      x1={px + AVT_R + 2} y1={py}
                      x2={bx - 4} y2={py}
                      stroke={`${p.color}25`} strokeWidth={0.7}
                      strokeDasharray="2 8"
                      style={{ animation: 'data-flow-out 5s linear infinite' }} />
                    {/* Ghost node */}
                    <g transform={`translate(${px},${py})`} opacity={sel ? 0.65 : 0.35}>
                      <circle cx={0} cy={0} r={AVT_R}
                        fill={sel ? `${p.color}14` : `${p.color}08`}
                        stroke={`${p.color}${sel ? '75' : '50'}`}
                        strokeWidth={sel ? 1.2 : 0.8}
                        strokeDasharray="2 4" />
                      <text x={0} y={3.5} textAnchor="middle"
                        fontFamily="IBM Plex Mono" fontSize="9"
                        fill={p.color} opacity=".75">{ini}</text>
                      <text x={0} y={AVT_R + 13} textAnchor="middle"
                        fontFamily="IBM Plex Mono" fontSize="8.5"
                        fill="rgba(255,255,255,0.50)" letterSpacing=".8">
                        {p.name.split(' ')[0]!.toUpperCase()}
                      </text>
                      <text x={0} y={AVT_R + 24} textAnchor="middle"
                        fontFamily="IBM Plex Mono" fontSize="8"
                        fill={`${p.color}88`} letterSpacing=".4">
                        {timeLabel}
                      </text>
                    </g>
                  </g>
                )
              })}

              {/* ── INCOMING zone — static nodes, right column ──────────── */}
              {futurePeople.map((p, i) => {
                const px  = ZONE_X
                const py  = nodeY(i, futurePeople.length)
                const bx  = boundaryX(py, 1)
                const ini = p.name.split(' ').map((w) => w[0]).join('')
                const sel = selectedTempId === p.id
                return (
                  <g key={`incoming-${p.id}`}
                    onClick={(e) => { e.stopPropagation(); setSelectedTempId(sel ? null : p.id) }}
                    style={{ cursor: 'pointer' }}>
                    {/* Data incoming flow line */}
                    <line
                      x1={bx + 4} y1={py}
                      x2={px - AVT_R - 2} y2={py}
                      stroke={`${p.color}28`} strokeWidth={0.7}
                      strokeDasharray="2 7"
                      style={{ animation: 'data-flow-in 3.5s linear infinite' }} />
                    <g transform={`translate(${px},${py})`}>
                      {/* Expanding pulse ring */}
                      <circle cx={0} cy={0} r={AVT_R + 5}
                        fill="none" stroke={`${p.color}28`} strokeWidth={0.7}>
                        <animate attributeName="r"
                          values={`${AVT_R + 5};${AVT_R + 16};${AVT_R + 5}`}
                          dur="2.8s" repeatCount="indefinite" />
                        <animate attributeName="opacity"
                          values="0.55;0;0.55" dur="2.8s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={0} cy={0} r={AVT_R}
                        fill={`${p.color}0D`}
                        stroke={`${p.color}${sel ? '88' : '68'}`}
                        strokeWidth={sel ? 1.4 : 1}
                        strokeDasharray="3 3">
                        <animate attributeName="opacity"
                          values="0.5;0.80;0.5" dur="2.8s" repeatCount="indefinite" />
                      </circle>
                      <text x={0} y={3.5} textAnchor="middle"
                        fontFamily="IBM Plex Mono" fontSize="9.5"
                        fill={p.color} opacity=".80">{ini}</text>
                      <text x={0} y={AVT_R + 13} textAnchor="middle"
                        fontFamily="IBM Plex Mono" fontSize="8.5"
                        fill="rgba(255,255,255,0.55)" letterSpacing=".8">
                        {p.name.split(' ')[0]!.toUpperCase()}
                      </text>
                      <text x={0} y={AVT_R + 24} textAnchor="middle"
                        fontFamily="IBM Plex Mono" fontSize="8.5"
                        fill={`${p.color}95`} letterSpacing=".4">
                        ETA {p.minutesOffset}m
                      </text>
                    </g>
                  </g>
                )
              })}

              {/* ── Present people (orbiting) ────────────────────────────── */}
              {people.map((p) => {
                const xy   = pos[p.id]
                if (!xy) return null
                const sel  = selectedId === p.id
                const ring = PERSON_RING[p.id] ?? 3
                const ini  = p.name.split(' ').map((w) => w[0]).join('')
                // Owner (ring 0) is larger and brighter; opacity fades with distance
                const r    = ring === 0 ? AVT_R + 3 : AVT_R
                const nameOpacity = 0.78 - ring * 0.10   // 0.78 → 0.48
                return (
                  <g key={p.id}
                    transform={`translate(${xy.x},${xy.y})`}
                    onClick={() => onSelect(sel ? null : p.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {sel && (
                      <circle cx={0} cy={0} r={r + 10} fill="none"
                        stroke={p.color} strokeWidth="1"
                        strokeDasharray="3 4" opacity=".55"
                        style={{ animation: 'spin-slow 9s linear infinite', transformOrigin: '0 0' }} />
                    )}
                    {/* Owner gets an extra glow ring */}
                    {ring === 0 && (
                      <circle cx={0} cy={0} r={r + 5}
                        fill="none" stroke={`${p.color}28`} strokeWidth={1} />
                    )}
                    {/* Outer white border ring — GitHub contrast improvement */}
                    <circle cx={0} cy={0} r={r + 1.5}
                      fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth={0.8} />
                    <circle cx={0} cy={0} r={r}
                      fill={`${p.color}${sel ? '28' : '18'}`}
                      stroke={`${p.color}${sel ? '90' : '70'}`}
                      strokeWidth={sel ? 1.8 : ring === 0 ? 1.4 : 1} />
                    <text x={0} y={3.5} textAnchor="middle"
                      fontFamily="IBM Plex Mono" fontSize={ring === 0 ? '10' : '9.5'}
                      fill={p.color} opacity={ring === 0 ? '.95' : '.85'}>{ini}</text>
                    <text x={0} y={r + 13} textAnchor="middle"
                      fontFamily="IBM Plex Mono" fontSize="8.5"
                      fill="rgba(255,255,255,0.90)" letterSpacing=".8">
                      {p.name.split(' ')[0]!.toUpperCase()}
                    </text>
                    {/* Data depth dots — more dots = more data = closer to cabin */}
                    {renderDataDots(p, ring)}
                    {/* Biometric HR badge — owner only (ring 0) */}
                    {ring === 0 && blend.biometricHR !== undefined && (
                      <g transform={`translate(${r + 6}, ${-r - 2})`}>
                        <rect x={-1} y={-8} width={38} height={14} rx={3}
                          fill="rgba(10,14,22,0.88)" stroke={`${p.color}38`} strokeWidth={0.7} />
                        <text x={18} y={0.5} textAnchor="middle"
                          fontFamily="IBM Plex Mono" fontSize="7.5"
                          fill={p.color} opacity=".85">
                          {blend.biometricHR} bpm
                        </text>
                        <text x={18} y={9} textAnchor="middle"
                          fontFamily="IBM Plex Mono" fontSize="6.5"
                          fill={blend.biometricMode === 'focus' ? '#4A8FD4' : blend.biometricMode === 'relax' ? '#5BC98A' : 'rgba(226,232,244,0.40)'}
                          letterSpacing=".5">
                          {blend.biometricMode.toUpperCase()}
                        </text>
                      </g>
                    )}
                    <circle cx={0} cy={0} r={r + 14} fill="transparent" />
                  </g>
                )
              })}

              {/* Hint */}
              {!selectedId && !selectedTempId && (
                <text x={0} y={cy - 10} textAnchor="middle"
                  fontFamily="IBM Plex Mono" fontSize="8.5"
                  fill="rgba(255,255,255,0.28)" letterSpacing="1.6">
                  TAP TO INSPECT
                </text>
              )}
            </g>
          </svg>

          {/* ── Temporal popup ───────────────────────────────────────────── */}
          {selectedTempPerson && (() => {
            const isPast = selectedTempPerson.connectionState === 'past'
            const i      = isPast
              ? effectivePast.findIndex((p) => p.id === selectedTempPerson.id)
              : futurePeople.findIndex((p) => p.id === selectedTempPerson.id)
            const total  = isPast ? effectivePast.length : futurePeople.length
            const svgX   = isPast ? -ZONE_X : ZONE_X
            const svgY   = nodeY(i, total)
            const side   = isPast ? 'left' : 'right'
            const anchor = popupAnchor(svgX, svgY, side)
            return (
              <TemporalPopup
                person={selectedTempPerson}
                side={side}
                anchorLeft={anchor.anchorLeft}
                anchorTop={anchor.anchorTop}
              />
            )
          })()}
        </>
      )}
    </div>
  )
}
