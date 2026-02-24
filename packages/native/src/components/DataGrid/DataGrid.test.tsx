import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { DataGrid, DataGridColumn, DataGridRow } from './DataGrid'

describe('DataGrid', () => {
  const mockColumns: DataGridColumn[] = [
    { id: 'name', header: 'Name', accessor: 'name', sortable: true },
    { id: 'email', header: 'Email', accessor: 'email', sortable: true },
    { id: 'role', header: 'Role', accessor: 'role' },
  ]

  const mockData: DataGridRow[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor' },
  ]

  it('renders correctly', () => {
    const { getByText } = render(<DataGrid columns={mockColumns} data={mockData} />)
    expect(getByText('Name')).toBeTruthy()
    expect(getByText('Email')).toBeTruthy()
    expect(getByText('Role')).toBeTruthy()
  })

  it('renders all rows', () => {
    const { getByText } = render(<DataGrid columns={mockColumns} data={mockData} />)
    expect(getByText('John Doe')).toBeTruthy()
    expect(getByText('Jane Smith')).toBeTruthy()
    expect(getByText('Bob Johnson')).toBeTruthy()
  })

  it('renders all cell values', () => {
    const { getByText } = render(<DataGrid columns={mockColumns} data={mockData} />)
    expect(getByText('john@example.com')).toBeTruthy()
    expect(getByText('Admin')).toBeTruthy()
    expect(getByText('User')).toBeTruthy()
  })

  it('sorts data in ascending order when sortable column is clicked', () => {
    const { getByText, getAllByText } = render(<DataGrid columns={mockColumns} data={mockData} />)

    fireEvent.press(getByText('Name'))

    // Check if sort indicator is present
    const sortIndicators = getAllByText('▲')
    expect(sortIndicators.length).toBeGreaterThan(0)
  })

  it('sorts data in descending order when sortable column is clicked twice', () => {
    const { getByText, getAllByText } = render(<DataGrid columns={mockColumns} data={mockData} />)

    fireEvent.press(getByText('Name'))
    fireEvent.press(getByText('Name'))

    // Check if sort indicator is present
    const sortIndicators = getAllByText('▼')
    expect(sortIndicators.length).toBeGreaterThan(0)
  })

  it('removes sort when sortable column is clicked three times', () => {
    const { getByText, queryByText } = render(<DataGrid columns={mockColumns} data={mockData} />)

    fireEvent.press(getByText('Name'))
    fireEvent.press(getByText('Name'))
    fireEvent.press(getByText('Name'))

    // Sort indicators should be gone
    expect(queryByText('▲')).toBeNull()
    expect(queryByText('▼')).toBeNull()
  })

  it('does not sort when non-sortable column is clicked', () => {
    const { getByText, queryByText } = render(<DataGrid columns={mockColumns} data={mockData} />)

    fireEvent.press(getByText('Role'))

    // No sort indicators should appear
    expect(queryByText('▲')).toBeNull()
    expect(queryByText('▼')).toBeNull()
  })

  it('calls onRowPress when row is pressed', () => {
    const onRowPress = jest.fn()
    const { getByText } = render(
      <DataGrid columns={mockColumns} data={mockData} onRowPress={onRowPress} />
    )

    fireEvent.press(getByText('John Doe'))
    expect(onRowPress).toHaveBeenCalledWith(expect.objectContaining({ id: '1', name: 'John Doe' }))
  })

  it('renders with testID', () => {
    const { getByTestId } = render(
      <DataGrid columns={mockColumns} data={mockData} testID="data-grid" />
    )
    expect(getByTestId('data-grid')).toBeTruthy()
  })

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: '#f0f0f0' }
    const { getByTestId } = render(
      <DataGrid columns={mockColumns} data={mockData} testID="data-grid" style={customStyle} />
    )
    const grid = getByTestId('data-grid')
    expect(grid.props.style).toContainEqual(expect.objectContaining(customStyle))
  })
})
