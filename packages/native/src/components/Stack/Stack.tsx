import React from 'react'
import { View, ViewStyle } from 'react-native'
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
      direction = 'column',
      space,
      align,
      justify,
      wrap,
      children,
      style,
      ...boxProps
    },
    ref
  ) => {
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

      return React.cloneElement(child, {
        // @ts-ignore
        style: [child.props.style, spacingStyle],
      })
    })

    return (
      <View ref={ref} style={[stackStyle, style]} {...boxProps}>
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
