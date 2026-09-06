import { Grid, Html } from '@react-three/drei'
import type { ReactNode } from 'react'

const rulerMarks = Array.from({ length: 23 }, (_, index) => index / 10)
const rulerLabels = [0, 50, 100, 150, 200]

export function HeightStudio({ children }: { children: ReactNode }) {
  return (
    <>
      <color attach="background" args={['#b8b9b5']} />
      <fog attach="fog" args={['#b8b9b5', 10, 26]} />
      <ambientLight intensity={1.25} color="#e8eeec" />
      <hemisphereLight args={['#f2f6f4', '#7a756c', 1.45]} />
      <directionalLight position={[4, 7, 5]} intensity={1.65} color="#fff6e6" />
      <directionalLight position={[-3, 3, -2]} intensity={0.55} color="#c5d5da" />

      <mesh position={[0, -0.045, 0]}>
        <boxGeometry args={[13, 0.09, 7]} />
        <meshStandardMaterial color="#9d9e99" roughness={0.92} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <circleGeometry args={[0.55, 48]} />
        <meshBasicMaterial color="#2f322e" transparent opacity={0.16} />
      </mesh>
      <Grid
        position={[0, 0.004, 0]}
        args={[12, 6]}
        cellSize={0.1}
        cellThickness={0.35}
        cellColor="#858780"
        sectionSize={1}
        sectionThickness={1.15}
        sectionColor="#6f726b"
        fadeDistance={13}
        fadeStrength={1.4}
        infiniteGrid={false}
      />
      <mesh position={[0, 2.1, -2.72]}>
        <boxGeometry args={[13, 4.2, 0.12]} />
        <meshStandardMaterial color="#c7c7c1" roughness={0.96} />
      </mesh>
      <mesh position={[-6.1, 2.1, 0]}>
        <boxGeometry args={[0.12, 4.2, 5.5]} />
        <meshStandardMaterial color="#afb0ab" roughness={0.94} />
      </mesh>

      <group position={[-5.35, 0, -2.62]}>
        <mesh position={[0, 1.1, 0.012]}>
          <boxGeometry args={[0.018, 2.2, 0.012]} />
          <meshBasicMaterial color="#444b48" />
        </mesh>
        {rulerMarks.map((height, index) => {
          const major = index % 5 === 0
          return (
            <mesh key={height} position={[major ? 0.105 : 0.065, height, 0.015]}>
              <boxGeometry args={[major ? 0.22 : 0.13, major ? 0.012 : 0.006, 0.012]} />
              <meshBasicMaterial color={major ? '#2c3532' : '#646a66'} />
            </mesh>
          )
        })}
        {rulerLabels.map((centimeters) => (
          <Html
            key={centimeters}
            center
            position={[-0.2, centimeters / 100, 0.04]}
            distanceFactor={6}
            style={{ pointerEvents: 'none' }}
          >
            <span className="ruler-label">{centimeters}</span>
          </Html>
        ))}
        <Html center position={[-0.2, 2.28, 0.04]} distanceFactor={6} style={{ pointerEvents: 'none' }}>
          <span className="ruler-unit">CM</span>
        </Html>
      </group>

      {children}
    </>
  )
}
