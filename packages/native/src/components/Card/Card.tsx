import React from 'react'
import { View, ViewProps, ViewStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { radius } from '@tesserix/tokens/radius'

export interface CardProps extends ViewProps {
  /**
   * Variant of the card
   * @default 'elevated'
   */
  variant?: 'elevated' | 'outlined' | 'filled' | 'unstyled'
  /**
   * Padding size
   * @default 'md'
   */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  /**
   * Border radius size
   * @default 'md'
   */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /**
   * Shadow elevation (only applies to 'elevated' variant)
   * @default 'md'
   */
  elevation?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

const paddingMap = {
  none: 0,
  sm: spacing[2],
  md: spacing[4],
  lg: spacing[6],
  xl: spacing[8],
}

const roundedMap = {
  none: radius.none,
  sm: radius.sm,
  md: radius.md,
  lg: radius.lg,
  xl: radius.xl,
  full: radius.full,
}

const elevationMap = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 16,
  },
}

/**
 * Card component for grouping related content
 *
 * @example
 * ```tsx
 * <Card>
 *   <Text>Card content</Text>
 * </Card>
 *
 * <Card variant="outlined" padding="lg">
 *   <Heading>Title</Heading>
 *   <Text>Description</Text>
 * </Card>
 * ```
 */
export const Card = React.forwardRef<View, CardProps>(
  (
    {
      variant = 'elevated',
      padding = 'md',
      rounded = 'md',
      elevation = 'md',
      style,
      children,
      ...props
    },
    ref
  ) => {
    const variantStyles: ViewStyle = (() => {
      switch (variant) {
        case 'elevated':
          return {
            backgroundColor: '#ffffff',
            ...elevationMap[elevation],
          }
        case 'outlined':
          return {
            backgroundColor: '#ffffff',
            borderWidth: 1,
            borderColor: '#e5e7eb',
          }
        case 'filled':
          return {
            backgroundColor: '#f9fafb',
          }
        case 'unstyled':
          return {}
        default:
          return {}
      }
    })()

    const cardStyle: ViewStyle = {
      padding: paddingMap[padding],
      borderRadius: roundedMap[rounded],
      ...variantStyles,
    }

    return (
      <View ref={ref} style={[cardStyle, style]} {...props}>
        {children}
      </View>
    )
  }
)

Card.displayName = 'Card'
