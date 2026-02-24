import React from 'react'
import { View, Text, ViewStyle, TextStyle, ScrollView } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize, fontWeight } from '@tesserix/tokens/typography'

export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
}

export interface OrderSummaryProps {
  /** List of order items */
  items: OrderItem[]
  /** Subtotal amount */
  subtotal?: number
  /** Tax amount */
  tax?: number
  /** Shipping amount */
  shipping?: number
  /** Total amount */
  total?: number
  /** Currency symbol */
  currency?: string
  /** Custom container style */
  style?: ViewStyle
  /** Test ID for testing */
  testID?: string
}

/**
 * OrderSummary component for displaying order summary with items list and totals
 *
 * @example
 * ```tsx
 * <OrderSummary
 *   items={[
 *     { id: '1', name: 'Product A', quantity: 2, price: 29.99 },
 *     { id: '2', name: 'Product B', quantity: 1, price: 49.99 }
 *   ]}
 *   subtotal={109.97}
 *   tax={10.99}
 *   shipping={5.99}
 *   total={126.95}
 * />
 * ```
 */
export const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  tax,
  shipping,
  total,
  currency = '$',
  style,
  testID,
}) => {
  const calculatedSubtotal =
    subtotal ?? items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const calculatedTotal = total ?? calculatedSubtotal + (tax ?? 0) + (shipping ?? 0)

  const containerStyle: ViewStyle = {
    padding: spacing[4],
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  }

  const titleStyle: TextStyle = {
    fontSize: fontSize.lg,
    fontWeight: String(fontWeight.bold) as TextStyle['fontWeight'],
    color: '#111827',
    marginBottom: spacing[3],
  }

  const itemContainerStyle: ViewStyle = {
    marginBottom: spacing[2],
    paddingBottom: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  }

  const itemRowStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[1],
  }

  const itemNameStyle: TextStyle = {
    fontSize: fontSize.base,
    color: '#374151',
    flex: 1,
  }

  const itemPriceStyle: TextStyle = {
    fontSize: fontSize.base,
    fontWeight: String(fontWeight.medium) as TextStyle['fontWeight'],
    color: '#111827',
  }

  const quantityStyle: TextStyle = {
    fontSize: fontSize.sm,
    color: '#6b7280',
  }

  const summaryRowStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[2],
  }

  const summaryLabelStyle: TextStyle = {
    fontSize: fontSize.base,
    color: '#6b7280',
  }

  const summaryValueStyle: TextStyle = {
    fontSize: fontSize.base,
    fontWeight: String(fontWeight.medium) as TextStyle['fontWeight'],
    color: '#374151',
  }

  const totalRowStyle: ViewStyle = {
    ...summaryRowStyle,
    marginTop: spacing[2],
    paddingTop: spacing[3],
    borderTopWidth: 2,
    borderTopColor: '#e5e7eb',
  }

  const totalLabelStyle: TextStyle = {
    fontSize: fontSize.lg,
    fontWeight: String(fontWeight.bold) as TextStyle['fontWeight'],
    color: '#111827',
  }

  const totalValueStyle: TextStyle = {
    fontSize: fontSize.lg,
    fontWeight: String(fontWeight.bold) as TextStyle['fontWeight'],
    color: '#111827',
  }

  return (
    <View style={[containerStyle, style]} testID={testID} accessible accessibilityRole="summary">
      <Text style={titleStyle} accessibilityRole="header">
        Order Summary
      </Text>

      <ScrollView style={{ maxHeight: 300 }}>
        {items.map((item) => (
          <View key={item.id} style={itemContainerStyle} accessible>
            <View style={itemRowStyle}>
              <Text style={itemNameStyle} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={itemPriceStyle}>
                {currency}
                {(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
            <Text style={quantityStyle}>
              Qty: {item.quantity} × {currency}
              {item.price.toFixed(2)}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={{ marginTop: spacing[3] }}>
        <View style={summaryRowStyle}>
          <Text style={summaryLabelStyle}>Subtotal</Text>
          <Text style={summaryValueStyle}>
            {currency}
            {calculatedSubtotal.toFixed(2)}
          </Text>
        </View>

        {tax !== undefined && tax > 0 && (
          <View style={summaryRowStyle}>
            <Text style={summaryLabelStyle}>Tax</Text>
            <Text style={summaryValueStyle}>
              {currency}
              {tax.toFixed(2)}
            </Text>
          </View>
        )}

        {shipping !== undefined && shipping > 0 && (
          <View style={summaryRowStyle}>
            <Text style={summaryLabelStyle}>Shipping</Text>
            <Text style={summaryValueStyle}>
              {currency}
              {shipping.toFixed(2)}
            </Text>
          </View>
        )}

        <View style={totalRowStyle}>
          <Text style={totalLabelStyle}>Total</Text>
          <Text style={totalValueStyle}>
            {currency}
            {calculatedTotal.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  )
}

OrderSummary.displayName = 'OrderSummary'
