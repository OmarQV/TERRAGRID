import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { gsap, SplitText } from '../lib/animation'

export default function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const root = ref.current!
      // Split plain text only, preserving links, icons and their semantics.
      const texts = Array.from(root.querySelectorAll<HTMLElement>('h2, h3, h4, p'))
        .filter((element) => element.children.length === 0)
      const splits = texts.map((element) => SplitText.create(element, {
        type: 'lines', mask: 'lines', linesClass: 'reveal-line', autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 105, opacity: 0, duration: 0.75, stagger: 0.065, ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 92%', once: true },
          })
        },
      }))
      if (!texts.length) gsap.from(root, {
        y: 18, opacity: 0, duration: 0.65, ease: 'power3.out',
        scrollTrigger: { trigger: root, start: 'top 92%', once: true },
      })
      return () => splits.forEach((split) => split.revert())
    })
    return () => media.revert()
  }, [])
  return <div ref={ref} className={className}>{children}</div>
}
