import React from 'react'
import { View, ViewStyle } from 'react-native'

export interface CenterProps {
  /** Center children */
  children: React.ReactNode
  /** Custom container style */
  style?: ViewStyle
}

export const Center: React.FC<CenterProps> = ({ children, style }) => {
  return (
    <View
      style={[
        {
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}

Center.displayName = 'Center'
