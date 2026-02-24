import React from 'react'
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native'
import { fontSize, fontWeight } from '@tesserix/tokens/typography'

export interface TextProps extends RNTextProps {
  /** Font size from typography scale */
  size?: keyof typeof fontSize
  /** Font weight */
  weight?: keyof typeof fontWeight
  /** Text color */
  color?: string
  /** Text alignment */
  align?: TextStyle['textAlign']
  /** Line height multiplier */
  lineHeight?: number
  /** Bold text */
  bold?: boolean
  /** Italic text */
  italic?: boolean
  /** Underline text */
  underline?: boolean
  /** Strikethrough text */
  strikethrough?: boolean
}

export const Text = React.forwardRef<RNText, TextProps>(
  (
    {
      size = 'base',
      weight,
      color,
      align,
      lineHeight,
      bold,
      italic,
      underline,
      strikethrough,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const textStyle: TextStyle = {
      fontSize: fontSize[size],
      ...(weight && { fontWeight: String(fontWeight[weight]) as TextStyle['fontWeight'] }),
      ...(bold && { fontWeight: String(fontWeight.bold) as TextStyle['fontWeight'] }),
      ...(color && { color }),
      ...(align && { textAlign: align }),
      ...(lineHeight && { lineHeight: fontSize[size] * lineHeight }),
      ...(italic && { fontStyle: 'italic' }),
      ...(underline && { textDecorationLine: 'underline' }),
      ...(strikethrough && { textDecorationLine: 'line-through' }),
    }

    return (
      <RNText ref={ref} style={[textStyle, style]} {...props}>
        {children}
      </RNText>
    )
  }
)

Text.displayName = 'Text'
