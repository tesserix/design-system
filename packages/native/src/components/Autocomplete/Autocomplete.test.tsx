import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Autocomplete } from './Autocomplete'

const mockOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
]

describe('Autocomplete', () => {
  it('renders with placeholder', () => {
    const { getByPlaceholderText } = render(
      <Autocomplete options={mockOptions} placeholder="Search fruits" />
    )
    expect(getByPlaceholderText('Search fruits')).toBeTruthy()
  })

  it('renders label', () => {
    const { getByText } = render(
      <Autocomplete options={mockOptions} label="Select fruit" />
    )
    expect(getByText('Select fruit')).toBeTruthy()
  })

  it('calls onChangeText when typing', () => {
    const onChangeText = jest.fn()
    const { getByRole } = render(
      <Autocomplete options={mockOptions} onChangeText={onChangeText} />
    )
    const input = getByRole('search')
    fireEvent.changeText(input, 'app')
    expect(onChangeText).toHaveBeenCalledWith('app')
  })

  it('displays error message', () => {
    const { getByText } = render(
      <Autocomplete options={mockOptions} error="Required field" />
    )
    expect(getByText('Required field')).toBeTruthy()
  })
})
