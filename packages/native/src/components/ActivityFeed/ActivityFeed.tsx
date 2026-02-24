import React from 'react'
import { View, Text, FlatList, StyleSheet, ViewStyle, StyleProp } from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface ActivityFeedItem {
  /** Activity ID */
  id: string
  /** Activity title */
  title: string
  /** Activity description */
  description?: string
  /** Timestamp */
  timestamp: string
  /** Icon component */
  icon?: React.ReactNode
  /** Avatar component */
  avatar?: React.ReactNode
}

export interface ActivityFeedProps {
  /** Activity items */
  items: ActivityFeedItem[]
  /** Custom style */
  style?: StyleProp<ViewStyle>
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  items,
  style,
}) => {
  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      style={[styles.container, style]}
      renderItem={({ item, index }) => {
        const isLast = index === items.length - 1

        return (
          <View style={styles.itemContainer}>
            <View style={styles.leftColumn}>
              <View style={styles.iconContainer}>
                {item.icon || item.avatar || <View style={styles.dot} />}
              </View>
              {!isLast && <View style={styles.line} />}
            </View>

            <View style={styles.contentColumn}>
              <Text style={styles.title}>{item.title}</Text>
              {item.description && (
                <Text style={styles.description}>{item.description}</Text>
              )}
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
          </View>
        )
      }}
    />
  )
}

ActivityFeed.displayName = 'ActivityFeed'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: semanticSpacing.md,
    paddingHorizontal: semanticSpacing.md,
  },
  leftColumn: {
    alignItems: 'center',
    marginRight: semanticSpacing.md,
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3b82f6',
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: '#e5e7eb',
    marginTop: semanticSpacing.xs,
  },
  contentColumn: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: '#111827',
    marginBottom: semanticSpacing.xs,
  },
  description: {
    fontSize: fontSize.sm,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: semanticSpacing.xs,
  },
  timestamp: {
    fontSize: fontSize.xs,
    color: '#9ca3af',
  },
})
