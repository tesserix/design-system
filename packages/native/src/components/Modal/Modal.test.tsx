import React from 'react'
import { render } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Modal } from './Modal'

describe('Modal', () => {
  it('renders when isOpen is true', () => {
    const { getByText } = render(
      <Modal isOpen={true} onClose={jest.fn()}>
        <Text>Modal Content</Text>
      </Modal>
    )
    expect(getByText('Modal Content')).toBeTruthy()
  })

  it('does not render when isOpen is false', () => {
    const { queryByText } = render(
      <Modal isOpen={false} onClose={jest.fn()}>
        <Text>Modal Content</Text>
      </Modal>
    )
    expect(queryByText('Modal Content')).toBeNull()
  })

  it('renders children', () => {
    const { getByText } = render(
      <Modal isOpen={true} onClose={jest.fn()}>
        <Text>Test Content</Text>
      </Modal>
    )
    expect(getByText('Test Content')).toBeTruthy()
  })
})
