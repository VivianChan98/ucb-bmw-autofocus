import { EASING } from './tokens'

export const ease = EASING

export const spring = {
  type: 'spring' as const,
  stiffness: 60,
  damping: 20,
  mass: 1,
}

export const tween = (duration = 0.5) => ({
  type: 'tween' as const,
  duration,
  ease: EASING,
})
