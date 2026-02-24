import React from 'react'
import { render } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Portal, PortalHost } from './Portal'

describe('Portal', () => {
  it('renders content in host', () => {
    const { getByText } = render(
      <>
        <PortalHost />
        <Portal>
          <Text>Portal Content</Text>
        </Portal>
      </>
    )
    expect(getByText('Portal Content')).toBeTruthy()
  })
})
