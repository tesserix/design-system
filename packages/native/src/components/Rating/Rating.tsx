import React from 'react'
import { View, TouchableOpacity, Text, ViewStyle } from 'react-native'

export interface RatingProps {
  /** Rating value */
  value?: number
  /** Maximum rating */
  max?: number
  /** Callback when rating changes */
  onChange?: (value: number) => void
  /** Read only */
  readOnly?: boolean
  /** Size */
  size?: number
  /** Color */
  color?: string
  /** Empty color */
  emptyColor?: string
  /** Custom container style */
  style?: ViewStyle
}

export const Rating: React.FC<RatingProps> = ({
  value = 0,
  max = 5,
  onChange,
  readOnly = false,
  size = 24,
  color = '#fbbf24',
  emptyColor = '#d1d5db',
  style,
}) => {
  const handlePress = (index: number) => {
    if (!readOnly && onChange) {
      onChange(index + 1)
    }
  }

  return (
    <View style={[{ flexDirection: 'row' }, style]}>
      {Array.from({ length: max }).map((_, index) => {
        const isFilled = index < value
        const Wrapper = readOnly ? View : TouchableOpacity

        return (
          <Wrapper
            key={index}
            onPress={() => handlePress(index)}
            disabled={readOnly}
          >
            <Text
              style={{
                fontSize: size,
                color: isFilled ? color : emptyColor,
              }}
            >
              ★
            </Text>
          </Wrapper>
        )
      })}
    </View>
  )
}

Rating.displayName = 'Rating'
