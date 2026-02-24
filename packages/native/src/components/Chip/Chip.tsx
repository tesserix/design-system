import React from 'react'
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface ChipProps {
  /** Chip label */
  label: string
  /** Chip variant */
  variant?: 'solid' | 'outline'
  /** Chip color scheme */
  colorScheme?: 'primary' | 'secondary' | 'success' | 'error'
  /** Chip size */
  size?: 'sm' | 'md' | 'lg'
  /** Closeable chip */
  closeable?: boolean
  /** onClose handler */
  onClose?: () => void
  /** onClick handler */
  onPress?: () => void
  /** Disabled state */
  disabled?: boolean
  /** Custom container style */
  style?: ViewStyle
  /** Custom text style */
  textStyle?: TextStyle
}

const colorMap = {
  primary: { solid: '#3b82f6', outline: '#3b82f6', text: '#ffffff', outlineText: '#3b82f6' },
  secondary: { solid: '#6b7280', outline: '#6b7280', text: '#ffffff', outlineText: '#6b7280' },
  success: { solid: '#10b981', outline: '#10b981', text: '#ffffff', outlineText: '#10b981' },
  error: { solid: '#ef4444', outline: '#ef4444', text: '#ffffff', outlineText: '#ef4444' },
}

const sizeMap = {
  sm: { padding: spacing[1], fontSize: fontSize.xs },
  md: { padding: spacing[2], fontSize: fontSize.sm },
  lg: { padding: spacing[3], fontSize: fontSize.base },
}

export const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'solid',
  colorScheme = 'primary',
  size = 'md',
  closeable = false,
  onClose,
  onPress,
  disabled = false,
  style,
  textStyle,
}) => {
  const colors = colorMap[colorScheme]
  const sizeStyle = sizeMap[size]
  const Wrapper = onPress ? TouchableOpacity : View

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: sizeStyle.padding,
    paddingHorizontal: sizeStyle.padding * 2,
    borderRadius: 16,
    backgroundColor: variant === 'solid' ? colors.solid : 'transparent',
    borderWidth: variant === 'outline' ? 1 : 0,
    borderColor: variant === 'outline' ? colors.outline : 'transparent',
    opacity: disabled ? 0.5 : 1,
  }

  const labelStyle: TextStyle = {
    fontSize: sizeStyle.fontSize,
    color: variant === 'solid' ? colors.text : colors.outlineText,
    fontWeight: '500',
  }

  return (
    <Wrapper
      onPress={onPress}
      disabled={disabled || !onPress}
      activeOpacity={0.7}
      style={[containerStyle, style]}
    >
      <Text style={[labelStyle, textStyle]}>{label}</Text>
      {closeable && onClose && (
        <TouchableOpacity
          onPress={onClose}
          disabled={disabled}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{ marginLeft: spacing[1] }}
        >
          <Text style={{ color: labelStyle.color, fontSize: sizeStyle.fontSize }}>✕</Text>
        </TouchableOpacity>
      )}
    </Wrapper>
  )
}

Chip.displayName = 'Chip'
