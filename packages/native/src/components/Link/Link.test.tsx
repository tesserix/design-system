import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Link } from './Link'

describe('Link', () => {
  it('renders children', () => {
    const { getByText } = render(<Link>Click me</Link>)
    expect(getByText('Click me')).toBeTruthy()
  })

  it('calls onPress when pressed', () => {
    const onPress = jest.fn()
    const { getByText } = render(<Link onPress={onPress}>Click me</Link>)
    fireEvent.press(getByText('Click me'))
    expect(onPress).toHaveBeenCalled()
  })
})
