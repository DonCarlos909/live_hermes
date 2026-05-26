import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: string | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error: error.message }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen flex items-center justify-center bg-[#0a0a0f] text-[#f0f0ff] p-8">
          <div className="max-w-lg text-center">
            <div className="text-4xl mb-4">⚠</div>
            <h1 className="text-xl font-mono mb-2" style={{ color: '#ff2d55' }}>
              HERMES — RENDER ERROR
            </h1>
            <p className="text-sm font-mono opacity-60 mb-4 break-all">
              {this.state.error}
            </p>
            <p className="text-xs font-mono opacity-40">
              Try updating your GPU drivers or disabling hardware acceleration.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
