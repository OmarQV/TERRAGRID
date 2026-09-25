import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)
export { gsap, ScrollTrigger, SplitText }

/** Values stay outside React: no component renders on each scroll frame. */
export class ScrollProgress {
  value = 0.5
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
