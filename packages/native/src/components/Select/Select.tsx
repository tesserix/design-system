import React, { useState } from 'react'
import {
  TouchableOpacity,
  Text,
  Modal,
  View,
  FlatList,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

export interface SelectProps extends Omit<TouchableOpacityProps, 'style'> {
  /** Selected value */
  value?: string
  /** Callback when value changes */
  onChange?: (value: string) => void
  /** Select options */
  options: SelectOption[]
  /** Placeholder text */
  placeholder?: string
  /** Select size */
  size?: 'sm' | 'md' | 'lg'
  /** Disabled state */
  disabled?: boolean
  /** Disabled state */
  isDisabled?: boolean
  /** Error state */
  error?: boolean
  /** Error state */
  isInvalid?: boolean
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

export const Select = React.forwardRef<React.ElementRef<typeof TouchableOpacity>, SelectProps>(
  (
    {
      value,
      onChange,
      options,
      placeholder = 'Select an option',
      size = 'md',
      disabled = false,
      isDisabled,
      error = false,
      isInvalid,
      style,
      textStyle,
      accessibilityLabel,
      accessibilityHint,
      accessibilityState,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const sizeStyle = sizeStyles[size]
    const resolvedDisabled = isDisabled ?? disabled
    const resolvedInvalid = isInvalid ?? error

    const selectedOption = options.find((opt) => opt.value === value)

    const handleSelect = (optionValue: string) => {
      if (onChange) {
        onChange(optionValue)
      }
      setIsOpen(false)
    }

    const containerStyle: ViewStyle = {
      paddingVertical: sizeStyle.padding,
      paddingHorizontal: sizeStyle.padding * 1.5,
      borderWidth: 1,
      borderColor: resolvedInvalid ? '#ef4444' : '#d1d5db',
      borderRadius: 8,
      backgroundColor: resolvedDisabled ? '#f3f4f6' : '#ffffff',
      opacity: resolvedDisabled ? 0.5 : 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }

    const textStyles: TextStyle = {
      fontSize: sizeStyle.fontSize,
      color: selectedOption ? '#1f2937' : '#9ca3af',
    }

    return (
      <>
        <TouchableOpacity
          ref={ref}
          onPress={() => !resolvedDisabled && setIsOpen(true)}
          disabled={resolvedDisabled}
          activeOpacity={0.7}
          style={[containerStyle, style]}
          accessible
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel ?? selectedOption?.label ?? placeholder}
          accessibilityHint={accessibilityHint}
          accessibilityState={{
            ...accessibilityState,
            disabled: resolvedDisabled,
            expanded: isOpen,
          }}
          {...props}
        >
          <Text style={[textStyles, textStyle]}>
            {selectedOption?.label || placeholder}
          </Text>
          <Text style={{ fontSize: sizeStyle.fontSize, color: '#6b7280' }}>▼</Text>
        </TouchableOpacity>

        <Modal
          visible={isOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsOpen(false)}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            activeOpacity={1}
            onPress={() => setIsOpen(false)}
          >
            <View
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 12,
                padding: spacing[2],
                maxHeight: '70%',
                width: '80%',
                maxWidth: 400,
              }}
              onStartShouldSetResponder={() => true}
            >
              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => !item.disabled && handleSelect(item.value)}
                    disabled={item.disabled}
                    accessibilityRole="button"
                    accessibilityState={{ disabled: item.disabled, selected: value === item.value }}
                    style={{
                      paddingVertical: spacing[3],
                      paddingHorizontal: spacing[4],
                      borderRadius: 8,
                      backgroundColor: value === item.value ? '#eff6ff' : 'transparent',
                      opacity: item.disabled ? 0.5 : 1,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: fontSize.base,
                        color: value === item.value ? '#3b82f6' : '#1f2937',
                      }}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </>
    )
  }
)

Select.displayName = 'Select'
