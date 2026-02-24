import React from 'react'
import { TouchableOpacity, View, ViewStyle } from 'react-native'
import { Text } from '../Text'
import { spacing } from '@tesserix/tokens/spacing'
import { radius } from '@tesserix/tokens/radius'

export interface CheckboxProps {
  /**
   * Whether the checkbox is checked
   */
  isChecked?: boolean
  /**
   * Callback when checkbox value changes
   */
  onChange?: (value: boolean) => void
  /**
   * Size of the checkbox
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Color scheme when checkbox is checked
   * @default 'primary'
   */
  colorScheme?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
  /**
   * Label for the checkbox
   */
  label?: string
  /**
   * Helper text below the checkbox
   */
  helperText?: string
  /**
   * Whether the checkbox is disabled
   */
  isDisabled?: boolean
  /**
   * Whether the checkbox is in an indeterminate state
   */
  isIndeterminate?: boolean
  /**
   * Container style
   */
  containerStyle?: ViewStyle
  /**
   * Test ID for testing
   */
  testID?: string
  /**
   * Accessibility label for screen readers
   */
  accessibilityLabel?: string
  /**
   * Accessibility hint for screen readers
   */
  accessibilityHint?: string
}

const sizeMap = {
  sm: 16,
  md: 20,
  lg: 24,
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
 * Checkbox component for multiple selections
 *
 * @example
 * ```tsx
 * <Checkbox isChecked={accepted} onChange={setAccepted} />
 * <Checkbox label="I accept the terms" isChecked={accepted} onChange={setAccepted} />
 * <Checkbox colorScheme="success" isChecked={accepted} onChange={setAccepted} />
 * ```
 */
export const Checkbox = React.forwardRef<View, CheckboxProps>(
  (
    {
      isChecked = false,
      onChange,
      size = 'md',
      colorScheme = 'primary',
      label,
      helperText,
      isDisabled = false,
      isIndeterminate = false,
      containerStyle,
      testID,
      accessibilityLabel,
      accessibilityHint,
    },
    ref
  ) => {
    const checkboxSize = sizeMap[size]
    const accentColor = colorSchemeMap[colorScheme]

    const handlePress = () => {
      if (!isDisabled && onChange) {
        onChange(!isChecked)
      }
    }

    const containerStyles: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'flex-start',
      opacity: isDisabled ? 0.5 : 1,
    }

    const checkboxStyles: ViewStyle = {
      width: checkboxSize,
      height: checkboxSize,
      borderRadius: radius.sm,
      borderWidth: 2,
      borderColor: isChecked || isIndeterminate ? accentColor : '#d1d5db',
      backgroundColor: isChecked || isIndeterminate ? accentColor : 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: label ? 2 : 0,
    }

    const checkmarkStyles: ViewStyle = {
      width: checkboxSize * 0.5,
      height: checkboxSize * 0.25,
      borderLeftWidth: 2,
      borderBottomWidth: 2,
      borderColor: '#ffffff',
      transform: [{ rotate: '-45deg' }, { translateY: -1 }],
    }

    const indeterminateStyles: ViewStyle = {
      width: checkboxSize * 0.6,
      height: 2,
      backgroundColor: '#ffffff',
    }

    const labelContainer: ViewStyle = {
      marginLeft: label ? spacing[2] : 0,
      flex: 1,
    }
    const resolvedAccessibilityLabel = accessibilityLabel ?? label
    const resolvedAccessibilityHint = accessibilityHint ?? helperText

    return (
      <TouchableOpacity
        ref={ref}
        onPress={handlePress}
        disabled={isDisabled}
        style={[containerStyles, containerStyle]}
        activeOpacity={0.7}
        testID={testID}
        accessible
        accessibilityRole="checkbox"
        accessibilityLabel={resolvedAccessibilityLabel}
        accessibilityHint={resolvedAccessibilityHint}
        accessibilityState={{
          disabled: isDisabled,
          checked: isIndeterminate ? 'mixed' : isChecked,
        }}
      >
        <View style={checkboxStyles}>
          {isIndeterminate ? (
            <View style={indeterminateStyles} />
          ) : (
            isChecked && <View style={checkmarkStyles} />
          )}
        </View>
        {(label || helperText) && (
          <View style={labelContainer}>
            {label && (
              <Text size="base" weight="medium" color="#111827">
                {label}
              </Text>
            )}
            {helperText && (
              <Text size="sm" color="#6b7280">
                {helperText}
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    )
  }
)

Checkbox.displayName = 'Checkbox'
