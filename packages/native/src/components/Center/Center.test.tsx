import React from 'react'
import { render } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Center } from './Center'

describe('Center', () => {
  it('renders children', () => {
    const { getByText } = render(
      <Center>
        <Text>Centered Content</Text>
      </Center>
    )
    expect(getByText('Centered Content')).toBeTruthy()
  })
})
