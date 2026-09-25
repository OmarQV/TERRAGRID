import { Suspense, useEffect, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Float, OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { ProductLine } from '../data/content'

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

type ProductCanvasProps = {
  product: ProductLine
  modelReady: boolean
  reduceMotion: boolean | null
  onReady: () => void
}

/** Escena 3D del producto. Se carga de forma diferida para no retrasar el primer render del hero. */
export default function ProductCanvas({ product, modelReady, reduceMotion, onReady }: ProductCanvasProps) {
  return (
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
        <ProductModel key={product.model} path={product.model} onReady={onReady} />
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
  )
}
