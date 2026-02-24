import React from 'react'
import { render } from '@testing-library/react-native'
import { MetricCard } from './MetricCard'

describe('MetricCard', () => {
  it('renders correctly', () => {
    const { getByText } = render(<MetricCard value="24.5K" label="Total Users" />)
    expect(getByText('24.5K')).toBeTruthy()
    expect(getByText('Total Users')).toBeTruthy()
  })

  it('renders icon when provided', () => {
    const { getByText } = render(<MetricCard value="100" label="Score" icon="📈" />)
    expect(getByText('📈')).toBeTruthy()
  })

  it('renders upward trend', () => {
    const { getByText } = render(
      <MetricCard value="100" label="Sales" trend="up" trendValue="+12.5%" />
    )
    expect(getByText('↑')).toBeTruthy()
    expect(getByText('+12.5%')).toBeTruthy()
  })

  it('renders downward trend', () => {
    const { getByText } = render(
      <MetricCard value="100" label="Sales" trend="down" trendValue="-5.2%" />
    )
    expect(getByText('↓')).toBeTruthy()
    expect(getByText('-5.2%')).toBeTruthy()
  })

  it('renders neutral trend', () => {
    const { getByText } = render(
      <MetricCard value="100" label="Sales" trend="neutral" trendValue="0%" />
    )
    expect(getByText('→')).toBeTruthy()
    expect(getByText('0%')).toBeTruthy()
  })

  it('does not render trend when not provided', () => {
    const { queryByText } = render(<MetricCard value="100" label="Sales" />)
    expect(queryByText('↑')).toBeNull()
    expect(queryByText('↓')).toBeNull()
    expect(queryByText('→')).toBeNull()
  })

  it('does not render trend when trendValue is missing', () => {
    const { queryByText } = render(<MetricCard value="100" label="Sales" trend="up" />)
    expect(queryByText('↑')).toBeNull()
  })

  it('exposes proper accessibility properties', () => {
    const { getByTestId } = render(
      <MetricCard
        value="24.5K"
        label="Total Users"
        trend="up"
        trendValue="+12.5%"
        testID="metric"
      />
    )
    const metric = getByTestId('metric')
    expect(metric.props.accessibilityRole).toBe('summary')
    expect(metric.props.accessibilityLabel).toContain('Total Users: 24.5K')
    expect(metric.props.accessibilityLabel).toContain('trend up, +12.5%')
  })

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: '#f0f0f0' }
    const { getByTestId } = render(
      <MetricCard value="100" label="Sales" testID="metric" style={customStyle} />
    )
    const metric = getByTestId('metric')
    expect(metric.props.style).toContainEqual(expect.objectContaining(customStyle))
  })
})
