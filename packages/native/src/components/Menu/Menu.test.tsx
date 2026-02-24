import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Menu } from './Menu'

const mockItems = [
  { label: 'Item 1', onPress: jest.fn() },
  { label: 'Item 2', onPress: jest.fn() },
]

describe('Menu', () => {
  it('renders trigger', () => {
    const { getByText } = render(
      <Menu trigger={<Text>Menu</Text>} items={mockItems} />
    )
    expect(getByText('Menu')).toBeTruthy()
  })

  it('opens menu when trigger is pressed', () => {
    const { getByText } = render(
      <Menu trigger={<Text>Menu</Text>} items={mockItems} />
    )
    fireEvent.press(getByText('Menu'))
    expect(getByText('Item 1')).toBeTruthy()
    expect(getByText('Item 2')).toBeTruthy()
  })
})
