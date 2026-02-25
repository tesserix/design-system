import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Text, View } from 'react-native'
import { ProductGrid } from './ProductGrid'

type MockProduct = {
  id: string
  name: string
}

const mockData: MockProduct[] = [
  { id: '1', name: 'Product 1' },
  { id: '2', name: 'Product 2' },
  { id: '3', name: 'Product 3' },
  { id: '4', name: 'Product 4' },
]

describe('ProductGrid', () => {
  it('renders products in grid', () => {
    const { getByText } = render(
      <ProductGrid
        data={mockData}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
          </View>
        )}
      />
    )
    expect(getByText('Product 1')).toBeTruthy()
    expect(getByText('Product 4')).toBeTruthy()
  })

  it('renders with custom number of columns', () => {
    const { getByLabelText } = render(
      <ProductGrid
        data={mockData}
        numColumns={3}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
          </View>
        )}
      />
    )
    expect(getByLabelText('Product grid')).toBeTruthy()
  })

  it('handles empty data', () => {
    const { getByLabelText } = render(
      <ProductGrid
        data={[] as MockProduct[]}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
          </View>
        )}
      />
    )
    expect(getByLabelText('Product grid')).toBeTruthy()
  })

  it('calls onProductPress when an item is pressed', () => {
    const onProductPress = jest.fn()
    const { getByTestId } = render(
      <ProductGrid
        data={mockData}
        onProductPress={onProductPress}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
          </View>
        )}
      />
    )

    fireEvent.press(getByTestId('product-grid-item-2'))
    expect(onProductPress).toHaveBeenCalledWith(mockData[1])
  })
})
