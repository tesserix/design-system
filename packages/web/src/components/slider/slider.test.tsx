import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Slider } from './slider'

describe('Slider', () => {
  it('renders with single value', () => {
    render(<Slider defaultValue={[50]} />)
    expect(screen.getByRole('slider')).toBeInTheDocument()
  })

  it('renders multiple thumbs for range', () => {
    render(<Slider defaultValue={[25, 75]} />)
    expect(screen.getAllByRole('slider')).toHaveLength(2)
  })

  it('sets correct aria attributes', () => {
    render(<Slider defaultValue={[50]} min={0} max={100} />)
    const slider = screen.getByRole('slider')
    expect(slider).toHaveAttribute('aria-valuemin', '0')
    expect(slider).toHaveAttribute('aria-valuemax', '100')
    expect(slider).toHaveAttribute('aria-valuenow', '50')
  })

  it('applies disabled state', () => {
    render(<Slider defaultValue={[50]} disabled />)
    const slider = screen.getByRole('slider')
    expect(slider).toHaveAttribute('data-disabled', '')
  })

  it('applies custom className', () => {
    const { container } = render(<Slider defaultValue={[50]} className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
