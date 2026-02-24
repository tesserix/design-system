import React from 'react'
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'

export interface MasonryGridProps<T> {
  /** Data array */
  data: T[]
  /** Number of columns */
  numColumns?: number
  /** Render item */
  renderItem: (item: T, index: number) => React.ReactNode
  /** Key extractor */
  keyExtractor: (item: T, index: number) => string
  /** Item spacing */
  itemSpacing?: number
  /** Custom style */
  style?: StyleProp<ViewStyle>
}

export const MasonryGrid = <T,>({
  data,
  numColumns = 2,
  renderItem,
  keyExtractor,
  itemSpacing = semanticSpacing.md,
  style,
}: MasonryGridProps<T>) => {
  // Distribute items into columns
  const columns: T[][] = Array.from({ length: numColumns }, () => [])

  data.forEach((item, index) => {
    const columnIndex = index % numColumns
    columns[columnIndex].push(item)
  })

  return (
    <View style={[styles.container, style]}>
      {columns.map((columnData, columnIndex) => (
        <View
          key={columnIndex}
          style={[
            styles.column,
            {
              marginRight: columnIndex < numColumns - 1 ? itemSpacing : 0,
            },
          ]}
        >
          {columnData.map((item, itemIndex) => {
            const originalIndex = itemIndex * numColumns + columnIndex
            return (
              <View
                key={keyExtractor(item, originalIndex)}
                style={{ marginBottom: itemSpacing }}
              >
                {renderItem(item, originalIndex)}
              </View>
            )
          })}
        </View>
      ))}
    </View>
  )
}

MasonryGrid.displayName = 'MasonryGrid'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
  },
})
