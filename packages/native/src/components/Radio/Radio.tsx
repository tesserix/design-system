import React from 'react'
import {
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
  TouchableOpacityProps,
} from 'react-native'

export interface RadioProps extends Omit<TouchableOpacityProps, 'style'> {
  /** Whether the radio is checked */
  checked?: boolean
  /** Whether the radio is checked */
  isChecked?: boolean
  /** Callback when radio state changes */
  onChange?: (checked: boolean) => void
  /** Radio size */
  size?: 'sm' | 'md' | 'lg'
  /** Radio color scheme */
  colorScheme?: 'primary' | 'secondary' | 'success' | 'error'
  /** Disabled state */
  disabled?: boolean
  /** Disabled state */
  isDisabled?: boolean
  /** Value of the radio */
  value?: string
  /** Accessibility label */
  accessibilityLabel?: string
  /** Custom container style */
  style?: StyleProp<ViewStyle>
}

const sizeMap = {
  sm: 16,
  md: 20,
  lg: 24,
}

const colorMap = {
  primary: '#3b82f6',
  secondary: '#6b7280',
  success: '#10b981',
  error: '#ef4444',
}

export const Radio = React.forwardRef<React.ElementRef<typeof TouchableOpacity>, RadioProps>(
  (
    {
      checked = false,
      isChecked,
      onChange,
      size = 'md',
      colorScheme = 'primary',
      disabled = false,
      isDisabled,
      value: _value,
      style,
      accessibilityLabel,
      ...props
    },
    ref
  ) => {
    const resolvedChecked = isChecked ?? checked
    const resolvedDisabled = isDisabled ?? disabled
    const radioSize = sizeMap[size]
    const color = colorMap[colorScheme]

    const handlePress = () => {
      if (!resolvedDisabled && onChange) {
        onChange(!resolvedChecked)
      }
    }

    const containerStyle: ViewStyle = {
      width: radioSize,
      height: radioSize,
      borderRadius: radioSize / 2,
      borderWidth: 2,
      borderColor: resolvedChecked ? color : '#d1d5db',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: resolvedDisabled ? '#f3f4f6' : 'transparent',
      opacity: resolvedDisabled ? 0.5 : 1,
    }

    const innerCircleStyle: ViewStyle = {
      width: radioSize * 0.5,
      height: radioSize * 0.5,
      borderRadius: (radioSize * 0.5) / 2,
      backgroundColor: color,
    }

    return (
      <TouchableOpacity
        ref={ref}
        onPress={handlePress}
        disabled={resolvedDisabled}
        activeOpacity={0.7}
        accessible
        accessibilityRole="radio"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ checked: resolvedChecked, disabled: resolvedDisabled }}
        style={style}
        {...props}
      >
        <View style={containerStyle}>
          {resolvedChecked && <View style={innerCircleStyle} />}
        </View>
      </TouchableOpacity>
    )
  }
)

Radio.displayName = 'Radio'
