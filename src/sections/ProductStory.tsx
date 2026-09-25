import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { BadgeCheck, Check, Sprout } from 'lucide-react'
import scene from '../assets/scene-semilla.webp'
import ProductStage from '../components/ProductStage'
import Reveal from '../components/Reveal'
import SceneReveal from '../components/SceneReveal'
import { useSmoothScroll } from '../lib/scroll-context'
import { gsap, ScrollTrigger, ScrollProgress } from '../lib/animation'
import { PRODUCT_LINES } from '../data/content'

export default function ProductStory() {
  const [activeProduct, setActiveProduct] = useState(0)
  const chapterRefs = useRef<Array<HTMLElement | null>>([])
  const scrollTo = useSmoothScroll()
  const progress = useMemo(() => PRODUCT_LINES.map(() => new ScrollProgress()), [])

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      chapterRefs.current.forEach((chapter, index) => {
        if (!chapter) return
        ScrollTrigger.create({
          trigger: chapter, start: 'top center', end: 'bottom center',
          onEnter: () => setActiveProduct(index),
          onEnterBack: () => setActiveProduct(index),
          onRefresh: (self) => { if (self.isActive) setActiveProduct(index) },
        })
        ScrollTrigger.create({
          trigger: chapter, start: 'top bottom', end: 'bottom top',
          onUpdate: (self) => progress[index].set(self.progress),
          onRefresh: (self) => progress[index].set(self.progress),
        })
      })
    })
    return () => context.revert()
  }, [progress])

  const active = PRODUCT_LINES[activeProduct]

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
        <div className="product-story-grid section-shell-wide">
          <div className="product-copy-column">
            {PRODUCT_LINES.map((product, index) => {
              const Icon = product.icon
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
                    <ProductStage product={product} progress={progress[index]} posterOnly />
                  </div>
                  <Reveal className="product-copy-card">
                    <div className="product-meta">
                      <span>{product.index}</span>
                      <span>{product.phase}</span>
                    </div>
                    <div className="product-icon"><Icon size={24} /></div>
                    <p className="eyebrow">{product.eyebrow}</p>
                    <h3>{product.name}</h3>
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
              <ProductStage product={active} progress={progress[activeProduct]} />
              <nav className="product-nav" aria-label="Cambiar línea de producto">
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
                    <strong>{product.name.replace('TERRAGRID ', '')}</strong>
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
