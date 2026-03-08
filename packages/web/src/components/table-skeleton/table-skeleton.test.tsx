import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TableSkeleton, CardGridSkeleton, ListSkeleton, DashboardSkeleton, FormSkeleton } from './table-skeleton'

describe('TableSkeleton', () => {
  it('renders with loading status', () => {
    render(<TableSkeleton />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders correct number of rows', () => {
    const { container } = render(<TableSkeleton rows={3} columns={2} />)
    const rows = container.querySelectorAll('.divide-y > div')
    expect(rows.length).toBe(3)
  })

  it('has sr-only loading text', () => {
    render(<TableSkeleton />)
    expect(screen.getByText('Loading table data, please wait...')).toBeInTheDocument()
  })
})

describe('CardGridSkeleton', () => {
  it('renders with loading status', () => {
    render(<CardGridSkeleton />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders correct number of cards', () => {
    const { container } = render(<CardGridSkeleton count={4} />)
    const cards = container.querySelectorAll('.bg-card')
    expect(cards.length).toBe(4)
  })
})

describe('ListSkeleton', () => {
  it('renders with loading status', () => {
    render(<ListSkeleton />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})

describe('DashboardSkeleton', () => {
  it('renders with loading status', () => {
    render(<DashboardSkeleton />)
    expect(screen.getAllByRole('status').length).toBeGreaterThan(0)
  })
})

describe('FormSkeleton', () => {
  it('renders with loading status', () => {
    render(<FormSkeleton />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
