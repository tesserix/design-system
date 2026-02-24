import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Select } from './Select'

const mockOptions = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
]

describe('Select', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Select options={mockOptions} />)
    expect(getByText('Select an option')).toBeTruthy()
  })

  it('displays selected value', () => {
    const { getByText } = render(<Select options={mockOptions} value="2" />)
    expect(getByText('Option 2')).toBeTruthy()
  })

  it('opens modal when pressed', () => {
    const { getByText, getByRole } = render(<Select options={mockOptions} />)
    const trigger = getByRole('button')
    fireEvent.press(trigger)
    expect(getByText('Option 1')).toBeTruthy()
    expect(getByText('Option 2')).toBeTruthy()
    expect(getByText('Option 3')).toBeTruthy()
  })

  it('calls onChange when option is selected', () => {
    const onChange = jest.fn()
    const { getByText, getByRole } = render(
      <Select options={mockOptions} onChange={onChange} />
    )
    fireEvent.press(getByRole('button'))
    fireEvent.press(getByText('Option 2'))
    expect(onChange).toHaveBeenCalledWith('2')
  })

  it('does not open when disabled', () => {
    const { queryByText, getByRole } = render(
      <Select options={mockOptions} disabled />
    )
    fireEvent.press(getByRole('button'))
    // Modal should not be visible
    expect(queryByText('Option 1')).toBeNull()
  })

  it('applies error styling', () => {
    const { getByRole } = render(<Select options={mockOptions} error />)
    const button = getByRole('button')
    expect(button.props.style).toBeTruthy()
  })
})
