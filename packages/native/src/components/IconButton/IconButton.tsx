import React from 'react'
import { ActivityIndicator, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { radius } from '@tesserix/tokens/radius'

export interface IconButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  /**
   * Icon to display (React element)
   */
  icon: React.ReactNode
  /**
   * Aria label for accessibility
   */
  'aria-label'?: string
  /**
   * Size of the button
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /**
   * Variant of the button
   * @default 'ghost'
   */
  variant?: 'ghost' | 'outline' | 'solid'
  /**
   * Color scheme
   * @default 'primary'
   */
  colorScheme?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
  /**
   * Border radius
   * @default 'md'
   */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  /**
   * Whether the button is disabled
   */
  isDisabled?: boolean
  /**
   * Whether the button is loading
   */
  isLoading?: boolean
  /**
   * Custom container style
   */
  style?: ViewStyle
}

const sizeMap = {
  sm: spacing[6],
  md: spacing[8],
  lg: spacing[10],
  xl: spacing[12],
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
 * IconButton component for icon-only actions
 *
 * @example
 * ```tsx
 * <IconButton icon={<Icon name="close" />} aria-label="Close" />
 * <IconButton icon={<Icon name="menu" />} aria-label="Menu" variant="solid" colorScheme="primary" />
 * <IconButton icon={<Icon name="settings" />} aria-label="Settings" rounded="full" />
 * ```
 */
export const IconButton = React.forwardRef<React.ElementRef<typeof TouchableOpacity>, IconButtonProps>(
  (
    {
      icon,
      'aria-label': ariaLabel,
      size = 'md',
      variant = 'ghost',
      colorScheme = 'primary',
      rounded = 'md',
      isDisabled = false,
      isLoading = false,
      style,
      accessibilityState,
      accessibilityLabel,
      ...props
    },
    ref
  ) => {
    const buttonSize = sizeMap[size]
    const accentColor = colorSchemeMap[colorScheme]
    const borderRadius = roundedMap[rounded]

    const variantStyles: ViewStyle = (() => {
      switch (variant) {
        case 'solid':
          return {
            backgroundColor: accentColor,
          }
        case 'outline':
          return {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: accentColor,
          }
        case 'ghost':
        default:
          return {
            backgroundColor: 'transparent',
          }
      }
    })()

    const containerStyles: ViewStyle = {
      width: buttonSize,
      height: buttonSize,
      borderRadius,
      alignItems: 'center',
      justifyContent: 'center',
      ...variantStyles,
      ...(isDisabled && { opacity: 0.5 }),
    }
    const isDisabledState = isDisabled || isLoading
    const mergedAccessibilityState = {
      ...accessibilityState,
      disabled: isDisabledState,
      busy: isLoading,
    }
    const resolvedLabel = accessibilityLabel ?? ariaLabel

    return (
      <TouchableOpacity
        ref={ref}
        style={[containerStyles, style]}
        disabled={isDisabledState}
        activeOpacity={0.7}
        accessible
        accessibilityLabel={resolvedLabel}
        accessibilityRole="button"
        accessibilityState={mergedAccessibilityState}
        {...props}
      >
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'solid' ? '#ffffff' : accentColor}
          />
        ) : (
          icon
        )}
      </TouchableOpacity>
    )
  }
)

IconButton.displayName = 'IconButton'
