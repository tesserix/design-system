import React from 'react'
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface BannerProps {
  /** Banner message */
  message: string
  /** Banner variant */
  variant?: 'info' | 'success' | 'warning' | 'error'
  /** Closeable banner */
  closeable?: boolean
  /** onClose handler */
  onClose?: () => void
  /** Action button */
  action?: React.ReactNode
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

export const Banner: React.FC<BannerProps> = ({
  message,
  variant = 'info',
  closeable = false,
  onClose,
  action,
  style,
  textStyle,
}) => {
  const colors = variantColors[variant]

  return (
    <View
      style={[
        {
          backgroundColor: colors.bg,
          borderLeftWidth: 4,
          borderLeftColor: colors.border,
          padding: spacing[4],
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        style,
      ]}
    >
      <Text
        style={[
          {
            flex: 1,
            fontSize: fontSize.sm,
            color: colors.text,
          },
          textStyle,
        ]}
      >
        {message}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
        {action && action}
        {closeable && onClose && (
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={{ color: colors.text, fontSize: fontSize.base }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

Banner.displayName = 'Banner'
