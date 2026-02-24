import React from 'react'
import { FlatList, FlatListProps } from 'react-native'

export interface VirtualListProps<T> extends FlatListProps<T> {
  /** Window size for rendering */
  windowSize?: number
  /** Max items to render per batch */
  maxToRenderPerBatch?: number
  /** Update cells batch period */
  updateCellsBatchingPeriod?: number
}

export const VirtualList = <T,>({
  windowSize = 21,
  maxToRenderPerBatch = 10,
  updateCellsBatchingPeriod = 50,
  ...flatListProps
}: VirtualListProps<T>) => {
  return (
    <FlatList
      {...flatListProps}
      windowSize={windowSize}
      maxToRenderPerBatch={maxToRenderPerBatch}
      updateCellsBatchingPeriod={updateCellsBatchingPeriod}
      removeClippedSubviews={true}
      initialNumToRender={10}
    />
  )
}

VirtualList.displayName = 'VirtualList'
