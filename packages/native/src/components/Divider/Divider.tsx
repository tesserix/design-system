import React from 'react'
import { View, ViewProps, ViewStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'

export interface DividerProps extends ViewProps {
  /**
   * Orientation of the divider
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'
  /**
   * Thickness of the divider
   * @default 1
   */
  thickness?: number
  /**
   * Color of the divider
   * @default '#e5e7eb'
   */
  color?: string
  /**
   * Margin around the divider
   */
  margin?: keyof typeof spacing
  /**
   * Margin horizontal (only for horizontal divider)
   */
  marginX?: keyof typeof spacing
  /**
   * Margin vertical (only for vertical divider)
   */
  marginY?: keyof typeof spacing
}

/**
 * Divider component for separating content
 *
 * @example
 * ```tsx
 * <Divider />
 * <Divider orientation="vertical" />
 * <Divider thickness={2} color="#3b82f6" />
 * <Divider margin={4} />
 * ```
 */
export const Divider = React.forwardRef<View, DividerProps>(
  (
    {
      orientation = 'horizontal',
      thickness = 1,
      color = '#e5e7eb',
      margin,
      marginX,
      marginY,
      style,
      ...props
    },
    ref
  ) => {
    const dividerStyles: ViewStyle = {
      backgroundColor: color,
      ...(orientation === 'horizontal'
        ? {
            height: thickness,
            width: '100%',
            ...(margin !== undefined && {
              marginVertical: spacing[margin],
            }),
            ...(marginX !== undefined && {
              marginHorizontal: spacing[marginX],
            }),
          }
        : {
            width: thickness,
            height: '100%',
            ...(margin !== undefined && {
              marginHorizontal: spacing[margin],
            }),
            ...(marginY !== undefined && {
              marginVertical: spacing[marginY],
            }),
          }),
    }

    return <View ref={ref} style={[dividerStyles, style]} {...props} />
  }
)

Divider.displayName = 'Divider'
