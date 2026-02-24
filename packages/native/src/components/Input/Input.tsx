import React from 'react'
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize, fontWeight } from '@tesserix/tokens/typography'

export interface InputProps extends Omit<RNTextInputProps, 'style'> {
  /** Input size */
  size?: 'sm' | 'md' | 'lg'
  /** Input variant */
  variant?: 'outline' | 'filled' | 'unstyled'
  /** Error state */
  isInvalid?: boolean
  /** Disabled state */
  isDisabled?: boolean
  /** Label text */
  label?: string
  /** Helper text */
  helperText?: string
  /** Error message */
  errorMessage?: string
  /** Custom container style */
  containerStyle?: ViewStyle
  /** Custom input style */
  inputStyle?: TextStyle
  /** Custom label style */
  labelStyle?: TextStyle
}

const sizeStyles: Record<string, { padding: number; fontSize: number }> = {
  sm: { padding: spacing[2], fontSize: fontSize.sm },
  md: { padding: spacing[3], fontSize: fontSize.base },
  lg: { padding: spacing[4], fontSize: fontSize.lg },
}

export const Input = React.forwardRef<RNTextInput, InputProps>(
  (
    {
      size = 'md',
      variant = 'outline',
      isInvalid,
      isDisabled,
      label,
      helperText,
      errorMessage,
      containerStyle,
      inputStyle,
      labelStyle,
      accessibilityLabel,
      accessibilityHint,
      accessibilityState,
      ...props
    },
    ref
  ) => {
    const sizeStyle = sizeStyles[size]

    const containerStyles: ViewStyle = {
      marginBottom: spacing[2],
    }

    const labelStyles: TextStyle = {
      fontSize: fontSize.sm,
      fontWeight: String(fontWeight.medium) as TextStyle['fontWeight'],
      marginBottom: spacing[1],
      color: isInvalid ? '#ef4444' : '#374151',
    }

    const inputStyles: TextStyle = {
      padding: sizeStyle.padding,
      fontSize: sizeStyle.fontSize,
      borderRadius: 8,
      color: '#1f2937',
      ...(variant === 'outline' && {
        borderWidth: 1,
        borderColor: isInvalid ? '#ef4444' : isDisabled ? '#e5e7eb' : '#d1d5db',
        backgroundColor: isDisabled ? '#f9fafb' : '#ffffff',
      }),
      ...(variant === 'filled' && {
        backgroundColor: isDisabled ? '#e5e7eb' : '#f3f4f6',
        borderWidth: 0,
      }),
      ...(variant === 'unstyled' && {
        borderWidth: 0,
        backgroundColor: 'transparent',
      }),
    }

    const helperStyles: TextStyle = {
      fontSize: fontSize.xs,
      marginTop: spacing[1],
      color: isInvalid ? '#ef4444' : '#6b7280',
    }
    const resolvedAccessibilityLabel = accessibilityLabel ?? label
    const resolvedAccessibilityHint = accessibilityHint ?? (isInvalid ? errorMessage : helperText)
    const mergedAccessibilityState = {
      ...accessibilityState,
      disabled: Boolean(isDisabled),
      ...(isInvalid !== undefined ? { invalid: Boolean(isInvalid) } : {}),
    }

    return (
      <View style={[containerStyles, containerStyle]}>
        {label && <Text style={[labelStyles, labelStyle]}>{label}</Text>}
        <RNTextInput
          ref={ref}
          style={[inputStyles, inputStyle]}
          editable={!isDisabled}
          placeholderTextColor="#9ca3af"
          accessibilityLabel={resolvedAccessibilityLabel}
          accessibilityHint={resolvedAccessibilityHint}
          accessibilityState={mergedAccessibilityState}
          {...props}
        />
        {(errorMessage || helperText) && (
          <Text style={helperStyles}>
            {isInvalid && errorMessage ? errorMessage : helperText}
          </Text>
        )}
      </View>
    )
  }
)

Input.displayName = 'Input'
