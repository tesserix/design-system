import React from 'react'
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize, fontWeight } from '@tesserix/tokens/typography'

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  /** Button variant */
  variant?: 'solid' | 'outline' | 'ghost'
  /** Button size */
  size?: 'sm' | 'md' | 'lg'
  /** Button color scheme (`danger` is deprecated alias for `error`) */
  colorScheme?: 'primary' | 'secondary' | 'error' | 'danger' | 'success'
  /** Full width button */
  fullWidth?: boolean
  /** Loading state */
  isLoading?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Button children */
  children: React.ReactNode
  /** Custom container style */
  style?: ViewStyle
  /** Custom text style */
  textStyle?: TextStyle
}

const sizeStyles: Record<string, { padding: number; fontSize: number }> = {
  sm: { padding: spacing[2], fontSize: fontSize.sm },
  md: { padding: spacing[3], fontSize: fontSize.base },
  lg: { padding: spacing[4], fontSize: fontSize.lg },
}

export const Button = React.forwardRef<React.ElementRef<typeof TouchableOpacity>, ButtonProps>(
  (
    {
      variant = 'solid',
      size = 'md',
      colorScheme = 'primary',
      fullWidth,
      isLoading,
      disabled,
      children,
      style,
      textStyle,
      accessibilityState,
      accessibilityLabel,
      ...props
    },
    ref
  ) => {
    const sizeStyle = sizeStyles[size]
    const resolvedColorScheme = colorScheme === 'danger' ? 'error' : colorScheme
    const computedAccessibilityLabel =
      accessibilityLabel ??
      (typeof children === 'string' || typeof children === 'number' ? String(children) : undefined)
    const isDisabledState = Boolean(disabled || isLoading)
    const mergedAccessibilityState = {
      ...accessibilityState,
      disabled: isDisabledState,
      busy: Boolean(isLoading),
    }

    // Base styles
    const containerStyle: ViewStyle = {
      paddingVertical: sizeStyle.padding,
      paddingHorizontal: sizeStyle.padding * 2,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      ...(fullWidth && { width: '100%' }),
      ...(disabled && { opacity: 0.5 }),
    }

    // Variant styles
    const variantStyles: ViewStyle =
      variant === 'solid'
        ? {
            backgroundColor: resolvedColorScheme === 'primary' ? '#3b82f6' :
              resolvedColorScheme === 'error' ? '#ef4444' :
              resolvedColorScheme === 'success' ? '#10b981' :
              '#6b7280',
          }
        : variant === 'outline'
        ? {
            borderWidth: 1,
            borderColor: resolvedColorScheme === 'primary' ? '#3b82f6' :
              resolvedColorScheme === 'error' ? '#ef4444' :
              resolvedColorScheme === 'success' ? '#10b981' :
              '#6b7280',
            backgroundColor: 'transparent',
          }
        : {
            backgroundColor: 'transparent',
          }

    const textStyles: TextStyle = {
      fontSize: sizeStyle.fontSize,
      fontWeight: String(fontWeight.medium) as TextStyle['fontWeight'],
      color:
        variant === 'solid'
          ? '#ffffff'
          : resolvedColorScheme === 'primary' ? '#3b82f6' :
          resolvedColorScheme === 'error' ? '#ef4444' :
          resolvedColorScheme === 'success' ? '#10b981' :
          '#6b7280',
    }

    return (
      <TouchableOpacity
        ref={ref}
        style={[containerStyle, variantStyles, style]}
        disabled={isDisabledState}
        activeOpacity={0.7}
        accessible
        accessibilityRole="button"
        accessibilityLabel={computedAccessibilityLabel}
        accessibilityState={mergedAccessibilityState}
        {...props}
      >
        {isLoading ? (
          <ActivityIndicator
            color={variant === 'solid' ? '#ffffff' : textStyles.color}
            size="small"
          />
        ) : (
          <Text style={[textStyles, textStyle]}>{children}</Text>
        )}
      </TouchableOpacity>
    )
  }
)

Button.displayName = 'Button'
