import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Text } from 'react-native'
import { CommentItem } from './CommentItem'

describe('CommentItem', () => {
  it('renders comment', () => {
    const { getByText } = render(
      <CommentItem
        author="John Doe"
        comment="This is a great post!"
      />
    )
    expect(getByText('John Doe')).toBeTruthy()
    expect(getByText('This is a great post!')).toBeTruthy()
  })

  it('renders timestamp', () => {
    const { getByText } = render(
      <CommentItem
        author="John Doe"
        comment="Hello"
        timestamp="2 hours ago"
      />
    )
    expect(getByText('2 hours ago')).toBeTruthy()
  })

  it('renders avatar', () => {
    const { getByText } = render(
      <CommentItem
        author="John Doe"
        comment="Hello"
        avatar={<Text>Avatar</Text>}
      />
    )
    expect(getByText('Avatar')).toBeTruthy()
  })

  it('calls onLike when like button is pressed', () => {
    const onLike = jest.fn()
    const { getByLabelText } = render(
      <CommentItem
        author="John Doe"
        comment="Hello"
        onLike={onLike}
      />
    )
    const likeButton = getByLabelText('Like comment')
    fireEvent.press(likeButton)
    expect(onLike).toHaveBeenCalled()
  })

  it('shows like count', () => {
    const { getByText } = render(
      <CommentItem
        author="John Doe"
        comment="Hello"
        likes={42}
        onLike={jest.fn()}
      />
    )
    expect(getByText('42')).toBeTruthy()
  })

  it('shows replies count', () => {
    const { getByText } = render(
      <CommentItem
        author="John Doe"
        comment="Hello"
        replies={5}
        onReply={jest.fn()}
      />
    )
    expect(getByText('5')).toBeTruthy()
  })
})
