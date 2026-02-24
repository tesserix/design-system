import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, ViewStyle, TextStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize, fontWeight } from '@tesserix/tokens/typography'

export interface PricingPlan {
  id: string
  name: string
  price: string | number
  period?: string
  description?: string
  features: Array<{
    name: string
    included: boolean
  }>
  highlighted?: boolean
  buttonText?: string
  onSelect?: () => void
}

export interface PricingTableProps {
  /** Pricing plans */
  plans: PricingPlan[]
  /** Currency symbol */
  currency?: string
  /** Custom container style */
  style?: ViewStyle
  /** Test ID for testing */
  testID?: string
}

/**
 * PricingTable component - Feature comparison table with multiple plans
 *
 * @example
 * ```tsx
 * <PricingTable
 *   plans={[
 *     {
 *       id: 'basic',
 *       name: 'Basic',
 *       price: 9,
 *       period: 'month',
 *       features: [
 *         { name: '10 Projects', included: true },
 *         { name: 'Basic Support', included: true }
 *       ]
 *     }
 *   ]}
 * />
 * ```
 */
export const PricingTable: React.FC<PricingTableProps> = ({
  plans,
  currency = '$',
  style,
  testID,
}) => {
  const containerStyle: ViewStyle = {
    padding: spacing[4],
  }

  const planCardStyle = (highlighted: boolean): ViewStyle => ({
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: spacing[5],
    marginHorizontal: spacing[2],
    minWidth: 280,
    borderWidth: highlighted ? 2 : 1,
    borderColor: highlighted ? '#3b82f6' : '#e5e7eb',
    ...(highlighted && {
      shadowColor: '#3b82f6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    }),
  })

  const planNameStyle: TextStyle = {
    fontSize: fontSize.xl,
    fontWeight: String(fontWeight.bold) as TextStyle['fontWeight'],
    color: '#111827',
    marginBottom: spacing[1],
  }

  const planDescriptionStyle: TextStyle = {
    fontSize: fontSize.sm,
    color: '#6b7280',
    marginBottom: spacing[4],
  }

  const priceContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing[1],
  }

  const currencyStyle: TextStyle = {
    fontSize: fontSize.xl,
    fontWeight: String(fontWeight.semibold) as TextStyle['fontWeight'],
    color: '#111827',
  }

  const priceStyle: TextStyle = {
    fontSize: fontSize['4xl'],
    fontWeight: String(fontWeight.bold) as TextStyle['fontWeight'],
    color: '#111827',
  }

  const periodStyle: TextStyle = {
    fontSize: fontSize.base,
    color: '#6b7280',
    marginLeft: spacing[1],
  }

  const featuresContainerStyle: ViewStyle = {
    marginTop: spacing[4],
    marginBottom: spacing[4],
  }

  const featureItemStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[2],
  }

  const featureIconStyle = (included: boolean): TextStyle => ({
    fontSize: fontSize.base,
    marginRight: spacing[2],
    color: included ? '#10b981' : '#d1d5db',
  })

  const featureTextStyle = (included: boolean): TextStyle => ({
    fontSize: fontSize.base,
    color: included ? '#111827' : '#9ca3af',
  })

  const buttonStyle = (highlighted: boolean): ViewStyle => ({
    backgroundColor: highlighted ? '#3b82f6' : '#ffffff',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: highlighted ? 0 : 1,
    borderColor: '#e5e7eb',
  })

  const buttonTextStyle = (highlighted: boolean): TextStyle => ({
    fontSize: fontSize.base,
    fontWeight: String(fontWeight.semibold) as TextStyle['fontWeight'],
    color: highlighted ? '#ffffff' : '#374151',
  })

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[containerStyle, style]}
      testID={testID}
      accessible
      accessibilityRole="list"
      accessibilityLabel="Pricing plans"
    >
      {plans.map((plan) => (
        <View
          key={plan.id}
          style={planCardStyle(plan.highlighted ?? false)}
          accessible
          accessibilityRole="summary"
          accessibilityLabel={`${plan.name} plan, ${currency}${plan.price}${plan.period ? ` per ${plan.period}` : ''}`}
        >
          <Text style={planNameStyle}>{plan.name}</Text>
          {plan.description && <Text style={planDescriptionStyle}>{plan.description}</Text>}

          <View style={priceContainerStyle}>
            <Text style={currencyStyle}>{currency}</Text>
            <Text style={priceStyle}>{plan.price}</Text>
            {plan.period && <Text style={periodStyle}>/{plan.period}</Text>}
          </View>

          <View style={featuresContainerStyle}>
            {plan.features.map((feature, index) => (
              <View key={index} style={featureItemStyle}>
                <Text style={featureIconStyle(feature.included)} accessible={false}>
                  {feature.included ? '✓' : '×'}
                </Text>
                <Text style={featureTextStyle(feature.included)}>{feature.name}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={buttonStyle(plan.highlighted ?? false)}
            onPress={plan.onSelect}
            disabled={!plan.onSelect}
            accessible
            accessibilityRole="button"
            accessibilityLabel={plan.buttonText ?? 'Select plan'}
          >
            <Text style={buttonTextStyle(plan.highlighted ?? false)}>
              {plan.buttonText ?? 'Get Started'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  )
}

PricingTable.displayName = 'PricingTable'
