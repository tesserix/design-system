import React from 'react'
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface ChatBubbleProps {
  /** Message text */
  message: string
  /** Is this message from current user */
  isOwn?: boolean
  /** Sender name */
  senderName?: string
  /** Timestamp */
  timestamp?: string
  /** Avatar component */
  avatar?: React.ReactNode
  /** Background color */
  backgroundColor?: string
  /** Text color */
  textColor?: string
  /** Custom style */
  style?: StyleProp<ViewStyle>
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  isOwn = false,
  senderName,
  timestamp,
  avatar,
  backgroundColor,
  textColor,
  style,
}) => {
  const bubbleColor = backgroundColor || (isOwn ? '#3b82f6' : '#f3f4f6')
  const messageColor = textColor || (isOwn ? '#ffffff' : '#111827')

  return (
    <View
      style={[
        styles.container,
        isOwn ? styles.ownContainer : styles.otherContainer,
        style,
      ]}
      accessibilityRole="text"
      accessibilityLabel={`${senderName ? `${senderName}: ` : ''}${message}`}
    >
      {!isOwn && avatar && <View style={styles.avatar}>{avatar}</View>}

      <View style={styles.content}>
        {!isOwn && senderName && (
          <Text style={styles.senderName}>{senderName}</Text>
        )}
        <View
          style={[
            styles.bubble,
            { backgroundColor: bubbleColor },
            isOwn ? styles.ownBubble : styles.otherBubble,
          ]}
        >
          <Text style={[styles.message, { color: messageColor }]}>
            {message}
          </Text>
        </View>
        {timestamp && <Text style={styles.timestamp}>{timestamp}</Text>}
      </View>

      {isOwn && avatar && <View style={styles.avatar}>{avatar}</View>}
    </View>
  )
}

ChatBubble.displayName = 'ChatBubble'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: semanticSpacing.xs,
    paddingHorizontal: semanticSpacing.md,
    alignItems: 'flex-end',
  },
  ownContainer: {
    justifyContent: 'flex-end',
  },
  otherContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    marginHorizontal: semanticSpacing.xs,
  },
  content: {
    flex: 1,
    maxWidth: '75%',
  },
  senderName: {
    fontSize: fontSize.xs,
    color: '#6b7280',
    marginBottom: semanticSpacing.xs,
    marginLeft: semanticSpacing.sm,
  },
  bubble: {
    borderRadius: 18,
    paddingVertical: semanticSpacing.sm,
    paddingHorizontal: semanticSpacing.md,
  },
  ownBubble: {
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    borderBottomLeftRadius: 4,
  },
  message: {
    fontSize: fontSize.base,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: fontSize.xs,
    color: '#9ca3af',
    marginTop: semanticSpacing.xs,
    marginHorizontal: semanticSpacing.sm,
  },
})
