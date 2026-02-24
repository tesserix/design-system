import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { WishlistButton } from './WishlistButton'

describe('WishlistButton', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<WishlistButton testID="wishlist-btn" />)
    expect(getByTestId('wishlist-btn')).toBeTruthy()
  })

  it('toggles wishlist state when pressed (uncontrolled)', () => {
    const onToggle = jest.fn()
    const { getByTestId } = render(<WishlistButton testID="wishlist-btn" onToggle={onToggle} />)

    fireEvent.press(getByTestId('wishlist-btn'))
    expect(onToggle).toHaveBeenCalledWith(true)

    fireEvent.press(getByTestId('wishlist-btn'))
    expect(onToggle).toHaveBeenCalledWith(false)
  })

  it('respects controlled state', () => {
    const onToggle = jest.fn()
    const { getByTestId, rerender } = render(
      <WishlistButton testID="wishlist-btn" isInWishlist={false} onToggle={onToggle} />
    )

    fireEvent.press(getByTestId('wishlist-btn'))
    expect(onToggle).toHaveBeenCalledWith(true)

    rerender(<WishlistButton testID="wishlist-btn" isInWishlist={true} onToggle={onToggle} />)

    fireEvent.press(getByTestId('wishlist-btn'))
    expect(onToggle).toHaveBeenCalledWith(false)
  })

  it('renders different sizes', () => {
    const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg']
    sizes.forEach((size) => {
      const { getByTestId } = render(<WishlistButton testID={`btn-${size}`} size={size} />)
      expect(getByTestId(`btn-${size}`)).toBeTruthy()
    })
  })

  it('exposes proper accessibility properties', () => {
    const { getByTestId, rerender } = render(
      <WishlistButton testID="wishlist-btn" isInWishlist={false} />
    )

    let button = getByTestId('wishlist-btn')
    expect(button.props.accessibilityRole).toBe('button')
    expect(button.props.accessibilityLabel).toBe('Add to wishlist')
    expect(button.props.accessibilityState).toEqual({ selected: false })

    rerender(<WishlistButton testID="wishlist-btn" isInWishlist={true} />)
    button = getByTestId('wishlist-btn')
    expect(button.props.accessibilityLabel).toBe('Remove from wishlist')
    expect(button.props.accessibilityState).toEqual({ selected: true })
  })

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: '#f0f0f0' }
    const { getByTestId } = render(
      <WishlistButton testID="wishlist-btn" style={customStyle} />
    )
    const button = getByTestId('wishlist-btn')
    expect(button.props.style).toEqual(expect.objectContaining(customStyle))
  })

  it('forwards ref', () => {
    const ref = React.createRef<any>()
    render(<WishlistButton ref={ref} />)
    expect(ref.current).toBeTruthy()
  })
})
