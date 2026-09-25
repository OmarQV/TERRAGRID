import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { BadgeCheck, Check, Sprout } from 'lucide-react'
import ProductStage from '../components/ProductStage'
import { PRODUCT_LINES } from '../data/content'

export default function ProductStory() {
  const [activeProduct, setActiveProduct] = useState(0)
  const chapterRefs = useRef<Array<HTMLElement | null>>([])
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (!visible) return
        const index = Number((visible.target as HTMLElement).dataset.productIndex)
        if (!Number.isNaN(index)) setActiveProduct(index)
      },
      { rootMargin: '-34% 0px -34% 0px', threshold: [0.12, 0.35, 0.6] },
    )

    chapterRefs.current.forEach((chapter) => chapter && observer.observe(chapter))
    return () => observer.disconnect()
  }, [])

  const active = PRODUCT_LINES[activeProduct]

  const goToProduct = (index: number) => {
    setActiveProduct(index)
    chapterRefs.current[index]?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' })
  }

  return (
    <section className="product-story" id="lineas">
      <div className="product-story-intro section-shell">
        <p className="eyebrow">Una plataforma · Tres líneas</p>
        <h2>El roadmap se recorre como evoluciona una semilla.</h2>
        <p>Primero se valida la germinación. Después se amplía la producción. Finalmente se conserva y regenera el material genético.</p>
      </div>

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
                <motion.div
                  className="product-copy-card"
                  animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0.34, x: -18 }}
                  transition={{ duration: 0.45 }}
                >
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
                </motion.div>
              </article>
            )
          })}
        </div>

        <aside className="product-visual-column" aria-label="Modelos conceptuales TERRAGRID">
          <div className="product-visual-sticky">
            <ProductStage key={active.id} product={active} />
            <div className="product-nav" role="tablist" aria-label="Cambiar línea de producto">
              {PRODUCT_LINES.map((product, index) => (
                <button
                  key={product.id}
                  type="button"
                  className={index === activeProduct ? 'is-active' : ''}
                  onClick={() => goToProduct(index)}
                  aria-label={`Ver ${product.name}`}
                  aria-selected={index === activeProduct}
                  role="tab"
                >
                  <span>{product.index}</span>
                  <strong>{product.name.replace('TERRAGRID ', '')}</strong>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
