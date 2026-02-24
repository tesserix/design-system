import React, { useEffect, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface NotificationProps {
  /** Notification title */
  title: string
  /** Notification message */
  message?: string
  /** Variant type */
  variant?: 'info' | 'success' | 'warning' | 'error'
  /** Show notification */
  visible: boolean
  /** Auto dismiss duration in ms */
  duration?: number
  /** Callback when dismissed */
  onDismiss?: () => void
  /** Show close button */
  showClose?: boolean
  /** Custom style */
  style?: StyleProp<ViewStyle>
}

export const Notification: React.FC<NotificationProps> = ({
  title,
  message,
  variant = 'info',
  visible,
  duration = 5000,
  onDismiss,
  showClose = true,
  style,
}) => {
  const slideAnim = useRef(new Animated.Value(-100)).current
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start()

      if (duration > 0) {
        timerRef.current = setTimeout(() => {
          handleDismiss()
        }, duration)
      }
    } else {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }).start()
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [visible, duration, slideAnim])

  const handleDismiss = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onDismiss?.()
    })
  }

  const variantColors = {
    info: { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af' },
    success: { bg: '#f0fdf4', border: '#10b981', text: '#15803d' },
    warning: { bg: '#fefce8', border: '#eab308', text: '#a16207' },
    error: { bg: '#fef2f2', border: '#ef4444', text: '#991b1b' },
  }

  const colors = variantColors[variant]

  if (!visible) return null

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.bg,
          borderLeftColor: colors.border,
          transform: [{ translateY: slideAnim }],
        },
        style,
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {message && (
          <Text style={[styles.message, { color: colors.text }]}>
            {message}
          </Text>
        )}
      </View>
      {showClose && (
        <TouchableOpacity
          onPress={handleDismiss}
          style={styles.closeButton}
          accessibilityRole="button"
          accessibilityLabel="Dismiss notification"
        >
          <Text style={[styles.closeText, { color: colors.text }]}>✕</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  )
}

Notification.displayName = 'Notification'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: semanticSpacing.md,
    right: semanticSpacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: semanticSpacing.md,
    borderRadius: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.base,
    fontWeight: '600',
    marginBottom: 2,
  },
  message: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  closeButton: {
    padding: semanticSpacing.xs,
    marginLeft: semanticSpacing.sm,
  },
  closeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
})
