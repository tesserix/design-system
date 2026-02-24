import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Popover } from './Popover'

describe('Popover', () => {
  it('renders trigger', () => {
    const { getByText } = render(
      <Popover trigger={<Text>Trigger</Text>}>
        <Text>Content</Text>
      </Popover>
    )
    expect(getByText('Trigger')).toBeTruthy()
  })

  it('opens popover when trigger is pressed', () => {
    const { getByText } = render(
      <Popover trigger={<Text>Trigger</Text>}>
        <Text>Content</Text>
      </Popover>
    )
    fireEvent.press(getByText('Trigger'))
    expect(getByText('Content')).toBeTruthy()
  })
})
