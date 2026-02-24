import React from 'react'
import { render } from '@testing-library/react-native'
import { Text } from 'react-native'
import { PullToRefresh } from './PullToRefresh'

describe('PullToRefresh', () => {
  it('renders children', () => {
    const { getByText } = render(
      <PullToRefresh refreshing={false} onRefresh={jest.fn()}>
        <Text>Content</Text>
      </PullToRefresh>
    )
    expect(getByText('Content')).toBeTruthy()
  })
})
