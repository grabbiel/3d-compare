import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = {
  children: ReactNode
}

type State = {
  error: Error | null
}

export class SceneErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('3D scene failed to render.', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="scene-state scene-error" role="alert">
          <span className="scene-state-mark">!</span>
          <strong>The 3D stage could not start.</strong>
          <p>Check WebGL support, then reload the app.</p>
          <button type="button" onClick={() => window.location.reload()}>
            Reload stage
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
