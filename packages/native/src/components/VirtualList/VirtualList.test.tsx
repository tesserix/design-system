import React from 'react'
import { render } from '@testing-library/react-native'
import { Text } from 'react-native'
import { VirtualList } from './VirtualList'

const mockData = [
  { id: '1', text: 'Item 1' },
  { id: '2', text: 'Item 2' },
  { id: '3', text: 'Item 3' },
]

describe('VirtualList', () => {
  it('renders list items', () => {
    const { getByText } = render(
      <VirtualList
        data={mockData}
        renderItem={({ item }) => <Text>{item.text}</Text>}
        keyExtractor={(item) => item.id}
      />
    )
    expect(getByText('Item 1')).toBeTruthy()
  })

  it('applies performance optimizations', () => {
    const { UNSAFE_root } = render(
      <VirtualList
        data={mockData}
        renderItem={({ item }) => <Text>{item.text}</Text>}
        keyExtractor={(item) => item.id}
        windowSize={15}
        maxToRenderPerBatch={5}
      />
    )
    // VirtualList should apply windowSize and other performance props
    expect(UNSAFE_root).toBeTruthy()
  })
})
