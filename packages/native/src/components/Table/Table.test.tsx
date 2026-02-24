import React from 'react'
import { render } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Table } from './Table'

const mockColumns = [
  { key: 'name', label: 'Name', width: 120 },
  { key: 'age', label: 'Age', width: 80 },
  { key: 'email', label: 'Email', width: 200 },
]

const mockData = [
  { name: 'John Doe', age: 30, email: 'john@example.com' },
  { name: 'Jane Smith', age: 25, email: 'jane@example.com' },
]

describe('Table', () => {
  it('renders headers', () => {
    const { getByText } = render(
      <Table columns={mockColumns} data={mockData} />
    )
    expect(getByText('Name')).toBeTruthy()
    expect(getByText('Age')).toBeTruthy()
    expect(getByText('Email')).toBeTruthy()
  })

  it('renders data rows', () => {
    const { getByText } = render(
      <Table columns={mockColumns} data={mockData} />
    )
    expect(getByText('John Doe')).toBeTruthy()
    expect(getByText('30')).toBeTruthy()
    expect(getByText('john@example.com')).toBeTruthy()
  })

  it('hides header when showHeader is false', () => {
    const { queryByText } = render(
      <Table columns={mockColumns} data={mockData} showHeader={false} />
    )
    expect(queryByText('Name')).toBeNull()
  })

  it('renders custom cell content', () => {
    const customColumns = [
      {
        key: 'name',
        label: 'Name',
        render: (item: any) => <Text>Custom: {item.name}</Text>,
      },
    ]
    const { getByText } = render(
      <Table columns={customColumns} data={mockData} />
    )
    expect(getByText('Custom: John Doe')).toBeTruthy()
  })
})
