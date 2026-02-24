import React from 'react'
import { render } from '@testing-library/react-native'
import { Text } from 'react-native'
import { KeyboardAvoidingView } from './KeyboardAvoidingView'

describe('KeyboardAvoidingView', () => {
  it('renders children', () => {
    const { getByText } = render(
      <KeyboardAvoidingView>
        <Text>Content</Text>
      </KeyboardAvoidingView>
    )
    expect(getByText('Content')).toBeTruthy()
  })
})
