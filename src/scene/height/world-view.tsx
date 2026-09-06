import type { CompareApp } from '../../app/compare-app.ts'
import { useNavRig } from '../../app/use-compare.ts'
import type { CompareDocument } from '../../domain/document.ts'
import { HumanFigures } from './figures.tsx'
import { HeightOrbitRig } from './orbit-rig.tsx'
import { HeightStudio } from './studio.tsx'
import { HeightWalkRig } from './walk-rig.tsx'

export function HeightWorldView({
  app,
  document,
}: {
  app: CompareApp
  document: CompareDocument
}) {
  const rig = useNavRig(app)
  return (
    <HeightStudio>
      <HumanFigures app={app} world={document.height} unit={document.heightUnit} />
      {document.height.navMode === 'orbit' ? (
        <HeightOrbitRig world={document.height} rig={rig} />
      ) : (
        <HeightWalkRig world={document.height} rig={rig} />
      )}
    </HeightStudio>
  )
}
