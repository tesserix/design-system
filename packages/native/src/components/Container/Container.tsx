import React from 'react'
import { View, ViewStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'

export interface ContainerProps {
  /** Container children */
  children: React.ReactNode
  /** Max width */
  maxWidth?: ViewStyle['maxWidth']
  /** Padding */
  padding?: number
  /** Custom container style */
  style?: ViewStyle
}

export const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = 1200,
  padding = spacing[4],
  style,
}) => {
  return (
    <View
      style={[
        {
          maxWidth,
          padding,
          width: '100%',
          alignSelf: 'center',
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}

Container.displayName = 'Container'
