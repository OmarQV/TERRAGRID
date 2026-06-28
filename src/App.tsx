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
import './App.css'

const MODEL_PATH = '/blender/TERRAGRID_web_v2.glb'

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
    copy: 'Energia firme para operar agricultura controlada en zonas remotas sin depender de una red inestable.',
    position: [5.85, 2.75, 0],
  },
  {
    id: 'solar',
    label: 'Solar',
    title: 'Generacion solar',
    copy: 'Paneles y almacenamiento reducen consumo auxiliar y permiten modos hibridos de operacion.',
    position: [1.5, 1.28, 2.45],
  },
  {
    id: 'hydroponic',
    label: 'Hydro',
    title: 'Cultivo hidroponico',
    copy: 'Produccion de alimentos en interior con nutrientes, temperatura y humedad medidos en tiempo real.',
    position: [-1.2, 2.25, 0.35],
  },
  {
    id: 'water',
    label: 'H2O',
    title: 'Sistema de agua',
    copy: 'Recirculacion, filtrado y sensores para maximizar cada litro en clima arido de altura.',
    position: [-2.3, 0.9, 0.78],
  },
  {
    id: 'ai',
    label: 'IA',
    title: 'Control autonomo',
    copy: 'Modelos predictivos coordinan energia, riego, clima interior y mantenimiento preventivo.',
    position: [0, 3.65, 0],
  },
  {
    id: 'sensors',
    label: 'IoT',
    title: 'Sensores distribuidos',
    copy: 'Telemetria simulada para humedad, radiacion, caudal, potencia, temperatura y salud del sistema.',
    position: [2.54, 2.45, 0],
  },
]

const STORY_STEPS = [
  'Orbita alrededor del contenedor TERRAGRID',
  'Apertura de puertas y acceso tecnico',
  'Visualizacion del sistema hidroponico',
  'Aislamiento del nucleo SMR',
  'Capa IoT con estadisticas operativas',
]

const MODULES = [
  ['Terrain', 'Altiplano arido con grietas, rocas y desniveles suaves.'],
  ['Vegetation', 'Ichu seco disperso, bajo poligonaje y variacion aleatoria.'],
  ['Mountains', 'Cordillera nevada a distancia cinematografica.'],
  ['Lights', 'Golden hour, sombras largas y ambiente calido.'],
  ['LOD', 'Tres niveles listos para GLB web: ultra, medio y bajo.'],
  ['IoT', 'Hotspots con datos simulados para demo interactiva.'],
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
  const scene = useMemo(() => {
    const clonedScene = gltf.scene.clone(true)

    clonedScene.traverse((object) => {
      if (object.name === 'Montanas_Cordillera') {
        object.visible = false
      }
      if (object instanceof THREE.Mesh) {
        object.castShadow = true
        object.receiveShadow = true
      }
    })

    return clonedScene
  }, [gltf.scene])

  return (
    <group scale={0.76} position={[1.85, 0.05, 0.1]} rotation-y={-0.34}>
      <primitive object={scene} />
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
      {/* FONDO DEL CIELO — cambia '#ffffff' por cualquier color o agrega <Sky> aqui */}
      <color attach="background" args={['#008ca9ff']} />

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
            <a href="#modules">Modulos</a>
            <a href="#pipeline">GLB Web</a>
          </nav>
        )}

        {!focusMode && (
          <div className="hero-copy" id="hero">
            <p className="eyebrow">Containerized nuclear agriculture</p>
            <h1>TERRAGRID</h1>
            <p className="hero-lede">
              Agricultura de precision, energia firme y control IoT dentro de un contenedor desplegable
              para operar en el altiplano boliviano.
            </p>
            <div className="hero-actions">
              <a href="#experience" className="primary-action">
                Ver experiencia
              </a>
              <a href="#pipeline" className="secondary-action">
                Preparar GLB
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

        {!focusMode && (
          <div className="hero-metrics" aria-label="Metricas simuladas">
            <span>50k-150k tris</span>
            <span>LOD0/1/2</span>
            <span>Golden hour</span>
            <span>IoT ready</span>
          </div>
        )}
      </section>

      <section className="experience-band" id="experience">
        <div>
          <p className="eyebrow">Scroll animation</p>
          <h2>Un recorrido pensado para una startup deep-tech</h2>
        </div>
        <ol className="story-list">
          {STORY_STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="modules-band" id="modules">
        <div className="section-heading">
          <p className="eyebrow">Hero render</p>
          <h2>Lo que la escena agrega alrededor del prototipo</h2>
        </div>
        <div className="module-grid">
          {MODULES.map(([title, copy]) => (
            <article key={title} className="module-card">
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pipeline-band" id="pipeline">
        <div className="pipeline-copy">
          <p className="eyebrow">Blender a React</p>
          <h2>Ruta recomendada para el siguiente export</h2>
          <p>
            Organiza la escena en colecciones, aplica transformaciones, hornea materiales PBR, crea
            animaciones utiles y exporta el archivo como GLB con texturas, compresion y LOD.
          </p>
        </div>
        <div className="pipeline-steps">
          {['Terrain', 'Vegetation', 'Rocks', 'Mountains', 'HDRI', 'Cameras', 'Fog', 'Post FX'].map(
            (step) => (
              <span key={step}>{step}</span>
            ),
          )}
        </div>
      </section>
    </main>
  )
}

useGLTF.preload(MODEL_PATH)

export default App
