import React from 'react'
import { Switch as RNSwitch, SwitchProps as RNSwitchProps, View, ViewStyle } from 'react-native'
import { Text } from '../Text'
import { spacing } from '@tesserix/tokens/spacing'

export interface SwitchProps extends Omit<RNSwitchProps, 'value' | 'onValueChange' | 'onChange' | 'disabled'> {
  /**
   * Whether the switch is on
   */
  isChecked?: boolean
  /**
   * Callback when switch value changes
   */
  onChange?: (value: boolean) => void
  /**
   * Size of the switch
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Color scheme when switch is on
   * @default 'primary'
   */
  colorScheme?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
  /**
   * Label for the switch
   */
  label?: string
  /**
   * Helper text below the switch
   */
  helperText?: string
  /**
   * Whether the switch is disabled
   */
  isDisabled?: boolean
  /**
   * Container style
   */
  containerStyle?: ViewStyle
}

const colorSchemeMap = {
  primary: '#3b82f6',
  secondary: '#6b7280',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#06b6d4',
}

const sizeMap = {
  sm: 0.8,
  md: 1,
  lg: 1.2,
}

/**
 * Switch component for toggling between on/off states
 *
 * @example
 * ```tsx
 * <Switch isChecked={enabled} onChange={setEnabled} />
 * <Switch label="Enable notifications" isChecked={enabled} onChange={setEnabled} />
 * <Switch colorScheme="success" size="lg" isChecked={enabled} onChange={setEnabled} />
 * ```
 */
export const Switch = React.forwardRef<View, SwitchProps>(
  (
    {
      isChecked = false,
      onChange,
      size = 'md',
      colorScheme = 'primary',
      label,
      helperText,
      isDisabled = false,
      containerStyle,
      ...props
    },
    ref
  ) => {
    const trackColor = {
      false: '#d1d5db',
      true: colorSchemeMap[colorScheme],
    }

    const thumbColor = isChecked ? '#ffffff' : '#f9fafb'
    const scale = sizeMap[size]

    const containerStyles: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      opacity: isDisabled ? 0.5 : 1,
    }

    const switchContainer: ViewStyle = {
      transform: [{ scale }],
    }

    const labelContainer: ViewStyle = {
      marginLeft: label ? spacing[2] : 0,
      flex: 1,
    }

    if (!label && !helperText) {
      return (
        <View ref={ref} style={[containerStyle]}>
          <View style={switchContainer}>
            <RNSwitch
              value={isChecked}
              onValueChange={onChange}
              trackColor={trackColor}
              thumbColor={thumbColor}
              disabled={isDisabled}
              {...props}
            />
          </View>
        </View>
      )
    }

    return (
      <View ref={ref} style={[containerStyles, containerStyle]}>
        <View style={switchContainer}>
          <RNSwitch
            value={isChecked}
            onValueChange={onChange}
            trackColor={trackColor}
            thumbColor={thumbColor}
            disabled={isDisabled}
            {...props}
          />
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
      </View>
    )
  }
)

Switch.displayName = 'Switch'
