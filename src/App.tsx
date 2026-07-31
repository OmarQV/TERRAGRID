import { Suspense, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  ContactShadows,
  Html,
  OrbitControls,
  useGLTF,
} from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import {
  Sprout,
  Gauge,
  BrainCircuit,
  ScanLine,
  ShieldCheck,
  Users,
  Briefcase,
  BarChart2,
  Palette,
  Server,
  ArrowRight,
  CloudRain,
  Wheat,
  Microscope,
  Timer,
  Building2,
  Handshake,
  BadgeDollarSign,
  Check,
  TrendingDown,
  BugOff,
  SlidersHorizontal,
} from 'lucide-react'
import './App.css'

const MODEL_PATH = '/blender/v2%20eva%20pr6%20DRACO.glb'
const MODEL_FOOTPRINT = 6

type HotspotId = 'energy' | 'solar' | 'hydroponic' | 'water' | 'ai' | 'sensors'

type Hotspot = {
  id: HotspotId
  label: string
  title: string
  copy: string
  position: [number, number, number]
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'energy',
    label: 'Clima',
    title: 'Ambiente estable',
    copy: 'Temperatura y humedad reguladas para proteger cada lote frente a sequías y cambios bruscos del clima.',
    position: [2.35, 1.6, 0],
  },
  {
    id: 'solar',
    label: 'Luz',
    title: 'Iluminación precisa',
    copy: 'La intensidad y el fotoperiodo se ajustan a cada etapa de crecimiento de la semilla.',
    position: [0.75, 0.65, 1.2],
  },
  {
    id: 'hydroponic',
    label: 'Trigo',
    title: 'Multiplicación controlada',
    copy: 'El trigo crece en un entorno aislado y repetible antes de llevar las semillas mejor evaluadas al campo.',
    position: [-1.55, 1.85, 0.15],
  },
  {
    id: 'water',
    label: 'H2O',
    title: 'Riego eficiente',
    copy: 'El sistema entrega agua solo cuando el cultivo la necesita y reduce pérdidas por sobre-riego.',
    position: [-0.45, 1.05, -0.8],
  },
  {
    id: 'ai',
    label: 'IA',
    title: 'Recetas de crecimiento',
    copy: 'El controlador coordina luz, agua y temperatura según la etapa y el protocolo de cada variedad.',
    position: [1.25, 2.25, 0.05],
  },
  {
    id: 'sensors',
    label: 'IoT',
    title: 'Vigilancia continua',
    copy: 'Sensores registran humedad, temperatura, luz y presión de agua, y alertan ante condiciones anómalas.',
    position: [0.1, 1.55, 0.45],
  },
]

const PROBLEM_CAUSES = [
  'Sequía',
  'Insumos costosos',
  'Falta de combustible',
  'Harina importada',
]

type ModuleEntry = {
  icon: React.ReactNode
  title: string
  copy: string
}

const MODULES: ModuleEntry[] = [
  { icon: <Wheat size={22} />, title: '01 · Ingreso del lote', copy: 'Las semillas de trigo se identifican y siembran dentro del módulo para iniciar una evaluación controlada.' },
  { icon: <Gauge size={22} />, title: '02 · Medición continua', copy: 'Sensores observan temperatura, humedad, luz y presión de agua durante todo el ciclo.' },
  { icon: <SlidersHorizontal size={22} />, title: '03 · Regulación automática', copy: 'Riego, iluminación y clima responden automáticamente cuando una variable sale del rango ideal.' },
  { icon: <BugOff size={22} />, title: '04 · Control sanitario', copy: 'La vigilancia temprana detecta señales de plagas, bacterias u hongos antes de que comprometan el lote.' },
  { icon: <BrainCircuit size={22} />, title: '05 · Receta de crecimiento', copy: 'El controlador ajusta las condiciones de cada etapa y conserva el historial completo del ensayo.' },
  { icon: <Sprout size={22} />, title: '06 · Salida al campo', copy: 'Las semillas seleccionadas salen sanas, trazables y mejor preparadas para la siembra en campo abierto.' },
]

const IMPACT = [
  {
    icon: <ShieldCheck size={28} />,
    label: 'Seguridad',
    headline: 'Decidir antes de arriesgar una campaña',
    points: [
      'Evaluación previa en condiciones repetibles',
      'Detección temprana de riesgos sanitarios',
      'Menos incertidumbre al llevar el lote al campo',
    ],
  },
  {
    icon: <Timer size={28} />,
    label: 'Velocidad y ahorro',
    headline: 'Más aprendizaje con menos recursos',
    points: [
      'Uso preciso de agua, luz y temperatura',
      'Ciclos de prueba más cortos y comparables',
      'Menor dependencia de agroquímicos correctivos',
    ],
  },
  {
    icon: <ScanLine size={28} />,
    label: 'Trazabilidad',
    headline: 'Cada decisión respaldada por datos',
    points: [
      'Historial ambiental de cada lote evaluado',
      'Comparación directa con el método tradicional',
      'Evidencia para mejorar nuevas líneas genéticas',
    ],
  },
]

const MARKET_SEGMENTS = [
  { icon: <Wheat size={24} />, title: 'Empresas semilleras', copy: 'Evalúan y comercializan variedades de trigo con mayores garantías de calidad.' },
  { icon: <Microscope size={24} />, title: 'Multiplicadoras', copy: 'Reproducen material genético y necesitan procesos consistentes, rápidos y trazables.' },
  { icon: <Users size={24} />, title: 'Productores tecnificados', copy: 'Gestionan grandes extensiones y programas propios de prueba antes de sembrar.' },
  { icon: <Building2 size={24} />, title: 'Agroindustrias', copy: 'Buscan asegurar la calidad y continuidad del trigo que llega a sus plantas.' },
]

const PILOT_STEPS = [
  'Elegimos una empresa y un problema concreto',
  'Probamos una variedad o lote dentro de TERRAGRID',
  'Comparamos contra su método tradicional',
  'Medimos el ahorro, la calidad y el resultado',
  'Convertimos la evidencia en venta o leasing',
]

const BUSINESS_MODEL = [
  { tag: 'Entrada', title: 'Piloto pagado', price: 'USD 1.500–5.000', copy: 'Validamos un lote real y demostramos valor con métricas comparables.' },
  { tag: 'Implementación', title: 'Módulo o leasing', price: 'USD 22.500', copy: 'Venta del módulo completo o leasing desde USD 780 mensuales.' },
  { tag: 'Recurrente', title: 'Servicios', price: 'Desde USD 500', copy: 'Mantenimiento, licencia de software y protocolos para nuevos cultivos.' },
]

const TEAM = [
  {
    icon: <Briefcase size={24} />,
    photo: '/equipo/omar.jpg',
    name: 'Omar Quispe Vargas',
    role: 'Liderazgo, estrategia, modelo de negocio y seguridad',
    copy: 'Define la propuesta de valor, el modelo de negocio, la narrativa del pitch y la viabilidad del proyecto. Aporta en seguridad de la información, trazabilidad y sostenibilidad económica.',
  },
  {
    icon: <BarChart2 size={24} />,
    photo: '/equipo/carol.jpeg',
    name: 'Carol Katerine Canqui',
    role: 'Datos, inteligencia artificial y validación',
    copy: 'Responsable de variables agrícolas, análisis de datos del cultivo, métricas de validación e IA local. Lidera la identificación de usuarios objetivo y validación de mercado.',
  },
  {
    icon: <Palette size={24} />,
    photo: '/equipo/jhamil.jpg',
    name: 'Jhamil Calixto Mamani',
    role: 'UI/UX, frontend, diseño visual e identidad',
    copy: 'Transforma la propuesta técnica en experiencia visual. A cargo del dashboard, prototipos de interfaz, identidad visual, presentación en Canva y maqueta 3D del nodo.',
  },
  {
    icon: <Server size={24} />,
    photo: null,
    name: 'Saúl Mijael Choquehuanca',
    role: 'Backend, arquitectura técnica y blockchain',
    copy: 'Diseña la estructura lógica del prototipo, gestión de datos y operación offline-first. Lidera la trazabilidad blockchain y el pasaporte digital agrícola.',
  },
]

function seededValue(seed: number) {
  const value = Math.sin(seed * 78.233) * 43758.5453
  return value - Math.floor(value)
}

function AltiplanoTerrain() {
  return (
    <mesh rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[90, 90]} />
      <meshStandardMaterial color="#7a4f2a" roughness={0.98} metalness={0.0} />
    </mesh>
  )
}

function DryGrass() {
  const tufts = useMemo(
    () =>
      Array.from({ length: 70 }, (_, index) => {
        const angle = seededValue(index + 1) * Math.PI * 2
        const radius = 6 + seededValue(index + 8) * 28
        return {
          x: Math.cos(angle) * radius,
          z: Math.sin(angle) * radius,
          height: 0.18 + seededValue(index + 16) * 0.38,
          rotation: seededValue(index + 24) * Math.PI,
        }
      }),
    [],
  )

  return (
    <group>
      {tufts.map((tuft, index) => (
        <mesh
          key={index}
          castShadow
          position={[tuft.x, tuft.height / 2, tuft.z]}
          rotation={[0.18, tuft.rotation, -0.1]}
        >
          <coneGeometry args={[0.03, tuft.height, 5]} />
          <meshStandardMaterial color={index % 3 === 0 ? '#c9a84c' : '#a07838'} roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

function ScatteredRocks() {
  const rocks = useMemo(
    () =>
      Array.from({ length: 48 }, (_, index) => {
        const angle = seededValue(index + 100) * Math.PI * 2
        const radius = 4 + seededValue(index + 200) * 36
        const scale = 0.1 + seededValue(index + 300) * 0.38
        return {
          x: Math.cos(angle) * radius,
          z: Math.sin(angle) * radius,
          scale,
          rotation: seededValue(index + 400) * Math.PI,
        }
      }),
    [],
  )

  return (
    <group>
      {rocks.map((rock, index) => (
        <mesh
          key={index}
          castShadow
          receiveShadow
          position={[rock.x, rock.scale * 0.4, rock.z]}
          rotation={[rock.rotation, rock.rotation * 0.4, rock.rotation * 0.7]}
          scale={[rock.scale * 1.4, rock.scale * 0.65, rock.scale]}
        >
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#5a4e3e" roughness={0.96} />
        </mesh>
      ))}
    </group>
  )
}

function MountainRange() {
  const mountains = [
    [-44, 28, -60, 15, '#3e4540'],
    [-30, 36, -66, 19, '#373e38'],
    [-14, 32, -64, 17, '#3d4540'],
    [0, 38, -70, 20, '#384038'],
    [14, 33, -66, 18, '#3b4340'],
    [30, 30, -62, 16, '#373e38'],
    [46, 26, -58, 14, '#3d4540'],
  ] as const

  return (
    <group>
      {mountains.map(([x, height, z, radius, color], index) => (
        <group key={index} position={[x, -1, z]}>
          <mesh receiveShadow>
            <coneGeometry args={[radius, height, 9]} />
            <meshStandardMaterial color={color} roughness={0.93} />
          </mesh>
          <mesh position={[0, height * 0.34, 0]} scale={[0.52, 0.34, 0.52]}>
            <coneGeometry args={[radius, height, 9]} />
            <meshStandardMaterial color="#fff9f9ff" roughness={0.72} />
          </mesh>
          <mesh position={[0, height * 0.52, 0]} scale={[0.24, 0.2, 0.24]}>
            <coneGeometry args={[radius, height, 9]} />
            <meshStandardMaterial color="#f9f3f3ff" roughness={0.55} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function TerragridModel({
  activeHotspot,
  hoveredHotspot,
  showHotspots,
  onHotspotSelect,
  onHotspotHover,
}: {
  activeHotspot: HotspotId | null
  hoveredHotspot: HotspotId | null
  showHotspots: boolean
  onHotspotSelect: (id: HotspotId) => void
  onHotspotHover: (id: HotspotId | null) => void
}) {
  const gltf = useGLTF(MODEL_PATH)
  const { scene, modelOffset, modelScale } = useMemo(() => {
    const clonedScene = gltf.scene.clone(true)

    clonedScene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true
        object.receiveShadow = true
      }
    })

    clonedScene.updateMatrixWorld(true)

    const bounds = new THREE.Box3().setFromObject(clonedScene)
    const size = bounds.getSize(new THREE.Vector3())
    const center = bounds.getCenter(new THREE.Vector3())
    const footprint = Math.max(size.x, size.z)
    const scale = footprint > 0 ? MODEL_FOOTPRINT / footprint : 1

    return {
      scene: clonedScene,
      modelOffset: [-center.x, -bounds.min.y, -center.z] as [number, number, number],
      modelScale: scale,
    }
  }, [gltf.scene])

  return (
    <group position={[1.85, 0.05, 0.1]} rotation-y={0}>
      <group scale={modelScale}>
        <primitive object={scene} position={modelOffset} />
      </group>
      {showHotspots &&
        HOTSPOTS.map((hotspot) => (
          <Html key={hotspot.id} position={hotspot.position} center distanceFactor={5}>
            <button
              className={[
                'hotspot',
                activeHotspot === hotspot.id ? 'is-active' : '',
                hoveredHotspot === hotspot.id ? 'is-hovered' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              type="button"
              onClick={() => onHotspotSelect(hotspot.id)}
              onMouseEnter={() => onHotspotHover(hotspot.id)}
              onMouseLeave={() => onHotspotHover(null)}
              aria-label={hotspot.title}
            >
              <span>{hotspot.label}</span>
            </button>
          </Html>
        ))}
    </group>
  )
}

function SceneFallback() {
  return (
    <Html center className="scene-loader">
      Cargando modelo 3D
    </Html>
  )
}

function TerragridScene({
  activeHotspot,
  hoveredHotspot,
  showHotspots,
  onHotspotSelect,
  onHotspotHover,
}: {
  activeHotspot: HotspotId | null
  hoveredHotspot: HotspotId | null
  showHotspots: boolean
  onHotspotSelect: (id: HotspotId) => void
  onHotspotHover: (id: HotspotId | null) => void
}) {
  const isCompactViewport =
    typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches

  return (
    <Canvas
      shadows={!isCompactViewport}
      dpr={isCompactViewport ? [1, 1.25] : [1, 1.75]}
      camera={{
        position: isCompactViewport ? [1.85, 3.5, 12] : [1.85, 3.4, 9],
        fov: 35,
        near: 0.1,
        far: 150,
      }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.92 }}
      onCreated={({ camera }) => {
        camera.lookAt(1.85, 1.45, 0.05)
      }}
    >
      <color attach="background" args={['#0d1e2a']} />

      <ambientLight intensity={0.22} color="#ffd0a0" />
      <directionalLight
        castShadow={!isCompactViewport}
        intensity={2.2}
        color="#ffb06a"
        position={[-10, 3.5, 7]}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.001}
      />
      <directionalLight intensity={0.38} color="#ff8c60" position={[9, 5, -4]} />
      <directionalLight intensity={0.14} color="#a0c4ff" position={[0, 12, 0]} />

      <AltiplanoTerrain />
      <MountainRange />
      <ScatteredRocks />
      <DryGrass />

      {!isCompactViewport && (
        <ContactShadows
          position={[0, 0.02, 0]}
          opacity={0.48}
          scale={18}
          blur={3.2}
          far={6}
          color="#3a1e08"
        />
      )}

      <Suspense fallback={<SceneFallback />}>
        <TerragridModel
          activeHotspot={activeHotspot}
          hoveredHotspot={hoveredHotspot}
          showHotspots={showHotspots}
          onHotspotSelect={onHotspotSelect}
          onHotspotHover={onHotspotHover}
        />
      </Suspense>

      <OrbitControls
        makeDefault
        enableDamping
        enablePan={false}
        enableRotate
        target={[1.85, 1.45, 0.05]}
        minDistance={4}
        maxDistance={11}
        minPolarAngle={Math.PI * 0.18}
        maxPolarAngle={Math.PI * 0.48}
      />

      {!isCompactViewport && (
        <EffectComposer>
          <Bloom intensity={0.7} luminanceThreshold={0.82} luminanceSmoothing={0.5} mipmapBlur />
        </EffectComposer>
      )}
    </Canvas>
  )
}

function App() {
  const [activeHotspot, setActiveHotspot] = useState<HotspotId | null>(null)
  const [hoveredHotspot, setHoveredHotspot] = useState<HotspotId | null>(null)
  const [focusMode, setFocusMode] = useState(false)

  const panelId = hoveredHotspot ?? activeHotspot
  const panelData = HOTSPOTS.find((h) => h.id === panelId)
  const panelVisible = panelData !== undefined && !focusMode

  function handleHotspotSelect(id: HotspotId) {
    setActiveHotspot((prev) => (prev === id ? null : id))
  }

  return (
    <main>
      <section
        className={`hero-section ${focusMode ? 'is-focus-mode' : ''}`}
        aria-label="TERRAGRID landing"
      >
        <div className="scene-layer">
          <TerragridScene
            activeHotspot={activeHotspot}
            hoveredHotspot={hoveredHotspot}
            showHotspots={!focusMode}
            onHotspotSelect={handleHotspotSelect}
            onHotspotHover={setHoveredHotspot}
          />
        </div>

        <button
          className={`focus-btn ${focusMode ? 'is-focus' : ''}`}
          type="button"
          onClick={() => setFocusMode((f) => !f)}
          aria-label={focusMode ? 'Volver a vista normal' : 'Ver solo el modelo 3D'}
        >
          {focusMode ? '← Volver' : 'Solo modelo'}
        </button>

        {!focusMode && (
          <nav className="topbar" aria-label="Principal">
            <a className="brand" href="#hero" aria-label="TERRAGRID · Inicio">
              <img src="/img/logo%20tearagrid.png" alt="TERRAGRID" />
            </a>
            <div className="nav-links">
              <a href="#problema">Problema</a>
              <a href="#producto">Producto</a>
              <a href="#mercado">Mercado</a>
              <a href="#modelo">Modelo</a>
            </div>
          </nav>
        )}

        {!focusMode && (
          <div className="hero-copy" id="hero">
            <p className="eyebrow">Tecnología boliviana para semillas</p>
            <img
              className="hero-logo"
              src="/img/logo%20tearagrid.png"
              alt="TERRAGRID"
            />
            <p className="hero-lede">
              <span className="desktop-lede">
                El filtro previo que ayuda a que solo las mejores semillas de trigo lleguen a la tierra.
                Evaluamos, protegemos y multiplicamos cada lote en condiciones controladas.
              </span>
              <span className="mobile-lede">
                Semillas de trigo más sanas, resistentes y listas para el campo.
              </span>
            </p>
            <div className="hero-actions">
              <a href="#producto" className="primary-action desktop-primary-action">
                Conocer el sistema <ArrowRight size={17} />
              </a>
              <a href="#problema" className="secondary-action">Ver el desafío</a>
              <a href="#problema" className="primary-action mobile-next-action">
                Continuar <ArrowRight size={17} />
              </a>
            </div>
            <div className="hero-proof" aria-label="Propuesta de valor">
              <span>Semillas sanas</span>
              <span>Menos riesgo</span>
              <span>Datos trazables</span>
            </div>
          </div>
        )}

        <aside
          className={`hotspot-panel ${panelVisible ? 'is-visible' : ''}`}
          aria-live="polite"
        >
          {panelData && (
            <>
              <div className="hotspot-panel-header">
                <p>{panelData.label}</p>
                <button
                  className="panel-close"
                  type="button"
                  onClick={() => setActiveHotspot(null)}
                  aria-label="Cerrar panel"
                >
                  ×
                </button>
              </div>
              <h2>{panelData.title}</h2>
              <span>{panelData.copy}</span>
            </>
          )}
        </aside>

      </section>

      <section className="problem-band" id="problema">
        <div className="section-shell problem-layout">
          <div className="problem-copy">
            <p className="eyebrow">El problema</p>
            <h2>Bolivia produce cada vez menos del trigo que consume.</h2>
            <p className="section-lede">
              En dos décadas, la producción nacional pasó de cubrir 20–30 % de la demanda a solo 10–12 %.
            </p>
            <p className="source-note">Cifras reportadas por ANAPO, INE y prensa nacional.</p>
          </div>
          <div className="decline-card" aria-label="Caída de la producción de trigo">
            <div className="decline-title">
              <TrendingDown size={22} />
              <span>Producción nacional de trigo</span>
            </div>
            <div className="decline-metrics">
              <div>
                <span>2014</span>
                <strong>281.800</strong>
                <small>toneladas</small>
              </div>
              <ArrowRight size={28} aria-hidden="true" />
              <div className="metric-alert">
                <span>2026 · proyección</span>
                <strong>92.000</strong>
                <small>toneladas</small>
              </div>
            </div>
            <div className="decline-bar"><span /></div>
            <p>Casi <strong>2 de cada 3 toneladas</strong> dejaron de producirse frente a 2014.</p>
          </div>
        </div>
        <div className="section-shell problem-causes" aria-label="Principales causas">
          <strong>¿Por qué?</strong>
          <div>
            {PROBLEM_CAUSES.map((cause) => (
              <span key={cause}>{cause}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="solution-band" id="solucion">
        <div className="section-shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">La respuesta</p>
              <span className="section-kicker">Una incubadora para semillas</span>
            </div>
            <h2>Controlamos el entorno para que el productor no dependa de la suerte.</h2>
          </div>
          <div className="solution-grid">
            <article>
              <CloudRain size={26} />
              <h3>Resistencia climática</h3>
              <p>Probamos semillas bajo condiciones adversas antes de exponerlas a una campaña completa.</p>
            </article>
            <article>
              <BugOff size={26} />
              <h3>Sanidad del lote</h3>
              <p>Reducimos el riesgo de plagas y hongos con vigilancia y respuesta temprana.</p>
            </article>
            <article>
              <Timer size={26} />
              <h3>Multiplicación ágil</h3>
              <p>Generamos trigo sano en menos tiempo para disminuir la dependencia de semilla importada.</p>
            </article>
            <article>
              <BadgeDollarSign size={26} />
              <h3>Costos optimizados</h3>
              <p>Usamos agua, luz y temperatura con precisión dentro de un sistema medible.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="modules-band" id="producto">
        <div className="section-shell">
          <div className="section-heading product-heading">
            <div>
              <p className="eyebrow">Así funciona</p>
              <span className="section-kicker">Del lote al campo</span>
            </div>
            <h2>Seis pasos. Un proceso científico, repetible y trazable.</h2>
          </div>
          <div className="module-grid">
            {MODULES.map(({ icon, title, copy }) => (
              <article key={title} className="module-card">
                <div className="module-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="value-band" id="valor">
        <div className="section-shell value-intro">
          <p className="eyebrow">Lo que compra el cliente</p>
          <h2>No compra un contenedor.<br />Compra mejores decisiones.</h2>
          <p>La tecnología se traduce en seguridad, ahorro, velocidad, trazabilidad y una ventaja competitiva que puede medirse.</p>
        </div>
        <div className="impact-grid">
          {IMPACT.map(({ icon, label, headline, points }) => (
            <article key={label} className="impact-card">
              <div className="impact-icon">{icon}</div>
              <p className="impact-label">{label}</p>
              <h3>{headline}</h3>
              <ul>
                {points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="validation-band" id="evidencia">
        <div className="section-shell validation-layout">
          <div className="validation-number">
            <strong>10</strong>
            <span>especies validadas</span>
          </div>
          <div className="validation-copy">
            <p className="eyebrow">Validación / evidencia</p>
            <h2>Tecnología probada en la UMSA.</h2>
            <p>
              La microgerminación controlada mostró concentraciones de vitaminas, minerales y antioxidantes
              de hasta 40 veces frente a plantas adultas. Ahora aplicamos esa experiencia al trigo boliviano.
            </p>
          </div>
          <div className="validation-badge">
            <Microscope size={30} />
            <strong>Hasta 40×</strong>
            <span>concentración observada</span>
          </div>
        </div>
      </section>

      <section className="market-band" id="mercado">
        <div className="section-shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Mercado</p>
              <span className="section-kicker">B2B agrícola</span>
            </div>
            <h2>Empresas que ya entienden de semillas y quieren decidir mejor.</h2>
          </div>
          <div className="market-grid">
            {MARKET_SEGMENTS.map(({ icon, title, copy }) => (
              <article key={title}>
                <div>{icon}</div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
          <div className="pilot-block">
            <div className="pilot-copy">
              <p className="eyebrow">Cómo entramos</p>
              <h3>Primero demostramos.<br />Después escalamos.</h3>
              <p>Un piloto privado y pagado convierte una promesa tecnológica en evidencia de negocio.</p>
            </div>
            <ol className="pilot-steps">
              {PILOT_STEPS.map((step, index) => (
                <li key={step}><span>{index + 1}</span><p>{step}</p></li>
              ))}
            </ol>
          </div>
          <div className="market-footnote">
            <Handshake size={22} />
            <p>Primer foco: empresas de trigo en Santa Cruz, incluyendo perfiles como PRINA, Agripac y Semexa.</p>
          </div>
        </div>
      </section>

      <section className="business-band" id="modelo">
        <div className="section-shell">
          <div className="business-header">
            <div>
              <p className="eyebrow">Modelo de negocio</p>
              <h2>B2B, híbrido y escalable.</h2>
            </div>
            <p>Combinamos una venta inicial de alto valor con servicios recurrentes que acompañan cada cultivo.</p>
          </div>
          <div className="business-grid">
            {BUSINESS_MODEL.map(({ tag, title, price, copy }, index) => (
              <article key={title} className={index === 1 ? 'featured' : ''}>
                <span className="business-tag">{tag}</span>
                <h3>{title}</h3>
                <strong>{price}</strong>
                <p>{copy}</p>
                <div className="card-check"><Check size={15} /> {index === 0 ? 'Validación comercial' : index === 1 ? 'Venta o leasing' : 'Ingreso recurrente'}</div>
              </article>
            ))}
          </div>
          <div className="revenue-strip">
            <span>Mantenimiento anual <strong>USD 1.200–3.500</strong></span>
            <span>Software <strong>USD 500–4.000</strong></span>
            <span>Nuevos protocolos <strong>USD 2.500–5.000</strong></span>
            <span className="break-even">Punto de equilibrio: <strong>1 módulo</strong></span>
          </div>
        </div>
      </section>

      <section className="positioning-band">
        <div className="section-shell positioning-layout">
          <p className="eyebrow">Nuestro lugar en la cadena</p>
          <blockquote>“TERRAGRID no compite con el campo. Lo complementa.”</blockquote>
          <p>Somos el filtro previo que asegura que solo las mejores semillas lleguen a la tierra.</p>
          <div className="expansion-list">
            <span>Hoy · Trigo en Santa Cruz</span>
            <ArrowRight size={20} />
            <span>Mañana · Maíz, sorgo, soya, quinua y cañahua</span>
            <ArrowRight size={20} />
            <span>Escala · Latinoamérica</span>
          </div>
        </div>
      </section>

      <section className="team-band" id="equipo">
        <div className="team-heading">
          <p className="eyebrow">Equipo</p>
          <h2>Tecnología que busca crecer junto al campo.</h2>
          <p>Somos cuatro informáticos y buscamos sumar agrónomos y empresas semilleras como socios estratégicos.</p>
        </div>
        <div className="team-grid">
          {TEAM.map(({ icon, photo, name, role, copy }) => (
            <article key={name} className="team-card">
              {photo ? (
                <img className="team-photo" src={photo} alt={name} />
              ) : (
                <div className="team-icon">{icon}</div>
              )}
              <div>
                <h3>{name}</h3>
                <p className="team-role">{role}</p>
                <p className="team-copy">{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <p className="eyebrow">El futuro se siembra antes de llegar al campo</p>
        <h2>No es un invernadero.<br />Es el futuro.</h2>
        <p className="cta-copy">Con TERRAGRID, de cada 10 panes, 10 bolivianos.</p>
        <a href="#modelo" className="primary-action">Exploremos un piloto <ArrowRight size={17} /></a>
        <small>TERRAGRID · Universidad Mayor de San Andrés · Carrera de Informática</small>
      </section>

    </main>
  )
}

useGLTF.preload(MODEL_PATH)

export default App
