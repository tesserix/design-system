import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Chip } from './Chip'

describe('Chip', () => {
  it('renders label', () => {
    const { getByText } = render(<Chip label="Test Chip" />)
    expect(getByText('Test Chip')).toBeTruthy()
  })

  it('calls onPress when pressed', () => {
    const onPress = jest.fn()
    const { getByText } = render(<Chip label="Test Chip" onPress={onPress} />)
    fireEvent.press(getByText('Test Chip'))
    expect(onPress).toHaveBeenCalled()
  })

  it('shows close button when closeable', () => {
    const { getByText } = render(<Chip label="Test Chip" closeable onClose={jest.fn()} />)
    expect(getByText('✕')).toBeTruthy()
  })

  it('calls onClose when close button is pressed', () => {
    const onClose = jest.fn()
    const { getByText } = render(<Chip label="Test Chip" closeable onClose={onClose} />)
    fireEvent.press(getByText('✕'))
    expect(onClose).toHaveBeenCalled()
  })
})
