import React from 'react'
import { render } from '@testing-library/react-native'
import { BarChart } from './BarChart'

const mockData = [
  { label: 'Jan', value: 30 },
  { label: 'Feb', value: 45 },
  { label: 'Mar', value: 60 },
  { label: 'Apr', value: 40 },
]

describe('BarChart', () => {
  it('renders chart with data', () => {
    const { getByLabelText } = render(<BarChart data={mockData} />)
    expect(getByLabelText('Bar chart')).toBeTruthy()
  })

  it('renders labels when showLabels is true', () => {
    const { getByText } = render(<BarChart data={mockData} showLabels={true} />)
    expect(getByText('Jan')).toBeTruthy()
    expect(getByText('Feb')).toBeTruthy()
    expect(getByText('Mar')).toBeTruthy()
  })

  it('renders values when showValues is true', () => {
    const { getByText } = render(<BarChart data={mockData} showValues={true} />)
    expect(getByText('30')).toBeTruthy()
    expect(getByText('45')).toBeTruthy()
    expect(getByText('60')).toBeTruthy()
  })

  it('does not render labels when showLabels is false', () => {
    const { queryByText } = render(
      <BarChart data={mockData} showLabels={false} />
    )
    expect(queryByText('Jan')).toBeNull()
  })

  it('does not render values when showValues is false', () => {
    const { queryByText } = render(
      <BarChart data={mockData} showValues={false} />
    )
    expect(queryByText('30')).toBeNull()
  })

  it('renders with custom colors', () => {
    const dataWithColors = [
      { label: 'A', value: 10, color: '#ff0000' },
      { label: 'B', value: 20, color: '#00ff00' },
    ]
    const { getByLabelText } = render(<BarChart data={dataWithColors} />)
    expect(getByLabelText('Bar chart')).toBeTruthy()
  })

  it('handles empty data', () => {
    const { getByLabelText } = render(<BarChart data={[]} />)
    expect(getByLabelText('Bar chart')).toBeTruthy()
  })
})
