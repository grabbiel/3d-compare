import { PointerLockControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useCallback, useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { NavRig } from '../../app/compare-app.ts'
import type { HeightWorld } from '../../domain/height-world.ts'
import { DEFAULT_WALK_EYE_M, type HeightWalkSnapshot } from '../../domain/navigation.ts'

const UP = new THREE.Vector3(0, 1, 0)

function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLSelectElement ||
    target instanceof HTMLTextAreaElement
  )
}

export function HeightWalkRig({
  world,
  rig,
}: {
  world: HeightWorld
  rig: NavRig
}) {
  const { camera } = useThree()
  const keys = useRef(new Set<string>())
  const initialized = useRef(false)

  const apply = useCallback(
    (snapshot: HeightWalkSnapshot): void => {
      camera.position.set(...snapshot.eye)
      camera.rotation.set(snapshot.pitch, snapshot.yaw, 0, 'YXZ')
      camera.near = 0.03
      camera.far = 60
      camera.updateProjectionMatrix()
    },
    [camera],
  )

  const reset = useCallback((): void => {
    camera.position.set(0, DEFAULT_WALK_EYE_M, 3.4)
    camera.lookAt(0, 1.35, 0)
  }, [camera])

  const frameSelection = useCallback((): void => {
    const selected = world.placements.find((placement) => placement.id === world.selected)
    if (!selected) {
      reset()
      return
    }

    const height = selected.heightMm / 1000
    camera.position.set(selected.pose.x, DEFAULT_WALK_EYE_M, selected.pose.z + 2.25)
    camera.lookAt(selected.pose.x, Math.min(height * 0.72, DEFAULT_WALK_EYE_M), selected.pose.z)
  }, [camera, reset, world.placements, world.selected])

  useEffect(() => {
    if (initialized.current) {
      return
    }

    if (world.savedNav?.kind === 'walk') {
      apply(world.savedNav)
    } else {
      reset()
    }
    initialized.current = true
  })

  useEffect(() => {
    function keyDown(event: KeyboardEvent): void {
      if (isTypingTarget(event.target)) {
        return
      }
      keys.current.add(event.code)
    }

    function keyUp(event: KeyboardEvent): void {
      keys.current.delete(event.code)
    }

    window.addEventListener('keydown', keyDown)
    window.addEventListener('keyup', keyUp)
    return () => {
      window.removeEventListener('keydown', keyDown)
      window.removeEventListener('keyup', keyUp)
      rig.commitHeightSnapshot({
        kind: 'walk',
        eye: [camera.position.x, camera.position.y, camera.position.z],
        yaw: camera.rotation.y,
        pitch: camera.rotation.x,
      })
    }
  }, [camera, rig])

  useEffect(() => {
    if (world.cameraIntent.kind === 'none') {
      return
    }

    const intent = rig.consumeHeightIntent()
    if (intent.kind === 'frame-selection') {
      frameSelection()
    } else if (intent.kind === 'reset') {
      reset()
    } else if (intent.kind === 'restore' && intent.snapshot.kind === 'walk') {
      apply(intent.snapshot)
    }
  }, [apply, frameSelection, reset, rig, world.cameraIntent])

  useFrame((_, delta) => {
    const forwardInput =
      Number(keys.current.has('KeyW') || keys.current.has('ArrowUp')) -
      Number(keys.current.has('KeyS') || keys.current.has('ArrowDown'))
    const strafeInput =
      Number(keys.current.has('KeyD') || keys.current.has('ArrowRight')) -
      Number(keys.current.has('KeyA') || keys.current.has('ArrowLeft'))
    if (forwardInput === 0 && strafeInput === 0) {
      return
    }

    const forward = new THREE.Vector3()
    camera.getWorldDirection(forward)
    forward.y = 0
    forward.normalize()
    const right = forward.clone().cross(UP).normalize()
    const speed = keys.current.has('ShiftLeft') ? 3.25 : 1.75
    camera.position.addScaledVector(forward, forwardInput * speed * delta)
    camera.position.addScaledVector(right, strafeInput * speed * delta)
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -7.2, 7.2)
    camera.position.y = DEFAULT_WALK_EYE_M
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -2.35, 3.35)
  })

  return <PointerLockControls makeDefault />
}
