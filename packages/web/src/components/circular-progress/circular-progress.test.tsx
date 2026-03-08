import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CircularProgress } from './circular-progress'

describe('CircularProgress', () => {
  it('renders with default props', () => {
    render(<CircularProgress value={50} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('displays correct percentage', () => {
    render(<CircularProgress value={75} />)
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('respects max prop', () => {
    render(<CircularProgress value={50} max={200} />)
    expect(screen.getByText('25%')).toBeInTheDocument()
  })

  it('clamps value to 0-100%', () => {
    render(<CircularProgress value={150} />)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('hides label when showLabel is false', () => {
    render(<CircularProgress value={50} showLabel={false} />)
    expect(screen.queryByText('50%')).not.toBeInTheDocument()
  })

  it('shows custom label', () => {
    render(<CircularProgress value={50} label="Done" />)
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('sets correct aria attributes', () => {
    render(<CircularProgress value={30} max={50} />)
    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveAttribute('aria-valuemin', '0')
    expect(progressbar).toHaveAttribute('aria-valuemax', '50')
    expect(progressbar).toHaveAttribute('aria-valuenow', '30')
  })
})
