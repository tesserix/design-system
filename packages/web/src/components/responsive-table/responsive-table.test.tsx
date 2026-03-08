import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ResponsiveTable } from './responsive-table'

type TestItem = { id: string; name: string; email: string }

const testData: TestItem[] = [
  { id: '1', name: 'John', email: 'john@test.com' },
  { id: '2', name: 'Jane', email: 'jane@test.com' },
]

const testColumns = [
  { key: 'name' as const, header: 'Name', isPrimary: true },
  { key: 'email' as const, header: 'Email' },
]

describe('ResponsiveTable', () => {
  it('renders table with data', () => {
    render(
      <ResponsiveTable
        data={testData}
        columns={testColumns}
        keyExtractor={(item) => item.id}
      />
    )
    expect(screen.getAllByText('John').length).toBeGreaterThan(0)
    expect(screen.getAllByText('jane@test.com').length).toBeGreaterThan(0)
  })

  it('shows empty message when no data', () => {
    render(
      <ResponsiveTable
        data={[]}
        columns={testColumns}
        keyExtractor={(item: TestItem) => item.id}
        emptyMessage="No results"
      />
    )
    expect(screen.getByText('No results')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    const { container } = render(
      <ResponsiveTable
        data={[]}
        columns={testColumns}
        keyExtractor={(item: TestItem) => item.id}
        isLoading
      />
    )
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0)
  })

  it('handles row click', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(
      <ResponsiveTable
        data={testData}
        columns={testColumns}
        keyExtractor={(item) => item.id}
        onRowClick={handleClick}
      />
    )

    await user.click(screen.getAllByText('John')[0])
    expect(handleClick).toHaveBeenCalledWith(testData[0], 0)
  })

  it('renders column headers', () => {
    render(
      <ResponsiveTable
        data={testData}
        columns={testColumns}
        keyExtractor={(item) => item.id}
      />
    )
    expect(screen.getAllByText('Name').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Email').length).toBeGreaterThan(0)
  })
})
