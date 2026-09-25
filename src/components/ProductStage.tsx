import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { CircleDot } from 'lucide-react'
import type { ProductLine } from '../data/content'

const ProductCanvas = lazy(() => import('./ProductCanvas'))

export default function ProductStage({ product }: { product: ProductLine }) {
  const [modelReady, setModelReady] = useState(false)
  const reduceMotion = useReducedMotion()
  const [supports3D, setSupports3D] = useState(false)
  const handleModelReady = useCallback(() => setModelReady(true), [])

  useEffect(() => {
    const query = window.matchMedia('(min-width: 840px)')
    const update = () => setSupports3D(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return (
    <div className="product-stage-shell" style={{ '--product-accent': product.accent } as React.CSSProperties}>
      <div className="stage-topline">
        <span><CircleDot size={13} /> Modelo conceptual</span>
        <span className="stage-status">{product.status}</span>
      </div>

      <div className="stage-viewport">
        <motion.img
          key={product.poster}
          src={product.poster}
          alt={`Vista conceptual de ${product.name}`}
          className={`product-poster ${supports3D && modelReady ? 'is-hidden' : ''}`}
          initial={{ opacity: 0, scale: 1.025 }}
          animate={{ opacity: supports3D && modelReady ? 0 : 1, scale: 1 }}
          transition={{ duration: 0.45 }}
        />

        {supports3D && (
          <Suspense fallback={null}>
            <ProductCanvas
              product={product}
              modelReady={modelReady}
              reduceMotion={reduceMotion}
              onReady={handleModelReady}
            />
          </Suspense>
        )}

        {supports3D && !modelReady && (
          <div className="model-loader" aria-live="polite">
            <span /> Preparando modelo 3D
          </div>
        )}

        <div className="stage-orbit" aria-hidden="true" />
      </div>

      <div className="stage-footer">
        <span>{product.index} / 03</span>
        <span>{supports3D ? 'Arrastra para explorar' : 'Vista optimizada para móvil'}</span>
      </div>
    </div>
  )
}
