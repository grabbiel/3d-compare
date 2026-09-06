import { Html, useCursor } from '@react-three/drei'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import type * as THREE from 'three'
import type { CompareApp } from '../../app/compare-app.ts'
import type { HeightWorld } from '../../domain/height-world.ts'
import type { LengthUnit } from '../../domain/measure.ts'
import { toHumanDraw, type HumanDraw } from '../draw.ts'
import { bakeHumanStandIn } from '../standin/human-baker.ts'

type HumanFigureProps = {
  app: CompareApp
  draw: HumanDraw
}

function HumanFigure({ app, draw }: HumanFigureProps) {
  const [hovered, setHovered] = useState(false)
  const ring = useRef<THREE.Mesh>(null)
  const ringMaterial = useRef<THREE.MeshBasicMaterial>(null)
  const standIn = useMemo(() => bakeHumanStandIn(draw.recipe), [draw.recipe])
  const renderedHeight = draw.referenceHeightM * draw.scale
  const ringRadius =
    Math.max(draw.recipe.shoulderWidth, draw.recipe.hipWidth) * renderedHeight * 0.7 + 0.07

  useCursor(hovered)
  useFrame(({ clock }) => {
    if (!ring.current || !ringMaterial.current || !draw.selected) {
      return
    }

    const pulse = 1 + Math.sin(clock.elapsedTime * 3.4) * 0.035
    ring.current.scale.setScalar(pulse)
    ringMaterial.current.opacity = 0.54 + Math.sin(clock.elapsedTime * 3.4) * 0.12
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
      <primitive object={standIn} scale={renderedHeight} />
      {(draw.selected || hovered) && (
        <mesh ref={ring} position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[ringRadius * 0.86, ringRadius, 64]} />
          <meshBasicMaterial
            ref={ringMaterial}
            color={draw.selected ? '#e7a45d' : '#ffffff'}
            transparent
            opacity={draw.selected ? 0.66 : 0.32}
            depthWrite={false}
          />
        </mesh>
      )}
      <Html
        center
        position={[0, renderedHeight + 0.13, 0]}
        distanceFactor={7}
        style={{ pointerEvents: 'none' }}
      >
        <span className={draw.selected ? 'scene-label is-selected' : 'scene-label'}>
          {draw.label}
        </span>
      </Html>
    </group>
  )
}

export function HumanFigures({
  app,
  world,
  unit,
}: {
  app: CompareApp
  world: HeightWorld
  unit: LengthUnit
}) {
  return world.placements.map((placement) => (
    <HumanFigure
      key={placement.id}
      app={app}
      draw={toHumanDraw(placement, world.selected, unit)}
    />
  ))
}
