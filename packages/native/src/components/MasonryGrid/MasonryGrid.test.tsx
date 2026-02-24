import React from 'react'
import { render } from '@testing-library/react-native'
import { Text, View } from 'react-native'
import { MasonryGrid } from './MasonryGrid'

const mockData = [
  { id: '1', text: 'Item 1' },
  { id: '2', text: 'Item 2' },
  { id: '3', text: 'Item 3' },
  { id: '4', text: 'Item 4' },
]

describe('MasonryGrid', () => {
  it('renders items in grid', () => {
    const { getByText } = render(
      <MasonryGrid
        data={mockData}
        renderItem={(item) => (
          <View>
            <Text>{item.text}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    )
    expect(getByText('Item 1')).toBeTruthy()
    expect(getByText('Item 2')).toBeTruthy()
  })

  it('distributes items across columns', () => {
    const { getByText } = render(
      <MasonryGrid
        data={mockData}
        numColumns={2}
        renderItem={(item) => (
          <View>
            <Text>{item.text}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    )
    expect(getByText('Item 1')).toBeTruthy()
    expect(getByText('Item 4')).toBeTruthy()
  })
})
