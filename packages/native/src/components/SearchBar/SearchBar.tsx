import React from 'react'
import { View, TextInput, TouchableOpacity, Text, ViewStyle, TextInputProps } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface SearchBarProps extends Omit<TextInputProps, 'style'> {
  /** Search value */
  value?: string
  /** Callback when value changes */
  onChangeText?: (text: string) => void
  /** Callback when search is submitted */
  onSubmit?: () => void
  /** Callback when clear button is pressed */
  onClear?: () => void
  /** Show clear button */
  showClear?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Accessibility label for input */
  accessibilityLabel?: string
  /** Accessibility label for clear action */
  clearButtonLabel?: string
  /** Size */
  size?: 'sm' | 'md' | 'lg'
  /** Custom container style */
  style?: ViewStyle
}

const sizeStyles: Record<string, { padding: number; fontSize: number }> = {
  sm: { padding: spacing[2], fontSize: fontSize.sm },
  md: { padding: spacing[3], fontSize: fontSize.base },
  lg: { padding: spacing[4], fontSize: fontSize.lg },
}

export const SearchBar = React.forwardRef<TextInput, SearchBarProps>(
  (
    {
      value = '',
      onChangeText,
      onSubmit,
      onClear,
      showClear = true,
      disabled = false,
      accessibilityLabel = 'Search',
      clearButtonLabel = 'Clear search',
      size = 'md',
      style,
      placeholder = 'Search...',
      ...props
    },
    ref
  ) => {
    const sizeStyle = sizeStyles[size]

    const handleClear = () => {
      if (onChangeText) {
        onChangeText('')
      }
      if (onClear) {
        onClear()
      }
    }

    return (
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#d1d5db',
            borderRadius: 8,
            backgroundColor: disabled ? '#f3f4f6' : '#ffffff',
            paddingHorizontal: sizeStyle.padding,
            opacity: disabled ? 0.5 : 1,
          },
          style,
        ]}
      >
        <Text style={{ fontSize: sizeStyle.fontSize, color: '#6b7280', marginRight: spacing[2] }}>
          🔍
        </Text>
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          editable={!disabled}
          accessibilityLabel={accessibilityLabel}
          accessibilityState={{ disabled }}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          style={{
            flex: 1,
            fontSize: sizeStyle.fontSize,
            color: '#1f2937',
            paddingVertical: sizeStyle.padding,
          }}
          {...props}
        />
        {showClear && value && value.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            accessibilityRole="button"
            accessibilityLabel={clearButtonLabel}
            accessibilityState={{ disabled }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={{ fontSize: sizeStyle.fontSize, color: '#6b7280' }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }
)

SearchBar.displayName = 'SearchBar'
