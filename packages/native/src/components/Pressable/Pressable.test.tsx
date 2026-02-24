import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Pressable } from './Pressable'

describe('Pressable', () => {
  it('renders children', () => {
    const { getByText } = render(
      <Pressable>
        <Text>Press me</Text>
      </Pressable>
    )
    expect(getByText('Press me')).toBeTruthy()
  })

  it('calls onPress when pressed', () => {
    const onPress = jest.fn()
    const { getByText } = render(
      <Pressable onPress={onPress}>
        <Text>Press me</Text>
      </Pressable>
    )
    fireEvent.press(getByText('Press me'))
    expect(onPress).toHaveBeenCalled()
  })
})
