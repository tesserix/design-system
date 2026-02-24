import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { ActionSheet } from './ActionSheet'

const mockOptions = [
  { label: 'Option 1', onPress: jest.fn() },
  { label: 'Option 2', onPress: jest.fn() },
]

describe('ActionSheet', () => {
  it('renders when isOpen is true', () => {
    const { getByText } = render(
      <ActionSheet isOpen={true} onClose={jest.fn()} options={mockOptions} />
    )
    expect(getByText('Option 1')).toBeTruthy()
    expect(getByText('Option 2')).toBeTruthy()
  })

  it('does not render when isOpen is false', () => {
    const { queryByText } = render(
      <ActionSheet isOpen={false} onClose={jest.fn()} options={mockOptions} />
    )
    expect(queryByText('Option 1')).toBeNull()
  })

  it('calls option onPress when pressed', () => {
    const { getByText } = render(
      <ActionSheet isOpen={true} onClose={jest.fn()} options={mockOptions} />
    )
    fireEvent.press(getByText('Option 1'))
    expect(mockOptions[0].onPress).toHaveBeenCalled()
  })

  it('renders title when provided', () => {
    const { getByText } = render(
      <ActionSheet
        isOpen={true}
        onClose={jest.fn()}
        options={mockOptions}
        title="Select an option"
      />
    )
    expect(getByText('Select an option')).toBeTruthy()
  })
})
