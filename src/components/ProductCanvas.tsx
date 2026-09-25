import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { ProductLine } from '../data/content'
import type { ScrollProgress } from '../lib/animation'

function ProductModel({ path, onReady, progress }: { path: string; onReady: () => void; progress: ScrollProgress }) {
  const gltf = useGLTF(path, '/draco/')
  const group = useRef<THREE.Group>(null)
  const { camera, invalidate } = useThree()

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

  useEffect(() => progress.subscribe((value) => {
    // Fed by ScrollTrigger on GSAP's clock. Render only when the scene changes.
    const offset = value - 0.5
    if (group.current) {
      group.current.rotation.y = offset * 0.28
      group.current.position.y = offset * 0.1
    }
    camera.position.set(5.1 + offset * 0.4, 2.6 + offset * 0.3, 6.4 - offset * 0.5)
    camera.lookAt(0, 0.15, 0)
    invalidate()
  }), [progress, camera, invalidate])

  useEffect(() => () => {
    // Geometry/textures belong to useGLTF's cache; only cloned materials are ours.
    prepared.scene.traverse((object) => {
      if (object instanceof THREE.Mesh && object.material instanceof THREE.MeshStandardMaterial) object.material.dispose()
    })
  }, [prepared])

  return (
    <group ref={group} dispose={null}>
      <group scale={prepared.scale} position={[0, -1.75, 0]}>
        <primitive object={prepared.scene} position={prepared.offset} />
      </group>
    </group>
  )
}

type ProductCanvasProps = {
  product: ProductLine
  modelReady: boolean
  progress: ScrollProgress
  onReady: () => void
  onError: () => void
}

/** Escena 3D del producto. Se carga de forma diferida para no retrasar el primer render del hero. */
export default function ProductCanvas({ product, modelReady, progress, onReady, onError }: ProductCanvasProps) {
  return (
    <Canvas
      className={`product-canvas ${modelReady ? 'is-ready' : ''}`}
      frameloop="demand"
      fallback={<CanvasUnavailable onError={onError} />}
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
        <ProductModel key={product.model} path={product.model} onReady={onReady} progress={progress} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.76, 0]} receiveShadow>
          <planeGeometry args={[12, 12]} />
          <shadowMaterial transparent opacity={0.25} />
        </mesh>
      </Suspense>
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3.1}
        maxPolarAngle={Math.PI / 2.05}
        enableDamping={false}
        target={[0, 0.15, 0]}
      />
    </Canvas>
  )
}

function CanvasUnavailable({ onError }: { onError: () => void }) {
  useEffect(onError, [onError])
  return null
}
