import type { CompareApp } from '../../app/compare-app.ts'
import { useNavRig } from '../../app/use-compare.ts'
import type { CompareDocument } from '../../domain/document.ts'
import { FootFigures } from './figures.tsx'
import { FeetInspectRig } from './inspect-rig.tsx'
import { FeetOrbitRig } from './orbit-rig.tsx'
import { FeetTable } from './table.tsx'

export function FeetWorldView({
  app,
  document,
}: {
  app: CompareApp
  document: CompareDocument
}) {
  const rig = useNavRig(app)
  return (
    <FeetTable>
      <FootFigures app={app} world={document.feet} system={document.shoeSystem} />
      {document.feet.navMode === 'orbit' ? (
        <FeetOrbitRig world={document.feet} rig={rig} />
      ) : (
        <FeetInspectRig world={document.feet} rig={rig} />
      )}
    </FeetTable>
  )
}
