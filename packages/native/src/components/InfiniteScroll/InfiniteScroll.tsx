import React from 'react'
import {
  FlatList,
  FlatListProps,
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
} from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface InfiniteScrollProps<T> extends Omit<FlatListProps<T>, 'onEndReached'> {
  /** Callback when reaching end of list */
  onLoadMore: () => void | Promise<void>
  /** Whether more items are being loaded */
  loading?: boolean
  /** Whether there are more items to load */
  hasMore?: boolean
  /** Custom loading component */
  loadingComponent?: React.ReactNode
  /** Custom end message component */
  endMessage?: React.ReactNode
  /** Threshold for triggering load (0-1) */
  threshold?: number
}

export const InfiniteScroll = <T,>({
  onLoadMore,
  loading = false,
  hasMore = true,
  loadingComponent,
  endMessage,
  threshold = 0.5,
  ...flatListProps
}: InfiniteScrollProps<T>) => {
  const handleEndReached = () => {
    if (!loading && hasMore) {
      onLoadMore()
    }
  }

  const renderFooter = () => {
    if (loading) {
      return (
        loadingComponent || (
          <View style={styles.footer}>
            <ActivityIndicator size="small" color="#3b82f6" />
            <Text style={styles.footerText}>Loading more...</Text>
          </View>
        )
      )
    }

    if (!hasMore) {
      return (
        endMessage || (
          <View style={styles.footer}>
            <Text style={styles.endText}>No more items</Text>
          </View>
        )
      )
    }

    return null
  }

  return (
    <FlatList
      {...flatListProps}
      onEndReached={handleEndReached}
      onEndReachedThreshold={threshold}
      ListFooterComponent={renderFooter}
    />
  )
}

InfiniteScroll.displayName = 'InfiniteScroll'

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: semanticSpacing.lg,
  },
  footerText: {
    fontSize: fontSize.sm,
    color: '#6b7280',
    marginLeft: semanticSpacing.sm,
  },
  endText: {
    fontSize: fontSize.sm,
    color: '#9ca3af',
  },
})
