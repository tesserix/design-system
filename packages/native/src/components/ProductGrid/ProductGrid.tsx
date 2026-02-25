import React from 'react'
import {
  FlatList,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ListRenderItem,
  ListRenderItemInfo,
  TouchableOpacity,
  View,
} from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'

export interface ProductGridItem {
  /** Unique identifier */
  id: string
  [key: string]: any
}

export interface ProductGridProps<T extends ProductGridItem> {
  /** Product data array */
  data: T[]
  /** Number of columns */
  numColumns?: number
  /** Render function for each product */
  renderItem: ListRenderItem<T>
  /** Callback when product is pressed */
  onProductPress?: (item: T) => void
  /** Callback when end is reached (for pagination) */
  onEndReached?: () => void
  /** Loading state */
  loading?: boolean
  /** Refresh control */
  onRefresh?: () => void
  /** Whether currently refreshing */
  refreshing?: boolean
  /** Custom style */
  style?: StyleProp<ViewStyle>
  /** Column wrapper style */
  columnWrapperStyle?: StyleProp<ViewStyle>
}

export const ProductGrid = <T extends ProductGridItem>({
  data,
  numColumns = 2,
  renderItem,
  onProductPress,
  onEndReached,
  loading = false,
  onRefresh,
  refreshing = false,
  style,
  columnWrapperStyle,
}: ProductGridProps<T>) => {
  void loading

  const renderProductItem = (info: ListRenderItemInfo<T>) => {
    const content = renderItem(info)

    if (!onProductPress) {
      return <View style={styles.itemContainer}>{content}</View>
    }

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => onProductPress(info.item)}
        accessibilityRole="button"
        accessibilityLabel={`Open ${String(info.item.id)}`}
        testID={`product-grid-item-${info.item.id}`}
      >
        {content}
      </TouchableOpacity>
    )
  }

  return (
    <FlatList
      data={data}
      renderItem={renderProductItem}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      columnWrapperStyle={[
        numColumns > 1 && styles.columnWrapper,
        columnWrapperStyle,
      ]}
      contentContainerStyle={[styles.container, style]}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      onRefresh={onRefresh}
      refreshing={refreshing}
      showsVerticalScrollIndicator={false}
      accessible={true}
      accessibilityRole="list"
      accessibilityLabel="Product grid"
    />
  )
}

ProductGrid.displayName = 'ProductGrid'

const styles = StyleSheet.create({
  container: {
    padding: semanticSpacing.md,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: semanticSpacing.md,
  },
  itemContainer: {
    flex: 1,
  },
})
