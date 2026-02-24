import React from 'react'
import { render } from '@testing-library/react-native'
import { Text } from 'react-native'
import { ScrollView } from './ScrollView'

describe('ScrollView', () => {
  it('renders children', () => {
    const { getByText } = render(
      <ScrollView>
        <Text>Scrollable Content</Text>
      </ScrollView>
    )
    expect(getByText('Scrollable Content')).toBeTruthy()
  })
})
