import React, { useState } from 'react'
import { TouchableOpacity, TouchableOpacityProps, Text, ViewStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface WishlistButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  /** Whether item is in wishlist */
  isInWishlist?: boolean
  /** Callback when wishlist state changes */
  onToggle?: (isInWishlist: boolean) => void
  /** Button size */
  size?: 'sm' | 'md' | 'lg'
  /** Custom container style */
  style?: ViewStyle
  /** Test ID for testing */
  testID?: string
}

const sizeMap = {
  sm: { fontSize: fontSize.lg, padding: spacing[1] },
  md: { fontSize: fontSize.xl, padding: spacing[2] },
  lg: { fontSize: fontSize['2xl'], padding: spacing[3] },
}

/**
 * WishlistButton component - Standalone wishlist toggle button with heart icon
 *
 * @example
 * ```tsx
 * <WishlistButton
 *   isInWishlist={false}
 *   onToggle={(isInWishlist) => console.log('Wishlist:', isInWishlist)}
 * />
 * ```
 */
export const WishlistButton = React.forwardRef<
  React.ElementRef<typeof TouchableOpacity>,
  WishlistButtonProps
>(({ isInWishlist: controlledIsInWishlist, onToggle, size = 'md', style, testID, ...props }, ref) => {
  const [internalIsInWishlist, setInternalIsInWishlist] = useState(false)
  const isControlled = controlledIsInWishlist !== undefined
  const isInWishlist = isControlled ? controlledIsInWishlist : internalIsInWishlist

  const handlePress = () => {
    const newValue = !isInWishlist
    if (!isControlled) {
      setInternalIsInWishlist(newValue)
    }
    onToggle?.(newValue)
  }

  const sizeStyle = sizeMap[size]

  const containerStyle: ViewStyle = {
    padding: sizeStyle.padding,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  }

  return (
    <TouchableOpacity
      ref={ref}
      style={[containerStyle, style]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessible
      accessibilityRole="button"
      accessibilityLabel={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      accessibilityState={{ selected: isInWishlist }}
      testID={testID}
      {...props}
    >
      <Text
        style={{
          fontSize: sizeStyle.fontSize,
          color: isInWishlist ? '#ef4444' : '#9ca3af',
        }}
        accessible={false}
      >
        {isInWishlist ? '♥' : '♡'}
      </Text>
    </TouchableOpacity>
  )
})

WishlistButton.displayName = 'WishlistButton'
