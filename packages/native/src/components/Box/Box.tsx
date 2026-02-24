import React from 'react'
import { View, ViewProps, ViewStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'

export interface BoxProps extends ViewProps {
  /** Padding using spacing scale */
  p?: keyof typeof spacing
  /** Padding horizontal */
  px?: keyof typeof spacing
  /** Padding vertical */
  py?: keyof typeof spacing
  /** Padding top */
  pt?: keyof typeof spacing
  /** Padding right */
  pr?: keyof typeof spacing
  /** Padding bottom */
  pb?: keyof typeof spacing
  /** Padding left */
  pl?: keyof typeof spacing
  /** Margin using spacing scale */
  m?: keyof typeof spacing
  /** Margin horizontal */
  mx?: keyof typeof spacing
  /** Margin vertical */
  my?: keyof typeof spacing
  /** Margin top */
  mt?: keyof typeof spacing
  /** Margin right */
  mr?: keyof typeof spacing
  /** Margin bottom */
  mb?: keyof typeof spacing
  /** Margin left */
  ml?: keyof typeof spacing
  /** Background color */
  bg?: string
  /** Border radius */
  rounded?: boolean | number
  /** Flex value */
  flex?: ViewStyle['flex']
  /** Width */
  w?: ViewStyle['width']
  /** Height */
  h?: ViewStyle['height']
  /** Children */
  children?: React.ReactNode
}

export const Box = React.forwardRef<View, BoxProps>(
  (
    {
      p,
      px,
      py,
      pt,
      pr,
      pb,
      pl,
      m,
      mx,
      my,
      mt,
      mr,
      mb,
      ml,
      bg,
      rounded,
      flex,
      w,
      h,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const boxStyle: ViewStyle = {
      ...(p !== undefined && { padding: spacing[p] }),
      ...(px !== undefined && {
        paddingHorizontal: spacing[px],
      }),
      ...(py !== undefined && {
        paddingVertical: spacing[py],
      }),
      ...(pt !== undefined && { paddingTop: spacing[pt] }),
      ...(pr !== undefined && { paddingRight: spacing[pr] }),
      ...(pb !== undefined && { paddingBottom: spacing[pb] }),
      ...(pl !== undefined && { paddingLeft: spacing[pl] }),
      ...(m !== undefined && { margin: spacing[m] }),
      ...(mx !== undefined && {
        marginHorizontal: spacing[mx],
      }),
      ...(my !== undefined && {
        marginVertical: spacing[my],
      }),
      ...(mt !== undefined && { marginTop: spacing[mt] }),
      ...(mr !== undefined && { marginRight: spacing[mr] }),
      ...(mb !== undefined && { marginBottom: spacing[mb] }),
      ...(ml !== undefined && { marginLeft: spacing[ml] }),
      ...(bg && { backgroundColor: bg }),
      ...(rounded !== undefined && {
        borderRadius: typeof rounded === 'number' ? rounded : 8,
      }),
      ...(flex !== undefined && { flex }),
      ...(w !== undefined && { width: w }),
      ...(h !== undefined && { height: h }),
    }

    return (
      <View ref={ref} style={[boxStyle, style]} {...props}>
        {children}
      </View>
    )
  }
)

Box.displayName = 'Box'
