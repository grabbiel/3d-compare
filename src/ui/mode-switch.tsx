import type { CompareApp } from '../app/compare-app.ts'
import type { CompareDocument, Mode } from '../domain/document.ts'
import { FootIcon, PersonIcon } from './icons.tsx'

const modes: readonly {
  id: Mode
  label: string
  icon: typeof PersonIcon
}[] = [
  { id: 'height', label: 'Height', icon: PersonIcon },
  { id: 'feet', label: 'Feet', icon: FootIcon },
]

export function ModeSwitch({
  app,
  document,
}: {
  app: CompareApp
  document: CompareDocument
}) {
  return (
    <div className="mode-switch" aria-label="Comparison mode">
      <span className={`mode-switch-thumb is-${document.mode}`} aria-hidden="true" />
      {modes.map((mode) => {
        const Icon = mode.icon
        const count =
          mode.id === 'height'
            ? document.height.placements.length
            : document.feet.placements.length
        return (
          <button
            key={mode.id}
            type="button"
            className={document.mode === mode.id ? 'is-active' : ''}
            aria-pressed={document.mode === mode.id}
            onClick={() => app.setMode(mode.id)}
          >
            <Icon />
            <span>{mode.label}</span>
            {count > 0 && <span className="mode-count">{count}</span>}
          </button>
        )
      })}
    </div>
  )
}
