import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/animation'

type Motion = {
  backgroundY: number
  subjectY: number
  benchY: number
  foregroundY: number
  foregroundExitY: number
  copyY: number
}

const DESKTOP: Motion = { backgroundY: -4, subjectY: -7, benchY: -8, foregroundY: -13, foregroundExitY: -17, copyY: -60 }
const TABLET: Motion = { backgroundY: -3, subjectY: -5, benchY: -6, foregroundY: -9, foregroundExitY: -12, copyY: -40 }

export default function AgricultureParallax() {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const scene = root.current
    if (!scene) return

    const background = scene.querySelector<HTMLElement>('.agri-parallax-background')!
    const subject = scene.querySelector<HTMLElement>('.agri-parallax-subject')!
    const bench = scene.querySelectorAll<HTMLElement>('.agri-parallax-bench')
    const foreground = scene.querySelector<HTMLElement>('.agri-parallax-foreground')!
    const copy = scene.querySelector<HTMLElement>('.agri-parallax-content')!
    const lines = scene.querySelectorAll<HTMLElement>('.agri-line-inner')
    const media = gsap.matchMedia()

    const animate = (motion: Motion | 'mobile') => {
      // El fondo tiene margen de zoom para que no asome un borde al desplazarse.
      gsap.set(background, { scale: motion === 'mobile' ? 1.15 : 1.08, yPercent: 0, filter: 'brightness(0.82)' })
      gsap.set(subject, { scale: 1, yPercent: 0, xPercent: 0 })
      gsap.set(bench, { scale: 1, yPercent: 0, xPercent: 0 })
      gsap.set(foreground, { scale: 1, yPercent: 0, xPercent: 0 })

      gsap.timeline({ scrollTrigger: { trigger: scene, start: 'top bottom', end: 'top top', scrub: true } })
        .fromTo(subject, { opacity: 0, y: 36 }, { opacity: 1, y: 0, ease: 'none' }, 0)
        .fromTo(bench, { opacity: 0, y: 44 }, { opacity: 1, y: 0, ease: 'none' }, 0)
        .fromTo(foreground, { opacity: 0, y: 56 }, { opacity: 1, y: 0, ease: 'none' }, 0)

      gsap.timeline({ scrollTrigger: { trigger: scene, start: 'top 78%', end: 'top top', scrub: true } })
        .fromTo(lines, { yPercent: 120 }, { yPercent: 0, duration: 1, stagger: 0.08, ease: 'power4.out' })

      if (motion === 'mobile') {
        // Distancias basadas en la pantalla: los porcentajes de estas imágenes
        // equivalían a apenas unos píxeles en un teléfono.
        gsap.timeline({
          scrollTrigger: { trigger: scene, start: 'top top', end: 'bottom bottom', scrub: 0.25, invalidateOnRefresh: true },
          defaults: { ease: 'none', duration: 1 },
        })
          .to(background, { scale: 1.23, y: () => -Math.min(window.innerHeight * 0.035, 28) }, 0)
          .to(subject, { y: () => -Math.min(window.innerHeight * 0.09, 72) }, 0)
          .to(bench, { y: () => -Math.min(window.innerHeight * 0.13, 104) }, 0)
          .to(foreground, { y: () => -Math.min(window.innerHeight * 0.17, 136) }, 0)
          .to(copy, { y: () => -Math.min(window.innerHeight * 0.035, 28) }, 0)
        return
      }

      const { backgroundY, subjectY, benchY, foregroundY, foregroundExitY, copyY } = motion
      gsap.timeline({
        scrollTrigger: { trigger: scene, start: 'top top', end: 'bottom bottom', scrub: 1.2, invalidateOnRefresh: true },
        defaults: { ease: 'none' },
      })
        .to(background, { scale: 1.13, yPercent: backgroundY, filter: 'brightness(0.9)', duration: 0.85 }, 0)
        .to(subject, { scale: 1.025, xPercent: 1.5, yPercent: subjectY, duration: 0.85 }, 0)
        .to(bench, { scale: 1.045, yPercent: benchY, duration: 0.85 }, 0)
        .to(foreground, { scale: 1.08, xPercent: -1, yPercent: foregroundY, duration: 0.85 }, 0)
        .to(copy, { y: copyY, opacity: 0.88, duration: 1 }, 0)
        .to(background, { filter: 'brightness(0.7)', duration: 0.15 }, 0.85)
        .to(subject, { opacity: 0.75, duration: 0.15 }, 0.85)
        .to(foreground, { yPercent: foregroundExitY, duration: 0.15 }, 0.85)
    }

    media.add('(min-width: 1200px) and (prefers-reduced-motion: no-preference)', () => animate(DESKTOP), scene)
    media.add('(min-width: 621px) and (max-width: 1199px) and (prefers-reduced-motion: no-preference)', () => animate(TABLET), scene)
    media.add('(max-width: 620px) and (prefers-reduced-motion: no-preference)', () => animate('mobile'), scene)

    return () => media.revert()
  }, [])

  return (
    <div className="agri-parallax" ref={root}>
      <div className="agri-parallax-sticky">
        <div className="agri-parallax-layers" aria-hidden="true">
          <img className="agri-parallax-background" src="/img/prx1.png" alt="" width={1672} height={941} loading="lazy" decoding="async" />
          <img className="agri-parallax-bench agri-parallax-bench-back" src="/img/agriculture-bench-final.png" alt="" width={1672} height={941} loading="lazy" decoding="async" />
          <img className="agri-parallax-subject" src="/img/agriculture-subject.png" alt="" width={1670} height={942} loading="lazy" decoding="async" />
          <img className="agri-parallax-bench agri-parallax-bench-front" src="/img/agriculture-bench-final.png" alt="" width={1672} height={941} loading="lazy" decoding="async" />
          <div className="agri-parallax-shade" />
          <img className="agri-parallax-foreground" src="/img/agriculture-foreground.png" alt="" width={1670} height={942} loading="lazy" decoding="async" />
        </div>
        <div className="agri-parallax-content">
          <p className="eyebrow">Mercado inicial · Departamento de La Paz</p>
          <h2>
            <span className="agri-line-mask"><span className="agri-line-inner">El usuario necesita</span></span>
            <span className="agri-line-mask"><span className="agri-line-inner">confiabilidad.</span></span>
            <span className="agri-line-mask"><span className="agri-line-inner">El comprador necesita</span></span>
            <span className="agri-line-mask"><span className="agri-line-inner agri-line-accent">resultados.</span></span>
          </h2>
        </div>
      </div>
    </div>
  )
}
