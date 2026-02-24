import React from 'react'
import { View, Text, ViewStyle, TextStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface EmptyStateProps {
  /** Title */
  title?: string
  /** Description */
  description?: string
  /** Icon or illustration */
  icon?: React.ReactNode
  /** Action button */
  action?: React.ReactNode
  /** Custom container style */
  style?: ViewStyle
  /** Custom title style */
  titleStyle?: TextStyle
  /** Custom description style */
  descriptionStyle?: TextStyle
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No data',
  description,
  icon,
  action,
  style,
  titleStyle,
  descriptionStyle,
}) => {
  return (
    <View
      style={[
        {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: spacing[6],
        },
        style,
      ]}
    >
      {icon && <View style={{ marginBottom: spacing[4] }}>{icon}</View>}
      <Text
        style={[
          {
            fontSize: fontSize.xl,
            fontWeight: '600',
            color: '#1f2937',
            textAlign: 'center',
            marginBottom: spacing[2],
          },
          titleStyle,
        ]}
      >
        {title}
      </Text>
      {description && (
        <Text
          style={[
            {
              fontSize: fontSize.base,
              color: '#6b7280',
              textAlign: 'center',
              marginBottom: spacing[4],
            },
            descriptionStyle,
          ]}
        >
          {description}
        </Text>
      )}
      {action && action}
    </View>
  )
}

EmptyState.displayName = 'EmptyState'
