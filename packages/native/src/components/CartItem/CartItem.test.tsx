import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { CartItem } from './CartItem'

const mockItem = {
  image: 'https://example.com/product.jpg',
  name: 'Test Product',
  price: 29.99,
  quantity: 2,
}

describe('CartItem', () => {
  it('renders cart item information', () => {
    const { getByText } = render(<CartItem {...mockItem} />)
    expect(getByText('Test Product')).toBeTruthy()
    expect(getByText('$29.99')).toBeTruthy()
    expect(getByText('Total: $59.98')).toBeTruthy()
  })

  it('displays variant information', () => {
    const { getByText } = render(
      <CartItem {...mockItem} variant="Size: M, Color: Blue" />
    )
    expect(getByText('Size: M, Color: Blue')).toBeTruthy()
  })

  it('increases quantity when + button is pressed', () => {
    const onQuantityChange = jest.fn()
    const { getByLabelText } = render(
      <CartItem {...mockItem} onQuantityChange={onQuantityChange} />
    )
    fireEvent.press(getByLabelText('Increase quantity'))
    expect(onQuantityChange).toHaveBeenCalledWith(3)
  })

  it('decreases quantity when - button is pressed', () => {
    const onQuantityChange = jest.fn()
    const { getByLabelText } = render(
      <CartItem {...mockItem} onQuantityChange={onQuantityChange} />
    )
    fireEvent.press(getByLabelText('Decrease quantity'))
    expect(onQuantityChange).toHaveBeenCalledWith(1)
  })

  it('does not decrease quantity below 1', () => {
    const onQuantityChange = jest.fn()
    const { getByLabelText } = render(
      <CartItem {...mockItem} quantity={1} onQuantityChange={onQuantityChange} />
    )
    fireEvent.press(getByLabelText('Decrease quantity'))
    expect(onQuantityChange).not.toHaveBeenCalled()
  })

  it('calls onRemove when remove button is pressed', () => {
    const onRemove = jest.fn()
    const { getByLabelText } = render(
      <CartItem {...mockItem} onRemove={onRemove} />
    )
    fireEvent.press(getByLabelText('Remove item'))
    expect(onRemove).toHaveBeenCalled()
  })

  it('calls onPress when item is pressed', () => {
    const onPress = jest.fn()
    const { getByLabelText } = render(
      <CartItem {...mockItem} onPress={onPress} />
    )
    fireEvent.press(getByLabelText('Test Product, 2 items, $59.98'))
    expect(onPress).toHaveBeenCalled()
  })
})
