import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Header } from './Header'

describe('Header', () => {
  it('renders title', () => {
    const { getByText } = render(<Header title="My App" />)
    expect(getByText('My App')).toBeTruthy()
  })

  it('renders subtitle', () => {
    const { getByText } = render(
      <Header title="My App" subtitle="Welcome" />
    )
    expect(getByText('Welcome')).toBeTruthy()
  })

  it('renders left element', () => {
    const { getByText } = render(
      <Header title="My App" leftElement={<Text>Menu</Text>} />
    )
    expect(getByText('Menu')).toBeTruthy()
  })

  it('renders right element', () => {
    const { getByText } = render(
      <Header title="My App" rightElement={<Text>Settings</Text>} />
    )
    expect(getByText('Settings')).toBeTruthy()
  })

  it('calls onLeftPress when left element is pressed', () => {
    const onLeftPress = jest.fn()
    const { getByLabelText } = render(
      <Header
        title="My App"
        leftElement={<Text>Menu</Text>}
        onLeftPress={onLeftPress}
      />
    )
    const leftButton = getByLabelText('Header left button')
    fireEvent.press(leftButton)
    expect(onLeftPress).toHaveBeenCalled()
  })

  it('calls onRightPress when right element is pressed', () => {
    const onRightPress = jest.fn()
    const { getByLabelText } = render(
      <Header
        title="My App"
        rightElement={<Text>Settings</Text>}
        onRightPress={onRightPress}
      />
    )
    const rightButton = getByLabelText('Header right button')
    fireEvent.press(rightButton)
    expect(onRightPress).toHaveBeenCalled()
  })
})
