import React from 'react'
import { render } from '@testing-library/react-native'
import { Text } from 'react-native'
import { SafeAreaView } from './SafeAreaView'

describe('SafeAreaView', () => {
  it('renders children', () => {
    const { getByText } = render(
      <SafeAreaView>
        <Text>Content</Text>
      </SafeAreaView>
    )
    expect(getByText('Content')).toBeTruthy()
  })
})
