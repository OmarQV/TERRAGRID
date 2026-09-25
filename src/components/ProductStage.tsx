import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import type { ProductLine } from '../data/content'
import type { ScrollProgress } from '../lib/animation'
import { smoothstep, sunk } from '../lib/product-motion'
import { useReducedMotion } from '../lib/use-reduced-motion'
import SensorPanel from './SensorPanel'
import type { Drag } from './ProductCanvas'

const ProductCanvas = lazy(() => import('./ProductCanvas'))

class ModelBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onError() }
  render() { return this.state.failed ? null : this.props.children }
}

type NetworkInformation = { saveData?: boolean; effectiveType?: string; type?: string }

/** WebGL disponible y una conexión/equipo que aguante los modelos (pesan entre 11 y 21 MB). */
function canRender3D() {
  const nav = navigator as Navigator & { connection?: NetworkInformation; deviceMemory?: number }
  if (nav.connection?.saveData) return false
  if (['slow-2g', '2g', '3g'].includes(nav.connection?.effectiveType ?? '')) return false
  // Con datos móviles no se descargan 50 MB de modelos sin que nadie lo pida: se queda la foto.
  if (nav.connection?.type === 'cellular') return false
  if (nav.deviceMemory && nav.deviceMemory < 4) return false
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    return Boolean(gl)
  } catch {
    return false
  }
}

type Props = {
  products: ProductLine[]
  /** Posición continua del foco (0 = primero, 1 = segundo…). */
  position: ScrollProgress
  /** Avance 0–1 del capítulo: inclina un poco el modelo (solo celular). */
  tilt?: ScrollProgress
  /** Celular: un escenario por producto, sin arrastre y con render más ligero. */
  compact?: boolean
  /** Escenario duplicado del que ya hay otro accesible: no se anuncia a lectores de pantalla. */
  decorative?: boolean
}

/**
 * Producto sobre la plataforma del fondo: foto con fondo transparente y, si el equipo lo permite,
 * el modelo 3D encima. `position` decide cuál está en pie y cuál hundido, así el cambio entre
 * productos avanza con el scroll (Lenis + GSAP) en lugar de dispararse de golpe.
 */
export default function ProductStage({ products, position, tilt, compact = false, decorative = false }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const posters = useRef<Array<HTMLImageElement | null>>([])
  const panels = useRef<Array<HTMLDivElement | null>>([])
  const [drag] = useState<Drag>(() => ({ value: 0 }))
  const reduceMotion = useReducedMotion()
  const [capable] = useState(canRender3D)
  const [near, setNear] = useState(false)
  const [failed, setFailed] = useState(false)
  const [ready, setReady] = useState<Record<string, boolean>>({})
  const show3D = capable && !reduceMotion && !failed && near
  const handleError = useCallback(() => setFailed(true), [])
  const handleReady = useCallback((id: string) => setReady((current) => (current[id] ? current : { ...current, [id]: true })), [])

  // Foto y panel de cada producto según su distancia al foco. No pasa por React: se escribe directo al DOM.
  useEffect(() => position.subscribe((value) => {
    products.forEach((_, index) => {
      const distance = index - value
      const hidden = sunk(distance)
      const poster = posters.current[index]
      if (poster) {
        poster.style.transform = `translate3d(0, ${hidden * 106}%, 0)`
        poster.style.visibility = hidden >= 1 ? 'hidden' : 'visible'
      }
      const panel = panels.current[index]
      if (panel) {
        const opacity = 1 - smoothstep(0.06, 0.4, Math.abs(distance))
        panel.style.opacity = String(opacity)
        panel.style.transform = `translate3d(0, ${distance * 18}px, 0)`
        panel.style.visibility = opacity <= 0.01 ? 'hidden' : 'visible'
      }
    })
  }), [position, products])

  // El lienzo solo existe mientras el escenario está cerca de la pantalla (libera la GPU al alejarse).
  useEffect(() => {
    if (!capable || reduceMotion || !root.current) return
    const observer = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: compact ? '160px' : '400px' })
    observer.observe(root.current)
    return () => observer.disconnect()
  }, [capable, reduceMotion, compact])

  const any3D = show3D && products.some((product) => ready[product.id])

  return (
    <div ref={root} className={`pstage ${compact ? 'is-compact' : ''}`} aria-hidden={decorative || undefined}>
      <svg className="pstage-arcs" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M2 74 C 4 34, 34 6, 68 8 C 84 9, 93 16, 98 27" />
        <path d="M0 58 C 2 30, 22 14, 44 12" />
      </svg>

      <div className="pstage-scene">
        <div className="pstage-shadow" aria-hidden="true" />
        <div className="pstage-floor">
          {products.map((product, index) => (
            <img
              key={product.id}
              ref={(node) => { posters.current[index] = node }}
              className={`pstage-poster ${show3D && ready[product.id] ? 'is-3d' : ''}`}
              src={product.poster}
              alt={decorative ? '' : `Vista conceptual de ${product.name}`}
              width={product.posterWidth}
              height={product.posterHeight}
              loading={index === 0 || compact ? 'eager' : 'lazy'}
              decoding="async"
              draggable={false}
            />
          ))}
          {show3D && (
            <ModelBoundary onError={handleError}>
              <Suspense fallback={null}>
                <ProductCanvas
                  products={products}
                  position={position}
                  tilt={tilt}
                  compact={compact}
                  drag={drag}
                  onModelReady={handleReady}
                  onError={handleError}
                />
              </Suspense>
            </ModelBoundary>
          )}
        </div>
      </div>

      {products.map((product, index) => (
        <div key={product.id} className="pstage-panel-slot" ref={(node) => { panels.current[index] = node }}>
          <SensorPanel readings={product.readings} accent={product.accent} />
        </div>
      ))}

      {any3D && !compact && <p className="pstage-hint" aria-hidden="true">Arrastra para girar</p>}
    </div>
  )
}
