import React from 'react'
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize, fontWeight } from '@tesserix/tokens/typography'

export interface TaskCardProps {
  /** Task title */
  title: string
  /** Task completion status */
  completed?: boolean
  /** Due date */
  dueDate?: string
  /** Assignee name or avatar */
  assignee?: string
  /** Priority level */
  priority?: 'low' | 'medium' | 'high'
  /** Callback when checkbox is toggled */
  onToggle?: (completed: boolean) => void
  /** Callback when card is pressed */
  onPress?: () => void
  /** Custom container style */
  style?: ViewStyle
  /** Test ID for testing */
  testID?: string
}

/**
 * TaskCard component - Task item with checkbox, title, due date, assignee, priority
 *
 * @example
 * ```tsx
 * <TaskCard
 *   title="Review pull request"
 *   dueDate="2024-01-20"
 *   assignee="John Doe"
 *   priority="high"
 *   onToggle={(completed) => console.log('Completed:', completed)}
 * />
 * ```
 */
export const TaskCard: React.FC<TaskCardProps> = ({
  title,
  completed = false,
  dueDate,
  assignee,
  priority,
  onToggle,
  onPress,
  style,
  testID,
}) => {
  const handleToggle = () => {
    onToggle?.(!completed)
  }

  const getPriorityColor = () => {
    switch (priority) {
      case 'high':
        return '#ef4444'
      case 'medium':
        return '#f59e0b'
      case 'low':
        return '#10b981'
      default:
        return 'transparent'
    }
  }

  const containerStyle: ViewStyle = {
    backgroundColor: '#ffffff',
    padding: spacing[3],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderLeftWidth: 4,
    borderLeftColor: priority ? getPriorityColor() : '#e5e7eb',
  }

  const contentRowStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'flex-start',
  }

  const checkboxStyle: ViewStyle = {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: completed ? '#3b82f6' : '#d1d5db',
    backgroundColor: completed ? '#3b82f6' : '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
    marginTop: 2,
  }

  const checkmarkStyle: TextStyle = {
    fontSize: fontSize.xs,
    color: '#ffffff',
  }

  const contentStyle: ViewStyle = {
    flex: 1,
  }

  const titleStyle: TextStyle = {
    fontSize: fontSize.base,
    fontWeight: String(fontWeight.medium) as TextStyle['fontWeight'],
    color: completed ? '#9ca3af' : '#111827',
    textDecorationLine: completed ? 'line-through' : 'none',
    marginBottom: spacing[2],
  }

  const metaContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing[3],
  }

  const metaItemStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
  }

  const metaIconStyle: TextStyle = {
    fontSize: fontSize.sm,
    marginRight: spacing[1],
  }

  const metaTextStyle: TextStyle = {
    fontSize: fontSize.sm,
    color: '#6b7280',
  }

  const priorityBadgeStyle: ViewStyle = {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 4,
    backgroundColor: getPriorityColor(),
  }

  const priorityTextStyle: TextStyle = {
    fontSize: fontSize.xs,
    fontWeight: String(fontWeight.semibold) as TextStyle['fontWeight'],
    color: '#ffffff',
    textTransform: 'uppercase',
  }

  const CardWrapper = onPress ? TouchableOpacity : View

  return (
    <CardWrapper
      style={[containerStyle, style]}
      onPress={onPress}
      disabled={!onPress}
      testID={testID}
      accessible
      accessibilityRole={onPress ? 'button' : 'summary'}
      accessibilityLabel={`Task: ${title}${completed ? ', completed' : ''}${priority ? `, priority ${priority}` : ''}`}
      accessibilityState={{ checked: completed }}
    >
      <View style={contentRowStyle}>
        <TouchableOpacity
          style={checkboxStyle}
          onPress={handleToggle}
          accessible
          accessibilityRole="checkbox"
          accessibilityLabel={completed ? 'Mark as incomplete' : 'Mark as complete'}
          accessibilityState={{ checked: completed }}
        >
          {completed && <Text style={checkmarkStyle}>✓</Text>}
        </TouchableOpacity>

        <View style={contentStyle}>
          <Text style={titleStyle}>{title}</Text>

          {(dueDate || assignee || priority) && (
            <View style={metaContainerStyle}>
              {dueDate && (
                <View style={metaItemStyle}>
                  <Text style={metaIconStyle} accessible={false}>
                    📅
                  </Text>
                  <Text style={metaTextStyle}>{dueDate}</Text>
                </View>
              )}

              {assignee && (
                <View style={metaItemStyle}>
                  <Text style={metaIconStyle} accessible={false}>
                    👤
                  </Text>
                  <Text style={metaTextStyle}>{assignee}</Text>
                </View>
              )}

              {priority && (
                <View style={priorityBadgeStyle}>
                  <Text style={priorityTextStyle}>{priority.toUpperCase()}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </CardWrapper>
  )
}

TaskCard.displayName = 'TaskCard'
