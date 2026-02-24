import React from 'react'
import { render } from '@testing-library/react-native'
import { Text } from 'react-native'
import { ChatBubble } from './ChatBubble'

describe('ChatBubble', () => {
  it('renders message', () => {
    const { getByText } = render(
      <ChatBubble message="Hello, world!" />
    )
    expect(getByText('Hello, world!')).toBeTruthy()
  })

  it('renders sender name', () => {
    const { getByText } = render(
      <ChatBubble message="Hello" senderName="John Doe" />
    )
    expect(getByText('John Doe')).toBeTruthy()
  })

  it('renders timestamp', () => {
    const { getByText } = render(
      <ChatBubble message="Hello" timestamp="10:30 AM" />
    )
    expect(getByText('10:30 AM')).toBeTruthy()
  })

  it('renders avatar', () => {
    const { getByText } = render(
      <ChatBubble
        message="Hello"
        avatar={<Text>Avatar</Text>}
      />
    )
    expect(getByText('Avatar')).toBeTruthy()
  })

  it('applies own message styles', () => {
    const { getByText } = render(
      <ChatBubble message="My message" isOwn={true} />
    )
    expect(getByText('My message')).toBeTruthy()
  })
})
