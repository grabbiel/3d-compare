import { useMemo } from 'react'
import * as THREE from 'three'

let cachedTexture: THREE.CanvasTexture | null = null

/** A radial falloff painted once and shared by every shadow on both stages. */
function shadowTexture(): THREE.CanvasTexture {
  if (cachedTexture) {
    return cachedTexture
  }

  const size = 128
  const canvas = window.document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  if (context) {
    const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.5)')
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.26)')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, size, size)
  }

  cachedTexture = new THREE.CanvasTexture(canvas)
  return cachedTexture
}

/**
 * Grounds a figure without shadow maps, which software renderers composite badly.
 * Radii are in meters; the shadow is centered on `position` at floor level.
 */
export function BlobShadow({
  radiusX,
  radiusZ,
  position = [0, 0, 0],
}: {
  radiusX: number
  radiusZ: number
  position?: readonly [number, number, number]
}) {
  const texture = useMemo(() => shadowTexture(), [])
  return (
    <mesh
      position={[position[0], 0.003, position[2]]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[radiusX, radiusZ, 1]}
    >
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  )
}
