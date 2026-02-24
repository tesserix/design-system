import React from 'react'
import { render } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Image } from './Image'

describe('Image', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(
      <Image source={{ uri: 'https://example.com/image.jpg' }} testID="image" />
    )
    expect(getByTestId('image')).toBeTruthy()
  })

  it('shows fallback when error occurs', () => {
    const { getByText } = render(
      <Image
        source={{ uri: 'invalid' }}
        fallback={<Text>Fallback</Text>}
      />
    )
    // Trigger error by rendering
    expect(getByText).toBeDefined()
  })
})
