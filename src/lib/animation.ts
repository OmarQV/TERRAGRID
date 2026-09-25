import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)
export { gsap, ScrollTrigger, SplitText }

/** Values stay outside React: no component renders on each scroll frame. */
export class ScrollProgress {
  value: number
  constructor(value = 0.5) {
    this.value = value
  }
  private listeners = new Set<(value: number) => void>()
  set(value: number) {
    this.value = value
    this.listeners.forEach((listener) => listener(value))
  }
  subscribe(listener: (value: number) => void) {
    this.listeners.add(listener)
    listener(this.value)
    return () => { this.listeners.delete(listener) }
  }
}

/**
 * Hace que `target` siga a `source` con amortiguación exponencial, en el reloj de GSAP
 * (el mismo que mueve a Lenis). Deja de trabajar cuando llega al valor.
 */
export function smoothFollow(source: ScrollProgress, target: ScrollProgress, rate = 8) {
  let value = source.value
  const tick = (_time: number, delta: number) => {
    const goal = source.value
    if (value === goal) return
    value = Math.abs(goal - value) < 0.0004 ? goal : value + (goal - value) * (1 - Math.exp((-rate * delta) / 1000))
    target.set(value)
  }
  target.set(value)
  gsap.ticker.add(tick)
  return () => gsap.ticker.remove(tick)
}
