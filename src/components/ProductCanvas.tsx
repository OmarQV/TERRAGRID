import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { ProductLine } from '../data/content'
import { gsap, type ScrollProgress } from '../lib/animation'
import { sunk } from '../lib/product-motion'

/** Cámara fija de 3/4, la misma vista que las fotos de producto. La escena solo mueve los modelos. */
const CAMERA_POSITION = new THREE.Vector3(7.7, 3.9, 9.7)
const CAMERA_TARGET = new THREE.Vector3(0, 1.2, 0)
const FOV = 22
/** Ancho que ocupa el equipo en el lienzo (la foto de producto ocupa el 100% de su caja). */
const FIT_WIDTH = 0.985
/** Margen inferior (en NDC) entre la base del equipo y el borde del lienzo. */
const FIT_BOTTOM = -0.97
/** Giro base y cuánto gira el modelo según su distancia al foco (rad por producto). */
const BASE_YAW = 0.11
const YAW_PER_PRODUCT = 0.75

export type Drag = { value: number }

type ProductCanvasProps = {
  products: ProductLine[]
  /** Posición continua del foco: 0 = primer producto, 1 = segundo… */
  position: ScrollProgress
  /** Avance 0–1 dentro del capítulo (solo celular, donde hay un lienzo por producto). */
  tilt?: ScrollProgress
  compact: boolean
  drag: Drag
  onModelReady: (id: string) => void
  onError: () => void
}

/** Escena 3D de los productos. Se carga de forma diferida para no retrasar el primer render. */
export default function ProductCanvas({ products, position, tilt, compact, drag, onModelReady, onError }: ProductCanvasProps) {
  // Se carga primero el que está en foco y, cuando termina, el siguiente más cercano.
  const order = useMemo(() => {
    const focus = Math.round(position.value)
    return products.map((_, index) => index).sort((a, b) => Math.abs(a - focus) - Math.abs(b - focus) || a - b)
  }, [products, position])
  const [count, setCount] = useState(1)

  return (
    <Canvas
      className="pstage-canvas"
      style={{ position: 'absolute', inset: 0 }}
      frameloop="demand"
      dpr={[1, compact ? 1.25 : 1.6]}
      camera={{ position: CAMERA_POSITION, fov: FOV, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1 }}
      onCreated={({ gl, camera }) => {
        gl.localClippingEnabled = true
        gl.setClearAlpha(0)
        camera.lookAt(CAMERA_TARGET)
        gl.domElement.addEventListener('webglcontextlost', onError)
      }}
    >
      <hemisphereLight args={['#f2fff8', '#0a1410', 1.5]} />
      <ambientLight intensity={0.5} color="#eafff1" />
      <directionalLight position={[-5, 8, 6]} intensity={2.2} color="#ffffff" />
      <directionalLight position={[6, 3, 4]} intensity={0.45} color="#dffff0" />
      <Interaction drag={drag} enabled={!compact} />
      {order.slice(0, count).map((index) => (
        <Suspense key={products[index].id} fallback={null}>
          <ProductModel
            product={products[index]}
            index={index}
            position={position}
            tilt={tilt}
            drag={drag}
            onReady={() => {
              onModelReady(products[index].id)
              setCount((value) => Math.min(products.length, value + 1))
            }}
          />
        </Suspense>
      ))}
    </Canvas>
  )
}

/** Arrastre horizontal: gira el modelo y, al soltar, vuelve suavemente a su posición. */
function Interaction({ drag, enabled }: { drag: Drag; enabled: boolean }) {
  const { gl, invalidate } = useThree()

  useEffect(() => {
    if (!enabled) return
    const element = gl.domElement
    let pressed = false
    let lastX = 0
    const down = (event: PointerEvent) => {
      pressed = true
      lastX = event.clientX
      element.setPointerCapture(event.pointerId)
      gsap.killTweensOf(drag)
    }
    const move = (event: PointerEvent) => {
      if (!pressed) return
      drag.value = THREE.MathUtils.clamp(drag.value + (event.clientX - lastX) * 0.008, -1.4, 1.4)
      lastX = event.clientX
      invalidate()
    }
    const up = () => {
      if (!pressed) return
      pressed = false
      gsap.to(drag, { value: 0, duration: 1.5, ease: 'power3.out', onUpdate: invalidate })
    }
    element.addEventListener('pointerdown', down)
    element.addEventListener('pointermove', move)
    element.addEventListener('pointerup', up)
    element.addEventListener('pointercancel', up)
    return () => {
      element.removeEventListener('pointerdown', down)
      element.removeEventListener('pointermove', move)
      element.removeEventListener('pointerup', up)
      element.removeEventListener('pointercancel', up)
      gsap.killTweensOf(drag)
    }
  }, [gl, invalidate, drag, enabled])

  return null
}

type ModelProps = {
  product: ProductLine
  index: number
  position: ScrollProgress
  tilt?: ScrollProgress
  drag: Drag
  onReady: () => void
}

function ProductModel({ product, index, position, tilt, drag, onReady }: ModelProps) {
  const gltf = useGLTF(product.model, '/draco/')
  const { size, invalidate, get } = useThree()
  const outer = useRef<THREE.Group>(null)
  // Plano del suelo (mundo): lo que queda bajo la base se recorta, así el equipo sube/baja "dentro" de la plataforma.
  const floor = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), [])
  const fit = useRef({ y: 0, drop: 0 })
  const announce = useRef(onReady)
  useEffect(() => { announce.current = onReady })

  const prepared = useMemo(() => {
    const scene = gltf.scene.clone(true)
    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return
      const materials = (Array.isArray(object.material) ? object.material : [object.material]).map((material: THREE.Material) => {
        const copy = material.clone()
        copy.clippingPlanes = [floor]
        if (copy instanceof THREE.MeshStandardMaterial) {
          copy.roughness = Math.min(0.8, Math.max(0.3, copy.roughness))
          copy.metalness = Math.min(0.5, copy.metalness)
          copy.envMapIntensity = 1
        }
        return copy
      })
      object.material = Array.isArray(object.material) ? materials : materials[0]
    })
    // Normaliza el tamaño y apoya la base en el origen.
    scene.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(scene)
    const dimensions = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const scale = 4.2 / Math.max(dimensions.x, dimensions.y, dimensions.z)
    scene.position.set(-center.x, -box.min.y, -center.z)
    const inner = new THREE.Group()
    inner.scale.setScalar(scale)
    inner.add(scene)
    inner.updateMatrixWorld(true)
    const bounds = new THREE.Box3().setFromObject(inner)
    const corners = [bounds.min.x, bounds.max.x].flatMap((x) => [bounds.min.y, bounds.max.y].flatMap((y) => [bounds.min.z, bounds.max.z].map((z) => new THREE.Vector3(x, y, z))))
    return { inner, corners, height: bounds.max.y - bounds.min.y }
  }, [gltf.scene, floor])

  // Encuadra el equipo: ancho = el de su foto, base sobre el borde inferior del lienzo. Se repite al cambiar el tamaño.
  useLayoutEffect(() => {
    const group = outer.current
    if (!group) return
    const perspective = get().camera as THREE.PerspectiveCamera
    perspective.aspect = size.width / size.height
    perspective.updateProjectionMatrix()
    perspective.lookAt(CAMERA_TARGET)
    perspective.updateMatrixWorld(true)
    const right = new THREE.Vector3().setFromMatrixColumn(perspective.matrixWorld, 0)
    const up = new THREE.Vector3().setFromMatrixColumn(perspective.matrixWorld, 1)
    const distance = perspective.position.distanceTo(CAMERA_TARGET)
    const halfHeight = distance * Math.tan(THREE.MathUtils.degToRad(FOV / 2))
    const halfWidth = halfHeight * perspective.aspect

    group.rotation.set(0, BASE_YAW, 0)
    group.scale.setScalar(1)
    group.position.set(0, 0, 0)
    const measure = () => {
      group.updateMatrixWorld(true)
      let minX = Infinity, maxX = -Infinity, minY = Infinity
      for (const corner of prepared.corners) {
        const point = group.localToWorld(corner.clone()).project(perspective)
        minX = Math.min(minX, point.x)
        maxX = Math.max(maxX, point.x)
        minY = Math.min(minY, point.y)
      }
      return { width: maxX - minX, centerX: (maxX + minX) / 2, minY }
    }
    for (let pass = 0; pass < 5; pass++) {
      const { width, centerX, minY } = measure()
      group.scale.multiplyScalar((FIT_WIDTH * 2) / width)
      group.position.addScaledVector(right, -centerX * halfWidth)
      group.position.addScaledVector(up, (FIT_BOTTOM - minY) * halfHeight)
    }
    fit.current = { y: group.position.y, drop: prepared.height * group.scale.y * 1.12 }
    // eslint-disable-next-line react-hooks/immutability -- el plano es un objeto de three.js, no estado de React
    floor.constant = -group.position.y
    invalidate()
  }, [get, size.width, size.height, prepared, floor, invalidate])

  // Avisa una sola vez, cuando el modelo ya se dibujó (así la foto se funde sin dejar un hueco).
  useEffect(() => {
    let frame = requestAnimationFrame(() => { frame = requestAnimationFrame(() => announce.current()) })
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => position.subscribe(() => invalidate()), [position, invalidate])
  useEffect(() => tilt?.subscribe(() => invalidate()), [tilt, invalidate])

  useEffect(() => () => {
    // La geometría y las texturas son de la caché de useGLTF; solo los materiales clonados son nuestros.
    prepared.inner.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) material.dispose()
    })
  }, [prepared])

  useFrame(() => {
    const group = outer.current
    if (!group) return
    const distance = index - position.value
    const hidden = sunk(distance)
    group.visible = hidden < 0.999
    group.position.y = fit.current.y - hidden * fit.current.drop
    group.rotation.y = BASE_YAW - distance * YAW_PER_PRODUCT + (tilt ? (tilt.value - 0.5) * 0.5 : 0) + drag.value
  })

  return (
    <group ref={outer} dispose={null}>
      <primitive object={prepared.inner} />
    </group>
  )
}
