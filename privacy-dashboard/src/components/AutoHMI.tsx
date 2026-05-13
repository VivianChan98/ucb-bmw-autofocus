import { useState, useEffect } from 'react'
import { useSharedSession } from '../state/sharedSession'
import { MUSIC_QUEUE } from '../state/sharedPersonas'
import { SharedWidget } from './SharedWidget'

const T = {
  bg: '#090C13',
  surface: '#0C1019',
  border: 'rgba(255,255,255,0.06)',
  borderMid: 'rgba(255,255,255,0.10)',
  txt: '#E2E8F4',
  txtB: 'rgba(226,232,244,0.55)',
  txtC: 'rgba(226,232,244,0.25)',
  accent: '#4A8FD4',
}

type AutoHMIProps = {
  onOpenShared: () => void
}

function useTime() {
  const [t, setT] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 30000)
    return () => clearInterval(id)
  }, [])
  return t
}

// Dark automotive-style SVG map of a fictional city grid
function MapSVG({ width, height }: { width: number; height: number }) {
  const w = width, h = height
  if (!w || !h) return null

  // Scale helpers
  const px = (pct: number) => (pct / 100) * w
  const py = (pct: number) => (pct / 100) * h

  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <defs>
        {/* Route glow */}
        <filter id="route-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Map background gradient */}
        <radialGradient id="map-bg" cx="45%" cy="55%" r="65%">
          <stop offset="0%" stopColor="#121A28" />
          <stop offset="100%" stopColor="#0A1018" />
        </radialGradient>
      </defs>

      {/* Background */}
      <rect width={w} height={h} fill="url(#map-bg)" />

      {/* City blocks (background rectangles) */}
      {[
        [10, 12, 18, 22], [32, 8, 20, 18], [56, 10, 14, 20], [74, 8, 18, 22],
        [10, 38, 20, 20], [34, 36, 18, 22], [56, 35, 16, 18], [76, 36, 14, 20],
        [10, 65, 22, 18], [36, 63, 16, 20], [56, 62, 18, 18], [78, 64, 14, 18],
        [20, 25, 10, 10], [48, 28, 8, 8], [66, 30, 10, 8], [82, 28, 8, 8],
        [20, 50, 12, 10], [48, 52, 8, 10], [66, 55, 10, 8],
      ].map(([x, y, bw, bh], i) => (
        <rect key={i} x={px(x!)} y={py(y!)} width={px(bw!)} height={py(bh!)}
          fill="rgba(255,255,255,0.022)" rx={2} />
      ))}

      {/* Water / park area */}
      <ellipse cx={px(85)} cy={py(72)} rx={px(9)} ry={py(12)}
        fill="rgba(74,143,212,0.08)" />
      <ellipse cx={px(22)} cy={py(80)} rx={px(8)} ry={py(7)}
        fill="rgba(91,201,138,0.06)" />

      {/* Minor roads - horizontal */}
      {[18, 33, 57, 70, 82].map((y) => (
        <line key={`mh${y}`} x1={0} y1={py(y)} x2={w} y2={py(y)}
          stroke="rgba(255,255,255,0.055)" strokeWidth={0.8} />
      ))}
      {/* Minor roads - vertical */}
      {[18, 32, 55, 72, 85].map((x) => (
        <line key={`mv${x}`} x1={px(x)} y1={0} x2={px(x)} y2={h}
          stroke="rgba(255,255,255,0.055)" strokeWidth={0.8} />
      ))}

      {/* Major roads - horizontal */}
      {[9, 36, 62].map((y) => (
        <line key={`Mh${y}`} x1={0} y1={py(y)} x2={w} y2={py(y)}
          stroke="rgba(255,255,255,0.13)" strokeWidth={2} />
      ))}
      {/* Major roads - vertical */}
      {[30, 52, 76].map((x) => (
        <line key={`Mv${x}`} x1={px(x)} y1={0} x2={px(x)} y2={h}
          stroke="rgba(255,255,255,0.13)" strokeWidth={2} />
      ))}

      {/* Highway - diagonal-ish arterial */}
      <path
        d={`M ${px(0)} ${py(50)} C ${px(15)} ${py(48)}, ${px(35)} ${py(45)}, ${px(52)} ${py(36)} S ${px(70)} ${py(22)}, ${px(100)} ${py(18)}`}
        fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={3.5}
      />

      {/* Route line (car → destination) */}
      <path
        d={`M ${px(44)} ${py(62)} L ${px(44)} ${py(36)} L ${px(52)} ${py(36)} L ${px(52)} ${py(18)}`}
        fill="none" stroke={T.accent} strokeWidth={2.5}
        strokeLinecap="round" strokeLinejoin="round"
        filter="url(#route-glow)" opacity={0.85}
      />
      {/* Route direction arrows */}
      {[
        { x: px(44), y: py(50), rot: 90 },
        { x: px(49), y: py(36), rot: 0 },
        { x: px(52), y: py(27), rot: 90 },
      ].map((a, i) => (
        <g key={i} transform={`translate(${a.x},${a.y}) rotate(${a.rot})`}>
          <polygon points="0,-4 3,2 -3,2" fill={T.accent} opacity={0.55} />
        </g>
      ))}

      {/* Destination pin */}
      <g transform={`translate(${px(52)},${py(15)})`}>
        <circle cx={0} cy={0} r={7} fill={`${T.accent}22`} stroke={T.accent} strokeWidth={1.2} />
        <circle cx={0} cy={0} r={2.5} fill={T.accent} />
        <circle cx={0} cy={0} r={12} fill="transparent" />
      </g>

      {/* Destination label */}
      <text x={px(55)} y={py(13)} fontFamily="IBM Plex Mono" fontSize={9}
        fill="rgba(226,232,244,0.5)" letterSpacing="0.5">BMW HQ</text>

      {/* Car position */}
      <g transform={`translate(${px(44)},${py(62)}) rotate(-90)`}>
        {/* Outer pulse ring */}
        <circle cx={0} cy={0} r={14} fill="rgba(74,143,212,0.08)" stroke="rgba(74,143,212,0.20)" strokeWidth={1} />
        {/* Inner circle */}
        <circle cx={0} cy={0} r={8} fill="rgba(9,12,19,0.9)" stroke={T.accent} strokeWidth={1.5} />
        {/* Car arrow */}
        <polygon points="0,-5 4,4 0,2 -4,4" fill={T.accent} />
      </g>

      {/* Street name labels */}
      {[
        { x: px(6),  y: py(34),  label: 'Berliner Str.', rot: 0 },
        { x: px(6),  y: py(60),  label: 'Hauptstraße',   rot: 0 },
        { x: px(26), y: py(6),   label: 'Kurfürstendamm', rot: 0 },
        { x: px(54), y: py(6),   label: 'Unter den Linden', rot: 0 },
      ].map((l, i) => (
        <text key={i} x={l.x} y={l.y}
          fontFamily="IBM Plex Mono" fontSize={7.5}
          fill="rgba(255,255,255,0.18)" letterSpacing="0.3"
        >{l.label}</text>
      ))}

      {/* Compass rose */}
      <g transform={`translate(${px(94)},${py(12)})`} opacity={0.35}>
        <circle cx={0} cy={0} r={11} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={0.8} />
        <text x={0} y={-14} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={7} fill="rgba(255,255,255,0.5)">N</text>
        <line x1={0} y1={-8} x2={0} y2={8} stroke="rgba(255,255,255,0.25)" strokeWidth={0.8} />
        <line x1={-8} y1={0} x2={8} y2={0} stroke="rgba(255,255,255,0.25)" strokeWidth={0.8} />
        <polygon points="0,-7 1.5,0 0,-2 -1.5,0" fill="rgba(255,255,255,0.5)" />
      </g>
    </svg>
  )
}

// Simple animated progress for music
function MusicProgress() {
  const [progress, setProgress] = useState(38)
  const [playing] = useState(true)
  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setProgress((p) => p >= 100 ? 0 : p + 0.08), 200)
    return () => clearInterval(id)
  }, [playing])
  const totalSecs = 222 // 3:42
  const elapsed = Math.floor((progress / 100) * totalSecs)
  const mm = Math.floor(elapsed / 60)
  const ss = String(elapsed % 60).padStart(2, '0')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ height: 2, background: 'rgba(255,255,255,0.07)', borderRadius: 1, overflow: 'hidden', cursor: 'pointer' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'rgba(255,255,255,0.32)', borderRadius: 1, transition: 'width .18s linear' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8, color: T.txtC }}>{mm}:{ss}</span>
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8, color: T.txtC }}>3:42</span>
      </div>
    </div>
  )
}

export function AutoHMI({ onOpenShared }: AutoHMIProps) {
  const now = useTime()
  const { activePeople, sharing, cameraMode } = useSharedSession()
  const [mapDims, setMapDims] = useState({ w: 0, h: 0 })

  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  const track = MUSIC_QUEUE[0]!
  const owner = activePeople[0]

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: T.bg, fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* HMI Top status bar */}
      <div style={{
        height: 36, flexShrink: 0,
        background: T.surface,
        borderBottom: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center',
        padding: '0 18px', gap: 0,
      }}>
        {/* Time */}
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 13, color: T.txt, letterSpacing: '.04em', minWidth: 46 }}>{timeStr}</span>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Date + city */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: T.txtC, letterSpacing: '.08em' }}>{dateStr}</span>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: T.txtC, letterSpacing: '.06em' }}>·</span>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: T.txtC, letterSpacing: '.06em' }}>Schöneberg, Berlin</span>
        </div>

        <div style={{ flex: 1 }} />

        {/* System status icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: T.txtB }}>22°C</span>
          {/* BT */}
          <svg width="10" height="13" viewBox="0 0 10 13" fill="none">
            <path d="M2 3L8 8L5 11V2L8 5L2 10" stroke="rgba(226,232,244,0.4)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {/* Signal bars */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1.5 }}>
            {[5, 8, 11, 13].map((h, i) => (
              <div key={i} style={{ width: 3, height: h, borderRadius: 1, background: i < 3 ? 'rgba(226,232,244,0.5)' : 'rgba(226,232,244,0.15)' }} />
            ))}
          </div>
        </div>
      </div>

      {/* Map area */}
      <div
        style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}
        ref={(el) => {
          if (el && (el.clientWidth !== mapDims.w || el.clientHeight !== mapDims.h)) {
            setMapDims({ w: el.clientWidth, h: el.clientHeight })
          }
        }}
      >
        <MapSVG width={mapDims.w} height={mapDims.h} />

        {/* Speed indicator */}
        <div style={{
          position: 'absolute', top: 14, left: 16,
          background: 'rgba(9,12,19,0.78)', backdropFilter: 'blur(12px)',
          border: `1px solid ${T.border}`, borderRadius: 8,
          padding: '7px 13px', display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 22, color: T.txt, lineHeight: 1 }}>42</span>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 7, color: T.txtC, letterSpacing: '.12em' }}>KM/H</span>
        </div>

        {/* Speed limit */}
        <div style={{
          position: 'absolute', top: 14, left: 82,
          width: 30, height: 30, borderRadius: '50%',
          background: '#fff', border: '3px solid #e53', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: '#111', fontWeight: 600 }}>50</span>
        </div>

        {/* Shared Experience widget — floating bottom-right */}
        <div style={{ position: 'absolute', bottom: 14, right: 14 }}>
          <SharedWidget
            activePeople={activePeople}
            sharing={sharing}
            onOpen={onOpenShared}
          />
        </div>
      </div>

      {/* Bottom strip */}
      <div style={{
        height: 68, flexShrink: 0,
        background: T.surface,
        borderTop: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'stretch',
      }}>
        {/* Navigation tile */}
        <div style={{
          flex: 1, borderRight: `1px solid ${T.border}`,
          padding: '10px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14, color: T.accent, fontVariationSettings: "'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 20", lineHeight: 1 }}>navigation</span>
            <span style={{ fontSize: 13, color: T.txt, letterSpacing: '-.01em' }}>{owner?.nav ?? 'BMW HQ'}</span>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: T.txtC, marginLeft: 4 }}>4.2 km</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 22 }}>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: T.txtC }}>ETA</span>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: T.txtB }}>9 min</span>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8, color: T.txtC }}>·</span>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8, color: T.txtC }}>via Kurfürstendamm</span>
          </div>
        </div>

        {/* Music tile */}
        <div style={{
          flex: 1,
          borderRight: `1px solid ${T.border}`,
          padding: '10px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 5,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            {/* Album art placeholder */}
            <div style={{
              width: 32, height: 32, borderRadius: 5, flexShrink: 0,
              background: 'rgba(255,255,255,0.04)', border: `1px solid ${T.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14, color: T.txtC, fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20", lineHeight: 1 }}>music_note</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, color: T.txt, letterSpacing: '-.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 1 }}>{track.title}</p>
              <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: T.txtC }}>{track.artist}</p>
            </div>
            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, flexShrink: 0 }}>
              <span style={{ fontSize: 11, color: T.txtC, cursor: 'pointer' }}>⏮</span>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)', border: `1px solid ${T.borderMid}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}>
                <span style={{ fontSize: 7, color: T.txtB, marginLeft: 1.5 }}>▶</span>
              </div>
              <span style={{ fontSize: 11, color: T.txtC, cursor: 'pointer' }}>⏭</span>
            </div>
          </div>
          <MusicProgress />
        </div>

        {/* Privacy Space tile */}
        <div
          onClick={onOpenShared}
          style={{
            flex: 1,
            padding: '10px 18px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3,
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 14, color: T.accent, fontVariationSettings: "'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 20", lineHeight: 1 }}
            >hub</span>
            <span style={{ fontSize: 13, color: T.txt, letterSpacing: '-.01em' }}>Privacy Space</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 22 }}>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: T.txtC }}>
              {activePeople.length === 1 ? 'Only you' : `${activePeople.length} connected`}
            </span>
            {cameraMode && (
              <>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8, color: T.txtC }}>·</span>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8, color: T.txtC }}>Camera</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
