import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { PMREMGenerator } from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

/**
 * Image-based lighting from Three's procedural room. Skin and fabric pick up soft
 * ambient light and reflections without the app downloading an HDR.
 */
export function StudioEnvironment({ intensity = 1 }: { intensity?: number }) {
  const gl = useThree((state) => state.gl)
  const scene = useThree((state) => state.scene)

  useEffect(() => {
    const generator = new PMREMGenerator(gl)
    const target = generator.fromScene(new RoomEnvironment(), 0.04)
    scene.environment = target.texture
    scene.environmentIntensity = intensity
    return () => {
      scene.environment = null
      scene.environmentIntensity = 1
      target.dispose()
      generator.dispose()
    }
  }, [gl, scene, intensity])

  return null
}
