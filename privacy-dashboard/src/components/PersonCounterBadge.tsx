import type { DetectionStatus } from '../hooks/usePersonDetection'

type Props = {
  count: number
  status: DetectionStatus
}

const DOT_COLOR: Record<DetectionStatus, string> = {
  idle:    'rgba(255,255,255,0.18)',
  loading: '#D4A547',
  ready:   '#5BA87A',
  error:   '#C0534A',
}

export function PersonCounterBadge({ count, status }: Props) {
  const label =
    status === 'ready'   ? `${count} in frame` :
    status === 'loading' ? 'Loading model'     :
    status === 'error'   ? 'Camera error'      :
    'Camera idle'

  const dotColor = DOT_COLOR[status]

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 16,
        left: 16,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: 'rgba(9,12,19,0.72)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 6,
        padding: '5px 10px',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: dotColor,
          boxShadow: status === 'ready' ? `0 0 6px ${dotColor}` : 'none',
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: 'IBM Plex Mono',
          fontSize: 9,
          color: 'rgba(226,232,244,0.4)',
          letterSpacing: '.06em',
        }}
      >
        {label}
      </span>
    </div>
  )
}
