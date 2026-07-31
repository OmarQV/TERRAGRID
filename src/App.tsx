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
  WifiOff,
  ScanLine,
  ShieldCheck,
  Users,
  Leaf,
  Zap,
  Briefcase,
  BarChart2,
  Palette,
  Server,
} from 'lucide-react'
import './App.css'

const MODEL_PATH = '/blender/v2%20eva%20pr6.glb'
const MODEL_FOOTPRINT = 6

type HotspotId = 'reactor' | 'solar' | 'hydroponic' | 'water' | 'ai' | 'sensors'

type Hotspot = {
  id: HotspotId
  label: string
  title: string
  copy: string
  position: [number, number, number]
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'reactor',
    label: 'SMR',
    title: 'Reactor modular',
    copy: 'Energía firme para operar agricultura controlada en zonas remotas sin depender de una red inestable.',
    position: [2.35, 1.6, 0],
  },
  {
    id: 'solar',
    label: 'Solar',
    title: 'Generación solar',
    copy: 'Paneles y almacenamiento reducen consumo auxiliar y permiten modos híbridos de operación.',
    position: [0.75, 0.65, 1.2],
  },
  {
    id: 'hydroponic',
    label: 'Hydro',
    title: 'Cultivo hidropónico',
    copy: 'Producción de alimentos en interior con nutrientes, temperatura y humedad medidos en tiempo real.',
    position: [-1.55, 1.85, 0.15],
  },
  {
    id: 'water',
    label: 'H2O',
    title: 'Sistema de agua',
    copy: 'Recirculación, filtrado y sensores para maximizar cada litro en clima árido de altura.',
    position: [-0.45, 1.05, -0.8],
  },
  {
    id: 'ai',
    label: 'IA',
    title: 'Control autónomo',
    copy: 'Modelos predictivos coordinan energía, riego, clima interior y mantenimiento preventivo.',
    position: [1.25, 2.25, 0.05],
  },
  {
    id: 'sensors',
    label: 'IoT',
    title: 'Sensores distribuidos',
    copy: 'Telemetría simulada para humedad, radiación, caudal, potencia, temperatura y salud del sistema.',
    position: [0.1, 1.55, 0.45],
  },
]

const STORY_STEPS = [
  'Clima extremo, sequía y suelo estéril impiden la agricultura tradicional en el altiplano',
  'La energía inestable detiene cualquier sistema agrícola moderno en zonas remotas',
  'La baja conectividad inutiliza las soluciones AgriTech basadas en la nube',
  'Las cadenas de abastecimiento largas elevan costos y generan dependencia externa',
  'Las comunidades aisladas no tienen alternativa local de producción alimentaria',
]

type ModuleEntry = {
  icon: React.ReactNode
  title: string
  copy: string
}

const MODULES: ModuleEntry[] = [
  { icon: <Sprout size={22} />, title: 'Agricultura vertical', copy: 'Racks interiores con control de luz LED, temperatura, humedad, agua y nutrientes. Ciclos cortos y alta densidad productiva.' },
  { icon: <Gauge size={22} />, title: 'Sensores IoT', copy: 'Captura continua de pH, CO2, caudal, potencia, temperatura y humedad para toma de decisión en tiempo real.' },
  { icon: <BrainCircuit size={22} />, title: 'Edge AI', copy: 'Modelos predictivos dentro del nodo optimizan riego, iluminación y clima interior sin depender de servidores en la nube.' },
  { icon: <WifiOff size={22} />, title: 'Offline-first', copy: 'El sistema registra eventos, controla actuadores y mantiene la producción incluso cuando la conectividad falla por semanas.' },
  { icon: <ScanLine size={22} />, title: 'Gemelo digital', copy: 'Simulación virtual del nodo para testear escenarios y ajustar recetas de cultivo antes de aplicarlas al sistema físico.' },
  { icon: <ShieldCheck size={22} />, title: 'Trazabilidad', copy: 'Registro inmutable de siembra, uso de agua, nutrientes, energía y cosecha. Pasaporte digital de cada lote producido.' },
]

const IMPACT = [
  {
    icon: <Users size={28} />,
    label: 'Social',
    headline: 'Alimentos frescos donde no llegan',
    points: [
      'Reduce dependencia de cadenas externas de abastecimiento',
      'Genera empleo técnico local en zonas vulnerables',
      'Mejora acceso nutricional en territorios aislados',
    ],
  },
  {
    icon: <Leaf size={28} />,
    label: 'Ambiental',
    headline: 'Hasta 90 % menos agua que cultivo tradicional',
    points: [
      'Recirculación de nutrientes en circuito cerrado',
      'Sin pesticidas ni agroquímicos masivos',
      'Menor presión sobre suelos y acuíferos locales',
    ],
  },
  {
    icon: <Zap size={28} />,
    label: 'Tecnológico',
    headline: 'IA y datos en el borde de la red',
    points: [
      'Democratiza algoritmos de optimización en zonas sin señal',
      'Trazabilidad inmutable para certificación de impacto',
      'Arquitectura replicable como franquicia tecnológica',
    ],
  },
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
    <group position={[1.85, 0.05, 0.1]} rotation-y={-0.34}>
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
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [7.4, 3.85, 6.1], fov: 35, near: 0.1, far: 150 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.92 }}
      onCreated={({ camera }) => {
        camera.lookAt(1.85, 1.45, 0.05)
      }}
    >
      <color attach="background" args={['#0d1e2a']} />

      <ambientLight intensity={0.22} color="#ffd0a0" />
      <directionalLight
        castShadow
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

      <ContactShadows
        position={[0, 0.02, 0]}
        opacity={0.48}
        scale={18}
        blur={3.2}
        far={6}
        color="#3a1e08"
      />

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
        target={[1.85, 1.45, 0.05]}
        minDistance={4}
        maxDistance={11}
        minPolarAngle={Math.PI * 0.18}
        maxPolarAngle={Math.PI * 0.48}
      />

      <EffectComposer>
        <Bloom intensity={0.7} luminanceThreshold={0.82} luminanceSmoothing={0.5} mipmapBlur />
      </EffectComposer>
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
      <section className="hero-section" aria-label="TERRAGRID landing">
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
            <a href="#hero">TERRAGRID</a>
          </nav>
        )}

        {!focusMode && (
          <div className="hero-copy" id="hero">
            <p className="eyebrow">Containerized nuclear agriculture</p>
            <h1>TERRAGRID</h1>
            <p className="hero-lede">
              Producción de alimentos en ambiente controlado para territorios con clima extremo,
              energía inestable y baja conectividad. Edge AI local y operación offline-first.
            </p>
            <div className="hero-actions">
              <a href="#experience" className="primary-action">
                Ver detalles
              </a>
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

      <section className="experience-band" id="experience">
        <div>
          <p className="eyebrow">El problema</p>
          <h2>Producir alimentos en territorios extremos sigue siendo inviable</h2>
        </div>
        <ol className="story-list">
          {STORY_STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="modules-band" id="modules">
        <div className="section-heading">
          <p className="eyebrow">Arquitectura del nodo</p>
          <h2>Seis capas integradas en un contenedor desplegable</h2>
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
      </section>

      {/* ── IMPACTO ────────────────────────────────────── */}
      <section className="impact-band" id="impacto">
        <div className="impact-heading">
          <p className="eyebrow">Impacto</p>
          <h2>Por qué importa más allá de la tecnología</h2>
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

      {/* ── MERCADO ────────────────────────────────────── */}
      <section className="pipeline-band" id="pipeline">
        <div className="pipeline-copy">
          <p className="eyebrow">Mercado objetivo</p>
          <h2>Cuatro segmentos con necesidad crítica</h2>
          <p>
            TERRAGRID opera donde otras soluciones fallan: baja conectividad, energía inestable y
            logística vulnerable. Su arquitectura modular permite instalarlo en comunidades rurales,
            campamentos industriales, instituciones públicas y zonas estratégicas con alta demanda
            de soberanía alimentaria.
          </p>
        </div>
        <div className="pipeline-steps">
          {[
            'Comunidades rurales',
            'Municipios',
            'Minería remota',
            'Bases de investigación',
            'Zonas fronterizas',
            'Centros educativos',
            'Agroindustria',
            'Respuesta a desastres',
          ].map((step) => (
            <span key={step}>{step}</span>
          ))}
        </div>
      </section>
      {/* ── EQUIPO ─────────────────────────────────────── */}
      <section className="team-band" id="equipo">
        <div className="team-heading">
          <p className="eyebrow">Equipo</p>
          <h2>Cuatro disciplinas, un solo sistema</h2>
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

      {/* ── CTA FINAL ──────────────────────────────────── */}
      <section className="cta-band">
        <p className="eyebrow">ElevateU 2026</p>
        <h2>Soberanía alimentaria extrema,<br />desde Bolivia al mundo.</h2>
        <p>TERRAGRID — Universidad Mayor de San Andrés · Carrera de Informática</p>
      </section>

    </main>
  )
}

useGLTF.preload(MODEL_PATH)

export default App
