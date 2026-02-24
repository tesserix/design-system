import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, ViewStyle, TextStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize, fontWeight } from '@tesserix/tokens/typography'

export interface KanbanCard {
  id: string
  title: string
  description?: string
  tags?: string[]
}

export interface KanbanColumn {
  id: string
  title: string
  cards: KanbanCard[]
  color?: string
}

export interface KanbanBoardProps {
  /** Columns with cards */
  columns: KanbanColumn[]
  /** Callback when card is pressed */
  onCardPress?: (card: KanbanCard, columnId: string) => void
  /** Custom container style */
  style?: ViewStyle
  /** Test ID for testing */
  testID?: string
}

/**
 * KanbanBoard component - Task board with columns and cards
 *
 * @example
 * ```tsx
 * <KanbanBoard
 *   columns={[
 *     {
 *       id: 'todo',
 *       title: 'To Do',
 *       cards: [
 *         { id: '1', title: 'Task 1', description: 'Description' }
 *       ]
 *     },
 *     {
 *       id: 'in-progress',
 *       title: 'In Progress',
 *       cards: []
 *     }
 *   ]}
 * />
 * ```
 */
export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  onCardPress,
  style,
  testID,
}) => {
  const containerStyle: ViewStyle = {
    flex: 1,
  }

  const columnContainerStyle: ViewStyle = {
    width: 280,
    marginRight: spacing[4],
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: spacing[3],
  }

  const columnTitleStyle: TextStyle = {
    fontSize: fontSize.base,
    fontWeight: String(fontWeight.semibold) as TextStyle['fontWeight'],
    color: '#111827',
    marginBottom: spacing[3],
  }

  const cardStyle: ViewStyle = {
    backgroundColor: '#ffffff',
    padding: spacing[3],
    borderRadius: 8,
    marginBottom: spacing[2],
    borderWidth: 1,
    borderColor: '#e5e7eb',
  }

  const cardTitleStyle: TextStyle = {
    fontSize: fontSize.base,
    fontWeight: String(fontWeight.medium) as TextStyle['fontWeight'],
    color: '#111827',
    marginBottom: spacing[1],
  }

  const cardDescriptionStyle: TextStyle = {
    fontSize: fontSize.sm,
    color: '#6b7280',
    marginBottom: spacing[2],
  }

  const tagsContainerStyle: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[1],
  }

  const tagStyle: ViewStyle = {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 4,
  }

  const tagTextStyle: TextStyle = {
    fontSize: fontSize.xs,
    color: '#4338ca',
  }

  const cardCountStyle: TextStyle = {
    fontSize: fontSize.sm,
    color: '#6b7280',
    marginLeft: spacing[1],
  }

  return (
    <ScrollView
      horizontal
      style={[containerStyle, style]}
      showsHorizontalScrollIndicator={false}
      testID={testID}
      accessible
      accessibilityLabel="Kanban board"
    >
      {columns.map((column) => (
        <View
          key={column.id}
          style={[
            columnContainerStyle,
            column.color && { borderLeftWidth: 4, borderLeftColor: column.color },
          ]}
          accessible
          accessibilityRole="list"
          accessibilityLabel={`${column.title} column`}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing[2] }}>
            <Text style={columnTitleStyle}>{column.title}</Text>
            <Text style={cardCountStyle}>({column.cards.length})</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {column.cards.map((card) => (
              <TouchableOpacity
                key={card.id}
                style={cardStyle}
                onPress={() => onCardPress?.(card, column.id)}
                disabled={!onCardPress}
                accessible
                accessibilityRole="button"
                accessibilityLabel={`Card: ${card.title}`}
                accessibilityHint="Opens card details"
                accessibilityState={{ disabled: !onCardPress }}
              >
                <Text style={cardTitleStyle}>{card.title}</Text>
                {card.description && <Text style={cardDescriptionStyle}>{card.description}</Text>}
                {card.tags && card.tags.length > 0 && (
                  <View style={tagsContainerStyle}>
                    {card.tags.map((tag, index) => (
                      <View key={index} style={tagStyle}>
                        <Text style={tagTextStyle}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ))}
    </ScrollView>
  )
}

KanbanBoard.displayName = 'KanbanBoard'
