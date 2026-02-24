import React from 'react'
import { View, Text, ViewStyle, TextStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize, fontWeight } from '@tesserix/tokens/typography'

export interface ReviewCardProps {
  /** Rating value (0-5) */
  rating: number
  /** Reviewer name */
  reviewerName: string
  /** Review date */
  date: string
  /** Review text content */
  reviewText: string
  /** Number of helpful votes */
  helpfulVotes?: number
  /** Maximum rating */
  maxRating?: number
  /** Custom container style */
  style?: ViewStyle
  /** Test ID for testing */
  testID?: string
}

/**
 * ReviewCard component for displaying product reviews
 *
 * @example
 * ```tsx
 * <ReviewCard
 *   rating={4}
 *   reviewerName="John Doe"
 *   date="2024-01-15"
 *   reviewText="Great product! Highly recommended."
 *   helpfulVotes={12}
 * />
 * ```
 */
export const ReviewCard: React.FC<ReviewCardProps> = ({
  rating,
  reviewerName,
  date,
  reviewText,
  helpfulVotes = 0,
  maxRating = 5,
  style,
  testID,
}) => {
  const containerStyle: ViewStyle = {
    padding: spacing[4],
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  }

  const headerStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  }

  const ratingContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[1],
  }

  const nameStyle: TextStyle = {
    fontSize: fontSize.base,
    fontWeight: String(fontWeight.semibold) as TextStyle['fontWeight'],
    color: '#111827',
  }

  const dateStyle: TextStyle = {
    fontSize: fontSize.sm,
    color: '#6b7280',
  }

  const reviewTextStyle: TextStyle = {
    fontSize: fontSize.base,
    color: '#374151',
    lineHeight: fontSize.base * 1.5,
    marginBottom: spacing[2],
  }

  const helpfulStyle: TextStyle = {
    fontSize: fontSize.sm,
    color: '#6b7280',
  }

  const starStyle: TextStyle = {
    fontSize: fontSize.lg,
    color: '#fbbf24',
    marginRight: 2,
  }

  const emptyStarStyle: TextStyle = {
    ...starStyle,
    color: '#d1d5db',
  }

  return (
    <View
      style={[containerStyle, style]}
      testID={testID}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Review by ${reviewerName}, ${rating} out of ${maxRating} stars, ${reviewText}`}
    >
      <View style={headerStyle}>
        <View>
          <View style={ratingContainerStyle}>
            {Array.from({ length: maxRating }).map((_, index) => (
              <Text
                key={index}
                style={index < rating ? starStyle : emptyStarStyle}
                accessible={false}
              >
                ★
              </Text>
            ))}
          </View>
          <Text style={nameStyle}>{reviewerName}</Text>
        </View>
        <Text style={dateStyle}>{date}</Text>
      </View>

      <Text style={reviewTextStyle}>{reviewText}</Text>

      {helpfulVotes > 0 && (
        <Text style={helpfulStyle} accessibilityLabel={`${helpfulVotes} people found this helpful`}>
          {helpfulVotes} {helpfulVotes === 1 ? 'person' : 'people'} found this helpful
        </Text>
      )}
    </View>
  )
}

ReviewCard.displayName = 'ReviewCard'
