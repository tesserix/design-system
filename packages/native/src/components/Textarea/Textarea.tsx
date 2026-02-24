import React from 'react'
import { TextInput, TextInputProps, ViewStyle, TextStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface TextareaProps extends Omit<TextInputProps, 'style'> {
  /** Textarea size */
  size?: 'sm' | 'md' | 'lg'
  /** Error state */
  error?: boolean
  /** Error state */
  isInvalid?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Disabled state */
  isDisabled?: boolean
  /** Number of lines */
  rows?: number
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

export const Textarea = React.forwardRef<TextInput, TextareaProps>(
  (
    {
      size = 'md',
      error = false,
      isInvalid,
      disabled = false,
      isDisabled,
      rows = 4,
      style,
      textStyle,
      accessibilityLabel,
      accessibilityHint,
      accessibilityState,
      ...props
    },
    ref
  ) => {
    const sizeStyle = sizeStyles[size]
    const resolvedInvalid = isInvalid ?? error
    const resolvedDisabled = isDisabled ?? disabled

    const containerStyle: ViewStyle = {
      paddingVertical: sizeStyle.padding,
      paddingHorizontal: sizeStyle.padding * 1.5,
      borderWidth: 1,
      borderColor: resolvedInvalid ? '#ef4444' : '#d1d5db',
      borderRadius: 8,
      backgroundColor: resolvedDisabled ? '#f3f4f6' : '#ffffff',
      opacity: resolvedDisabled ? 0.5 : 1,
      minHeight: rows * 24,
    }

    const textStyles: TextStyle = {
      fontSize: sizeStyle.fontSize,
      color: '#1f2937',
      textAlignVertical: 'top',
    }

    return (
      <TextInput
        ref={ref}
        multiline
        numberOfLines={rows}
        editable={!resolvedDisabled}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{
          ...accessibilityState,
          disabled: resolvedDisabled,
          ...(resolvedInvalid ? { invalid: true } : {}),
        }}
        style={[containerStyle, textStyles, textStyle, style]}
        placeholderTextColor="#9ca3af"
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'
