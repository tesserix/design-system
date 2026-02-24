import React from 'react'
import { View, ViewStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'

export interface GridProps {
  /** Grid children */
  children: React.ReactNode
  /** Number of columns */
  columns?: number
  /** Gap between items */
  gap?: number
  /** Custom container style */
  style?: ViewStyle
}

export const Grid: React.FC<GridProps> = ({
  children,
  columns = 2,
  gap = spacing[4],
  style,
}) => {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap,
        },
        style,
      ]}
    >
      {React.Children.map(children, (child) => (
        <View style={{ width: `${100 / columns}%`, padding: gap / 2 }}>
          {child}
        </View>
      ))}
    </View>
  )
}

Grid.displayName = 'Grid'
