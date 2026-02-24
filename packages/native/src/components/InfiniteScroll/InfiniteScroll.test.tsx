import React from 'react'
import { render } from '@testing-library/react-native'
import { Text } from 'react-native'
import { InfiniteScroll } from './InfiniteScroll'

const mockData = [
  { id: '1', text: 'Item 1' },
  { id: '2', text: 'Item 2' },
  { id: '3', text: 'Item 3' },
]

describe('InfiniteScroll', () => {
  it('renders list items', () => {
    const { getByText } = render(
      <InfiniteScroll
        data={mockData}
        renderItem={({ item }) => <Text>{item.text}</Text>}
        keyExtractor={(item) => item.id}
        onLoadMore={jest.fn()}
      />
    )
    expect(getByText('Item 1')).toBeTruthy()
    expect(getByText('Item 2')).toBeTruthy()
  })

  it('shows loading indicator when loading', () => {
    const { getByText } = render(
      <InfiniteScroll
        data={mockData}
        renderItem={({ item }) => <Text>{item.text}</Text>}
        keyExtractor={(item) => item.id}
        onLoadMore={jest.fn()}
        loading={true}
      />
    )
    expect(getByText('Loading more...')).toBeTruthy()
  })

  it('shows end message when no more items', () => {
    const { getByText } = render(
      <InfiniteScroll
        data={mockData}
        renderItem={({ item }) => <Text>{item.text}</Text>}
        keyExtractor={(item) => item.id}
        onLoadMore={jest.fn()}
        hasMore={false}
      />
    )
    expect(getByText('No more items')).toBeTruthy()
  })

  it('renders custom loading component', () => {
    const { getByText } = render(
      <InfiniteScroll
        data={mockData}
        renderItem={({ item }) => <Text>{item.text}</Text>}
        keyExtractor={(item) => item.id}
        onLoadMore={jest.fn()}
        loading={true}
        loadingComponent={<Text>Custom Loading...</Text>}
      />
    )
    expect(getByText('Custom Loading...')).toBeTruthy()
  })
})
