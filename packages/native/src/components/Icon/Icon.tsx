import React from 'react'
import { Text, TextStyle } from 'react-native'

export interface IconProps {
  /** Icon name (emoji or text) */
  name: string
  /** Icon size */
  size?: number
  /** Icon color */
  color?: string
  /** Custom style */
  style?: TextStyle
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = '#000000',
  style,
}) => {
  return (
    <Text
      style={[
        {
          fontSize: size,
          color,
        },
        style,
      ]}
    >
      {name}
    </Text>
  )
}

Icon.displayName = 'Icon'
