import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Input } from './Input'

describe('Input', () => {
  it('renders correctly', () => {
    const { getByPlaceholderText } = render(<Input placeholder="Enter text" />)
    expect(getByPlaceholderText('Enter text')).toBeTruthy()
  })

  it('renders with label', () => {
    const { getByText } = render(<Input label="Email" placeholder="Enter email" />)
    expect(getByText('Email')).toBeTruthy()
  })

  it('renders with helper text', () => {
    const { getByText } = render(
      <Input placeholder="Enter text" helperText="This is a helper text" />
    )
    expect(getByText('This is a helper text')).toBeTruthy()
  })

  it('renders with error message when invalid', () => {
    const { getByText } = render(
      <Input
        placeholder="Enter text"
        isInvalid
        errorMessage="This field is required"
        helperText="Helper text"
      />
    )
    expect(getByText('This field is required')).toBeTruthy()
  })

  it('handles text input', () => {
    const onChangeText = jest.fn()
    const { getByPlaceholderText } = render(
      <Input placeholder="Enter text" onChangeText={onChangeText} />
    )

    const input = getByPlaceholderText('Enter text')
    fireEvent.changeText(input, 'Hello')

    expect(onChangeText).toHaveBeenCalledWith('Hello')
  })

  it('is disabled when isDisabled is true', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Enter text" isDisabled />
    )

    const input = getByPlaceholderText('Enter text')
    expect(input.props.editable).toBe(false)
  })

  it('renders different sizes', () => {
    const { rerender, getByPlaceholderText } = render(
      <Input placeholder="Enter text" size="sm" />
    )
    const inputSm = getByPlaceholderText('Enter text')
    expect(inputSm).toBeTruthy()

    rerender(<Input placeholder="Enter text" size="md" />)
    const inputMd = getByPlaceholderText('Enter text')
    expect(inputMd).toBeTruthy()

    rerender(<Input placeholder="Enter text" size="lg" />)
    const inputLg = getByPlaceholderText('Enter text')
    expect(inputLg).toBeTruthy()
  })

  it('renders different variants', () => {
    const { rerender, getByPlaceholderText } = render(
      <Input placeholder="Enter text" variant="outline" />
    )
    const inputOutline = getByPlaceholderText('Enter text')
    expect(inputOutline).toBeTruthy()

    rerender(<Input placeholder="Enter text" variant="filled" />)
    const inputFilled = getByPlaceholderText('Enter text')
    expect(inputFilled).toBeTruthy()

    rerender(<Input placeholder="Enter text" variant="unstyled" />)
    const inputUnstyled = getByPlaceholderText('Enter text')
    expect(inputUnstyled).toBeTruthy()
  })

  it('applies accessibility label, hint, and state from field props', () => {
    const { getByPlaceholderText } = render(
      <Input
        placeholder="Enter email"
        label="Email"
        helperText="Use your work email"
        isInvalid
        errorMessage="Invalid email"
        isDisabled
      />
    )
    const input = getByPlaceholderText('Enter email')
    expect(input.props.accessibilityLabel).toBe('Email')
    expect(input.props.accessibilityHint).toBe('Invalid email')
    expect(input.props.accessibilityState).toEqual(
      expect.objectContaining({ disabled: true, invalid: true })
    )
  })
})
