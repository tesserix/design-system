import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PhoneInput } from './phone-input'

describe('PhoneInput', () => {
  it('renders with placeholder', () => {
    render(<PhoneInput value="" onChange={vi.fn()} placeholder="Phone number" />)
    expect(screen.getByPlaceholderText('Phone number')).toBeInTheDocument()
  })

  it('displays selected country dial code', () => {
    render(<PhoneInput value="" onChange={vi.fn()} countryCode="AU" />)
    expect(screen.getByText('+61')).toBeInTheDocument()
  })

  it('sets country from countryCode prop', () => {
    render(<PhoneInput value="" onChange={vi.fn()} countryCode="US" />)
    expect(screen.getByText('+1')).toBeInTheDocument()
  })

  it('parses existing value', () => {
    render(<PhoneInput value="+91-9876543210" onChange={vi.fn()} />)
    expect(screen.getByText('+91')).toBeInTheDocument()
  })

  it('calls onChange with full number', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()
    render(<PhoneInput value="" onChange={handleChange} />)

    const input = screen.getByPlaceholderText('Enter phone number')
    await user.type(input, '412345678')

    expect(handleChange).toHaveBeenCalled()
  })

  it('disables input when disabled prop is true', () => {
    render(<PhoneInput value="" onChange={vi.fn()} disabled />)
    expect(screen.getByPlaceholderText('Enter phone number')).toBeDisabled()
  })
})
