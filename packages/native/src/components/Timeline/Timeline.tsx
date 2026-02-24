import React from 'react'
import { View, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native'
import { spacing, typography } from '@tesserix/tokens'

export interface TimelineItemData {
  /** Item title */
  title: string
  /** Item description */
  description?: string
  /** Timestamp */
  timestamp?: string
  /** Icon component */
  icon?: React.ReactNode
  /** Custom dot color */
  dotColor?: string
}

export interface TimelineProps {
  /** Timeline items */
  items: TimelineItemData[]
  /** Line color */
  lineColor?: string
  /** Dot size */
  dotSize?: number
  /** Line width */
  lineWidth?: number
  /** Custom style */
  style?: StyleProp<ViewStyle>
}

export const Timeline: React.FC<TimelineProps> = ({
  items,
  lineColor = '#d1d5db',
  dotSize = 12,
  lineWidth = 2,
  style,
}) => {
  return (
    <View style={[styles.container, style]} accessibilityRole="list">
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        const itemDotColor = item.dotColor || '#3b82f6'

        return (
          <View
            key={index}
            style={styles.itemContainer}
            accessibilityRole="listitem"
            accessibilityLabel={`${item.title}${item.timestamp ? `, ${item.timestamp}` : ''}${item.description ? `. ${item.description}` : ''}`}
          >
            <View style={styles.leftColumn}>
              <View
                style={[
                  styles.dot,
                  {
                    width: dotSize,
                    height: dotSize,
                    borderRadius: dotSize / 2,
                    backgroundColor: itemDotColor,
                  },
                ]}
              >
                {item.icon && (
                  <View style={styles.iconContainer}>{item.icon}</View>
                )}
              </View>
              {!isLast && (
                <View
                  style={[
                    styles.line,
                    {
                      width: lineWidth,
                      backgroundColor: lineColor,
                    },
                  ]}
                />
              )}
            </View>
            <View style={styles.contentColumn}>
              <View style={styles.header}>
                <Text style={styles.title}>{item.title}</Text>
                {item.timestamp && (
                  <Text style={styles.timestamp}>{item.timestamp}</Text>
                )}
              </View>
              {item.description && (
                <Text style={styles.description}>{item.description}</Text>
              )}
            </View>
          </View>
        )
      })}
    </View>
  )
}

Timeline.displayName = 'Timeline'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    paddingBottom: spacing.lg,
  },
  leftColumn: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  dot: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'absolute',
  },
  line: {
    flex: 1,
    marginTop: spacing.xs,
  },
  contentColumn: {
    flex: 1,
    paddingTop: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  timestamp: {
    fontSize: typography.fontSize.sm,
    color: '#6b7280',
    marginLeft: spacing.sm,
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: '#4b5563',
    lineHeight: 20,
  },
})
