import React from 'react'
import { render } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Drawer } from './Drawer'

describe('Drawer', () => {
  it('renders when isOpen is true', () => {
    const { getByText } = render(
      <Drawer isOpen={true} onClose={jest.fn()}>
        <Text>Drawer Content</Text>
      </Drawer>
    )
    expect(getByText('Drawer Content')).toBeTruthy()
  })

  it('does not render when isOpen is false', () => {
    const { queryByText } = render(
      <Drawer isOpen={false} onClose={jest.fn()}>
        <Text>Drawer Content</Text>
      </Drawer>
    )
    expect(queryByText('Drawer Content')).toBeNull()
  })
})
