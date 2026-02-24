import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface ProductCardProps {
  /** Product image URL */
  image: string
  /** Product name */
  name: string
  /** Product price */
  price: number
  /** Currency symbol */
  currency?: string
  /** Original price (for discount display) */
  originalPrice?: number
  /** Product rating (0-5) */
  rating?: number
  /** Number of reviews */
  reviewCount?: number
  /** Product badge (e.g., "New", "Sale") */
  badge?: string
  /** Whether product is in stock */
  inStock?: boolean
  /** Callback when card is pressed */
  onPress?: () => void
  /** Callback when add to cart is pressed */
  onAddToCart?: () => void
  /** Callback when wishlist is pressed */
  onWishlist?: () => void
  /** Whether product is wishlisted */
  isWishlisted?: boolean
  /** Custom style */
  style?: StyleProp<ViewStyle>
}

export const ProductCard: React.FC<ProductCardProps> = ({
  image,
  name,
  price,
  currency = '$',
  originalPrice,
  rating,
  reviewCount,
  badge,
  inStock = true,
  onPress,
  onAddToCart,
  onWishlist,
  isWishlisted = false,
  style,
}) => {
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      disabled={!onPress}
      accessible={!!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={onPress ? `${name}, ${currency}${price}` : undefined}
      accessibilityState={onPress ? { disabled: false } : undefined}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="cover"
          accessible={true}
          accessibilityRole="image"
        />
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
        {onWishlist && (
          <TouchableOpacity
            style={styles.wishlistButton}
            onPress={onWishlist}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            accessibilityState={{ selected: isWishlisted }}
          >
            <Text style={styles.wishlistIcon}>{isWishlisted ? '♥' : '♡'}</Text>
          </TouchableOpacity>
        )}
        {!inStock && (
          <View style={styles.outOfStock}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>

        {rating !== undefined && (
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>★ {rating.toFixed(1)}</Text>
            {reviewCount !== undefined && (
              <Text style={styles.reviewCount}>({reviewCount})</Text>
            )}
          </View>
        )}

        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {currency}{price.toFixed(2)}
          </Text>
          {originalPrice && originalPrice > price && (
            <>
              <Text style={styles.originalPrice}>
                {currency}{originalPrice.toFixed(2)}
              </Text>
              <Text style={styles.discount}>-{discount}%</Text>
            </>
          )}
        </View>

        {onAddToCart && inStock && (
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={onAddToCart}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Add to cart"
          >
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  )
}

ProductCard.displayName = 'ProductCard'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f3f4f6',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: semanticSpacing.sm,
    left: semanticSpacing.sm,
    backgroundColor: '#ef4444',
    paddingHorizontal: semanticSpacing.sm,
    paddingVertical: semanticSpacing.xs,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: fontSize.xs,
    color: '#ffffff',
    fontWeight: '600',
  },
  wishlistButton: {
    position: 'absolute',
    top: semanticSpacing.sm,
    right: semanticSpacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  wishlistIcon: {
    fontSize: 18,
    color: '#ef4444',
  },
  outOfStock: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    fontSize: fontSize.base,
    color: '#ffffff',
    fontWeight: '700',
  },
  content: {
    padding: semanticSpacing.md,
  },
  name: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: '#111827',
    marginBottom: semanticSpacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: semanticSpacing.xs,
  },
  rating: {
    fontSize: fontSize.sm,
    color: '#f59e0b',
    fontWeight: '600',
    marginRight: semanticSpacing.xs,
  },
  reviewCount: {
    fontSize: fontSize.sm,
    color: '#6b7280',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: semanticSpacing.sm,
  },
  price: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: '#111827',
    marginRight: semanticSpacing.sm,
  },
  originalPrice: {
    fontSize: fontSize.sm,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
    marginRight: semanticSpacing.xs,
  },
  discount: {
    fontSize: fontSize.sm,
    color: '#ef4444',
    fontWeight: '600',
  },
  addToCartButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: semanticSpacing.sm,
    borderRadius: 8,
    alignItems: 'center',
  },
  addToCartText: {
    fontSize: fontSize.base,
    color: '#ffffff',
    fontWeight: '600',
  },
})
