import React from 'react'
import { View, ViewStyle } from 'react-native'
import { BoxProps } from '../Box/Box'

export interface FlexProps extends Omit<BoxProps, 'style'> {
  /** Flex direction */
  direction?: ViewStyle['flexDirection']
  /** Align items */
  align?: ViewStyle['alignItems']
  /** Justify content */
  justify?: ViewStyle['justifyContent']
  /** Flex wrap */
  wrap?: ViewStyle['flexWrap']
  /** Flex value */
  flex?: ViewStyle['flex']
  /** Align self */
  alignSelf?: ViewStyle['alignSelf']
  /** Flex grow */
  grow?: ViewStyle['flexGrow']
  /** Flex shrink */
  shrink?: ViewStyle['flexShrink']
  /** Flex basis */
  basis?: ViewStyle['flexBasis']
  /** Custom style */
  style?: ViewStyle
}

export const Flex = React.forwardRef<View, FlexProps>(
  (
    {
      direction = 'row',
      align,
      justify,
      wrap,
      flex,
      alignSelf,
      grow,
      shrink,
      basis,
      style,
      children,
      ...boxProps
    },
    ref
  ) => {
    const flexStyle: ViewStyle = {
      display: 'flex',
      flexDirection: direction,
      ...(align && { alignItems: align }),
      ...(justify && { justifyContent: justify }),
      ...(wrap && { flexWrap: wrap }),
      ...(flex !== undefined && { flex }),
      ...(alignSelf && { alignSelf }),
      ...(grow !== undefined && { flexGrow: grow }),
      ...(shrink !== undefined && { flexShrink: shrink }),
      ...(basis !== undefined && { flexBasis: basis }),
    }

    return (
      <View ref={ref} style={[flexStyle, style]} {...boxProps}>
        {children}
      </View>
    )
  }
)

Flex.displayName = 'Flex'
