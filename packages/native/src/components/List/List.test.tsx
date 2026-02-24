import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Text } from 'react-native'
import { List } from './List'
import { ListItem } from './ListItem'

describe('List', () => {
  it('renders children', () => {
    const { getByText } = render(
      <List>
        <Text>Item 1</Text>
        <Text>Item 2</Text>
      </List>
    )
    expect(getByText('Item 1')).toBeTruthy()
    expect(getByText('Item 2')).toBeTruthy()
  })
})

describe('ListItem', () => {
  it('renders title', () => {
    const { getByText } = render(<ListItem title="Test Title" />)
    expect(getByText('Test Title')).toBeTruthy()
  })

  it('renders subtitle when provided', () => {
    const { getByText } = render(
      <ListItem title="Test Title" subtitle="Test Subtitle" />
    )
    expect(getByText('Test Subtitle')).toBeTruthy()
  })

  it('calls onPress when pressed', () => {
    const onPress = jest.fn()
    const { getByText } = render(
      <ListItem title="Test Title" onPress={onPress} />
    )
    fireEvent.press(getByText('Test Title'))
    expect(onPress).toHaveBeenCalled()
  })

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn()
    const { getByText } = render(
      <ListItem title="Test Title" onPress={onPress} disabled />
    )
    fireEvent.press(getByText('Test Title'))
    expect(onPress).not.toHaveBeenCalled()
  })
})
