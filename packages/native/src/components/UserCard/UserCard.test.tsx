import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Text } from 'react-native'
import { UserCard } from './UserCard'

describe('UserCard', () => {
  it('renders user name', () => {
    const { getByText } = render(<UserCard name="John Doe" />)
    expect(getByText('John Doe')).toBeTruthy()
  })

  it('renders bio', () => {
    const { getByText } = render(
      <UserCard name="John Doe" bio="Software Developer" />
    )
    expect(getByText('Software Developer')).toBeTruthy()
  })

  it('renders avatar', () => {
    const { getByText } = render(
      <UserCard name="John Doe" avatar={<Text>Avatar</Text>} />
    )
    expect(getByText('Avatar')).toBeTruthy()
  })

  it('renders stats', () => {
    const { getByText } = render(
      <UserCard
        name="John Doe"
        stats={{ followers: 1000, following: 500, posts: 42 }}
      />
    )
    expect(getByText('1000')).toBeTruthy()
    expect(getByText('Followers')).toBeTruthy()
    expect(getByText('500')).toBeTruthy()
    expect(getByText('42')).toBeTruthy()
  })

  it('calls onFollow when follow button is pressed', () => {
    const onFollow = jest.fn()
    const { getByLabelText } = render(
      <UserCard name="John Doe" onFollow={onFollow} />
    )
    const followButton = getByLabelText('Follow')
    fireEvent.press(followButton)
    expect(onFollow).toHaveBeenCalled()
  })

  it('shows following state', () => {
    const { getByText } = render(
      <UserCard name="John Doe" onFollow={jest.fn()} isFollowing={true} />
    )
    expect(getByText('Following')).toBeTruthy()
  })
})
