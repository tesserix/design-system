import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorState, detectErrorType } from './error-state'

describe('ErrorState', () => {
  it('renders with default props', () => {
    render(<ErrorState />)
    expect(screen.getByText('Something Went Wrong')).toBeInTheDocument()
  })

  it('renders not_found type', () => {
    render(<ErrorState type="not_found" />)
    expect(screen.getByText('Not Found')).toBeInTheDocument()
  })

  it('renders access_denied type', () => {
    render(<ErrorState type="access_denied" />)
    expect(screen.getByText('Access Denied')).toBeInTheDocument()
  })

  it('shows custom title and description', () => {
    render(<ErrorState title="Custom Error" description="Custom message" />)
    expect(screen.getByText('Custom Error')).toBeInTheDocument()
    expect(screen.getByText('Custom message')).toBeInTheDocument()
  })

  it('shows retry button when showRetryButton is true', () => {
    render(<ErrorState showRetryButton />)
    expect(screen.getByText('Try Again')).toBeInTheDocument()
  })

  it('shows home button when showHomeButton is true', () => {
    render(<ErrorState showHomeButton />)
    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument()
  })

  it('renders compact mode', () => {
    const { container } = render(<ErrorState compact />)
    expect(container.querySelector('.py-12')).toBeInTheDocument()
  })

  it('shows error code', () => {
    render(<ErrorState code="ERR_500" />)
    expect(screen.getByText(/ERR_500/)).toBeInTheDocument()
  })

  it('shows suggestions by default', () => {
    render(<ErrorState type="server_error" />)
    expect(screen.getByText('What you can try')).toBeInTheDocument()
  })

  it('hides suggestions when showSuggestions is false', () => {
    render(<ErrorState type="server_error" showSuggestions={false} />)
    expect(screen.queryByText('What you can try')).not.toBeInTheDocument()
  })

  it('renders custom actions', () => {
    const handleClick = vi.fn()
    render(
      <ErrorState
        actions={[{ label: 'Custom Action', onClick: handleClick }]}
      />
    )
    expect(screen.getByText('Custom Action')).toBeInTheDocument()
  })

  it('supports message prop as alias for description', () => {
    render(<ErrorState message="Error message here" />)
    expect(screen.getByText('Error message here')).toBeInTheDocument()
  })
})

describe('detectErrorType', () => {
  it('detects network errors', () => {
    expect(detectErrorType('Failed to fetch')).toBe('network_error')
    expect(detectErrorType(new Error('Network error'))).toBe('network_error')
  })

  it('detects timeout errors', () => {
    expect(detectErrorType('Request timed out')).toBe('timeout')
  })

  it('detects auth errors', () => {
    expect(detectErrorType('401 Unauthorized')).toBe('requires_auth')
  })

  it('detects forbidden errors', () => {
    expect(detectErrorType('403 Forbidden')).toBe('access_denied')
  })

  it('detects not found errors', () => {
    expect(detectErrorType('404 Not Found')).toBe('not_found')
  })

  it('defaults to server_error', () => {
    expect(detectErrorType('Something broke')).toBe('server_error')
  })
})
