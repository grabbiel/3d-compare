import type { CompareApp } from '../app/compare-app.ts'
import type { CompareDocument } from '../domain/document.ts'

export function UnitToggles({
  app,
  document,
}: {
  app: CompareApp
  document: CompareDocument
}) {
  if (document.mode === 'height') {
    return (
      <div className="compact-toggle" aria-label="Height unit">
        <button
          type="button"
          className={document.heightUnit === 'ftin' ? 'is-active' : ''}
          aria-pressed={document.heightUnit === 'ftin'}
          onClick={() => app.setHeightUnit('ftin')}
        >
          ft + in
        </button>
        <button
          type="button"
          className={document.heightUnit === 'cm' ? 'is-active' : ''}
          aria-pressed={document.heightUnit === 'cm'}
          onClick={() => app.setHeightUnit('cm')}
        >
          cm
        </button>
      </div>
    )
  }

  return (
    <div className="compact-toggle" aria-label="Shoe size system">
      <button
        type="button"
        className={document.shoeSystem === 'US' ? 'is-active' : ''}
        aria-pressed={document.shoeSystem === 'US'}
        onClick={() => app.setShoeSystem('US')}
      >
        US
      </button>
      <button
        type="button"
        className={document.shoeSystem === 'EU' ? 'is-active' : ''}
        aria-pressed={document.shoeSystem === 'EU'}
        onClick={() => app.setShoeSystem('EU')}
      >
        EU
      </button>
    </div>
  )
}
