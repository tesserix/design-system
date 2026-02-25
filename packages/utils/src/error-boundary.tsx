import * as React from "react"

export interface ErrorBoundaryProps {
  /**
   * The children to render
   */
  children: React.ReactNode
  /**
   * Fallback UI to render when an error occurs
   */
  fallback?: React.ReactNode | ((error: Error, resetError: () => void) => React.ReactNode)
  /**
   * Callback when an error is caught
   */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  /**
   * Custom reset keys that trigger a reset when changed
   */
  resetKeys?: unknown[]
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Component that catches JavaScript errors in child component tree
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys } = this.props
    const { hasError } = this.state

    if (
      hasError &&
      resetKeys &&
      prevProps.resetKeys &&
      !areKeysEqual(prevProps.resetKeys, resetKeys)
    ) {
      this.reset()
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    const { hasError, error } = this.state
    const { children, fallback } = this.props

    if (hasError && error) {
      if (typeof fallback === "function") {
        return fallback(error, this.reset)
      }

      if (fallback) {
        return fallback
      }

      return (
        <div role="alert" className="p-4 bg-destructive/10 border border-destructive rounded-lg">
          <h2 className="text-lg font-semibold text-destructive mb-2">Something went wrong</h2>
          <details className="text-sm text-destructive/80">
            <summary className="cursor-pointer">Error details</summary>
            <pre className="mt-2 p-2 bg-background rounded text-xs overflow-auto">
              {error.message}
            </pre>
          </details>
          <button
            onClick={this.reset}
            className="mt-4 px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
          >
            Try again
          </button>
        </div>
      )
    }

    return children
  }
}

function areKeysEqual(prevKeys: unknown[], nextKeys: unknown[]): boolean {
  if (prevKeys.length !== nextKeys.length) return false
  return prevKeys.every((key, index) => Object.is(key, nextKeys[index]))
}
