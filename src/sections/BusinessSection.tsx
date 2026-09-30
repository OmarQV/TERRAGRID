import { useLayoutEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { BUSINESS_PHASES } from '../data/content'
import { gsap, SplitText } from '../lib/animation'

export default function BusinessSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const media = gsap.matchMedia()
    media.add({ motion: '(prefers-reduced-motion: no-preference)', mobile: '(max-width: 620px)' }, (context) => {
      if (!context.conditions?.motion) return

      const mobile = Boolean(context.conditions.mobile)
      const background = section.querySelector<HTMLElement>('.business-background')!
      const subject = section.querySelector<HTMLElement>('.business-subject')!
      const foreground = section.querySelector<HTMLElement>('.business-foreground')!
      const label = section.querySelector<HTMLElement>('.business-heading .eyebrow')!
      const heading = section.querySelector<HTMLElement>('.business-heading h2')!
      const description = section.querySelector<HTMLElement>('.business-heading > p:last-child')!
      const flow = section.querySelector<HTMLElement>('.business-flow')!
      const roadmap = section.querySelector<HTMLElement>('.business-roadmap')!
      const cards = gsap.utils.toArray<HTMLElement>('.business-card', section)
      const photos = gsap.utils.toArray<HTMLElement>('.business-card-photo img', section)
      const split = SplitText.create(heading, { type: 'lines', mask: 'lines', linesClass: 'business-reveal-line' })

      const sceneTrigger = { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 0.65, invalidateOnRefresh: true }
      gsap.fromTo(background, { y: 0, scale: 1.05 }, {
        y: mobile ? -44 : -80, scale: 1.05, ease: 'none', scrollTrigger: sceneTrigger,
      })
      gsap.fromTo(foreground, { y: 0 }, {
        y: mobile ? -150 : -300, ease: 'none', scrollTrigger: sceneTrigger,
      })
      gsap.fromTo(subject, { y: 0, autoAlpha: mobile ? 0.78 : 0.9, filter: 'brightness(0.96) blur(2px)' }, {
        y: mobile ? -100 : -180, autoAlpha: mobile ? 0.68 : 0.72, filter: 'brightness(0.96) blur(0px)', ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 0.55 },
      })

      gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top 83%', end: 'top 20%', scrub: 0.55 },
        defaults: { ease: 'none' },
      })
        .fromTo(label, { autoAlpha: 0, y: 35 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0)
        .fromTo(split.lines, { autoAlpha: 0, y: 80, clipPath: 'inset(0 0 100% 0)' }, {
          autoAlpha: 1, y: 0, clipPath: 'inset(0 0 0% 0)', stagger: 0.13, duration: 0.48,
        }, 0.15)
        .fromTo(description, { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.67)
        .fromTo(flow, { autoAlpha: 0, scaleX: 0.8 }, { autoAlpha: 1, scaleX: 1, duration: 0.28 }, 0.79)

      if (mobile) {
        cards.forEach((card, index) => {
          const trigger = { trigger: card, start: 'top 94%', end: 'top 56%', scrub: 0.35 }
          gsap.fromTo(card, { autoAlpha: 0, y: 68, rotationX: 5 }, {
            autoAlpha: 1, y: 0, rotationX: 0, ease: 'none', scrollTrigger: trigger,
          })
          gsap.fromTo(photos[index], { scale: 1.09 }, { scale: 1, ease: 'none', scrollTrigger: trigger })
        })
      } else {
        gsap.timeline({
          scrollTrigger: { trigger: roadmap, start: 'top 92%', end: 'top 35%', scrub: 0.7 },
          defaults: { ease: 'none' },
        })
          .fromTo(cards, { autoAlpha: 0, y: 80, rotationX: 8, filter: 'blur(8px)' }, {
            autoAlpha: 1, y: 0, rotationX: 0, filter: 'blur(0px)', stagger: 0.15, duration: 0.65,
          }, 0)
          .fromTo(photos, { scale: 1.1 }, { scale: 1, stagger: 0.15, duration: 0.8 }, 0.08)
      }

      return () => split.revert()
    }, section)

    return () => media.revert()
  }, [])

  return (
    <section className="business" id="modelo" ref={sectionRef}>
      <div className="business-scene" aria-hidden="true">
        <img className="business-background" src="/img/business-background.jpg" alt="" width={1672} height={941} loading="lazy" decoding="async" />
        <div className="business-scrim" />
        <img className="business-subject" src="/img/business-subject.png" alt="" width={1672} height={941} loading="lazy" decoding="async" />
        <img className="business-foreground" src="/img/business-foreground.png" alt="" width={1672} height={941} loading="lazy" decoding="async" />
      </div>

      <div className="business-content section-shell-wide">
        <header className="business-heading">
          <p className="eyebrow">Modelo de negocio por etapas</p>
          <h2>Vender el <span>resultado</span> primero. Desplegar la infraestructura después.</h2>
          <p>Un modelo que reduce el riesgo, valida la demanda<br className="business-desktop-break" /> y escala con evidencia real.</p>
        </header>

        <div className="business-flow" aria-hidden="true">
          <span className="business-flow-line" />
          <span className="business-flow-cue"><span /></span>
        </div>

        <div className="business-roadmap">
          {BUSINESS_PHASES.map((phase) => (
            <article className={`business-card${phase.now ? ' is-now' : ''}`} key={phase.phase}>
              <div className="business-card-photo">
                <img src={phase.image} alt={phase.imageAlt} width={1536} height={1024} loading="lazy" decoding="async" />
              </div>
              <div className="business-card-body">
                <div className="business-phase">
                  <span>{phase.phase}</span>
                  {phase.now && <em>Inicio</em>}
                </div>
                <p className="business-kicker">{phase.label}</p>
                <h3>{phase.title}</h3>
                <div className="business-line" />
                <p className="business-copy">{phase.copy}</p>
              </div>
              <span className="business-card-arrow" aria-hidden="true"><ArrowRight size={20} strokeWidth={1.8} /></span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
