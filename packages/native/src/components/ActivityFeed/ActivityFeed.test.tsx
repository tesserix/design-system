import React from 'react'
import { render } from '@testing-library/react-native'
import { Text } from 'react-native'
import { ActivityFeed } from './ActivityFeed'

const mockItems = [
  {
    id: '1',
    title: 'User signed up',
    description: 'New user joined the platform',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    title: 'Post published',
    timestamp: '5 hours ago',
  },
]

describe('ActivityFeed', () => {
  it('renders activity items', () => {
    const { getByText } = render(<ActivityFeed items={mockItems} />)
    expect(getByText('User signed up')).toBeTruthy()
    expect(getByText('Post published')).toBeTruthy()
  })

  it('renders descriptions when provided', () => {
    const { getByText } = render(<ActivityFeed items={mockItems} />)
    expect(getByText('New user joined the platform')).toBeTruthy()
  })

  it('renders timestamps', () => {
    const { getByText } = render(<ActivityFeed items={mockItems} />)
    expect(getByText('2 hours ago')).toBeTruthy()
    expect(getByText('5 hours ago')).toBeTruthy()
  })

  it('renders custom icons', () => {
    const itemsWithIcon = [
      {
        ...mockItems[0],
        icon: <Text>Icon</Text>,
      },
    ]
    const { getByText } = render(<ActivityFeed items={itemsWithIcon} />)
    expect(getByText('Icon')).toBeTruthy()
  })
})
