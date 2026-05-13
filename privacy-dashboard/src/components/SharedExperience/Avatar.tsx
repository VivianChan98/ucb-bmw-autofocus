type AvatarProps = { name: string; size?: number; color: string; style?: React.CSSProperties }

export function Avatar({ name, size = 40, color, style = {} }: AvatarProps) {
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2)
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `radial-gradient(circle at 35% 35%, ${color}2e, ${color}0d)`,
      border: `1.5px solid ${color}55`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, ...style,
    }}>
      <span style={{ fontFamily: 'IBM Plex Mono', fontSize: size * 0.33, color, fontWeight: 400, letterSpacing: '.05em' }}>
        {initials}
      </span>
    </div>
  )
}
