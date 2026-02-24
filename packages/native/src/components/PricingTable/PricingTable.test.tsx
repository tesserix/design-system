import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { PricingTable, PricingPlan } from './PricingTable'

describe('PricingTable', () => {
  const mockPlans: PricingPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: 9,
      period: 'month',
      description: 'For individuals',
      features: [
        { name: '10 Projects', included: true },
        { name: 'Basic Support', included: true },
        { name: 'Advanced Analytics', included: false },
      ],
      buttonText: 'Start Free Trial',
      onSelect: jest.fn(),
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 29,
      period: 'month',
      description: 'For teams',
      features: [
        { name: 'Unlimited Projects', included: true },
        { name: 'Priority Support', included: true },
        { name: 'Advanced Analytics', included: true },
      ],
      highlighted: true,
      onSelect: jest.fn(),
    },
  ]

  it('renders correctly', () => {
    const { getByText } = render(<PricingTable plans={mockPlans} />)
    expect(getByText('Basic')).toBeTruthy()
    expect(getByText('Pro')).toBeTruthy()
  })

  it('displays plan prices', () => {
    const { getByText } = render(<PricingTable plans={mockPlans} />)
    expect(getByText('9')).toBeTruthy()
    expect(getByText('29')).toBeTruthy()
  })

  it('displays plan periods', () => {
    const { getAllByText } = render(<PricingTable plans={mockPlans} />)
    expect(getAllByText('/month').length).toBe(2)
  })

  it('displays plan descriptions', () => {
    const { getByText } = render(<PricingTable plans={mockPlans} />)
    expect(getByText('For individuals')).toBeTruthy()
    expect(getByText('For teams')).toBeTruthy()
  })

  it('displays plan features', () => {
    const { getByText } = render(<PricingTable plans={mockPlans} />)
    expect(getByText('10 Projects')).toBeTruthy()
    expect(getByText('Basic Support')).toBeTruthy()
    expect(getByText('Unlimited Projects')).toBeTruthy()
    expect(getByText('Priority Support')).toBeTruthy()
  })

  it('renders included feature checkmarks', () => {
    const { getAllByText } = render(<PricingTable plans={mockPlans} />)
    const checkmarks = getAllByText('✓')
    expect(checkmarks.length).toBeGreaterThan(0)
  })

  it('renders excluded feature crosses', () => {
    const { getAllByText } = render(<PricingTable plans={mockPlans} />)
    const crosses = getAllByText('×')
    expect(crosses.length).toBeGreaterThan(0)
  })

  it('displays custom button text', () => {
    const { getByText } = render(<PricingTable plans={mockPlans} />)
    expect(getByText('Start Free Trial')).toBeTruthy()
  })

  it('displays default button text when not provided', () => {
    const { getAllByText } = render(<PricingTable plans={mockPlans} />)
    expect(getAllByText('Get Started').length).toBeGreaterThan(0)
  })

  it('calls onSelect when button is pressed', () => {
    const { getByText } = render(<PricingTable plans={mockPlans} />)

    fireEvent.press(getByText('Start Free Trial'))
    expect(mockPlans[0].onSelect).toHaveBeenCalled()
  })

  it('uses custom currency symbol', () => {
    const { getAllByText } = render(<PricingTable plans={mockPlans} currency="€" />)
    expect(getAllByText('€').length).toBeGreaterThan(0)
  })

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: '#f0f0f0' }
    const { getByTestId } = render(
      <PricingTable plans={mockPlans} testID="pricing-table" style={customStyle} />
    )
    const table = getByTestId('pricing-table')
    expect(table.props.style).toContainEqual(expect.objectContaining(customStyle))
  })
})
