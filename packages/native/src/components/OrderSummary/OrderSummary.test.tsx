import React from 'react'
import { render } from '@testing-library/react-native'
import { OrderSummary, OrderItem } from './OrderSummary'

describe('OrderSummary', () => {
  const mockItems: OrderItem[] = [
    { id: '1', name: 'Product A', quantity: 2, price: 29.99 },
    { id: '2', name: 'Product B', quantity: 1, price: 49.99 },
  ]

  it('renders correctly', () => {
    const { getByText } = render(<OrderSummary items={mockItems} />)
    expect(getByText('Order Summary')).toBeTruthy()
    expect(getByText('Product A')).toBeTruthy()
    expect(getByText('Product B')).toBeTruthy()
  })

  it('calculates subtotal automatically', () => {
    const { getAllByText } = render(<OrderSummary items={mockItems} />)
    expect(getAllByText('$109.97').length).toBeGreaterThan(0) // 2*29.99 + 1*49.99
  })

  it('displays provided subtotal, tax, and shipping', () => {
    const { getByText } = render(
      <OrderSummary items={mockItems} subtotal={109.97} tax={10.99} shipping={5.99} />
    )
    expect(getByText('$109.97')).toBeTruthy()
    expect(getByText('$10.99')).toBeTruthy()
    expect(getByText('$5.99')).toBeTruthy()
  })

  it('calculates total correctly', () => {
    const { getByText } = render(
      <OrderSummary items={mockItems} subtotal={109.97} tax={10.99} shipping={5.99} />
    )
    expect(getByText('$126.95')).toBeTruthy() // 109.97 + 10.99 + 5.99
  })

  it('uses provided total when available', () => {
    const { getByText } = render(
      <OrderSummary
        items={mockItems}
        subtotal={109.97}
        tax={10.99}
        shipping={5.99}
        total={150.0}
      />
    )
    expect(getByText('$150.00')).toBeTruthy()
  })

  it('uses custom currency symbol', () => {
    const { getAllByText } = render(<OrderSummary items={mockItems} currency="€" />)
    expect(getAllByText('€109.97').length).toBeGreaterThan(0)
  })

  it('displays item quantities and prices correctly', () => {
    const { getByText } = render(<OrderSummary items={mockItems} />)
    expect(getByText('Qty: 2 × $29.99')).toBeTruthy()
    expect(getByText('Qty: 1 × $49.99')).toBeTruthy()
  })

  it('displays item total prices correctly', () => {
    const { getByText } = render(<OrderSummary items={mockItems} />)
    expect(getByText('$59.98')).toBeTruthy() // 2 * 29.99
    expect(getByText('$49.99')).toBeTruthy() // 1 * 49.99
  })

  it('does not display tax row when tax is zero', () => {
    const { queryByText } = render(<OrderSummary items={mockItems} tax={0} />)
    expect(queryByText('Tax')).toBeNull()
  })

  it('does not display shipping row when shipping is zero', () => {
    const { queryByText } = render(<OrderSummary items={mockItems} shipping={0} />)
    expect(queryByText('Shipping')).toBeNull()
  })

  it('exposes proper accessibility properties', () => {
    const { getByTestId } = render(<OrderSummary items={mockItems} testID="order-summary" />)
    const summary = getByTestId('order-summary')
    expect(summary.props.accessibilityRole).toBe('summary')
  })

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: '#f0f0f0' }
    const { getByTestId } = render(
      <OrderSummary items={mockItems} testID="order-summary" style={customStyle} />
    )
    const summary = getByTestId('order-summary')
    expect(summary.props.style).toContainEqual(expect.objectContaining(customStyle))
  })
})
