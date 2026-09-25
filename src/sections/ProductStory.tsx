import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { BadgeCheck, Check, Sprout } from 'lucide-react'
import scene from '../assets/scene-semilla.webp'
import ProductStage from '../components/ProductStage'
import Parallax from '../components/Parallax'
import Reveal from '../components/Reveal'
import SceneReveal from '../components/SceneReveal'
import { useSmoothScroll } from '../lib/scroll-context'
import { gsap, ScrollTrigger, ScrollProgress, smoothFollow } from '../lib/animation'
import { smoothstep } from '../lib/product-motion'
import { useReducedMotion } from '../lib/use-reduced-motion'
import { PRODUCT_LINES } from '../data/content'

export default function ProductStory() {
  const [activeProduct, setActiveProduct] = useState(0)
  const chapterRefs = useRef<Array<HTMLElement | null>>([])
  const gridRef = useRef<HTMLDivElement>(null)
  const scrollTo = useSmoothScroll()
  const reduceMotion = useReducedMotion()
  // Foco continuo (0 = SEED, 1 = GROW, 2 = SEED BANK): `focus` lo calcula el scroll y `position` lo sigue con suavidad.
  const focus = useMemo(() => new ScrollProgress(0), [])
  const position = useMemo(() => new ScrollProgress(0), [])
  // Avance 0–1 de cada capítulo (inclina el modelo en celular) y un foco fijo para los escenarios de una sola pieza.
  const progress = useMemo(() => PRODUCT_LINES.map(() => new ScrollProgress()), [])
  const single = useMemo(() => new ScrollProgress(0), [])

  useLayoutEffect(() => {
    const chapters = chapterRefs.current.filter((chapter): chapter is HTMLElement => Boolean(chapter))
    const stopFollowing = reduceMotion ? undefined : smoothFollow(focus, position)
    const context = gsap.context(() => {
      let centers: number[] = []
      const measure = () => {
        centers = chapters.map((chapter) => {
          const box = chapter.getBoundingClientRect()
          return box.top + window.scrollY + box.height / 2
        })
      }
      const update = () => {
        const middle = window.scrollY + window.innerHeight / 2
        // Entre dos centros de capítulo el foco avanza con una meseta: el producto descansa y cambia en el tramo medio.
        let value = 0
        if (middle >= centers[centers.length - 1]) value = centers.length - 1
        else if (middle > centers[0]) {
          const index = centers.findIndex((center, at) => middle >= center && middle < centers[at + 1])
          value = index + smoothstep(0.22, 0.78, (middle - centers[index]) / (centers[index + 1] - centers[index]))
        }
        focus.set(value)
        if (reduceMotion) position.set(Math.round(value))
        setActiveProduct(Math.round(value))
        // El texto del capítulo lejos del centro baja de intensidad (--focus; solo lo usa el diseño de escritorio).
        chapters.forEach((chapter, at) => {
          const distance = Math.abs(middle - centers[at]) / (chapter.offsetHeight / 2)
          chapter.style.setProperty('--focus', reduceMotion ? '1' : (1 - smoothstep(0.3, 1, distance)).toFixed(3))
        })
      }
      ScrollTrigger.create({
        trigger: gridRef.current, start: 'top bottom', end: 'bottom top',
        onUpdate: update, onRefresh: () => { measure(); update() },
      })
      chapters.forEach((chapter, index) => ScrollTrigger.create({
        trigger: chapter, start: 'top bottom', end: 'bottom top',
        onUpdate: (self) => progress[index].set(self.progress),
        onRefresh: (self) => progress[index].set(self.progress),
      }))
    })
    return () => {
      context.revert()
      stopFollowing?.()
    }
  }, [focus, position, progress, reduceMotion])

  const goToProduct = (index: number) => {
    const chapter = chapterRefs.current[index]
    if (chapter) scrollTo(chapter, true)
  }

  return (
    <section className="product-story">
      <SceneReveal
        image={scene}
        anchorId="lineas"
        eyebrow="Una plataforma · Tres líneas"
        title="El roadmap se recorre como evoluciona una semilla."
      />

      <div className="product-sheet">
        <div className="product-sheet-backdrop" aria-hidden="true">
          <Parallax className="product-sheet-photo" distance={36} mobileDistance={12}>
            <img
              src="/img/fondo%20contenedores.png"
              alt=""
              width={1672}
              height={941}
              loading="lazy"
              decoding="async"
            />
          </Parallax>
          <div className="product-sheet-shade" />
        </div>
        <div className="product-story-grid" ref={gridRef}>
          <div className="product-copy-column">
            {PRODUCT_LINES.map((product, index) => {
              const Icon = product.icon
              const [first, ...rest] = product.name.split(' ')
              const isActive = index === activeProduct
              return (
                <article
                  className={`product-chapter ${isActive ? 'is-active' : ''}`}
                  id={product.id}
                  key={product.id}
                  data-product-index={index}
                  ref={(node) => { chapterRefs.current[index] = node }}
                  style={{ '--product-accent': product.accent } as React.CSSProperties}
                >
                  <div className="product-mobile-visual">
                    <ProductStage products={[product]} position={single} tilt={progress[index]} compact />
                  </div>
                  <Reveal className="product-copy-card">
                    <div className="product-meta">
                      <span>{product.index}</span>
                      <span>{product.phase}</span>
                    </div>
                    <div className="product-icon"><Icon size={24} /></div>
                    <p className="eyebrow">{product.eyebrow}</p>
                    <h3>
                      <span>{first}</span>
                      <span className="product-title-accent">{rest.join(' ')}</span>
                    </h3>
                    <h4>{product.headline}</h4>
                    <p className="product-description">{product.description}</p>
                    <div className="product-facts">
                      <span><Sprout size={15} /> {product.crops}</span>
                      <span><BadgeCheck size={15} /> {product.purpose}</span>
                    </div>
                    <ul>
                      {product.features.map((feature) => <li key={feature}><Check size={16} /> {feature}</li>)}
                    </ul>
                    <p className="product-note">{product.note}</p>
                  </Reveal>
                </article>
              )
            })}
          </div>

          <aside className="product-visual-column" aria-label="Modelos conceptuales TERRAGRID">
            <div className="product-visual-sticky">
              <ProductStage products={PRODUCT_LINES} position={position} decorative />
              <nav className="pnav" aria-label="Cambiar línea de producto">
                {PRODUCT_LINES.map((product, index) => (
                  <button
                    key={product.id}
                    type="button"
                    className={index === activeProduct ? 'is-active' : ''}
                    onClick={() => goToProduct(index)}
                    aria-label={`Ver ${product.name}`}
                    aria-current={index === activeProduct ? 'step' : undefined}
                    aria-controls={product.id}
                  >
                    <span>{product.index}</span>
                    <i aria-hidden="true" />
                  </button>
                ))}
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
