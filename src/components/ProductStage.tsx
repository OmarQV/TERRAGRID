import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from 'motion/react'
import { CircleDot } from 'lucide-react'
import type { ProductLine } from '../data/content'
import type { ScrollProgress } from '../lib/animation'
import Parallax from './Parallax'

const ProductCanvas = lazy(() => import('./ProductCanvas'))

class ModelBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onError() }
  render() { return this.state.failed ? null : this.props.children }
}

type Props = { product: ProductLine; progress: ScrollProgress; posterOnly?: boolean }

export default function ProductStage({ product, progress, posterOnly = false }: Props) {
  const shell = useRef<HTMLDivElement>(null)
  const progressBar = useRef<HTMLSpanElement>(null)
  const [readyModel, setReadyModel] = useState('')
  const reduceMotion = useReducedMotion()
  const [supports3D, setSupports3D] = useState(false)
  const [nearby, setNearby] = useState(false)
  const [failed, setFailed] = useState(false)
  const modelReady = readyModel === product.model
  const show3D = supports3D && nearby && !reduceMotion && !posterOnly && !failed
  const handleModelReady = useCallback(() => setReadyModel(product.model), [product.model])
  const handleError = useCallback(() => setFailed(true), [])

  useEffect(() => {
    if (posterOnly) return
    const query = window.matchMedia('(min-width: 981px) and (pointer: fine)')
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    const update = () => setSupports3D(query.matches && !connection?.saveData)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [posterOnly])

  useEffect(() => {
    if (!supports3D || reduceMotion || posterOnly) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setNearby(true)
        observer.disconnect()
      }
    }, { rootMargin: '400px' })
    if (shell.current) observer.observe(shell.current)
    return () => observer.disconnect()
  }, [supports3D, reduceMotion, posterOnly])

  useEffect(() => {
    if (reduceMotion) return
    return progress.subscribe((value) => {
      if (progressBar.current) progressBar.current.style.transform = `scaleX(${value})`
    })
  }, [progress, reduceMotion])

  return (
    <div ref={shell} className="product-stage-shell" style={{ '--product-accent': product.accent } as React.CSSProperties}>
      <div className="stage-topline">
        <span><CircleDot size={13} /> Modelo conceptual</span>
        <span className="stage-status">{product.status}</span>
      </div>

      <div className="stage-viewport">
        <Parallax className="stage-atmosphere" distance={32} mobileDistance={10} aria-hidden="true" />
        <Parallax className="stage-poster-layer" distance={-18} mobileDistance={-8}>
          <img
            key={product.poster}
            src={product.poster}
            alt={`Vista conceptual de ${product.name}`}
            className={`product-poster ${show3D && modelReady ? 'is-hidden' : ''}`}
            loading="lazy"
            decoding="async"
          />
        </Parallax>

        {show3D && (
          <ModelBoundary onError={handleError}>
            <Suspense fallback={null}>
              <ProductCanvas
                product={product}
                modelReady={modelReady}
                progress={progress}
                onReady={handleModelReady}
                onError={handleError}
              />
            </Suspense>
          </ModelBoundary>
        )}

        {show3D && !modelReady && (
          <div className="model-loader" aria-live="polite">
            <span /> Preparando modelo 3D
          </div>
        )}

        <Parallax className="stage-orbit-layer" distance={16} mobileDistance={5} aria-hidden="true">
          <div className="stage-orbit" />
        </Parallax>
      </div>

      <div className="stage-footer">
        <span>{product.index} / 03</span>
        <span>{show3D ? 'Arrastra para explorar' : posterOnly ? 'Vista optimizada para móvil' : 'Vista conceptual'}</span>
      </div>
      <div className="stage-progress" aria-hidden="true"><span ref={progressBar} /></div>
    </div>
  )
}
