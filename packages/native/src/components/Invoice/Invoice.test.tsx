import React from 'react'
import { render } from '@testing-library/react-native'
import { Invoice, InvoiceItem } from './Invoice'

describe('Invoice', () => {
  const mockItems: InvoiceItem[] = [
    { id: '1', description: 'Web Development', quantity: 40, unitPrice: 100, total: 4000 },
    { id: '2', description: 'UI Design', quantity: 20, unitPrice: 80, total: 1600 },
  ]

  const defaultProps = {
    invoiceNumber: 'INV-001',
    date: '2024-01-15',
    dueDate: '2024-02-15',
    from: {
      name: 'Company Inc',
      address: '123 Main Street, City, ST 12345',
      email: 'billing@company.com',
      phone: '555-1234',
    },
    to: {
      name: 'Client Co',
      address: '456 Client Ave, Town, ST 67890',
      email: 'accounts@client.com',
      phone: '555-5678',
    },
    items: mockItems,
    subtotal: 5600,
    total: 5600,
  }

  it('renders correctly', () => {
    const { getByText } = render(<Invoice {...defaultProps} />)
    expect(getByText('INVOICE')).toBeTruthy()
    expect(getByText('Invoice #: INV-001')).toBeTruthy()
  })

  it('displays invoice dates', () => {
    const { getByText } = render(<Invoice {...defaultProps} />)
    expect(getByText('Date: 2024-01-15')).toBeTruthy()
    expect(getByText('Due Date: 2024-02-15')).toBeTruthy()
  })

  it('displays from billing info', () => {
    const { getByText } = render(<Invoice {...defaultProps} />)
    expect(getByText('Company Inc')).toBeTruthy()
    expect(getByText('123 Main Street, City, ST 12345')).toBeTruthy()
    expect(getByText('billing@company.com')).toBeTruthy()
    expect(getByText('555-1234')).toBeTruthy()
  })

  it('displays to billing info', () => {
    const { getByText } = render(<Invoice {...defaultProps} />)
    expect(getByText('Client Co')).toBeTruthy()
    expect(getByText('456 Client Ave, Town, ST 67890')).toBeTruthy()
    expect(getByText('accounts@client.com')).toBeTruthy()
    expect(getByText('555-5678')).toBeTruthy()
  })

  it('displays line items', () => {
    const { getByText } = render(<Invoice {...defaultProps} />)
    expect(getByText('Web Development')).toBeTruthy()
    expect(getByText('UI Design')).toBeTruthy()
    expect(getByText('40')).toBeTruthy()
    expect(getByText('20')).toBeTruthy()
  })

  it('displays item prices', () => {
    const { getByText } = render(<Invoice {...defaultProps} />)
    expect(getByText('$100.00')).toBeTruthy()
    expect(getByText('$80.00')).toBeTruthy()
    expect(getByText('$4000.00')).toBeTruthy()
    expect(getByText('$1600.00')).toBeTruthy()
  })

  it('displays totals', () => {
    const { getAllByText } = render(<Invoice {...defaultProps} />)
    expect(getAllByText('$5600.00').length).toBeGreaterThan(0)
  })

  it('displays tax when provided', () => {
    const { getByText } = render(<Invoice {...defaultProps} tax={560} total={6160} />)
    expect(getByText('$560.00')).toBeTruthy()
    expect(getByText('$6160.00')).toBeTruthy()
  })

  it('uses custom currency symbol', () => {
    const { getAllByText } = render(<Invoice {...defaultProps} currency="€" />)
    expect(getAllByText('€5600.00').length).toBeGreaterThan(0)
  })

  it('displays notes when provided', () => {
    const { getByText } = render(
      <Invoice {...defaultProps} notes="Payment due within 30 days" />
    )
    expect(getByText('Payment due within 30 days')).toBeTruthy()
  })

  it('does not display notes when not provided', () => {
    const { queryByText } = render(<Invoice {...defaultProps} />)
    expect(queryByText('Notes')).toBeNull()
  })

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: '#f0f0f0' }
    const { getByTestId } = render(<Invoice {...defaultProps} testID="invoice" style={customStyle} />)
    const invoice = getByTestId('invoice')
    expect(invoice.props.style).toContainEqual(expect.objectContaining(customStyle))
  })
})
