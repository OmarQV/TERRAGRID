import { useLayoutEffect, useRef, type ComponentProps } from 'react'
import { gsap } from '../lib/animation'

type Props = ComponentProps<'div'> & { distance?: number; mobileDistance?: number }

/** Isolate transforms from layout and sticky ancestors. */
export default function Parallax({ children, distance = 28, mobileDistance = 8, ...props }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const media = gsap.matchMedia()
    media.add({ motion: '(prefers-reduced-motion: no-preference)', mobile: '(max-width: 980px)' }, (context) => {
      if (!context.conditions?.motion || !ref.current) return
      const travel = context.conditions.mobile ? mobileDistance : distance
      if (!travel) return
      gsap.fromTo(ref.current, { y: -travel }, {
        y: travel, ease: 'none',
        scrollTrigger: { trigger: ref.current.closest('article, section') ?? ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    })
    return () => media.revert()
  }, [distance, mobileDistance])
  return <div ref={ref} {...props}>{children}</div>
}
