import { Html, useCursor } from '@react-three/drei'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import type * as THREE from 'three'
import type { CompareApp } from '../../app/compare-app.ts'
import type { FeetWorld } from '../../domain/feet-world.ts'
import type { ShoeSystem } from '../../domain/shoe-charts.ts'
import { toFootDraw, type FootDraw } from '../draw.ts'
import { bakeFootStandIn } from '../standin/foot-baker.ts'

function FootFigure({ app, draw }: { app: CompareApp; draw: FootDraw }) {
  const [hovered, setHovered] = useState(false)
  const ring = useRef<THREE.Mesh>(null)
  const ringMaterial = useRef<THREE.MeshBasicMaterial>(null)
  const standIn = useMemo(() => bakeFootStandIn(draw.recipe), [draw.recipe])
  const renderedLength = draw.referenceLengthM * draw.scale

  useCursor(hovered)
  useFrame(({ clock }) => {
    if (!ring.current || !ringMaterial.current || !draw.selected) {
      return
    }

    const pulse = 1 + Math.sin(clock.elapsedTime * 3.8) * 0.04
    ring.current.scale.set(
      renderedLength * 0.27 * pulse,
      renderedLength * 0.58 * pulse,
      1,
    )
    ringMaterial.current.opacity = 0.58 + Math.sin(clock.elapsedTime * 3.8) * 0.1
  })

  function select(event: ThreeEvent<MouseEvent>): void {
    event.stopPropagation()
    app.select(draw.id)
  }

  return (
    <group
      position={draw.position}
      rotation={[0, draw.yaw, 0]}
      onClick={select}
      onDoubleClick={(event) => {
        select(event)
        app.frameSelection()
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      <primitive object={standIn} scale={renderedLength} />
      {(draw.selected || hovered) && (
        <mesh
          ref={ring}
          position={[0, 0.006, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[renderedLength * 0.27, renderedLength * 0.58, 1]}
        >
          <ringGeometry args={[0.86, 1, 64]} />
          <meshBasicMaterial
            ref={ringMaterial}
            color={draw.selected ? '#f0ad63' : '#fff7e8'}
            transparent
            opacity={draw.selected ? 0.66 : 0.3}
            depthWrite={false}
          />
        </mesh>
      )}
      <Html
        center
        position={[0, renderedLength * 1.1 + 0.08, -renderedLength * 0.2]}
        distanceFactor={2.2}
        style={{ pointerEvents: 'none' }}
      >
        <span className={draw.selected ? 'scene-label feet-label is-selected' : 'scene-label feet-label'}>
          {draw.label}
        </span>
      </Html>
    </group>
  )
}

export function FootFigures({
  app,
  world,
  system,
}: {
  app: CompareApp
  world: FeetWorld
  system: ShoeSystem
}) {
  return world.placements.map((placement) => (
    <FootFigure
      key={placement.id}
      app={app}
      draw={toFootDraw(placement, world.selected, system)}
    />
  ))
}
