import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface CommentItemProps {
  /** Author name */
  author: string
  /** Comment text */
  comment: string
  /** Avatar component */
  avatar?: React.ReactNode
  /** Timestamp */
  timestamp?: string
  /** Number of likes */
  likes?: number
  /** Number of replies */
  replies?: number
  /** Is liked */
  isLiked?: boolean
  /** Like button callback */
  onLike?: () => void
  /** Reply button callback */
  onReply?: () => void
  /** Custom style */
  style?: StyleProp<ViewStyle>
}

export const CommentItem: React.FC<CommentItemProps> = ({
  author,
  comment,
  avatar,
  timestamp,
  likes = 0,
  replies = 0,
  isLiked = false,
  onLike,
  onReply,
  style,
}) => {
  return (
    <View style={[styles.container, style]} accessibilityRole="text">
      <View style={styles.header}>
        {avatar && <View style={styles.avatar}>{avatar}</View>}
        <View style={styles.authorInfo}>
          <Text style={styles.author}>{author}</Text>
          {timestamp && <Text style={styles.timestamp}>{timestamp}</Text>}
        </View>
      </View>

      <Text style={styles.comment}>{comment}</Text>

      <View style={styles.actions}>
        {onLike && (
          <TouchableOpacity
            onPress={onLike}
            style={styles.action}
            accessibilityRole="button"
            accessibilityLabel={`${isLiked ? 'Unlike' : 'Like'} comment`}
          >
            <Text style={[styles.actionIcon, isLiked && styles.likedIcon]}>
              {isLiked ? '❤️' : '🤍'}
            </Text>
            {likes > 0 && (
              <Text style={[styles.actionText, isLiked && styles.likedText]}>
                {likes}
              </Text>
            )}
          </TouchableOpacity>
        )}

        {onReply && (
          <TouchableOpacity
            onPress={onReply}
            style={styles.action}
            accessibilityRole="button"
            accessibilityLabel="Reply to comment"
          >
            <Text style={styles.actionIcon}>💬</Text>
            {replies > 0 && (
              <Text style={styles.actionText}>{replies}</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

CommentItem.displayName = 'CommentItem'

const styles = StyleSheet.create({
  container: {
    padding: semanticSpacing.md,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: semanticSpacing.sm,
  },
  avatar: {
    marginRight: semanticSpacing.sm,
  },
  authorInfo: {
    flex: 1,
  },
  author: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: '#111827',
  },
  timestamp: {
    fontSize: fontSize.xs,
    color: '#9ca3af',
    marginTop: 2,
  },
  comment: {
    fontSize: fontSize.sm,
    color: '#374151',
    lineHeight: 20,
    marginBottom: semanticSpacing.sm,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: semanticSpacing.md,
  },
  actionIcon: {
    fontSize: 16,
    marginRight: semanticSpacing.xs,
  },
  actionText: {
    fontSize: fontSize.xs,
    color: '#6b7280',
  },
  likedIcon: {
    // Already colored emoji
  },
  likedText: {
    color: '#ef4444',
  },
})
