// Convert Kelvin temperature to an approximate RGB color for display purposes
// Range: 2700K (warm amber) to 6500K (cool blue-white)
export function kelvinToHex(k: number): string {
  // Clamp to display range
  const t = Math.max(2700, Math.min(6500, k))
  const pct = (t - 2700) / (6500 - 2700)  // 0 = warm, 1 = cool

  // Warm: #FFB347 (amber-orange) → Neutral: #FFF5E0 → Cool: #CAD8FF (blue-white)
  const warm = { r: 255, g: 179, b: 71 }
  const neutral = { r: 255, g: 245, b: 224 }
  const cool = { r: 186, g: 210, b: 255 }

  let r: number, g: number, b: number
  if (pct < 0.5) {
    const p = pct * 2
    r = Math.round(warm.r + (neutral.r - warm.r) * p)
    g = Math.round(warm.g + (neutral.g - warm.g) * p)
    b = Math.round(warm.b + (neutral.b - warm.b) * p)
  } else {
    const p = (pct - 0.5) * 2
    r = Math.round(neutral.r + (cool.r - neutral.r) * p)
    g = Math.round(neutral.g + (cool.g - neutral.g) * p)
    b = Math.round(neutral.b + (cool.b - neutral.b) * p)
  }

  return `rgb(${r},${g},${b})`
}

export function kelvinLabel(k: number): string {
  if (k <= 3000) return 'Warm'
  if (k <= 3800) return 'Warm neutral'
  if (k <= 4500) return 'Neutral'
  if (k <= 5200) return 'Cool white'
  return 'Daylight'
}
