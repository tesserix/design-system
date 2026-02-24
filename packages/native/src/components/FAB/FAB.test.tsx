import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Text } from 'react-native'
import { FAB } from './FAB'

describe('FAB', () => {
  it('renders correctly', () => {
    const { getByText } = render(<FAB />)
    expect(getByText('+')).toBeTruthy()
  })

  it('renders custom icon', () => {
    const { getByText } = render(<FAB icon={<Text>★</Text>} />)
    expect(getByText('★')).toBeTruthy()
  })

  it('calls onPress when pressed', () => {
    const onPress = jest.fn()
    const { getByText } = render(<FAB onPress={onPress} />)
    fireEvent.press(getByText('+'))
    expect(onPress).toHaveBeenCalled()
  })
})
