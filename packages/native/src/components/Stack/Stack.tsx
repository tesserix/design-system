import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { BoxProps } from '../Box/Box'

export interface StackProps extends Omit<BoxProps, 'style'> {
  /** Direction of stack */
  direction?: 'row' | 'column'
  /** Space between items */
  space?: keyof typeof spacing
  /** Align items */
  align?: ViewStyle['alignItems']
  /** Justify content */
  justify?: ViewStyle['justifyContent']
  /** Wrap items */
  wrap?: boolean
  /** Custom style */
  style?: ViewStyle
}

export const Stack = React.forwardRef<View, StackProps>(
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
      direction = 'column',
      space,
      align,
      justify,
      wrap,
      children,
      style,
      ...viewProps
    },
    ref
  ) => {
    const boxStyle: ViewStyle = {
      ...(p !== undefined && { padding: spacing[p] }),
      ...(px !== undefined && { paddingHorizontal: spacing[px] }),
      ...(py !== undefined && { paddingVertical: spacing[py] }),
      ...(pt !== undefined && { paddingTop: spacing[pt] }),
      ...(pr !== undefined && { paddingRight: spacing[pr] }),
      ...(pb !== undefined && { paddingBottom: spacing[pb] }),
      ...(pl !== undefined && { paddingLeft: spacing[pl] }),
      ...(m !== undefined && { margin: spacing[m] }),
      ...(mx !== undefined && { marginHorizontal: spacing[mx] }),
      ...(my !== undefined && { marginVertical: spacing[my] }),
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

    const stackStyle: ViewStyle = {
      flexDirection: direction,
      ...(align && { alignItems: align }),
      ...(justify && { justifyContent: justify }),
      ...(wrap && { flexWrap: 'wrap' }),
    }

    // Add spacing between children
    const childrenWithSpacing = React.Children.map(children, (child, index) => {
      if (!React.isValidElement(child)) return child

      const isLast = index === React.Children.count(children) - 1
      if (isLast || !space) return child

      const spacingStyle: ViewStyle =
        direction === 'row'
          ? { marginRight: spacing[space] }
          : { marginBottom: spacing[space] }

      const childWithStyle = child as React.ReactElement<{ style?: StyleProp<ViewStyle> }>
      return React.cloneElement(childWithStyle, {
        style: [childWithStyle.props.style, spacingStyle],
      })
    })

    return (
      <View ref={ref} style={[boxStyle, stackStyle, style]} {...viewProps}>
        {childrenWithSpacing}
      </View>
    )
  }
)

Stack.displayName = 'Stack'

/** Vertical Stack */
export const VStack = React.forwardRef<View, Omit<StackProps, 'direction'>>(
  (props, ref) => <Stack ref={ref} direction="column" {...props} />
)

VStack.displayName = 'VStack'

/** Horizontal Stack */
export const HStack = React.forwardRef<View, Omit<StackProps, 'direction'>>(
  (props, ref) => <Stack ref={ref} direction="row" {...props} />
)

HStack.displayName = 'HStack'
