import React from 'react'
import { TouchableOpacity, Text, ViewStyle, TouchableOpacityProps } from 'react-native'

export interface FABProps extends TouchableOpacityProps {
  /** FAB icon */
  icon?: React.ReactNode
  /** FAB size */
  size?: 'sm' | 'md' | 'lg'
  /** Color scheme */
  colorScheme?: 'primary' | 'secondary' | 'success' | 'error'
  /** Position */
  position?: { bottom?: number; right?: number; top?: number; left?: number }
  /** Custom style */
  style?: ViewStyle
  /** Accessibility label */
  accessibilityLabel?: string
}

const sizeMap = {
  sm: 48,
  md: 56,
  lg: 64,
}

const colorMap = {
  primary: '#3b82f6',
  secondary: '#6b7280',
  success: '#10b981',
  error: '#ef4444',
}

export const FAB: React.FC<FABProps> = ({
  icon,
  size = 'md',
  colorScheme = 'primary',
  position = { bottom: 16, right: 16 },
  style,
  accessibilityLabel = 'Floating action button',
  accessibilityState,
  ...props
}) => {
  const fabSize = sizeMap[size]
  const backgroundColor = colorMap[colorScheme]

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        {
          position: 'absolute',
          width: fabSize,
          height: fabSize,
          borderRadius: fabSize / 2,
          backgroundColor,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 8,
          ...position,
        },
        style,
      ]}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{
        ...accessibilityState,
        disabled: Boolean(props.disabled),
      }}
      {...props}
    >
      {icon || <Text style={{ color: '#ffffff', fontSize: 24 }}>+</Text>}
    </TouchableOpacity>
  )
}

FAB.displayName = 'FAB'
