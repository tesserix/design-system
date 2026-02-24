import React from 'react'
import { render } from '@testing-library/react-native'
import { Text } from 'react-native'
import { BottomSheet } from './BottomSheet'

describe('BottomSheet', () => {
  it('renders when isOpen is true', () => {
    const { getByText } = render(
      <BottomSheet isOpen={true} onClose={jest.fn()}>
        <Text>Bottom Sheet Content</Text>
      </BottomSheet>
    )
    expect(getByText('Bottom Sheet Content')).toBeTruthy()
  })

  it('does not render when isOpen is false', () => {
    const { queryByText } = render(
      <BottomSheet isOpen={false} onClose={jest.fn()}>
        <Text>Bottom Sheet Content</Text>
      </BottomSheet>
    )
    expect(queryByText('Bottom Sheet Content')).toBeNull()
  })
})
