import React from 'react'
import { TouchableOpacity, Text, TouchableOpacityProps, ViewStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'

export interface BackButtonProps extends TouchableOpacityProps {
  /** onPress handler */
  onPress?: () => void
  /** Button icon */
  icon?: React.ReactNode
  /** Button color */
  color?: string
  /** Button size */
  size?: number
  /** Custom style */
  style?: ViewStyle
}

export const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  icon,
  color = '#1f2937',
  size = 24,
  style,
  ...props
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          padding: spacing[2],
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      {...props}
    >
      {icon || (
        <Text style={{ fontSize: size, color }}>←</Text>
      )}
    </TouchableOpacity>
  )
}

BackButton.displayName = 'BackButton'
