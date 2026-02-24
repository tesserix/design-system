import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface SortableItem {
  id: string
  label: string
  [key: string]: any
}

export interface SortableListProps {
  /** List items */
  items: SortableItem[]
  /** Callback when order changes */
  onReorder?: (items: SortableItem[]) => void
  /** Custom item renderer */
  renderItem?: (item: SortableItem, index: number) => React.ReactNode
  /** Custom container style */
  style?: ViewStyle
  /** Test ID for testing */
  testID?: string
}

/**
 * SortableList component - List with drag-to-reorder capability
 * Note: This is a simplified version. For production, consider using react-native-draggable-flatlist
 *
 * @example
 * ```tsx
 * <SortableList
 *   items={[
 *     { id: '1', label: 'Item 1' },
 *     { id: '2', label: 'Item 2' }
 *   ]}
 *   onReorder={(newOrder) => console.log(newOrder)}
 * />
 * ```
 */
export const SortableList: React.FC<SortableListProps> = ({
  items,
  onReorder,
  renderItem,
  style,
  testID,
}) => {
  const [currentItems, setCurrentItems] = useState(items)

  const moveItem = (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1

    if (toIndex < 0 || toIndex >= currentItems.length) return

    const newItems = [...currentItems]
    const [movedItem] = newItems.splice(fromIndex, 1)
    newItems.splice(toIndex, 0, movedItem)

    setCurrentItems(newItems)
    onReorder?.(newItems)
  }

  const containerStyle: ViewStyle = {
    padding: spacing[2],
  }

  const itemContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: spacing[3],
    marginBottom: spacing[2],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  }

  const dragHandleStyle: ViewStyle = {
    marginRight: spacing[3],
    padding: spacing[1],
  }

  const dragHandleTextStyle: TextStyle = {
    fontSize: fontSize.lg,
    color: '#9ca3af',
  }

  const contentStyle: ViewStyle = {
    flex: 1,
  }

  const labelStyle: TextStyle = {
    fontSize: fontSize.base,
    color: '#374151',
  }

  const buttonsContainerStyle: ViewStyle = {
    flexDirection: 'column',
    marginLeft: spacing[2],
  }

  const buttonStyle: ViewStyle = {
    padding: spacing[1],
  }

  const buttonTextStyle: TextStyle = {
    fontSize: fontSize.sm,
    color: '#6b7280',
  }

  return (
    <View
      style={[containerStyle, style]}
      testID={testID}
      accessible
      accessibilityRole="list"
      accessibilityLabel="Sortable list"
    >
      {currentItems.map((item, index) => (
        <View
          key={item.id}
          style={itemContainerStyle}
          accessible
          accessibilityRole="button"
          accessibilityLabel={`${item.label}, position ${index + 1} of ${currentItems.length}`}
        >
          <View style={dragHandleStyle}>
            <Text style={dragHandleTextStyle} accessible={false}>
              ☰
            </Text>
          </View>

          <View style={contentStyle}>
            {renderItem ? renderItem(item, index) : <Text style={labelStyle}>{item.label}</Text>}
          </View>

          <View style={buttonsContainerStyle}>
            <TouchableOpacity
              style={buttonStyle}
              onPress={() => moveItem(index, 'up')}
              disabled={index === 0}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Move up"
              accessibilityState={{ disabled: index === 0 }}
            >
              <Text style={[buttonTextStyle, index === 0 && { opacity: 0.3 }]}>▲</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={buttonStyle}
              onPress={() => moveItem(index, 'down')}
              disabled={index === currentItems.length - 1}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Move down"
              accessibilityState={{ disabled: index === currentItems.length - 1 }}
            >
              <Text
                style={[buttonTextStyle, index === currentItems.length - 1 && { opacity: 0.3 }]}
              >
                ▼
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  )
}

SortableList.displayName = 'SortableList'
