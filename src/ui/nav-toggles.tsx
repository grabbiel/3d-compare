import type { CompareApp } from '../app/compare-app.ts'
import type { CompareDocument } from '../domain/document.ts'
import {
  FrameIcon,
  InspectIcon,
  OrbitIcon,
  ResetIcon,
  WalkIcon,
} from './icons.tsx'

export function NavToggles({
  app,
  document,
}: {
  app: CompareApp
  document: CompareDocument
}) {
  if (document.mode === 'height') {
    return (
      <div className="compact-toggle nav-toggle" aria-label="Height navigation">
        <button
          type="button"
          className={document.height.navMode === 'orbit' ? 'is-active' : ''}
          aria-pressed={document.height.navMode === 'orbit'}
          onClick={() => app.setHeightNavMode('orbit')}
        >
          <OrbitIcon />
          Orbit
        </button>
        <button
          type="button"
          className={document.height.navMode === 'walk' ? 'is-active' : ''}
          aria-pressed={document.height.navMode === 'walk'}
          onClick={() => app.setHeightNavMode('walk')}
        >
          <WalkIcon />
          Walk
        </button>
      </div>
    )
  }

  return (
    <div className="compact-toggle nav-toggle" aria-label="Feet navigation">
      <button
        type="button"
        className={document.feet.navMode === 'orbit' ? 'is-active' : ''}
        aria-pressed={document.feet.navMode === 'orbit'}
        onClick={() => app.setFeetNavMode('orbit')}
      >
        <OrbitIcon />
        Orbit
      </button>
      <button
        type="button"
        className={document.feet.navMode === 'inspect' ? 'is-active' : ''}
        aria-pressed={document.feet.navMode === 'inspect'}
        onClick={() => app.setFeetNavMode('inspect')}
      >
        <InspectIcon />
        Inspect
      </button>
    </div>
  )
}

export function ViewActions({ app }: { app: CompareApp }) {
  return (
    <div className="view-actions">
      <button type="button" onClick={() => app.frameSelection()} title="Frame selection">
        <FrameIcon />
        <span>Frame</span>
      </button>
      <button type="button" onClick={() => app.resetView()} title="Reset view">
        <ResetIcon />
        <span>Reset</span>
      </button>
    </div>
  )
}
