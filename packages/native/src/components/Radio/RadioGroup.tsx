import React, { Children, cloneElement, isValidElement } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { Radio, RadioProps } from './Radio'

export interface RadioGroupProps {
  /** Currently selected value */
  value?: string
  /** Callback when selection changes */
  onChange?: (value: string) => void
  /** Radio children */
  children: React.ReactNode
  /** Direction of radio items */
  direction?: 'row' | 'column'
  /** Spacing between items */
  spacing?: number
  /** Disabled state for all radios */
  disabled?: boolean
  /** Disabled state for all radios */
  isDisabled?: boolean
  /** Color scheme for all radios */
  colorScheme?: 'primary' | 'secondary' | 'success' | 'error'
  /** Size for all radios */
  size?: 'sm' | 'md' | 'lg'
  /** Custom container style */
  style?: ViewStyle
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onChange,
  children,
  direction = 'column',
  spacing: spacingProp = spacing[2],
  disabled = false,
  isDisabled,
  colorScheme,
  size,
  style,
}) => {
  const resolvedDisabled = isDisabled ?? disabled
  const containerStyle: ViewStyle = {
    flexDirection: direction,
  }

  const handleChange = (radioValue: string) => {
    if (onChange) {
      onChange(radioValue)
    }
  }

  return (
    <View style={[containerStyle, style]}>
      {Children.map(children, (child, index) => {
        if (isValidElement<RadioProps>(child) && child.type === Radio) {
          const radioValue = child.props.value || ''
          const spacingStyle: ViewStyle =
            index < Children.count(children) - 1
              ? direction === 'row'
                ? { marginRight: spacingProp }
                : { marginBottom: spacingProp }
              : {}

          const childWithStyle = child as React.ReactElement<{ style?: StyleProp<ViewStyle> }>

          return cloneElement(child, {
            checked: value === radioValue,
            onChange: () => handleChange(radioValue),
            disabled: resolvedDisabled || child.props.disabled,
            colorScheme: child.props.colorScheme || colorScheme,
            size: child.props.size || size,
            style: [childWithStyle.props.style, spacingStyle],
          })
        }
        return child
      })}
    </View>
  )
}

RadioGroup.displayName = 'RadioGroup'
