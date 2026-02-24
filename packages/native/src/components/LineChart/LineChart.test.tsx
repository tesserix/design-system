import React from 'react'
import { render } from '@testing-library/react-native'
import { LineChart } from './LineChart'

const mockData = [
  { label: 'Jan', value: 30 },
  { label: 'Feb', value: 45 },
  { label: 'Mar', value: 35 },
  { label: 'Apr', value: 60 },
]

describe('LineChart', () => {
  it('renders chart with data', () => {
    const { getByLabelText } = render(<LineChart data={mockData} />)
    expect(getByLabelText('Line chart')).toBeTruthy()
  })

  it('renders labels when showLabels is true', () => {
    const { getByText } = render(<LineChart data={mockData} showLabels={true} />)
    expect(getByText('Jan')).toBeTruthy()
    expect(getByText('Feb')).toBeTruthy()
    expect(getByText('Mar')).toBeTruthy()
  })

  it('renders values when showValues is true', () => {
    const { getByText } = render(<LineChart data={mockData} showValues={true} />)
    expect(getByText('30')).toBeTruthy()
    expect(getByText('45')).toBeTruthy()
  })

  it('does not render labels when showLabels is false', () => {
    const { queryByText } = render(
      <LineChart data={mockData} showLabels={false} />
    )
    expect(queryByText('Jan')).toBeNull()
  })

  it('renders data points', () => {
    const { getByLabelText } = render(<LineChart data={mockData} showPoints={true} />)
    expect(getByLabelText('Jan: 30')).toBeTruthy()
    expect(getByLabelText('Feb: 45')).toBeTruthy()
  })

  it('does not render points when showPoints is false', () => {
    const { queryByLabelText } = render(
      <LineChart data={mockData} showPoints={false} />
    )
    expect(queryByLabelText('Jan: 30')).toBeNull()
  })

  it('handles custom colors', () => {
    const { getByLabelText } = render(
      <LineChart
        data={mockData}
        lineColor="#ff0000"
        pointColor="#00ff00"
      />
    )
    expect(getByLabelText('Line chart')).toBeTruthy()
  })

  it('handles empty data', () => {
    const { getByLabelText } = render(<LineChart data={[]} />)
    expect(getByLabelText('Line chart')).toBeTruthy()
  })
})
