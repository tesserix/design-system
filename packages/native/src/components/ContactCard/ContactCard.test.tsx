import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { ContactCard } from './ContactCard'

describe('ContactCard', () => {
  const defaultProps = {
    name: 'John Doe',
    role: 'Senior Engineer',
    company: 'Tech Corp',
    email: 'john@techcorp.com',
    phone: '+1 555-1234',
  }

  it('renders correctly', () => {
    const { getByText } = render(<ContactCard {...defaultProps} />)
    expect(getByText('John Doe')).toBeTruthy()
    expect(getByText('Senior Engineer')).toBeTruthy()
    expect(getByText('Tech Corp')).toBeTruthy()
  })

  it('displays email and phone', () => {
    const { getByText } = render(<ContactCard {...defaultProps} />)
    expect(getByText('john@techcorp.com')).toBeTruthy()
    expect(getByText('+1 555-1234')).toBeTruthy()
  })

  it('displays default avatar with first letter of name', () => {
    const { getByText } = render(<ContactCard {...defaultProps} />)
    expect(getByText('J')).toBeTruthy()
  })

  it('displays custom avatar', () => {
    const { getByText } = render(<ContactCard {...defaultProps} avatar="👤" />)
    expect(getByText('👤')).toBeTruthy()
  })

  it('renders without optional fields', () => {
    const { getByText, queryByText } = render(<ContactCard name="Jane Smith" />)
    expect(getByText('Jane Smith')).toBeTruthy()
    expect(queryByText('Senior Engineer')).toBeNull()
    expect(queryByText('Tech Corp')).toBeNull()
  })

  it('does not render contact info section when email and phone are missing', () => {
    const { queryByText } = render(<ContactCard name="Jane Smith" />)
    expect(queryByText('✉️')).toBeNull()
    expect(queryByText('📞')).toBeNull()
  })

  it('calls onEmailPress when email is pressed', () => {
    const onEmailPress = jest.fn()
    const { getByText } = render(<ContactCard {...defaultProps} onEmailPress={onEmailPress} />)

    fireEvent.press(getByText('john@techcorp.com'))
    expect(onEmailPress).toHaveBeenCalled()
  })

  it('calls onPhonePress when phone is pressed', () => {
    const onPhonePress = jest.fn()
    const { getByText } = render(<ContactCard {...defaultProps} onPhonePress={onPhonePress} />)

    fireEvent.press(getByText('+1 555-1234'))
    expect(onPhonePress).toHaveBeenCalled()
  })

  it('renders email without onEmailPress callback', () => {
    const { getByText } = render(<ContactCard {...defaultProps} />)
    expect(getByText('john@techcorp.com')).toBeTruthy()
  })

  it('exposes proper accessibility properties', () => {
    const { getByTestId } = render(<ContactCard {...defaultProps} testID="contact" />)
    const card = getByTestId('contact')
    expect(card.props.accessibilityRole).toBe('summary')
    expect(card.props.accessibilityLabel).toContain('John Doe')
    expect(card.props.accessibilityLabel).toContain('Senior Engineer')
    expect(card.props.accessibilityLabel).toContain('Tech Corp')
  })

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: '#f0f0f0' }
    const { getByTestId } = render(
      <ContactCard {...defaultProps} testID="contact" style={customStyle} />
    )
    const card = getByTestId('contact')
    expect(card.props.style).toContainEqual(expect.objectContaining(customStyle))
  })
})
