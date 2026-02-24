import React, { useEffect, useState } from 'react'
import { View, Text, Animated, ViewStyle, TextStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface ToastProps {
  /** Toast message */
  message: string
  /** Toast variant */
  variant?: 'info' | 'success' | 'warning' | 'error'
  /** Toast duration in ms */
  duration?: number
  /** Whether toast is visible */
  isVisible: boolean
  /** Callback when toast auto-dismisses */
  onDismiss?: () => void
  /** Toast position */
  position?: 'top' | 'bottom'
  /** Custom container style */
  style?: ViewStyle
  /** Custom text style */
  textStyle?: TextStyle
}

const variantColors = {
  info: { bg: '#eff6ff', text: '#1e40af', border: '#3b82f6' },
  success: { bg: '#f0fdf4', text: '#15803d', border: '#10b981' },
  warning: { bg: '#fefce8', text: '#a16207', border: '#eab308' },
  error: { bg: '#fef2f2', text: '#991b1b', border: '#ef4444' },
}

export const Toast: React.FC<ToastProps> = ({
  message,
  variant = 'info',
  duration = 3000,
  isVisible,
  onDismiss,
  position = 'top',
  style,
  textStyle,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0))
  const colors = variantColors[variant]

  useEffect(() => {
    if (isVisible) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(duration),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (onDismiss) {
          onDismiss()
        }
      })
    }
  }, [isVisible, duration, fadeAnim, onDismiss])

  if (!isVisible) {
    return null
  }

  return (
    <Animated.View
      style={{
        position: 'absolute',
        [position]: spacing[6],
        left: spacing[4],
        right: spacing[4],
        opacity: fadeAnim,
        zIndex: 9999,
      }}
      accessible
      accessibilityRole="alert"
    >
      <View
        style={[
          {
            backgroundColor: colors.bg,
            borderLeftWidth: 4,
            borderLeftColor: colors.border,
            borderRadius: 8,
            padding: spacing[4],
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          },
          style,
        ]}
      >
        <Text
          style={[
            {
              fontSize: fontSize.base,
              color: colors.text,
            },
            textStyle,
          ]}
        >
          {message}
        </Text>
      </View>
    </Animated.View>
  )
}

Toast.displayName = 'Toast'
