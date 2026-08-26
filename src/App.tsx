import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Float, OrbitControls, useGLTF } from '@react-three/drei'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import * as THREE from 'three'
import {
  Activity,
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BatteryCharging,
  Blocks,
  Bot,
  Check,
  ChevronRight,
  CircleDot,
  CloudSun,
  Cpu,
  Database,
  Droplets,
  Gauge,
  Handshake,
  Leaf,
  LineChart,
  Mail,
  Menu,
  Network,
  QrCode,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Sprout,
  ThermometerSun,
  TimerReset,
  Users,
  Warehouse,
  Waves,
  X,
  type LucideIcon,
} from 'lucide-react'
import './App.css'

type ProductLine = {
  id: 'seed' | 'grow' | 'seed-bank'
  index: string
  phase: string
  status: string
  name: string
  eyebrow: string
  headline: string
  description: string
  model: string
  poster: string
  icon: LucideIcon
  accent: string
  crops: string
  purpose: string
  features: string[]
  note: string
}

const PRODUCT_LINES: ProductLine[] = [
  {
    id: 'seed',
    index: '01',
    phase: 'Ahora · MVP',
    status: 'Primera validación',
    name: 'TERRAGRID SEED',
    eyebrow: 'Microgerminación y plantines',
    headline: 'Convertir la etapa más incierta en un proceso medible.',
    description:
      'Incubadora agrícola inteligente para controlar la germinación, la emergencia y el desarrollo inicial del plantín. Registra las condiciones y los eventos de cada lote antes del trasplante.',
    model: '/models/terragrid-seed.glb',
    poster: '/products/terragrid-seed.png',
    icon: Sprout,
    accent: '#9df78f',
    crops: 'Perejil · Lechuga · Tomate',
    purpose: 'Plantines uniformes y trazables',
    features: [
      'Protocolos agronómicos por etapa',
      'Control de temperatura, humedad, luz, riego y ventilación',
      'Registro digital del lote y seguimiento posrasplante',
    ],
    note: 'El perejil será el piloto agronómico principal; la lechuga apoyará la calibración y el tomate se evaluará como plantín para trasplante.',
  },
  {
    id: 'grow',
    index: '02',
    phase: 'Siguiente fase',
    status: 'Roadmap productivo',
    name: 'TERRAGRID GROW',
    eyebrow: 'Crecimiento hidropónico',
    headline: 'Del plantín al ciclo productivo en ambiente controlado.',
    description:
      'Módulo hidropónico compacto orientado a hortalizas de hoja y hierbas. Extenderá el monitoreo hacia pH, conductividad eléctrica, nivel y temperatura de la solución nutritiva.',
    model: '/models/terragrid-grow.glb',
    poster: '/products/terragrid-grow.png',
    icon: Waves,
    accent: '#6ee7c1',
    crops: 'Lechuga · Perejil · Hojas',
    purpose: 'Producción controlada hasta cosecha',
    features: [
      'Recirculación y control de solución nutritiva',
      'Monitoreo de pH, EC, agua y energía',
      'Configuración modular según cultivo y etapa',
    ],
    note: 'GROW se desarrollará después de validar SEED. El tomate convencional continuará saliendo como plantín; no se promete su producción completa en el gabinete compacto.',
  },
  {
    id: 'seed-bank',
    index: '03',
    phase: 'Visión futura',
    status: 'Conservación distribuida',
    name: 'TERRAGRID SEED BANK',
    eyebrow: 'Microbanco inteligente',
    headline: 'Proteger la semilla, comprobar su viabilidad y regenerarla a tiempo.',
    description:
      'Sistema modular que combina conservación controlada, identificación de lotes, pruebas periódicas de germinación y un historial digital de viabilidad.',
    model: '/models/terragrid-seed-bank.glb',
    poster: '/products/terragrid-seed-bank.png',
    icon: Database,
    accent: '#f2d27d',
    crops: 'Semillas locales · Nativas · Comerciales',
    purpose: 'Conservación y pruebas de viabilidad',
    features: [
      'Zona de conservación con humedad y temperatura controladas',
      'Zona independiente para pruebas de germinación',
      'Alertas de revisión, pérdida de viabilidad y regeneración',
    ],
    note: 'SEED BANK no es una caja de almacenamiento: será una red de microbancos capaces de verificar periódicamente si cada lote continúa vivo.',
  },
]

const PROBLEM_POINTS = [
  {
    icon: TimerReset,
    title: 'Resembrar cuesta tiempo',
    copy: 'Una emergencia irregular puede obligar al productor a repetir el almácigo y retrasar todo el ciclo.',
  },
  {
    icon: CloudSun,
    title: 'El clima amplifica el riesgo',
    copy: 'En La Paz, bajas temperaturas, heladas y variaciones ambientales vuelven más vulnerable la primera etapa.',
  },
  {
    icon: ScanLine,
    title: 'La calidad llega sin historia',
    copy: 'Sin datos comparables del lote es difícil distinguir un plantín vigoroso de uno que solo parece estar listo.',
  },
]

const SYSTEM_LAYERS = [
  {
    icon: ThermometerSun,
    number: '01',
    title: 'Sensores',
    copy: 'Temperatura, humedad, luz, riego y variables del sustrato traducen el ambiente en datos útiles.',
    status: 'MVP',
  },
  {
    icon: Cpu,
    number: '02',
    title: 'Automatización local',
    copy: 'Reglas por etapa activan iluminación, ventilación y riego sin depender de conectividad permanente.',
    status: 'MVP',
  },
  {
    icon: Bot,
    number: '03',
    title: 'IA agronómica asistida',
    copy: 'El análisis de tendencias, imágenes y alertas apoyará decisiones; no reemplazará el criterio agronómico.',
    status: 'Progresivo',
  },
  {
    icon: Blocks,
    number: '04',
    title: 'Trazabilidad verificable',
    copy: 'Los hitos críticos podrán anclarse en blockchain y cerrar con una constancia digital, no una certificación oficial.',
    status: 'Roadmap',
  },
  {
    icon: BatteryCharging,
    number: '05',
    title: 'Energía modular',
    copy: 'Medición de consumo y arquitectura adaptable a red, respaldo o energía solar según el lugar de uso.',
    status: 'Roadmap',
  },
]

const VALIDATION_METRICS = [
  'Porcentaje de germinación',
  'Velocidad de emergencia',
  'Uniformidad y descarte',
  'Agua y energía',
  'Costo por plantín aceptado',
  'Supervivencia a 7, 14 y 30 días',
]

const MARKET_SEGMENTS = [
  {
    icon: Leaf,
    title: 'Productores hortícolas',
    copy: 'Plantines por lote para reducir incertidumbre antes del trasplante.',
  },
  {
    icon: Warehouse,
    title: 'Viveros y asociaciones',
    copy: 'Capacidad programada, protocolos repetibles e historial de producción.',
  },
  {
    icon: Users,
    title: 'Instituciones agrícolas',
    copy: 'Ensayos, formación, investigación aplicada y trazabilidad de lotes.',
  },
  {
    icon: Handshake,
    title: 'Aliados de implementación',
    copy: 'Agrónomos, municipios y organizaciones que puedan habilitar pilotos reales.',
  },
]

const BUSINESS_PHASES = [
  {
    phase: '01',
    label: 'Ingreso inicial',
    title: 'Venta de plantines',
    copy: 'TERRAGRID produce y entrega plantines por lote. El cliente compra el resultado, no el hardware.',
    now: true,
  },
  {
    phase: '02',
    label: 'Capacidad como servicio',
    title: 'Incubación por reserva',
    copy: 'El cliente reserva bandejas, especies y ventanas de producción dentro de una instalación TERRAGRID.',
  },
  {
    phase: '03',
    label: 'Despliegue futuro',
    title: 'Alquiler en sitio',
    copy: 'La incubadora se instala en las dependencias del cliente con soporte, monitoreo y mantenimiento.',
  },
]

const TEAM = [
  {
    photo: '/equipo/omar.png',
    name: 'Omar Quispe Vargas',
    role: 'Cofundador · Estrategia y producto',
    socials: [
      { label: 'LinkedIn', href: 'https://linkedin.com/in/omar-quispe-vargas-7b5601204', icon: FaLinkedinIn },
      { label: 'X', href: 'https://x.com/OmarQV2025', icon: FaXTwitter },
      { label: 'Facebook', href: 'https://www.facebook.com/omar.quispe.568/', icon: FaFacebookF },
      { label: 'Instagram', href: 'https://www.instagram.com/omar_aic_/', icon: FaInstagram },
    ],
  },
  {
    photo: '/equipo/carol.jpeg',
    name: 'Carol Katerine Canqui Uturunco',
    role: 'Datos, IA y validación',
    socials: [
      { label: 'LinkedIn', href: 'https://linkedin.com/in/carol-canqui', icon: FaLinkedinIn },
      { label: 'Instagram', href: 'https://www.instagram.com/carolcanqui/', icon: FaInstagram },
      { label: 'Facebook', href: 'https://www.facebook.com/katerine.canqui.uturunco', icon: FaFacebookF },
    ],
  },
  {
    photo: '/equipo/helen.jpeg',
    name: 'Helen Noemi Flores Apaza',
    role: 'Agronomía y protocolos',
    socials: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/flores-apaza-helen-noemi-2b078b429', icon: FaLinkedinIn },
      { label: 'Facebook', href: 'https://www.facebook.com/noemi.flores.3558', icon: FaFacebookF },
      { label: 'Instagram', href: 'https://www.instagram.com/noemiflores18/', icon: FaInstagram },
    ],
  },
  {
    photo: '/equipo/jhamil.jpg',
    name: 'Jhamil Calixto Mamani Quea',
    role: 'UI/UX e identidad visual',
    socials: [
      { label: 'LinkedIn', href: 'https://linkedin.com/in/jhamilcali', icon: FaLinkedinIn },
      { label: 'X', href: 'https://x.com/JHAMILCALIXTO', icon: FaXTwitter },
      { label: 'Instagram', href: 'https://instagram.com/jhamilquea', icon: FaInstagram },
      { label: 'Facebook', href: 'https://www.facebook.com/jhamil.mamani.7330', icon: FaFacebookF },
    ],
  },
  {
    photo: '/equipo/saul.png',
    name: 'Saúl Mijael Choquehuanca Huanca',
    role: 'Backend y blockchain',
    socials: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/saul-choquehuanca/?locale=es', icon: FaLinkedinIn },
      { label: 'Facebook', href: 'https://www.facebook.com/saulchoque123/', icon: FaFacebookF },
      { label: 'Instagram', href: 'https://www.instagram.com/baulchop/', icon: FaInstagram },
    ],
  },
]

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function ProductModel({ path, onReady }: { path: string; onReady: () => void }) {
  const gltf = useGLTF(path, '/draco/')

  const prepared = useMemo(() => {
    const scene = gltf.scene.clone(true)

    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return

      object.castShadow = true
      object.receiveShadow = true

      if (object.material instanceof THREE.MeshStandardMaterial) {
        object.material = object.material.clone()
        object.material.roughness = Math.min(0.78, Math.max(0.28, object.material.roughness))
        object.material.metalness = Math.min(0.74, object.material.metalness + 0.08)
        object.material.envMapIntensity = 1.25
      }
    })

    scene.updateMatrixWorld(true)
    const bounds = new THREE.Box3().setFromObject(scene)
    const size = bounds.getSize(new THREE.Vector3())
    const center = bounds.getCenter(new THREE.Vector3())
    const maxDimension = Math.max(size.x, size.y, size.z)
    const scale = maxDimension > 0 ? 4.2 / maxDimension : 1

    return {
      scene,
      scale,
      offset: [-center.x, -bounds.min.y, -center.z] as [number, number, number],
    }
  }, [gltf.scene])

  useEffect(() => {
    onReady()
  }, [onReady, path])

  return (
    <Float speed={1.1} rotationIntensity={0.08} floatIntensity={0.14}>
      <group scale={prepared.scale} position={[0, -1.75, 0]}>
        <primitive object={prepared.scene} position={prepared.offset} />
      </group>
    </Float>
  )
}

function ProductStage({ product }: { product: ProductLine }) {
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
          <Canvas
            className={`product-canvas ${modelReady ? 'is-ready' : ''}`}
            dpr={[1, 1.45]}
            shadows
            camera={{ position: [5.1, 2.6, 6.4], fov: 31, near: 0.1, far: 80 }}
            gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
          >
            <ambientLight intensity={0.58} color="#eafff1" />
            <hemisphereLight args={['#effff8', '#07100d', 1.25]} />
            <directionalLight castShadow position={[-5, 8, 6]} intensity={2.5} color="#ffffff" shadow-mapSize={[1024, 1024]} />
            <directionalLight position={[6, 3, 4]} intensity={2.2} color={product.accent} />
            <pointLight position={[-4, 1, -3]} intensity={12} distance={12} color="#7ddfc3" />
            <Suspense fallback={null}>
              <ProductModel key={product.model} path={product.model} onReady={handleModelReady} />
              <ContactShadows position={[0, -1.72, 0]} opacity={0.48} scale={8} blur={2.8} far={4.5} color="#000000" />
            </Suspense>
            <OrbitControls
              makeDefault
              enablePan={false}
              enableZoom={false}
              minPolarAngle={Math.PI / 3.1}
              maxPolarAngle={Math.PI / 2.05}
              autoRotate={!reduceMotion}
              autoRotateSpeed={0.42}
              target={[0, 0.15, 0]}
            />
          </Canvas>
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

function App() {
  const [activeProduct, setActiveProduct] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const chapterRefs = useRef<Array<HTMLElement | null>>([])
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28, restDelta: 0.001 })
  const heroY = useTransform(scrollYProgress, [0, 0.12], [0, 90])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.12])

  useEffect(() => {
    const targetId = window.location.hash.slice(1)
    if (!targetId) return

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ block: 'start' })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

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
    <main>
      <motion.div className="page-progress" style={{ scaleX: progress }} />

      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="TERRAGRID · Inicio">
          <span className="brand-mark"><Sprout size={21} /></span>
          <span>TERRAGRID</span>
        </a>

        <nav className={menuOpen ? 'is-open' : ''} aria-label="Navegación principal">
          <a href="#problema" onClick={() => setMenuOpen(false)}>Problema</a>
          <a href="#lineas" onClick={() => setMenuOpen(false)}>Líneas</a>
          <a href="#sistema" onClick={() => setMenuOpen(false)}>Sistema</a>
          <a href="#validacion" onClick={() => setMenuOpen(false)}>Validación</a>
          <a href="#equipo" onClick={() => setMenuOpen(false)}>Equipo</a>
        </nav>

        <a className="nav-cta" href="mailto:terragrid.2026@gmail.com?subject=Validemos%20un%20lote%20con%20TERRAGRID">
          Conversemos <ArrowRight size={15} />
        </a>

        <button className="menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}>
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-orb hero-orb-one" aria-hidden="true" />
        <div className="hero-orb hero-orb-two" aria-hidden="true" />

        <motion.div className="hero-copy" style={reduceMotion ? undefined : { y: heroY, opacity: heroOpacity }}>
          <div className="status-pill"><span /> Preincubación · La Paz, Bolivia</div>
          <p className="hero-kicker">Incubación agrícola inteligente</p>
          <h1>El clima ya es incierto.<br /><em>El plantín no debería serlo.</em></h1>
          <p className="hero-lede">
            TERRAGRID controla, automatiza y documenta la microgerminación para convertir cada lote en evidencia útil antes del trasplante.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#lineas">Explorar el sistema <ArrowDown size={17} /></a>
            <a className="button button-secondary" href="#validacion">Ver plan de validación</a>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual glow-border"
          initial={{ opacity: 0, x: 42 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.95, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          <img src="/products/terragrid-seed.png" alt="Concepto visual de la incubadora TERRAGRID SEED" />
          <div className="telemetry-card telemetry-top">
            <span><Activity size={14} /> Lote piloto</span>
            <strong>Perejil</strong>
            <small>Protocolo por validar</small>
          </div>
          <div className="telemetry-card telemetry-bottom">
            <span>Variables objetivo</span>
            <div><ThermometerSun size={15} /> Temperatura</div>
            <div><Droplets size={15} /> Humedad</div>
            <div><Gauge size={15} /> Riego</div>
          </div>
        </motion.div>

        <div className="hero-proof">
          <span>Plan inicial</span>
          <strong>3</strong><small>cultivos</small>
          <i />
          <strong>1</strong><small>piloto</small>
          <i />
          <strong>7·14·30</strong><small>días de seguimiento</small>
        </div>

        <a className="scroll-cue" href="#problema"><span>Desliza para descubrir</span><ArrowDown size={16} /></a>
      </section>

      <section className="problem section-pad" id="problema">
        <div className="section-shell">
          <Reveal className="section-heading split-heading">
            <div>
              <p className="eyebrow">El problema comienza antes de ver la cosecha</p>
              <h2>Una germinación irregular compromete decisiones, tiempo y recursos.</h2>
            </div>
            <p>
              El productor suele asumir el riesgo desde el almácigo sin un historial comparable del proceso. TERRAGRID enfoca su primera validación exactamente en esa brecha.
            </p>
          </Reveal>

          <div className="problem-grid">
            {PROBLEM_POINTS.map((point, index) => {
              const Icon = point.icon
              return (
                <Reveal className="problem-card glow-border" key={point.title}>
                  <span className="card-index">0{index + 1}</span>
                  <Icon size={27} />
                  <h3>{point.title}</h3>
                  <p>{point.copy}</p>
                </Reveal>
              )
            })}
          </div>

          <Reveal className="problem-statement">
            <Sparkles size={19} />
            <p><strong>La hipótesis:</strong> si se controlan y documentan las condiciones críticas de germinación, será posible entregar plantines más uniformes y tomar mejores decisiones antes de trasladarlos al campo.</p>
            <span>Por validar con evidencia</span>
          </Reveal>
        </div>
      </section>

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

      <section className="system section-pad" id="sistema">
        <div className="section-shell">
          <Reveal className="section-heading centered-heading">
            <p className="eyebrow">La capa inteligente</p>
            <h2>La tecnología solo entra cuando responde a una decisión agronómica.</h2>
            <p>Cada sensor, regla o registro debe ayudar a medir, actuar o explicar lo que ocurrió dentro del lote.</p>
          </Reveal>

          <div className="system-map">
            <div className="system-line" aria-hidden="true" />
            {SYSTEM_LAYERS.map((layer, index) => {
              const Icon = layer.icon
              return (
                <Reveal className="system-card glow-border" key={layer.title}>
                  <div className="system-card-top">
                    <span>{layer.number}</span>
                    <em>{layer.status}</em>
                  </div>
                  <div className="system-icon"><Icon size={25} /></div>
                  <h3>{layer.title}</h3>
                  <p>{layer.copy}</p>
                  {index < SYSTEM_LAYERS.length - 1 && <ChevronRight className="system-arrow" size={17} />}
                </Reveal>
              )
            })}
          </div>

          <Reveal className="data-strip">
            <div><Network size={21} /><span>Offline-first</span><small>El control esencial funciona localmente.</small></div>
            <div><QrCode size={21} /><span>Identidad por lote</span><small>Datos, eventos e imágenes en una sola ficha.</small></div>
            <div><ShieldCheck size={21} /><span>Verificable, no oficial</span><small>La constancia tecnológica no sustituye una certificación regulada.</small></div>
          </Reveal>
        </div>
      </section>

      <section className="validation section-pad" id="validacion">
        <div className="section-shell validation-grid">
          <Reveal className="validation-copy">
            <p className="eyebrow">Validar antes de escalar</p>
            <h2>No queremos construir una máquina y esperar que funcione.</h2>
            <p>
              TERRAGRID se encuentra en preincubación y todavía no presenta resultados agronómicos concluyentes. La primera validación comparará el sistema con un método de referencia en condiciones reales de La Paz.
            </p>
            <div className="validation-steps">
              <span><b>01</b> Protocolo agronómico</span>
              <span><b>02</b> Grupo de referencia</span>
              <span><b>03</b> Grupo TERRAGRID</span>
              <span><b>04</b> Seguimiento posrasplante</span>
            </div>
          </Reveal>

          <Reveal className="metrics-console glow-border">
            <div className="console-header">
              <span><LineChart size={17} /> Matriz de evidencia</span>
              <em>Por medir</em>
            </div>
            <div className="metrics-list">
              {VALIDATION_METRICS.map((metric, index) => (
                <div key={metric}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{metric}</p>
                  <i />
                </div>
              ))}
            </div>
            <p className="console-note">Los resultados definirán si existe valor técnico y comercial. No se publicarán porcentajes de mejora antes de medirlos.</p>
          </Reveal>
        </div>
      </section>

      <section className="market section-pad" id="mercado">
        <div className="section-shell">
          <Reveal className="section-heading split-heading">
            <div>
              <p className="eyebrow">Mercado inicial · Departamento de La Paz</p>
              <h2>El usuario necesita confiabilidad. El comprador necesita resultados.</h2>
            </div>
            <p>La primera oferta no vende una máquina: entrega plantines y evidencia de cada lote. El hardware aparece después, cuando el proceso haya sido validado.</p>
          </Reveal>

          <div className="market-grid">
            {MARKET_SEGMENTS.map((segment) => {
              const Icon = segment.icon
              return (
                <Reveal className="market-card" key={segment.title}>
                  <Icon size={24} />
                  <h3>{segment.title}</h3>
                  <p>{segment.copy}</p>
                </Reveal>
              )
            })}
          </div>

          <Reveal className="market-disclaimer">
            <BarChart3 size={20} />
            <p><strong>Lo que falta validar:</strong> pérdidas reales en germinación, costo actual por plantín aceptado, frecuencia de compra, tamaño de lote y disposición de pago.</p>
          </Reveal>
        </div>
      </section>

      <section className="business section-pad" id="modelo">
        <div className="section-shell">
          <Reveal className="section-heading centered-heading">
            <p className="eyebrow">Modelo de negocio por etapas</p>
            <h2>Vender el resultado primero. Desplegar la infraestructura después.</h2>
          </Reveal>

          <div className="business-roadmap">
            {BUSINESS_PHASES.map((phase) => (
              <Reveal className={`business-card ${phase.now ? 'is-now glow-border' : ''}`} key={phase.phase}>
                <div className="business-phase">
                  <span>{phase.phase}</span>
                  {phase.now && <em>Inicio</em>}
                </div>
                <p>{phase.label}</p>
                <h3>{phase.title}</h3>
                <div className="business-line" />
                <p>{phase.copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="team section-pad" id="equipo">
        <div className="section-shell">
          <Reveal className="section-heading split-heading">
            <div>
              <p className="eyebrow">Equipo interdisciplinario</p>
              <h2>Agronomía define el proceso. Tecnología lo vuelve medible.</h2>
            </div>
            <p>TERRAGRID reúne capacidades de producto, datos, software, diseño, seguridad, blockchain y agronomía dentro de una misma hoja de ruta.</p>
          </Reveal>

          <div className="team-grid">
            {TEAM.map((member) => (
              <Reveal className="team-card" key={member.name}>
                <div className="team-photo-wrap">
                  <img src={member.photo} alt={`Retrato de ${member.name}`} />
                </div>
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <span>{member.role}</span>
                  <div className="team-socials" aria-label={`Redes sociales de ${member.name}`}>
                    {member.socials.map((social) => {
                      const SocialIcon = social.icon
                      return (
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${member.name} en ${social.label}`}
                          title={social.label}
                          key={social.label}
                        >
                          <SocialIcon size={16} aria-hidden="true" />
                        </a>
                      )
                    })}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="cta section-pad">
        <div className="section-shell">
          <Reveal className="cta-card glow-border">
            <div className="cta-signal"><span /><span /><span /><span /><span /></div>
            <p className="eyebrow">Buscamos el primer entorno de validación</p>
            <h2>Convirtamos un lote real en evidencia.</h2>
            <p>Si produces plantines, gestionas un vivero, investigas cultivos o puedes facilitar un piloto en La Paz, queremos conversar.</p>
            <div className="cta-actions">
              <a className="button button-primary" href="mailto:terragrid.2026@gmail.com?subject=Validemos%20un%20lote%20con%20TERRAGRID">
                <Mail size={17} /> terragrid.2026@gmail.com
              </a>
              <a className="button button-secondary" href="#inicio">Volver al inicio</a>
            </div>
            <div className="cta-principles">
              <span><Check size={14} /> Datos antes que promesas</span>
              <span><Check size={14} /> Agronomía antes que automatización</span>
              <span><Check size={14} /> La Paz como primer territorio</span>
            </div>
          </Reveal>
        </div>
      </section>

      <footer>
        <a className="brand" href="#inicio"><span className="brand-mark"><Sprout size={20} /></span><span>TERRAGRID</span></a>
        <p>Incubación agrícola inteligente · La Paz, Bolivia · 2026</p>
        <a href="#inicio" aria-label="Volver arriba"><ArrowDown size={18} style={{ transform: 'rotate(180deg)' }} /></a>
      </footer>
    </main>
  )
}

export default App
