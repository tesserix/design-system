import React from 'react'
import { Text as RNText, TextStyle } from 'react-native'
import { fontSize, fontWeight } from '@tesserix/tokens/typography'
import { TextProps } from '../Text/Text'

export interface HeadingProps extends Omit<TextProps, 'size'> {
  /** Heading level */
  level?: '1' | '2' | '3' | '4' | '5' | '6'
  /** Custom size override */
  size?: keyof typeof fontSize
}

const headingSizes: Record<string, keyof typeof fontSize> = {
  '1': '5xl',
  '2': '4xl',
  '3': '3xl',
  '4': '2xl',
  '5': 'xl',
  '6': 'lg',
}

export const Heading = React.forwardRef<RNText, HeadingProps>(
  (
    {
      level = '1',
      size,
      weight = 'bold',
      color,
      align,
      lineHeight = 1.2,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const headingSize = size || headingSizes[level]

    const headingStyle: TextStyle = {
      fontSize: fontSize[headingSize],
      fontWeight: String(fontWeight[weight]) as TextStyle['fontWeight'],
      lineHeight: fontSize[headingSize] * lineHeight,
      ...(color && { color }),
      ...(align && { textAlign: align }),
    }

    return (
      <RNText ref={ref} style={[headingStyle, style]} {...props}>
        {children}
      </RNText>
    )
  }
)

Heading.displayName = 'Heading'

// Convenience exports
export const H1 = React.forwardRef<RNText, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level="1" {...props} />
)
H1.displayName = 'H1'

export const H2 = React.forwardRef<RNText, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level="2" {...props} />
)
H2.displayName = 'H2'

export const H3 = React.forwardRef<RNText, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level="3" {...props} />
)
H3.displayName = 'H3'

export const H4 = React.forwardRef<RNText, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level="4" {...props} />
)
H4.displayName = 'H4'

export const H5 = React.forwardRef<RNText, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level="5" {...props} />
)
H5.displayName = 'H5'

export const H6 = React.forwardRef<RNText, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level="6" {...props} />
)
H6.displayName = 'H6'
