import React from 'react'
import { TouchableOpacity, Text, TouchableOpacityProps, TextStyle } from 'react-native'
import { fontSize } from '@tesserix/tokens/typography'

export interface LinkProps extends TouchableOpacityProps {
  /** Link text */
  children: React.ReactNode
  /** Link color */
  color?: string
  /** Underline */
  underline?: boolean
  /** Text size */
  size?: 'sm' | 'md' | 'lg'
  /** Custom text style */
  textStyle?: TextStyle
}

const sizeMap = {
  sm: fontSize.sm,
  md: fontSize.base,
  lg: fontSize.lg,
}

export const Link: React.FC<LinkProps> = ({
  children,
  color = '#3b82f6',
  underline = true,
  size = 'md',
  textStyle,
  ...props
}) => {
  return (
    <TouchableOpacity activeOpacity={0.7} {...props}>
      <Text
        style={[
          {
            fontSize: sizeMap[size],
            color,
            textDecorationLine: underline ? 'underline' : 'none',
          },
          textStyle,
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  )
}

Link.displayName = 'Link'
