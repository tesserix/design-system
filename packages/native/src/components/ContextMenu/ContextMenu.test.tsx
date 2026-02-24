import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Text, View } from 'react-native'
import { ContextMenu } from './ContextMenu'

const mockItems = [
  {
    label: 'Edit',
    onPress: jest.fn(),
  },
  {
    label: 'Delete',
    onPress: jest.fn(),
    destructive: true,
  },
  {
    label: 'Disabled',
    onPress: jest.fn(),
    disabled: true,
  },
]

describe('ContextMenu', () => {
  it('renders children', () => {
    const { getByText } = render(
      <ContextMenu items={mockItems}>
        <View>
          <Text>Press me</Text>
        </View>
      </ContextMenu>
    )
    expect(getByText('Press me')).toBeTruthy()
  })

  it('opens menu on long press', () => {
    const { getByLabelText, getByText } = render(
      <ContextMenu items={mockItems}>
        <View>
          <Text>Press me</Text>
        </View>
      </ContextMenu>
    )

    fireEvent(getByLabelText('Long press to open context menu'), 'longPress', {
      nativeEvent: { pageX: 100, pageY: 200 },
    })

    expect(getByText('Edit')).toBeTruthy()
    expect(getByText('Delete')).toBeTruthy()
  })

  it('calls onPress when menu item is pressed', () => {
    const { getByLabelText, getByText } = render(
      <ContextMenu items={mockItems}>
        <View>
          <Text>Press me</Text>
        </View>
      </ContextMenu>
    )

    fireEvent(getByLabelText('Long press to open context menu'), 'longPress', {
      nativeEvent: { pageX: 100, pageY: 200 },
    })

    fireEvent.press(getByText('Edit'))
    expect(mockItems[0].onPress).toHaveBeenCalled()
  })

  it('does not call onPress for disabled items', () => {
    const { getByLabelText, getByText } = render(
      <ContextMenu items={mockItems}>
        <View>
          <Text>Press me</Text>
        </View>
      </ContextMenu>
    )

    fireEvent(getByLabelText('Long press to open context menu'), 'longPress', {
      nativeEvent: { pageX: 100, pageY: 200 },
    })

    fireEvent.press(getByText('Disabled'))
    expect(mockItems[2].onPress).not.toHaveBeenCalled()
  })
})
