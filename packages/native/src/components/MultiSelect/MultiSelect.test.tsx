import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { MultiSelect } from './MultiSelect'

const mockOptions = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
]

describe('MultiSelect', () => {
  it('renders with placeholder', () => {
    const { getByText } = render(
      <MultiSelect options={mockOptions} placeholder="Select options" />
    )
    expect(getByText('Select options')).toBeTruthy()
  })

  it('renders label', () => {
    const { getByText } = render(
      <MultiSelect options={mockOptions} label="Choose items" />
    )
    expect(getByText('Choose items')).toBeTruthy()
  })

  it('displays selected values', () => {
    const { getByText } = render(
      <MultiSelect options={mockOptions} value={['1', '2']} />
    )
    expect(getByText('Option 1, Option 2')).toBeTruthy()
  })

  it('opens modal on press', () => {
    const { getByRole, getByText } = render(
      <MultiSelect options={mockOptions} label="Select" />
    )
    const trigger = getByRole('button')
    fireEvent.press(trigger)
    expect(getByText('Done')).toBeTruthy()
  })
})
