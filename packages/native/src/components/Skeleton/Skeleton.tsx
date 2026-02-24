import React, { useEffect, useRef } from 'react'
import { Animated, ViewProps, ViewStyle } from 'react-native'

export interface SkeletonProps extends Omit<ViewProps, 'style'> {
  /** Skeleton width */
  width?: ViewStyle['width']
  /** Skeleton height */
  height?: number
  /** Skeleton border radius */
  borderRadius?: number
  /** Custom container style */
  style?: ViewStyle
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
  ...props
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start()
  }, [opacity])

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#e5e7eb',
          opacity,
        },
        style,
      ]}
      {...props}
    />
  )
}

Skeleton.displayName = 'Skeleton'
