import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { ProductCard } from './ProductCard'

const mockProduct = {
  image: 'https://example.com/product.jpg',
  name: 'Test Product',
  price: 29.99,
}

describe('ProductCard', () => {
  it('renders product information', () => {
    const { getByText } = render(<ProductCard {...mockProduct} />)
    expect(getByText('Test Product')).toBeTruthy()
    expect(getByText('$29.99')).toBeTruthy()
  })

  it('displays badge when provided', () => {
    const { getByText } = render(<ProductCard {...mockProduct} badge="New" />)
    expect(getByText('New')).toBeTruthy()
  })

  it('shows discount information', () => {
    const { getByText } = render(
      <ProductCard {...mockProduct} originalPrice={49.99} />
    )
    expect(getByText('$49.99')).toBeTruthy()
    expect(getByText('-40%')).toBeTruthy()
  })

  it('displays rating and review count', () => {
    const { getByText } = render(
      <ProductCard {...mockProduct} rating={4.5} reviewCount={120} />
    )
    expect(getByText('★ 4.5')).toBeTruthy()
    expect(getByText('(120)')).toBeTruthy()
  })

  it('calls onPress when card is pressed', () => {
    const onPress = jest.fn()
    const { getByLabelText } = render(
      <ProductCard {...mockProduct} onPress={onPress} />
    )
    fireEvent.press(getByLabelText('Test Product, $29.99'))
    expect(onPress).toHaveBeenCalled()
  })

  it('calls onAddToCart when add to cart button is pressed', () => {
    const onAddToCart = jest.fn()
    const { getByLabelText } = render(
      <ProductCard {...mockProduct} onAddToCart={onAddToCart} />
    )
    fireEvent.press(getByLabelText('Add to cart'))
    expect(onAddToCart).toHaveBeenCalled()
  })

  it('calls onWishlist when wishlist button is pressed', () => {
    const onWishlist = jest.fn()
    const { getByLabelText } = render(
      <ProductCard {...mockProduct} onWishlist={onWishlist} />
    )
    fireEvent.press(getByLabelText('Add to wishlist'))
    expect(onWishlist).toHaveBeenCalled()
  })

  it('shows out of stock overlay when not in stock', () => {
    const { getByText, queryByLabelText } = render(
      <ProductCard {...mockProduct} inStock={false} onAddToCart={jest.fn()} />
    )
    expect(getByText('Out of Stock')).toBeTruthy()
    expect(queryByLabelText('Add to cart')).toBeNull()
  })
})
