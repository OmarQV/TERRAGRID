import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from 'motion/react'
import { CircleDot } from 'lucide-react'
import type { ProductLine } from '../data/content'
import type { ScrollProgress } from '../lib/animation'
import { gsap } from '../lib/animation'
import Parallax from './Parallax'

const ProductCanvas = lazy(() => import('./ProductCanvas'))

class ModelBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onError() }
  render() { return this.state.failed ? null : this.props.children }
}

type Props = { product: ProductLine; progress: ScrollProgress; compact?: boolean; active?: boolean }

export default function ProductStage({ product, progress, compact = false, active = true }: Props) {
  const shell = useRef<HTMLDivElement>(null)
  const progressBar = useRef<HTMLSpanElement>(null)
  const displayed = useRef(product)
  const [displayProduct, setDisplayProduct] = useState(product)
  const [readyModel, setReadyModel] = useState('')
  const reduceMotion = useReducedMotion()
  const [supports3D, setSupports3D] = useState(false)
  const [nearby, setNearby] = useState(false)
  const [failed, setFailed] = useState(false)
  const modelReady = readyModel === displayProduct.model
  const show3D = supports3D && nearby && active && !reduceMotion && !failed
  const handleModelReady = useCallback(() => setReadyModel(displayProduct.model), [displayProduct.model])
  const handleError = useCallback(() => setFailed(true), [])

  // Keep the old model visible during the fade-out, then reveal the next poster/model.
  useEffect(() => {
    const element = shell.current
    if (!element) return
    if (displayed.current.id === product.id) {
      gsap.to(element, { autoAlpha: 1, y: 0, duration: 0.2, overwrite: true })
      return
    }
    if (reduceMotion) {
      displayed.current = product
      let cancelled = false
      queueMicrotask(() => { if (!cancelled) setDisplayProduct(product) })
      gsap.set(element, { autoAlpha: 1, y: 0 })
      return () => { cancelled = true }
    }
    const transition = gsap.timeline()
      .to(element, { autoAlpha: 0.12, y: 12, duration: 0.26, ease: 'power2.in' })
      .call(() => {
        displayed.current = product
        setDisplayProduct(product)
      })
      .to(element, { autoAlpha: 1, y: 0, duration: 0.48, ease: 'power2.out' })
    return () => { transition.kill() }
  }, [product, reduceMotion])

  useEffect(() => {
    const query = window.matchMedia('(min-width: 320px)')
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    const update = () => setSupports3D(query.matches && !connection?.saveData)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!supports3D || reduceMotion || !active) return
    const observer = new IntersectionObserver(([entry]) => {
      setNearby(entry.isIntersecting)
    }, { rootMargin: compact ? '120px' : '400px' })
    if (shell.current) observer.observe(shell.current)
    return () => observer.disconnect()
  }, [supports3D, reduceMotion, active, compact])

  useEffect(() => {
    if (reduceMotion) return
    return progress.subscribe((value) => {
      if (progressBar.current) progressBar.current.style.transform = `scaleX(${value})`
    })
  }, [progress, reduceMotion])

  return (
    <div ref={shell} className={`product-stage-shell ${compact ? 'is-compact' : ''}`} style={{ '--product-accent': displayProduct.accent } as React.CSSProperties}>
      <div className="stage-topline">
        <span><CircleDot size={13} /> Modelo conceptual</span>
        <span className="stage-status">{displayProduct.status}</span>
      </div>

      <div className="stage-viewport">
        <Parallax className="stage-atmosphere" distance={32} mobileDistance={10} aria-hidden="true" />
        <Parallax className="stage-poster-layer" distance={-18} mobileDistance={-8}>
          <img
            key={displayProduct.poster}
            src={displayProduct.poster}
            alt={`Vista conceptual de ${displayProduct.name}`}
            className={`product-poster ${show3D && modelReady ? 'is-hidden' : ''}`}
            loading="lazy"
            decoding="async"
          />
        </Parallax>

        {show3D && (
          <ModelBoundary onError={handleError}>
            <Suspense fallback={null}>
              <ProductCanvas
                product={displayProduct}
                modelReady={modelReady}
                progress={progress}
                compact={compact}
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
        <span>{displayProduct.index} / 03</span>
        <span>{show3D ? compact ? 'Modelo 3D · Desliza para avanzar' : 'Arrastra para explorar' : 'Vista conceptual'}</span>
      </div>
      <div className="stage-progress" aria-hidden="true"><span ref={progressBar} /></div>
    </div>
  )
}
