import React from 'react'
import { View, ViewStyle } from 'react-native'

export interface ListProps {
  /** List children */
  children: React.ReactNode
  /** Spacing between items */
  spacing?: number
  /** Custom container style */
  style?: ViewStyle
}

export const List: React.FC<ListProps> = ({
  children,
  spacing: spacingProp = 0,
  style,
}) => {
  return (
    <View style={[{ gap: spacingProp }, style]}>
      {children}
    </View>
  )
}

List.displayName = 'List'
