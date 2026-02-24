import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface PricingFeature {
  /** Feature text */
  text: string
  /** Whether feature is included */
  included: boolean
}

export interface PricingCardProps {
  /** Plan name */
  name: string
  /** Plan description */
  description?: string
  /** Plan price */
  price: number
  /** Currency symbol */
  currency?: string
  /** Billing period */
  period?: string
  /** List of features */
  features: PricingFeature[]
  /** Whether this is the recommended plan */
  recommended?: boolean
  /** Button text */
  buttonText?: string
  /** Button callback */
  onPress?: () => void
  /** Badge text (e.g., "Most Popular") */
  badge?: string
  /** Custom style */
  style?: StyleProp<ViewStyle>
}

export const PricingCard: React.FC<PricingCardProps> = ({
  name,
  description,
  price,
  currency = '$',
  period = 'month',
  features,
  recommended = false,
  buttonText = 'Get Started',
  onPress,
  badge,
  style,
}) => {
  return (
    <View
      style={[
        styles.container,
        recommended && styles.containerRecommended,
        style,
      ]}
      accessible={true}
      accessibilityLabel={`${name} plan, ${currency}${price} per ${period}`}
    >
      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}

      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.currency}>{currency}</Text>
        <Text style={styles.price}>{price}</Text>
        <Text style={styles.period}>/{period}</Text>
      </View>

      <View style={styles.features}>
        {features.map((feature, index) => (
          <View key={index} style={styles.feature}>
            <Text
              style={[
                styles.featureIcon,
                !feature.included && styles.featureIconExcluded,
              ]}
            >
              {feature.included ? '✓' : '×'}
            </Text>
            <Text
              style={[
                styles.featureText,
                !feature.included && styles.featureTextExcluded,
              ]}
            >
              {feature.text}
            </Text>
          </View>
        ))}
      </View>

      {onPress && (
        <TouchableOpacity
          style={[
            styles.button,
            recommended && styles.buttonRecommended,
          ]}
          onPress={onPress}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={buttonText}
        >
          <Text
            style={[
              styles.buttonText,
              recommended && styles.buttonTextRecommended,
            ]}
          >
            {buttonText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

PricingCard.displayName = 'PricingCard'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: semanticSpacing.lg,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  containerRecommended: {
    borderColor: '#3b82f6',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#3b82f6',
    paddingHorizontal: semanticSpacing.md,
    paddingVertical: semanticSpacing.xs,
    borderRadius: 16,
    marginBottom: semanticSpacing.md,
  },
  badgeText: {
    fontSize: fontSize.xs,
    color: '#ffffff',
    fontWeight: '600',
  },
  header: {
    marginBottom: semanticSpacing.lg,
  },
  name: {
    fontSize: fontSize['2xl'],
    fontWeight: '700',
    color: '#111827',
    marginBottom: semanticSpacing.xs,
  },
  description: {
    fontSize: fontSize.base,
    color: '#6b7280',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: semanticSpacing.lg,
  },
  currency: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: '#111827',
    marginTop: 4,
  },
  price: {
    fontSize: 48,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 56,
  },
  period: {
    fontSize: fontSize.base,
    color: '#6b7280',
    marginTop: 20,
  },
  features: {
    marginBottom: semanticSpacing.lg,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: semanticSpacing.sm,
  },
  featureIcon: {
    fontSize: fontSize.lg,
    color: '#10b981',
    marginRight: semanticSpacing.sm,
    width: 20,
  },
  featureIconExcluded: {
    color: '#d1d5db',
  },
  featureText: {
    flex: 1,
    fontSize: fontSize.base,
    color: '#111827',
  },
  featureTextExcluded: {
    color: '#9ca3af',
  },
  button: {
    backgroundColor: '#f3f4f6',
    paddingVertical: semanticSpacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonRecommended: {
    backgroundColor: '#3b82f6',
  },
  buttonText: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: '#111827',
  },
  buttonTextRecommended: {
    color: '#ffffff',
  },
})
