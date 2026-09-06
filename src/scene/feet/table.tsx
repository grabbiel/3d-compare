import { Grid, Html } from '@react-three/drei'
import type { ReactNode } from 'react'

const rulerLabels = Array.from({ length: 11 }, (_, index) => (index - 5) * 10)
const grainLines = Array.from({ length: 9 }, (_, index) => -0.48 + index * 0.12)

export function FeetTable({ children }: { children: ReactNode }) {
  return (
    <>
      <color attach="background" args={['#3a322a']} />
      <fog attach="fog" args={['#3a322a', 4, 10]} />
      <ambientLight intensity={1.15} color="#f8e2c4" />
      <hemisphereLight args={['#ffe8c8', '#4a3f34', 1.25]} />
      <directionalLight position={[-2.5, 4, 3]} intensity={1.9} color="#ffd9a8" />
      <directionalLight position={[2, 2.5, -1]} intensity={0.45} color="#d8e3d7" />

      <mesh position={[0, -0.075, 0]}>
        <boxGeometry args={[2.2, 0.15, 1.2]} />
        <meshStandardMaterial color="#8a6140" roughness={0.68} />
      </mesh>
      <mesh position={[0, -0.155, 0]}>
        <boxGeometry args={[2.26, 0.035, 1.26]} />
        <meshStandardMaterial color="#3b2a20" roughness={0.78} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
        <circleGeometry args={[0.28, 48]} />
        <meshBasicMaterial color="#1a120c" transparent opacity={0.28} />
      </mesh>

      {grainLines.map((z, index) => (
        <mesh key={z} position={[0, 0.002, z]}>
          <boxGeometry args={[2.05, index % 3 === 0 ? 0.004 : 0.002, 0.004]} />
          <meshBasicMaterial color={index % 3 === 0 ? '#9b6d49' : '#6d492f'} />
        </mesh>
      ))}

      <Grid
        position={[0, 0.006, 0]}
        args={[2, 1]}
        cellSize={0.01}
        cellThickness={0.24}
        cellColor="#c39967"
        sectionSize={0.1}
        sectionThickness={0.9}
        sectionColor="#e1bc83"
        fadeDistance={3}
        fadeStrength={1}
        infiniteGrid={false}
      />

      <group position={[0, 0.011, 0]}>
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.19, 0.195, 80, 1, 0.15, Math.PI * 0.7]} />
          <meshBasicMaterial color="#efe0c4" transparent opacity={0.42} />
        </mesh>
        <mesh position={[0, 0, -0.36]}>
          <boxGeometry args={[1.5, 0.004, 0.008]} />
          <meshBasicMaterial color="#efe0c4" transparent opacity={0.52} />
        </mesh>
        <mesh position={[0, 0, 0.36]}>
          <boxGeometry args={[1.5, 0.004, 0.008]} />
          <meshBasicMaterial color="#efe0c4" transparent opacity={0.52} />
        </mesh>
      </group>

      {rulerLabels.map((centimeters) => (
        <Html
          key={centimeters}
          center
          position={[centimeters / 100, 0.025, -0.535]}
          rotation={[-Math.PI / 2, 0, 0]}
          distanceFactor={1.8}
          style={{ pointerEvents: 'none' }}
        >
          <span className="table-ruler-label">{centimeters === 0 ? '0 CM' : Math.abs(centimeters)}</span>
        </Html>
      ))}

      {children}
    </>
  )
}
