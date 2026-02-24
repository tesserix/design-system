import React, { useRef, useState } from 'react'
import { View, PanResponder, ViewStyle, ViewProps } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'

export interface SliderProps extends Omit<ViewProps, 'style'> {
  /** Current value */
  value?: number
  /** Callback when value changes */
  onChange?: (value: number) => void
  /** Minimum value */
  min?: number
  /** Maximum value */
  max?: number
  /** Step increment */
  step?: number
  /** Disabled state */
  disabled?: boolean
  /** Color scheme */
  colorScheme?: 'primary' | 'secondary' | 'success' | 'error'
  /** Custom container style */
  style?: ViewStyle
}

const colorMap = {
  primary: '#3b82f6',
  secondary: '#6b7280',
  success: '#10b981',
  error: '#ef4444',
}

export const Slider: React.FC<SliderProps> = ({
  value = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  colorScheme = 'primary',
  style,
  ...props
}) => {
  const [trackWidth, setTrackWidth] = useState(0)
  const startValueRef = useRef(value)
  const color = colorMap[colorScheme]

  const normalizedValue = Math.max(min, Math.min(max, value))
  const percentage = ((normalizedValue - min) / (max - min)) * 100

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !disabled,
    onMoveShouldSetPanResponder: () => !disabled,
    onPanResponderGrant: () => {
      startValueRef.current = normalizedValue
    },
    onPanResponderMove: (_, gestureState) => {
      if (disabled || trackWidth <= 0) return

      const deltaValue = (gestureState.dx / trackWidth) * (max - min)
      const rawValue = startValueRef.current + deltaValue
      const steppedValue = Math.round(rawValue / step) * step

      if (onChange) {
        onChange(Math.max(min, Math.min(max, steppedValue)))
      }
    },
  })

  return (
    <View
      style={[{ paddingVertical: spacing[4] }, style]}
      onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
      {...panResponder.panHandlers}
      {...props}
    >
      <View
        style={{
          height: 4,
          backgroundColor: '#e5e7eb',
          borderRadius: 2,
          position: 'relative',
        }}
      >
        <View
          style={{
            height: 4,
            backgroundColor: color,
            borderRadius: 2,
            width: `${percentage}%`,
            opacity: disabled ? 0.5 : 1,
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: `${percentage}%`,
            top: -6,
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: color,
            marginLeft: -8,
            opacity: disabled ? 0.5 : 1,
          }}
        />
      </View>
    </View>
  )
}

Slider.displayName = 'Slider'
