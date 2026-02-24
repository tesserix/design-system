import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Text } from 'react-native'
import { FloatingMenu } from './FloatingMenu'

const mockItems = [
  { label: 'Share', icon: <Text>📤</Text>, onPress: jest.fn() },
  { label: 'Edit', icon: <Text>✏️</Text>, onPress: jest.fn() },
  { label: 'Delete', icon: <Text>🗑️</Text>, onPress: jest.fn() },
]

describe('FloatingMenu', () => {
  it('renders main button', () => {
    const { getByLabelText } = render(
      <FloatingMenu items={mockItems} />
    )
    expect(getByLabelText('Toggle menu')).toBeTruthy()
  })

  it('shows menu items when toggled', () => {
    const { getByLabelText, getByText } = render(
      <FloatingMenu items={mockItems} />
    )
    const mainButton = getByLabelText('Toggle menu')
    fireEvent.press(mainButton)
    expect(getByText('Share')).toBeTruthy()
    expect(getByText('Edit')).toBeTruthy()
  })

  it('calls onPress when item is clicked', () => {
    const { getByLabelText } = render(
      <FloatingMenu items={mockItems} />
    )
    const mainButton = getByLabelText('Toggle menu')
    fireEvent.press(mainButton)

    const shareButton = getByLabelText('Share')
    fireEvent.press(shareButton)
    expect(mockItems[0].onPress).toHaveBeenCalled()
  })

  it('renders custom icon', () => {
    const { getByText } = render(
      <FloatingMenu items={mockItems} icon={<Text>Menu</Text>} />
    )
    expect(getByText('Menu')).toBeTruthy()
  })
})
