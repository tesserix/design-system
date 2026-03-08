import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ComponentErrorBoundary, WidgetErrorBoundary, ChartErrorBoundary } from './error-boundary'

// Suppress console.error in tests
const originalError = console.error
beforeEach(() => {
  console.error = vi.fn()
})
afterEach(() => {
  console.error = originalError
})

function BrokenComponent(): React.JSX.Element {
  throw new Error('Test error')
}

function WorkingComponent() {
  return <div>Working</div>
}

describe('ComponentErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ComponentErrorBoundary>
        <WorkingComponent />
      </ComponentErrorBoundary>
    )
    expect(screen.getByText('Working')).toBeInTheDocument()
  })

  it('renders fallback on error', () => {
    render(
      <ComponentErrorBoundary>
        <BrokenComponent />
      </ComponentErrorBoundary>
    )
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('renders custom fallback on error', () => {
    render(
      <ComponentErrorBoundary fallback={<div>Custom Error</div>}>
        <BrokenComponent />
      </ComponentErrorBoundary>
    )
    expect(screen.getByText('Custom Error')).toBeInTheDocument()
  })

  it('calls onError callback', () => {
    const onError = vi.fn()
    render(
      <ComponentErrorBoundary onError={onError}>
        <BrokenComponent />
      </ComponentErrorBoundary>
    )
    expect(onError).toHaveBeenCalled()
  })

  it('shows retry button', () => {
    render(
      <ComponentErrorBoundary>
        <BrokenComponent />
      </ComponentErrorBoundary>
    )
    expect(screen.getByText('Try Again')).toBeInTheDocument()
  })
})

describe('WidgetErrorBoundary', () => {
  it('shows custom title on error', () => {
    render(
      <WidgetErrorBoundary title="Sales Widget">
        <BrokenComponent />
      </WidgetErrorBoundary>
    )
    expect(screen.getByText('Sales Widget')).toBeInTheDocument()
  })
})

describe('ChartErrorBoundary', () => {
  it('shows chart error on error', () => {
    render(
      <ChartErrorBoundary>
        <BrokenComponent />
      </ChartErrorBoundary>
    )
    expect(screen.getByText('Chart Error')).toBeInTheDocument()
  })
})
