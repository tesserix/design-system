import React from 'react'
import { View, ViewProps, ViewStyle, TextStyle } from 'react-native'
import { Text } from '../Text'
import { spacing } from '@tesserix/tokens/spacing'
import { radius } from '@tesserix/tokens/radius'
import { fontSize } from '@tesserix/tokens/typography'

export interface BadgeProps extends Omit<ViewProps, 'children'> {
  /**
   * Content to display in the badge
   */
  children?: React.ReactNode
  /**
   * Color scheme of the badge
   * @default 'gray'
   */
  colorScheme?: 'gray' | 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'pink' | 'cyan'
  /**
   * Variant of the badge
   * @default 'subtle'
   */
  variant?: 'solid' | 'subtle' | 'outline'
  /**
   * Size of the badge
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Border radius
   * @default 'md'
   */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
}

const sizeStyles = {
  sm: {
    paddingHorizontal: spacing[1.5],
    paddingVertical: spacing[0.5],
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * 1.2,
  },
  md: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.2,
  },
  lg: {
    paddingHorizontal: spacing[2.5],
    paddingVertical: spacing[1.5],
    fontSize: fontSize.base,
    lineHeight: fontSize.base * 1.2,
  },
}

const roundedMap = {
  none: radius.none,
  sm: radius.sm,
  md: radius.md,
  lg: radius.lg,
  full: radius.full,
}

const colorSchemes = {
  gray: { base: '#6b7280', text: '#374151', bg: '#f3f4f6', border: '#d1d5db' },
  red: { base: '#ef4444', text: '#b91c1c', bg: '#fee2e2', border: '#fca5a5' },
  green: { base: '#10b981', text: '#047857', bg: '#d1fae5', border: '#6ee7b7' },
  blue: { base: '#3b82f6', text: '#1e40af', bg: '#dbeafe', border: '#93c5fd' },
  yellow: { base: '#f59e0b', text: '#b45309', bg: '#fef3c7', border: '#fcd34d' },
  purple: { base: '#a855f7', text: '#7e22ce', bg: '#f3e8ff', border: '#d8b4fe' },
  pink: { base: '#ec4899', text: '#be185d', bg: '#fce7f3', border: '#f9a8d4' },
  cyan: { base: '#06b6d4', text: '#0e7490', bg: '#cffafe', border: '#67e8f9' },
}

/**
 * Badge component for labels and status indicators
 *
 * @example
 * ```tsx
 * <Badge>New</Badge>
 * <Badge colorScheme="green">Active</Badge>
 * <Badge variant="solid" colorScheme="red">Error</Badge>
 * <Badge size="lg" rounded="full">99+</Badge>
 * ```
 */
export const Badge = React.forwardRef<View, BadgeProps>(
  (
    {
      children,
      colorScheme = 'gray',
      variant = 'subtle',
      size = 'md',
      rounded = 'md',
      style,
      ...props
    },
    ref
  ) => {
    const sizeStyle = sizeStyles[size]
    const colorConfig = colorSchemes[colorScheme]

    const variantStyles: ViewStyle & { textColor: string } = (() => {
      switch (variant) {
        case 'solid':
          return {
            backgroundColor: colorConfig.base,
            textColor: '#ffffff',
          }
        case 'subtle':
          return {
            backgroundColor: colorConfig.bg,
            textColor: colorConfig.text,
          }
        case 'outline':
          return {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: colorConfig.border,
            textColor: colorConfig.text,
          }
        default:
          return {
            backgroundColor: colorConfig.bg,
            textColor: colorConfig.text,
          }
      }
    })()

    const badgeStyle: ViewStyle = {
      paddingHorizontal: sizeStyle.paddingHorizontal,
      paddingVertical: sizeStyle.paddingVertical,
      borderRadius: roundedMap[rounded],
      backgroundColor: variantStyles.backgroundColor,
      borderWidth: variantStyles.borderWidth,
      borderColor: variantStyles.borderColor,
      alignSelf: 'flex-start',
    }

    const textStyle: TextStyle = {
      fontSize: sizeStyle.fontSize,
      lineHeight: sizeStyle.lineHeight,
      color: variantStyles.textColor,
      fontWeight: '500',
    }

    return (
      <View ref={ref} style={[badgeStyle, style]} {...props}>
        {typeof children === 'string' ? (
          <Text style={textStyle}>{children}</Text>
        ) : (
          children
        )}
      </View>
    )
  }
)

Badge.displayName = 'Badge'
