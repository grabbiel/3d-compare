import { useEffect, useState } from 'react'
import type { CompareApp } from '../app/compare-app.ts'
import { useCompare } from '../app/use-compare.ts'
import { FEET_CATALOG } from '../catalog/feet.ts'
import { HUMAN_CATALOG } from '../catalog/humans.ts'
import { CompareCanvas } from '../scene/canvas.tsx'
import { CatalogDrawer } from './catalog-drawer.tsx'
import { FootIcon, PersonIcon, PlusIcon } from './icons.tsx'
import { Inspector } from './inspector.tsx'
import { ModeSwitch } from './mode-switch.tsx'
import { NavToggles, ViewActions } from './nav-toggles.tsx'
import { PlacementList } from './placement-list.tsx'
import { SceneErrorBoundary } from './scene-error-boundary.tsx'
import { UnitToggles } from './unit-toggles.tsx'
import './app.css'

export function App({ app }: { app: CompareApp }) {
  const document = useCompare(app)
  const [notice, setNotice] = useState('')
  const [sceneReady, setSceneReady] = useState(false)
  const activeCount =
    document.mode === 'height'
      ? document.height.placements.length
      : document.feet.placements.length

  useEffect(() => {
    if (!notice) {
      return
    }

    const timeout = window.setTimeout(() => setNotice(''), 3200)
    return () => window.clearTimeout(timeout)
  }, [notice])

  const sceneName = document.mode === 'height' ? 'Concrete studio' : 'Oak measure table'
  const sceneCode = document.mode === 'height' ? 'ROOM 01' : 'TABLE 02'

  return (
    <div className={`compare-app mode-${document.mode}`}>
      <header className="app-header">
        <div className="brand-block">
          <span className="brand-mark" aria-hidden="true">
            <span>3D</span>
          </span>
          <div>
            <h1>3D Compare</h1>
            <p>Scale, place, and see the difference.</p>
          </div>
        </div>
        <ModeSwitch app={app} document={document} />
        <div className="header-meta">
          <span className="status-dot" />
          <span>Local workspace</span>
          <small>No account needed</small>
        </div>
      </header>

      <main className="workspace">
        <CatalogDrawer app={app} document={document} announce={setNotice} />

        <section className="stage-panel" aria-label={`${sceneName} 3D stage`}>
          <div className="stage-toolbar">
            <div className="stage-title">
              <span>{sceneCode}</span>
              <strong>{sceneName}</strong>
            </div>
            <div className="stage-controls">
              <NavToggles app={app} document={document} />
              <span className="toolbar-divider" />
              <UnitToggles app={app} document={document} />
              <span className="toolbar-divider" />
              <ViewActions app={app} />
            </div>
          </div>

          <div className="canvas-shell">
            <SceneErrorBoundary>
              <CompareCanvas app={app} document={document} onReady={() => setSceneReady(true)} />
            </SceneErrorBoundary>

            {!sceneReady && (
              <div className="scene-state scene-loading" role="status">
                <span className="loading-cube" aria-hidden="true" />
                <strong>Preparing the 3D stage</strong>
                <p>Building procedural models in your browser.</p>
              </div>
            )}

            {sceneReady && activeCount === 0 && (
              <div className="scene-empty">
                <span className="empty-icon">
                  {document.mode === 'height' ? <PersonIcon /> : <FootIcon />}
                </span>
                <span className="eyebrow">
                  {document.mode === 'height' ? 'Studio ready' : 'Table ready'}
                </span>
                <h2>
                  {document.mode === 'height'
                    ? 'Build your first lineup'
                    : 'Set down a pair of feet'}
                </h2>
                <p>
                  {document.mode === 'height'
                    ? 'Add up to 10 people, then tune every height.'
                    : 'Compare shoe sizes against a centimeter grid.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (document.mode === 'height') {
                      app.placeHuman(HUMAN_CATALOG[0].id)
                    } else {
                      app.placeFoot(FEET_CATALOG[0].id)
                    }
                  }}
                >
                  <PlusIcon />
                  {document.mode === 'height'
                    ? `Add ${HUMAN_CATALOG[0].label}`
                    : `Add ${FEET_CATALOG[0].label.toLowerCase()}`}
                </button>
              </div>
            )}

            <div className="scene-badge">
              <span className="status-dot" />
              Live scale
            </div>
            <div className="navigation-hint">
              {document.mode === 'height' && document.height.navMode === 'walk'
                ? 'Click the stage to look · W A S D to move · Esc to release'
                : document.mode === 'feet' && document.feet.navMode === 'inspect'
                  ? 'Drag to pan · Scroll to inspect scale'
                  : 'Drag to orbit · Scroll to zoom · Right-drag to pan'}
            </div>
            <div className="scale-key">
              <span />
              {document.mode === 'height' ? '1 m floor grid' : '1 cm surface grid'}
            </div>
          </div>
        </section>

        <aside className="detail-column">
          <Inspector app={app} document={document} />
          <PlacementList app={app} document={document} />
        </aside>
      </main>

      <div className={notice ? 'notice-toast is-visible' : 'notice-toast'} role="status">
        {notice}
      </div>
      <div className="sr-only" aria-live="polite">
        {notice}
      </div>
    </div>
  )
}
