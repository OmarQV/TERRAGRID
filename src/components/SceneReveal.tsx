import { useLayoutEffect, useRef } from 'react'
import { gsap, SplitText } from '../lib/animation'

type Props = {
  image: string
  eyebrow: string
  title: string
  /** id del ancla de la escena: cae con el título ya revelado (ver `.scene-anchor`). */
  anchorId?: string
}

/*
 * Escena por capas: la foto queda fija tras la página (position: fixed recortada por
 * el clip-path de `.scene`) y las secciones vecinas la destapan o la cubren al pasar.
 * Guion en unidades de svh de scroll (`.scene` mide 310svh; el trigger va de "su borde
 * superior entra por abajo" a "su base toca el borde inferior", es decir 310svh):
 *    0 – 100  la sección anterior sube y descubre la escena
 *  100 – 210  la escena queda fija con el título revelado
 *  210 – 310  la sección siguiente sube y la cubre
 * Con Lenis basta `scrub: true`: el suavizado ya lo pone el scroll, no la animación.
 */
const LENGTH = 310

export default function SceneReveal({ image, eyebrow, title, anchorId }: Props) {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const scene = root.current!
      const scrollTrigger = () => ({
        trigger: scene, start: 'top bottom', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true,
      })

      // Cámara: la foto se aclara y se aleja mientras se hace fija; al llegar la siguiente capa se oscurece.
      gsap.timeline({ scrollTrigger: scrollTrigger(), defaults: { ease: 'none' } })
        .fromTo('.scene-veil', { opacity: 0.8 }, { opacity: 0.1, duration: 190 }, 0)
        .fromTo('.scene-image', { scale: 1.14 }, { scale: 1, duration: 210 }, 0)
        .to('.scene-veil', { opacity: 0.5, duration: 100 }, 210)

      // Títulos: cada línea sube desde una máscara, atada al scroll (entra y sale línea por línea).
      const split = SplitText.create(scene.querySelectorAll('.scene-copy > *'), {
        type: 'lines', mask: 'lines', linesClass: 'reveal-line', autoSplit: true,
        onSplit(self) {
          // Estado inicial explícito: con stagger, GSAP solo aplica el "desde" de cada línea al llegar su turno.
          gsap.set(self.lines, { yPercent: 110 })
          return gsap.timeline({ scrollTrigger: scrollTrigger() })
            .fromTo(self.lines, { yPercent: 110 }, { yPercent: 0, duration: 40, stagger: 14, ease: 'power2.out' }, 65)
            .to(self.lines, { yPercent: -110, duration: 40, stagger: 8, ease: 'power2.in' }, 225)
            .set({}, {}, LENGTH)
        },
      })
      return () => split.revert()
    }, root)
    return () => media.revert()
  }, [])

  return (
    <div className="scene" ref={root}>
      <div className="scene-media" aria-hidden="true">
        <img className="scene-image" src={image} alt="" width={1672} height={941} decoding="async" />
        <div className="scene-veil" />
        <div className="scene-scrim" />
      </div>

      <div className="scene-stage">
        <div className="scene-copy">
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
      </div>

      {anchorId && <span id={anchorId} className="scene-anchor" />}
    </div>
  )
}
