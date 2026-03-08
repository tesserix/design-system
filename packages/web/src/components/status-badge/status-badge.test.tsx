import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusBadge, getStatusFromMapping } from './status-badge'

describe('StatusBadge', () => {
  it('renders children text', () => {
    render(<StatusBadge>Active</StatusBadge>)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('applies status data attribute', () => {
    render(<StatusBadge status="success">Active</StatusBadge>)
    const badge = screen.getByText('Active').closest('[data-slot="status-badge"]')
    expect(badge).toHaveAttribute('data-status', 'success')
  })

  it('defaults to neutral status', () => {
    render(<StatusBadge>Default</StatusBadge>)
    const badge = screen.getByText('Default').closest('[data-slot="status-badge"]')
    expect(badge).toHaveAttribute('data-status', 'neutral')
  })

  it('applies custom className', () => {
    render(<StatusBadge className="test-class">Test</StatusBadge>)
    const badge = screen.getByText('Test').closest('[data-slot="status-badge"]')
    expect(badge).toHaveClass('test-class')
  })
})

describe('getStatusFromMapping', () => {
  it('maps order statuses correctly', () => {
    expect(getStatusFromMapping('order', 'DELIVERED')).toBe('success')
    expect(getStatusFromMapping('order', 'PENDING')).toBe('warning')
    expect(getStatusFromMapping('order', 'CANCELLED')).toBe('error')
  })

  it('maps payment statuses correctly', () => {
    expect(getStatusFromMapping('payment', 'PAID')).toBe('success')
    expect(getStatusFromMapping('payment', 'FAILED')).toBe('error')
  })

  it('handles boolean mappings', () => {
    expect(getStatusFromMapping('boolean', true)).toBe('success')
    expect(getStatusFromMapping('boolean', false)).toBe('neutral')
  })

  it('returns neutral for unknown values', () => {
    expect(getStatusFromMapping('order', 'UNKNOWN')).toBe('neutral')
  })

  it('is case insensitive', () => {
    expect(getStatusFromMapping('order', 'delivered')).toBe('success')
    expect(getStatusFromMapping('order', 'Pending')).toBe('warning')
  })
})
