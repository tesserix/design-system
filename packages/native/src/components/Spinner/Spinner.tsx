import React from 'react'
import { ActivityIndicator, ActivityIndicatorProps, View, ViewStyle } from 'react-native'

export interface SpinnerProps extends Omit<ActivityIndicatorProps, 'size' | 'color'> {
  /**
   * Size of the spinner
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /**
   * Color variant of the spinner
   * @default 'primary'
   */
  colorScheme?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
  /**
   * Custom color (overrides colorScheme)
   */
  color?: string
  /**
   * Container style
   */
  containerStyle?: ViewStyle
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
}

const colorSchemeMap = {
  primary: '#3b82f6',
  secondary: '#6b7280',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#06b6d4',
}

/**
 * Spinner component for displaying loading states
 *
 * @example
 * ```tsx
 * <Spinner />
 * <Spinner size="lg" colorScheme="success" />
 * <Spinner color="#FF0000" />
 * ```
 */
export const Spinner = React.forwardRef<View, SpinnerProps>(
  (
    {
      size = 'md',
      colorScheme = 'primary',
      color,
      containerStyle,
      testID,
      ...props
    },
    ref
  ) => {
    const spinnerColor = color || colorSchemeMap[colorScheme]
    const spinnerSize = sizeMap[size]

    return (
      <View ref={ref} style={containerStyle} testID={testID}>
        <ActivityIndicator
          size={spinnerSize}
          color={spinnerColor}
          {...props}
        />
      </View>
    )
  }
)

Spinner.displayName = 'Spinner'
