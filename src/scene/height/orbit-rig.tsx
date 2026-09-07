import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useCallback, useEffect, useRef, type ComponentRef } from 'react'
import * as THREE from 'three'
import type { NavRig } from '../../app/compare-app.ts'
import type { HeightWorld } from '../../domain/height-world.ts'
import type { HeightOrbitSnapshot } from '../../domain/navigation.ts'

function defaultView(world: HeightWorld): HeightOrbitSnapshot {
  const placements = world.placements
  const centerX =
    placements.length === 0
      ? 0
      : placements.reduce((sum, placement) => sum + placement.pose.x, 0) / placements.length
  const span =
    placements.length < 2
      ? 2.4
      : Math.max(...placements.map((placement) => placement.pose.x)) -
          Math.min(...placements.map((placement) => placement.pose.x))
  const distance = Math.max(5.2, span * 1.15 + 3.2)
  return {
    kind: 'orbit',
    target: [centerX, 0.95, 0],
    position: [centerX + distance * 0.42, 2.35, distance],
  }
}

function selectionView(world: HeightWorld): HeightOrbitSnapshot {
  const selected = world.placements.find((placement) => placement.id === world.selected)
  if (!selected) {
    return defaultView(world)
  }

  const height = selected.heightMm / 1000
  return {
    kind: 'orbit',
    target: [selected.pose.x, height * 0.52, selected.pose.z],
    position: [selected.pose.x + height * 0.8, height * 0.72, selected.pose.z + height * 2.1],
  }
}

export function HeightOrbitRig({
  world,
  rig,
}: {
  world: HeightWorld
  rig: NavRig
}) {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null)
  const initialized = useRef(false)
  const { camera } = useThree()

  const apply = useCallback(
    (snapshot: HeightOrbitSnapshot): void => {
      camera.position.set(...snapshot.position)
      camera.near = 0.03
      camera.far = 60
      camera.updateProjectionMatrix()
      controls.current?.target.set(...snapshot.target)
      controls.current?.update()
    },
    [camera],
  )

  useEffect(() => {
    if (initialized.current) {
      return
    }

    const saved = world.savedNav
    apply(saved?.kind === 'orbit' ? saved : defaultView(world))
    initialized.current = true
  })

  useEffect(() => {
    if (world.cameraIntent.kind === 'none') {
      return
    }

    const intent = rig.consumeHeightIntent()
    if (intent.kind === 'frame-selection') {
      apply(selectionView(world))
    } else if (intent.kind === 'reset') {
      apply(defaultView(world))
    } else if (intent.kind === 'restore' && intent.snapshot.kind === 'orbit') {
      apply(intent.snapshot)
    }
  }, [apply, rig, world, world.cameraIntent])

  function snapshot(): HeightOrbitSnapshot {
    const target = controls.current?.target ?? new THREE.Vector3(0, 0.95, 0)
    return {
      kind: 'orbit',
      target: [target.x, target.y, target.z],
      position: [camera.position.x, camera.position.y, camera.position.z],
    }
  }

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.07}
      minDistance={1.2}
      maxDistance={20}
      maxPolarAngle={Math.PI / 2 - 0.025}
      target={[0, 0.95, 0]}
      onEnd={() => rig.commitHeightSnapshot(snapshot())}
    />
  )
}
