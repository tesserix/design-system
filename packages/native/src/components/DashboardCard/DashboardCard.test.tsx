import React from 'react'
import { render } from '@testing-library/react-native'
import { DashboardCard } from './DashboardCard'

describe('DashboardCard', () => {
  it('renders correctly', () => {
    const { getByText } = render(<DashboardCard title="Total Revenue" value="$45,231" />)
    expect(getByText('Total Revenue')).toBeTruthy()
    expect(getByText('$45,231')).toBeTruthy()
  })

  it('displays positive change indicator', () => {
    const { getByText } = render(
      <DashboardCard
        title="Sales"
        value="1,234"
        change={{ value: 12.5, label: 'vs last month' }}
      />
    )
    expect(getByText('↑ 12.5%')).toBeTruthy()
    expect(getByText('vs last month')).toBeTruthy()
  })

  it('displays negative change indicator', () => {
    const { getByText } = render(
      <DashboardCard title="Sales" value="1,234" change={{ value: -8.3, label: 'vs last month' }} />
    )
    expect(getByText('↓ 8.3%')).toBeTruthy()
  })

  it('displays zero change as positive', () => {
    const { getByText } = render(
      <DashboardCard title="Sales" value="1,234" change={{ value: 0 }} />
    )
    expect(getByText('↑ 0%')).toBeTruthy()
  })

  it('displays change without label', () => {
    const { getByText, queryByText } = render(
      <DashboardCard title="Sales" value="1,234" change={{ value: 5.5 }} />
    )
    expect(getByText('↑ 5.5%')).toBeTruthy()
    expect(queryByText('vs last month')).toBeNull()
  })

  it('renders icon when provided', () => {
    const { getByText } = render(<DashboardCard title="Revenue" value="$100" icon="💰" />)
    expect(getByText('💰')).toBeTruthy()
  })

  it('does not render change when not provided', () => {
    const { queryByText } = render(<DashboardCard title="Revenue" value="$100" />)
    expect(queryByText(/↑|↓/)).toBeNull()
  })

  it('applies custom color', () => {
    const { getByTestId } = render(
      <DashboardCard title="Revenue" value="$100" color="#ef4444" testID="card" />
    )
    const card = getByTestId('card')
    expect(card.props.style).toContainEqual(
      expect.objectContaining({ borderLeftColor: '#ef4444' })
    )
  })

  it('exposes proper accessibility properties', () => {
    const { getByTestId } = render(
      <DashboardCard
        title="Total Revenue"
        value="$45,231"
        change={{ value: 12.5 }}
        testID="card"
      />
    )
    const card = getByTestId('card')
    expect(card.props.accessibilityRole).toBe('summary')
    expect(card.props.accessibilityLabel).toContain('Total Revenue: $45,231')
    expect(card.props.accessibilityLabel).toContain('up 12.5%')
  })

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: '#f0f0f0' }
    const { getByTestId } = render(
      <DashboardCard title="Revenue" value="$100" testID="card" style={customStyle} />
    )
    const card = getByTestId('card')
    expect(card.props.style).toContainEqual(expect.objectContaining(customStyle))
  })
})
