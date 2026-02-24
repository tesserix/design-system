import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { BackButton } from './BackButton'

describe('BackButton', () => {
  it('renders correctly', () => {
    const { getByText } = render(<BackButton />)
    expect(getByText('←')).toBeTruthy()
  })

  it('calls onPress when pressed', () => {
    const onPress = jest.fn()
    const { getByText } = render(<BackButton onPress={onPress} />)
    fireEvent.press(getByText('←'))
    expect(onPress).toHaveBeenCalled()
  })
})
