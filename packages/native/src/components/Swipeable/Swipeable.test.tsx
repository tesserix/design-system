import React from 'react'
import { render } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Swipeable } from './Swipeable'

describe('Swipeable', () => {
  it('renders children', () => {
    const { getByText } = render(
      <Swipeable>
        <Text>Swipeable Content</Text>
      </Swipeable>
    )
    expect(getByText('Swipeable Content')).toBeTruthy()
  })

  it('renders left action', () => {
    const { getByText } = render(
      <Swipeable leftAction={<Text>Archive</Text>}>
        <Text>Content</Text>
      </Swipeable>
    )
    expect(getByText('Archive')).toBeTruthy()
  })

  it('renders right action', () => {
    const { getByText } = render(
      <Swipeable rightAction={<Text>Delete</Text>}>
        <Text>Content</Text>
      </Swipeable>
    )
    expect(getByText('Delete')).toBeTruthy()
  })

  it('renders both actions', () => {
    const { getByText } = render(
      <Swipeable
        leftAction={<Text>Archive</Text>}
        rightAction={<Text>Delete</Text>}
      >
        <Text>Content</Text>
      </Swipeable>
    )
    expect(getByText('Archive')).toBeTruthy()
    expect(getByText('Delete')).toBeTruthy()
  })
})
