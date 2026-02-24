import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface UserCardProps {
  /** User name */
  name: string
  /** User bio/description */
  bio?: string
  /** Avatar component */
  avatar?: React.ReactNode
  /** Follow button callback */
  onFollow?: () => void
  /** Unfollow button callback */
  onUnfollow?: () => void
  /** Is following */
  isFollowing?: boolean
  /** Additional stats */
  stats?: {
    followers?: number
    following?: number
    posts?: number
  }
  /** Custom style */
  style?: StyleProp<ViewStyle>
}

export const UserCard: React.FC<UserCardProps> = ({
  name,
  bio,
  avatar,
  onFollow,
  onUnfollow,
  isFollowing = false,
  stats,
  style,
}) => {
  const handleButtonPress = () => {
    if (isFollowing) {
      onUnfollow?.()
    } else {
      onFollow?.()
    }
  }

  const showButton = onFollow || onUnfollow

  return (
    <View
      style={[styles.container, style]}
      accessibilityRole="button"
    >
      <View style={styles.header}>
        {avatar && <View style={styles.avatar}>{avatar}</View>}
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          {bio && <Text style={styles.bio} numberOfLines={2}>{bio}</Text>}
        </View>
        {showButton && (
          <TouchableOpacity
            onPress={handleButtonPress}
            style={[
              styles.followButton,
              isFollowing && styles.followingButton,
            ]}
            accessibilityRole="button"
            accessibilityLabel={isFollowing ? 'Unfollow' : 'Follow'}
          >
            <Text
              style={[
                styles.followButtonText,
                isFollowing && styles.followingButtonText,
              ]}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {stats && (
        <View style={styles.stats}>
          {stats.posts !== undefined && (
            <View style={styles.stat}>
              <Text style={styles.statValue}>{stats.posts}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
          )}
          {stats.followers !== undefined && (
            <View style={styles.stat}>
              <Text style={styles.statValue}>{stats.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
          )}
          {stats.following !== undefined && (
            <View style={styles.stat}>
              <Text style={styles.statValue}>{stats.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          )}
        </View>
      )}
    </View>
  )
}

UserCard.displayName = 'UserCard'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: semanticSpacing.md,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    marginRight: semanticSpacing.sm,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: '#111827',
    marginBottom: semanticSpacing.xs,
  },
  bio: {
    fontSize: fontSize.sm,
    color: '#6b7280',
    lineHeight: 18,
  },
  followButton: {
    paddingHorizontal: semanticSpacing.md,
    paddingVertical: semanticSpacing.xs,
    borderRadius: 6,
    backgroundColor: '#3b82f6',
  },
  followingButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  followButtonText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: '#ffffff',
  },
  followingButtonText: {
    color: '#6b7280',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: semanticSpacing.md,
    paddingTop: semanticSpacing.md,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: '#111827',
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: '#9ca3af',
    marginTop: semanticSpacing.xs,
  },
})
