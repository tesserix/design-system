import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface CartItemProps {
  /** Product image URL */
  image: string
  /** Product name */
  name: string
  /** Product price */
  price: number
  /** Currency symbol */
  currency?: string
  /** Product quantity */
  quantity: number
  /** Product variant (e.g., "Size: M, Color: Blue") */
  variant?: string
  /** Callback when quantity is changed */
  onQuantityChange?: (quantity: number) => void
  /** Callback when item is removed */
  onRemove?: () => void
  /** Callback when item is pressed */
  onPress?: () => void
  /** Custom style */
  style?: StyleProp<ViewStyle>
}

export const CartItem: React.FC<CartItemProps> = ({
  image,
  name,
  price,
  currency = '$',
  quantity,
  variant,
  onQuantityChange,
  onRemove,
  onPress,
  style,
}) => {
  const handleIncrease = () => {
    onQuantityChange?.(quantity + 1)
  }

  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange?.(quantity - 1)
    }
  }

  const total = price * quantity

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      disabled={!onPress}
      accessible={!!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={onPress ? `${name}, ${quantity} items, ${currency}${total.toFixed(2)}` : undefined}
      accessibilityState={onPress ? { disabled: false } : undefined}
    >
      <Image
        source={{ uri: image }}
        style={styles.image}
        resizeMode="cover"
        accessible={true}
        accessibilityRole="image"
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={2}>
            {name}
          </Text>
          {onRemove && (
            <TouchableOpacity
              onPress={onRemove}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Remove item"
            >
              <Text style={styles.removeIcon}>×</Text>
            </TouchableOpacity>
          )}
        </View>

        {variant && <Text style={styles.variant}>{variant}</Text>}

        <View style={styles.footer}>
          <Text style={styles.price}>
            {currency}{price.toFixed(2)}
          </Text>

          {onQuantityChange && (
            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleDecrease}
                disabled={quantity <= 1}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Decrease quantity"
                accessibilityState={{ disabled: quantity <= 1 }}
              >
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>

              <Text style={styles.quantity}>{quantity}</Text>

              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleIncrease}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Increase quantity"
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={styles.total}>
          Total: {currency}{total.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

CartItem.displayName = 'CartItem'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: semanticSpacing.md,
    marginBottom: semanticSpacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    marginRight: semanticSpacing.md,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: semanticSpacing.xs,
  },
  name: {
    flex: 1,
    fontSize: fontSize.base,
    fontWeight: '600',
    color: '#111827',
    marginRight: semanticSpacing.sm,
  },
  removeIcon: {
    fontSize: 24,
    color: '#9ca3af',
    lineHeight: 24,
  },
  variant: {
    fontSize: fontSize.sm,
    color: '#6b7280',
    marginBottom: semanticSpacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: semanticSpacing.xs,
  },
  price: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: '#111827',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: fontSize.lg,
    color: '#111827',
  },
  quantity: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: '#111827',
    paddingHorizontal: semanticSpacing.md,
  },
  total: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: '#3b82f6',
  },
})
