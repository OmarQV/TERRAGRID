import { motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from '../lib/use-reduced-motion'

type Frame = { filter: string; opacity: number; y: number }

type BlurTextProps = {
  text?: string
  delay?: number
  className?: string
  animateBy?: 'words' | 'letters'
  direction?: 'top' | 'bottom'
  threshold?: number
  rootMargin?: string
  animationFrom?: Frame
  animationTo?: Frame[]
  easing?: (progress: number) => number
  onAnimationComplete?: () => void
  stepDuration?: number
  headingLevel?: 2 | 3 | 4
}

function buildKeyframes(from: Frame, steps: Frame[]) {
  return {
    filter: [from.filter, ...steps.map((step) => step.filter)],
    opacity: [from.opacity, ...steps.map((step) => step.opacity)],
    y: [from.y, ...steps.map((step) => step.y)],
  }
}

export default function BlurText({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = (progress) => progress,
  onAnimationComplete,
  stepDuration = 0.35,
  headingLevel,
}: BlurTextProps) {
  const segments = useMemo(() => animateBy === 'words' ? text.split(' ') : text.split(''), [animateBy, text])
  const [inView, setInView] = useState(() => typeof window !== 'undefined' && !('IntersectionObserver' in window))
  const ref = useRef<HTMLParagraphElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!ref.current || reduceMotion) return
    if (!('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        observer.disconnect()
      }
    }, { threshold, rootMargin })

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold, rootMargin, reduceMotion])

  const defaultFrom = useMemo<Frame>(() => ({
    filter: 'blur(10px)', opacity: 0, y: direction === 'top' ? -50 : 50,
  }), [direction])
  const defaultTo = useMemo<Frame[]>(() => [
    { filter: 'blur(5px)', opacity: 0.5, y: direction === 'top' ? 5 : -5 },
    { filter: 'blur(0px)', opacity: 1, y: 0 },
  ], [direction])

  const from = animationFrom ?? defaultFrom
  const to = animationTo ?? defaultTo
  const keyframes = useMemo(() => buildKeyframes(from, to), [from, to])
  const times = useMemo(() => Array.from({ length: to.length + 1 }, (_, index) => index / to.length), [to])

  return (
    <p ref={ref} className={className} role={headingLevel ? 'heading' : undefined} aria-level={headingLevel} style={{ display: 'flex', flexWrap: 'wrap' }}>
      {segments.map((segment, index) => (
        <motion.span
          key={`${segment}-${index}`}
          initial={reduceMotion ? false : from}
          animate={reduceMotion ? to.at(-1) ?? from : inView ? keyframes : from}
          transition={{ duration: reduceMotion ? 0 : stepDuration * to.length, times, delay: reduceMotion ? 0 : index * delay / 1000, ease: easing }}
          onAnimationComplete={index === segments.length - 1 ? onAnimationComplete : undefined}
        >
          {segment === ' ' ? '\u00a0' : segment}
          {animateBy === 'words' && index < segments.length - 1 && '\u00a0'}
        </motion.span>
      ))}
    </p>
  )
}
