import React from 'react'
import { View, ViewProps, ViewStyle } from 'react-native'
import { Text } from '../Text'
import { spacing } from '@tesserix/tokens/spacing'
import { radius } from '@tesserix/tokens/radius'

export interface ProgressBarProps extends Omit<ViewProps, 'children'> {
  /**
   * Progress value (0-100)
   * @default 0
   */
  value?: number
  /**
   * Maximum value
   * @default 100
   */
  max?: number
  /**
   * Size/height of the progress bar
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Color scheme
   * @default 'primary'
   */
  colorScheme?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
  /**
   * Whether to show value label
   */
  showValue?: boolean
  /**
   * Custom value label format
   */
  valueLabel?: string
  /**
   * Whether the progress bar is indeterminate (loading animation)
   */
  isIndeterminate?: boolean
  /**
   * Border radius
   * @default 'full'
   */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
}

const sizeMap = {
  sm: 4,
  md: 8,
  lg: 12,
}

const colorSchemeMap = {
  primary: '#3b82f6',
  secondary: '#6b7280',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#06b6d4',
}

const roundedMap = {
  none: radius.none,
  sm: radius.sm,
  md: radius.md,
  lg: radius.lg,
  full: radius.full,
}

/**
 * ProgressBar component for showing progress or loading states
 *
 * @example
 * ```tsx
 * <ProgressBar value={50} />
 * <ProgressBar value={75} showValue />
 * <ProgressBar isIndeterminate />
 * <ProgressBar value={90} colorScheme="success" size="lg" />
 * ```
 */
export const ProgressBar = React.forwardRef<View, ProgressBarProps>(
  (
    {
      value = 0,
      max = 100,
      size = 'md',
      colorScheme = 'primary',
      showValue = false,
      valueLabel,
      isIndeterminate = false,
      rounded = 'full',
      style,
      ...props
    },
    ref
  ) => {
    const height = sizeMap[size]
    const accentColor = colorSchemeMap[colorScheme]
    const borderRadius = roundedMap[rounded]

    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    const containerStyles: ViewStyle = {
      width: '100%',
    }

    const trackStyles: ViewStyle = {
      height,
      backgroundColor: '#e5e7eb',
      borderRadius,
      overflow: 'hidden',
    }

    const fillStyles: ViewStyle = {
      height: '100%',
      width: isIndeterminate ? '50%' : `${percentage}%`,
      backgroundColor: accentColor,
      borderRadius,
    }

    const labelStyles: ViewStyle = {
      marginTop: spacing[1],
      alignItems: 'flex-end',
    }

    return (
      <View ref={ref} style={[containerStyles, style]} {...props}>
        <View style={trackStyles}>
          <View style={fillStyles} />
        </View>
        {showValue && !isIndeterminate && (
          <View style={labelStyles}>
            <Text size="sm" color="#6b7280" weight="medium">
              {valueLabel || `${Math.round(percentage)}%`}
            </Text>
          </View>
        )}
      </View>
    )
  }
)

ProgressBar.displayName = 'ProgressBar'
