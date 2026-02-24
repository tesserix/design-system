import React, { useEffect, useRef } from 'react'
import { View, Animated, ViewProps, ViewStyle } from 'react-native'

export interface CircularProgressProps extends Omit<ViewProps, 'style'> {
  /** Progress value (0-100) */
  value?: number
  /** Size of the circle */
  size?: number
  /** Stroke width */
  strokeWidth?: number
  /** Progress color */
  color?: string
  /** Background color */
  backgroundColor?: string
  /** Indeterminate mode */
  indeterminate?: boolean
  /** Custom container style */
  style?: ViewStyle
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value = 0,
  size = 40,
  strokeWidth = 4,
  color = '#3b82f6',
  backgroundColor = '#e5e7eb',
  indeterminate = false,
  style,
  ...props
}) => {
  const rotateValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (indeterminate) {
      Animated.loop(
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start()
    }
  }, [indeterminate, rotateValue])

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  const radius = (size - strokeWidth) / 2
  const _circumference = 2 * Math.PI * radius
  const progressValue = indeterminate ? 25 : Math.max(0, Math.min(100, value))
  void _circumference
  void progressValue

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          transform: indeterminate ? [{ rotate }] : undefined,
        },
        style,
      ]}
      {...props}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: backgroundColor,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: color,
          borderRightColor: 'transparent',
          borderBottomColor: indeterminate ? 'transparent' : color,
          transform: [{ rotate: '-45deg' }],
        }}
      />
    </Animated.View>
  )
}

CircularProgress.displayName = 'CircularProgress'
