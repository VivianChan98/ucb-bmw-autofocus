type ToggleProps = { on: boolean; onChange: (val: boolean) => void; color: string }

export function Toggle({ on, onChange, color }: ToggleProps) {
  return (
    <div
      onClick={() => onChange(!on)}
      style={{
        width: 30, height: 17, borderRadius: 9, cursor: 'pointer', flexShrink: 0,
        background: on ? `${color}35` : 'rgba(255,255,255,0.05)',
        border: `1px solid ${on ? color + '50' : 'rgba(255,255,255,0.09)'}`,
        position: 'relative', transition: 'all .25s',
      }}
    >
      <div style={{
        position: 'absolute', top: 2, left: on ? 13 : 2,
        width: 11, height: 11, borderRadius: '50%',
        background: on ? color : 'rgba(255,255,255,0.22)',
        transition: 'all .25s',
        boxShadow: on ? `0 0 5px ${color}70` : 'none',
      }} />
    </div>
  )
}
