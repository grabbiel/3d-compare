import { AdaptiveDpr } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import type { CompareApp } from '../app/compare-app.ts'
import type { CompareDocument } from '../domain/document.ts'
import { FeetWorldView } from './feet/world-view.tsx'
import { HeightWorldView } from './height/world-view.tsx'

export function CompareCanvas({
  app,
  document,
}: {
  app: CompareApp
  document: CompareDocument
}) {
  return (
    <Canvas
      id="compare-stage"
      shadows="soft"
      dpr={[1, 1.75]}
      camera={{ position: [4, 2.4, 6], fov: 38, near: 0.01, far: 60 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onPointerMissed={() => app.select(null)}
    >
      <Suspense fallback={null}>
        {document.mode === 'height' ? (
          <HeightWorldView app={app} document={document} />
        ) : (
          <FeetWorldView app={app} document={document} />
        )}
      </Suspense>
      <AdaptiveDpr pixelated />
    </Canvas>
  )
}
