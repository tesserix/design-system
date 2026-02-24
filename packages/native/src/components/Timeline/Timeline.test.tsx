import React from 'react'
import { render } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Timeline } from './Timeline'

describe('Timeline', () => {
  it('renders timeline items', () => {
    const items = [
      { title: 'Event 1', description: 'First event', timestamp: '10:00 AM' },
      { title: 'Event 2', description: 'Second event', timestamp: '11:00 AM' },
    ]

    const { getByText } = render(<Timeline items={items} />)

    expect(getByText('Event 1')).toBeTruthy()
    expect(getByText('First event')).toBeTruthy()
    expect(getByText('10:00 AM')).toBeTruthy()
    expect(getByText('Event 2')).toBeTruthy()
    expect(getByText('Second event')).toBeTruthy()
    expect(getByText('11:00 AM')).toBeTruthy()
  })

  it('renders custom icon', () => {
    const items = [
      {
        title: 'Event with icon',
        icon: <Text>Icon</Text>,
      },
    ]

    const { getByText } = render(<Timeline items={items} />)

    expect(getByText('Icon')).toBeTruthy()
  })
})
