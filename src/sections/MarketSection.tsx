import { useLayoutEffect, useRef } from 'react'
import AgricultureParallax from '../components/AgricultureParallax'
import { MARKET_SEGMENTS } from '../data/content'
import { gsap, SplitText } from '../lib/animation'

export default function MarketSection() {
  const sheetRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const sheet = sheetRef.current
    if (!sheet) return

    const media = gsap.matchMedia()
    media.add({
      motion: '(prefers-reduced-motion: no-preference)',
      pin: '(min-width: 1200px) and (min-height: 900px)',
      mobile: '(max-width: 620px)',
    }, (context) => {
      if (!context.conditions?.motion) return

      const title = sheet.querySelector<HTMLElement>('.market-intro h2')!
      const rule = sheet.querySelector<HTMLElement>('.market-rule')!
      const label = sheet.querySelector<HTMLElement>('.market-label')!
      const follow = sheet.querySelector<HTMLElement>('.market-follow')!
      const grid = sheet.querySelector<HTMLElement>('.market-grid')!
      const cards = gsap.utils.toArray<HTMLElement>('.market-card', sheet)
      const images = gsap.utils.toArray<HTMLElement>('.market-card-image img', sheet)
      const footnote = sheet.querySelector<HTMLElement>('.market-footnote')!
      const split = SplitText.create(title, { type: 'lines', mask: 'lines', linesClass: 'market-reveal-line' })

      gsap.timeline({
        scrollTrigger: { trigger: sheet, start: 'top 82%', end: 'top 18%', scrub: 0.65, invalidateOnRefresh: true },
        defaults: { ease: 'none' },
      })
        .fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.25 }, 0)
        .fromTo(label, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.08)
        .fromTo(split.lines, { autoAlpha: 0, yPercent: 105, clipPath: 'inset(0 0 100% 0)' }, {
          autoAlpha: 1, yPercent: 0, clipPath: 'inset(0 0 0% 0)', stagger: 0.13, duration: 0.5,
        }, 0.2)
        .fromTo(follow, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.62)

      gsap.utils.toArray<HTMLElement>('[data-speed]', sheet).forEach((layer) => {
        const speed = Number(layer.dataset.speed)
        gsap.fromTo(layer, { y: 20 * speed }, {
          y: -40 * speed,
          ease: 'none',
          scrollTrigger: { trigger: sheet, start: 'top bottom', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true },
        })
      })

      if (context.conditions.mobile) {
        cards.forEach((card, index) => {
          const trigger = { trigger: card, start: 'top 92%', end: 'top 53%', scrub: 0.35 }
          gsap.fromTo(card, { autoAlpha: 0, y: 64, rotationX: 6 }, {
            autoAlpha: 1, y: 0, rotationX: 0, ease: 'none', scrollTrigger: trigger,
          })
          gsap.fromTo(images[index], { scale: 1.08 }, { scale: 1, ease: 'none', scrollTrigger: trigger })
        })
        gsap.fromTo(footnote, { autoAlpha: 0, y: 20 }, {
          autoAlpha: 1, y: 0, scrollTrigger: { trigger: footnote, start: 'top 92%', end: 'top 72%', scrub: 0.35 },
        })
      } else {
        gsap.timeline({
          scrollTrigger: context.conditions.pin
            ? { trigger: sheet, start: 'top top', end: '+=65%', scrub: 0.65, pin: true, anticipatePin: 1 }
            : { trigger: grid, start: 'top 90%', end: 'top 34%', scrub: 0.6 },
          defaults: { ease: 'none' },
        })
          .fromTo(cards, { autoAlpha: 0, y: 80, rotationX: 8, filter: 'blur(8px)' }, {
            autoAlpha: 1, y: 0, rotationX: 0, filter: 'blur(0px)', stagger: 0.15, duration: 0.65,
          }, 0)
          .fromTo(images, { scale: 1.1 }, { scale: 1, stagger: 0.15, duration: 0.8 }, 0.12)
          .fromTo(footnote, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.7)
      }

      return () => split.revert()
    })

    return () => media.revert()
  }, [])

  return (
    <section className="market" id="mercado">
      <AgricultureParallax />
      <div className="market-sheet" ref={sheetRef}>
        <div className="market-atmosphere" data-speed="0.3" aria-hidden="true">
          <img src="/img/market-atmosphere.jpg" alt="" width={1586} height={1024} loading="lazy" decoding="async" />
        </div>
        <div className="market-glow" data-speed="0.6" aria-hidden="true" />

        <div className="market-content section-shell-wide" data-speed="1">
          <header className="market-intro">
            <span className="market-rule" aria-hidden="true" />
            <p className="market-label">Mercado inicial · Departamento de La Paz</p>
            <h2>La primera oferta no vende una máquina: <strong>entrega plantines y evidencia de cada lote</strong></h2>
            <p className="market-follow">El hardware aparece después, cuando el proceso haya sido validado</p>
          </header>

          <div className="market-grid">
            {MARKET_SEGMENTS.map((segment, index) => {
              const Icon = segment.icon
              return (
                <article className="market-card" key={segment.title}>
                  <div className="market-card-top">
                    <span className="market-card-icon"><Icon size={21} strokeWidth={1.7} aria-hidden="true" /></span>
                    <span className="market-card-number">0{index + 1}</span>
                  </div>
                  <h3>{segment.title}</h3>
                  <p>{segment.copy}</p>
                  <div className="market-card-image">
                    <img src={segment.image} alt={segment.imageAlt} width={1586} height={1024} loading="lazy" decoding="async" />
                  </div>
                </article>
              )
            })}
          </div>

          <p className="market-footnote"><span>Por validar</span> Pérdidas en germinación, costo por plantín aceptado, frecuencia de compra y disposición de pago</p>
        </div>
      </div>
    </section>
  )
}
